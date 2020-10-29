import {Component, Input, OnInit} from '@angular/core';
import {Accesso} from '../../../../model/accesso/Accesso';

@Component({
  selector: 'app-dati-accesso',
  templateUrl: './dati-accesso.component.html',
  styleUrls: ['./dati-accesso.component.scss']
})
export class DatiAccessoComponent implements OnInit {

  @Input()
  accesso: Accesso;

  constructor() { }

  ngOnInit(): void {
  }
}
