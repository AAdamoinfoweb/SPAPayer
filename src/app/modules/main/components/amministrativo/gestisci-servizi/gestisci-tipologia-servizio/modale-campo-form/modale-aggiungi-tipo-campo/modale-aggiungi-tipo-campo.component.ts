import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {OverlayService} from "../../../../../../../../services/overlay.service";
import {CampoTipologiaServizioService} from "../../../../../../../../services/campo-tipologia-servizio.service";

@Component({
  selector: 'app-modale-aggiungi-tipo-campo',
  templateUrl: './modale-aggiungi-tipo-campo.component.html',
  styleUrls: ['./modale-aggiungi-tipo-campo.component.scss']
})
export class ModaleAggiungiTipoCampoComponent implements OnInit {

  form: FormGroup;
  nome: string;
  informazioni: string;

  @Input()
  idFunzione: string;

  constructor(private overlayService: OverlayService, private campoTipologiaServizioService: CampoTipologiaServizioService) {
    this.form = new FormGroup({
      nome: new FormControl(null, [Validators.required]),
      informazioni: new FormControl(null, [Validators.required])
    });
  }


  ngOnInit(): void {
  }

  clickIndietro() {
    this.overlayService.mostraModaleTipoCampoEvent.emit(null);
  }

  salvaTipoCampo() {
    this.campoTipologiaServizioService.inserimentoTipoCampo({nome: this.nome, informazioni: this.informazioni}, this.idFunzione)
      .subscribe(() => {
        this.clickIndietro();
      });
  }
}
