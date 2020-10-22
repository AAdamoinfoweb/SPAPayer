import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {tipoColonna} from '../../enums/TipoColonna.enum';
import {tipoTabella} from '../../enums/TipoTabella.enum';
// @ts-ignore
import sprite from '../../../assets/img/sprite.svg';
import {SortEvent} from "primeng/api";

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
  @Input() selectedRows: boolean;

  @Output()
  onSelection: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  onClickIcon: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  onClickRow: EventEmitter<any> = new EventEmitter<any>();

  readonly tipoColonnaEnum = tipoColonna;
  readonly tipoTabellaEnum = tipoTabella;

  selection: any [];

  rowsPerPageOption: number[] = [5, 10, 20];

  pageSize = this.rowsPerPageOption[0];
  sprite: string | SVGPathElement = sprite;



  constructor() { }

  ngOnInit() { }

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

  clickOnRow(row: any) {
   this.onClickRow.emit(row);
  }

  customSort(event: SortEvent) {
    event.data.sort((data1, data2) => {
      let value1 = data1[event.field].value;
      let value2 = data2[event.field].value;
      let result = null;

      if (value1 == null && value2 != null)
        result = -1;
      else if (value1 != null && value2 == null)
        result = 1;
      else if (value1 == null && value2 == null)
        result = 0;
      else if (typeof value1 === 'string' && typeof value2 === 'string')
        result = value1.localeCompare(value2);
      else
        result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;

      return (event.order * result);
    });
  }
}

