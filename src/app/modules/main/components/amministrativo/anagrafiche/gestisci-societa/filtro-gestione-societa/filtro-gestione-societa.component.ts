import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Societa} from '../../../../../model/societa/Societa';
import {NgForm} from '@angular/forms';
import {ParametriRicercaSocieta} from '../../../../../model/societa/ParametriRicercaSocieta';
import {ParametriRicercaUtente} from '../../../../../model/utente/ParametriRicercaUtente';

@Component({
  selector: 'app-filtro-gestione-societa',
  templateUrl: './filtro-gestione-societa.component.html',
  styleUrls: ['../gestisci-societa.component.scss', './filtro-gestione-societa.component.scss']
})
export class FiltroGestioneSocietaComponent implements OnInit {

  @Input()
  listaSocieta: Array<Societa> = new Array<Societa>();

  @Output()
  onChangeListaSocieta: EventEmitter<Societa[]> = new EventEmitter<Societa[]>();

  filtroApplicato = new ParametriRicercaSocieta();

  constructor() {
  }

  ngOnInit(): void {
  }

  pulisciFiltri(filtroForm: NgForm): void {
    filtroForm.resetForm();
    this.onChangeListaSocieta.emit(this.listaSocieta);
    this.filtroApplicato = new ParametriRicercaSocieta();
  }

  cercaSocieta(filtroForm: NgForm): void {
    // TODO metodo cercaSocieta
  }

  disabilitaBottone(filtroForm: NgForm, nomeBottone: string): boolean {
    // TODO metodo disabilitaBottone
    return null;
  }

}
