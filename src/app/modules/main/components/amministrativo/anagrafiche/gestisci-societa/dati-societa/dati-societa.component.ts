import {Component, Input, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {FunzioneGestioneEnum} from '../../../../../../../enums/funzioneGestione.enum';

@Component({
  selector: 'app-dati-societa',
  templateUrl: './dati-societa.component.html',
  styleUrls: ['./dati-societa.component.scss']
})
export class DatiSocietaComponent implements OnInit {
  societa = {
    nome: null,
    email: null,
    telefono: null,
    descrizione: null
  }

  @Input()
  funzione: FunzioneGestioneEnum;

  constructor() { }

  ngOnInit(): void {
  }

  onChangeForm(form: NgForm) {
    // TODO onChangeForm
  }
}
