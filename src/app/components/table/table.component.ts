import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {tipoColonna} from '../../enums/TipoColonna.enum';
import {tipoTabella} from '../../enums/TipoTabella.enum';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  @Input() rows: any[];
  @Input() dataKey: any;
  @Input() cols: any[];
  @Input() tipoTabella = tipoTabella.CHECKBOX_SELECTION;

  @Output()
  onSelection: EventEmitter<any> = new EventEmitter<any>();

  tipoColonnaEnum = tipoColonna;
  tipoTabellaEnum = tipoTabella;

  selection: any [];

  constructor() { }

  ngOnInit() {
    this.rows = [{ name: 'Austin', gender: 'assets/img/sprite.svg#it-check', company: 'Swimlane',
      link: 'link company href:https://www.google.com/', importo: '89.21' },
      { name: 'Dany', gender: 'assets/img/sprite.svg#it-delete', company: 'KFC',
        link: 'href:https://www.google.com/', importo: '43' },
      { name: 'Molly', gender: 'assets/img/sprite.svg#it-mail', company: 'Burger King',
        link: 'href:https://www.google.com/', importo: '10' }];

    this.cols = [
      { field: 'name', header: 'Name', type: this.tipoColonnaEnum.TESTO },
      { field: 'gender', header: 'Gender', type: this.tipoColonnaEnum.ICONA },
      { field: 'company', header: 'Company', type: this.tipoColonnaEnum.TESTO },
      { field: 'link', header: 'Link', type: this.tipoColonnaEnum.LINK },
      { field: 'importo', header: 'Importo', type: this.tipoColonnaEnum.IMPORTO }
    ];
  }

  renderLink(testoLink: string) {
    const link = testoLink.split('href:');
    link.forEach(value => value.replace('href:', ''));
    return link;
  }

  selectRow(row: any) {
    window.alert(row.name);
  }

  onRowSelect(event) {
    this.onSelection.emit(event.data);
  }

  onRowUnselect(event) {
    this.onSelection.emit(event.data);
  }
}

