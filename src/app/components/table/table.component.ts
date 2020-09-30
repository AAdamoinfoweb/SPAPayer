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
  @Input() tipoTabella: tipoTabella;
  @Input() textLeft: string;

  @Output()
  onSelection: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  onClickIcon: EventEmitter<any> = new EventEmitter<any>();

  tipoColonnaEnum = tipoColonna;
  tipoTabellaEnum = tipoTabella;

  selection: any [];

  totalRecords: any;

  rowsPerPageOption: number[] = [5, 10, 20];

  pageSize = this.rowsPerPageOption[0];

  constructor() { }

  ngOnInit() {
    this.totalRecords = this.rows.length;
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

  onChangePageSize(event) {
    this.pageSize = event;
  }

  onIcon(dataKey) {
    this.onClickIcon.emit(dataKey);
  }

}

