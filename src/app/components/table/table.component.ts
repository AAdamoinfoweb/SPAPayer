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

  readonly tipoColonnaEnum = tipoColonna;
  readonly tipoTabellaEnum = tipoTabella;

  selection: any [];

  rowsPerPageOption: number[] = [5, 10, 20];

  pageSize = this.rowsPerPageOption[0];

  constructor() { }

  ngOnInit() { }

  selectRow(row: any) {
    window.alert(row.name);
  }

  onRowSelect(event) {
    this.onSelection.emit(this.selection);
  }

  onRowUnselect(event) {
    this.onSelection.emit(this.selection);
  }

  onChangePageSize(event) {
    this.pageSize = event;
  }

  onIcon(dataKey) {
    this.onClickIcon.emit(dataKey);
  }

  setTotalRecords(): number {
    return this.rows.length;
  }

}

