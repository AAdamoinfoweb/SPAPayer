import {Component, EventEmitter, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {OverlayService} from "../../../../../../../services/overlay.service";
import {CampoTipologiaServizioService} from "../../../../../../../services/campo-tipologia-servizio.service";
import {TipoCampo} from '../../../../../model/campo/TipoCampo';

export const aggiungiTipoCampoEvent: EventEmitter<number> = new EventEmitter<number>();

@Component({
  selector: 'app-modale-aggiungi-tipo-campo',
  templateUrl: './modale-aggiungi-tipo-campo.component.html',
  styleUrls: ['./modale-aggiungi-tipo-campo.component.scss']
})
export class ModaleAggiungiTipoCampoComponent implements OnInit {

  form: FormGroup;
  nome: string;
  informazione: string;
  listaNomi: string[];

  @Input()
  idFunzione: number;

  constructor(private overlayService: OverlayService, private campoTipologiaServizioService: CampoTipologiaServizioService) {
    this.form = new FormGroup({
      nome: new FormControl(null, [Validators.required]),
      informazione: new FormControl(null, [Validators.required])
    });

    const listaTipiCampo: TipoCampo[] = JSON.parse(localStorage.getItem('listaTipiCampo'));
    if (listaTipiCampo) {
      const listaNomi: string[] = listaTipiCampo.map(tipo => tipo.nome);
      const listaNomiUnivoci: string[] = listaNomi.filter((nome, index) => listaNomi.lastIndexOf(nome) === index);
      listaNomiUnivoci.sort();
      this.listaNomi = listaNomiUnivoci;
    }
  }


  ngOnInit(): void {
  }

  selezionaNome(): void {
    if (!this.nome) {
      this.informazione = null;
    }
  }

  inserisciInformazioni(): void {
    if (this.informazione === '') {
      this.informazione = null;
    }
  }

  disabilitaCampoInformazioni(): boolean {
    return !this.nome ? true : null;
  }

  clickIndietro() {
    this.overlayService.mostraModaleTipoCampoEvent.emit(null);
  }

  salvaTipoCampo() {
    this.campoTipologiaServizioService.inserimentoTipoCampo({nome: this.nome, informazione: this.informazione}, this.idFunzione)
      .subscribe((idTipoCampo) => {
        aggiungiTipoCampoEvent.emit(idTipoCampo);
        this.clickIndietro();
      });
  }
}
