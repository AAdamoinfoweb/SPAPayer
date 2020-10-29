import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {tipoColonna} from '../../enums/TipoColonna.enum';
import {tipoTabella} from '../../enums/TipoTabella.enum';
import * as moment from 'moment';
// @ts-ignore
import sprite from '../../../assets/img/sprite.svg';
import {SortEvent} from "primeng/api";
import {Table} from "primeng/table";
import {Utils} from "../../utils/Utils";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, OnChanges {

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
  @Input()
  selection: any [];

  wasLinkOrIconSelected: boolean = false;

  rowsPerPageOption: number[] = [5, 10, 20];

  pageSize = this.rowsPerPageOption[0];
  sprite: string | SVGPathElement = sprite;

  @ViewChild("table", {static: false}) table: Table;

  ngOnInit() { }
  
  constructor() { }

  onRowSelect(event) {
    this.selection = this.selection.filter(selection => this.rows.includes(selection));
    this.onSelection.emit(this.selection);
  }

  onRowUnselect(event) {
    this.selection = this.selection.filter(selection => this.rows.includes(selection));
    this.onSelection.emit(this.selection);
  }

  onChangePageSize(event) {
    this.pageSize = event;
  }

  onLinkClick() {
    this.wasLinkOrIconSelected = true;
  }

  onIconClick(dataKey) {
    this.wasLinkOrIconSelected = true;
    this.onClickIcon.emit(dataKey);
  }

  setTotalRecords(): number {
    return this.rows.length;
  }

  onRowClick(row: any) {
    // Ignores the row click event if a link or icon event is launched
    if (!this.wasLinkOrIconSelected) {
      this.onClickRow.emit(row);
    }
    this.wasLinkOrIconSelected = false;
  }

  customSort(event: SortEvent) {
    event.data.sort((data1, data2) => {
      let value1 = data1[event.field].value;
      let value2 = data2[event.field].value;
      let result = null;

      if (value1 == null && value2 != null) {
        result = -1;
      } else if (value1 != null && value2 == null) {
        result = 1;
      } else if (value1 == null && value2 == null) {
        result = 0;
      } else if (moment(value1, Utils.ACCEPTED_FORMAT_DATES, true).isValid() &&
        moment(value2, Utils.ACCEPTED_FORMAT_DATES, true).isValid()) {
        const value1Date = moment(value1, Utils.ACCEPTED_FORMAT_DATES);
        const value2Date = moment(value2, Utils.ACCEPTED_FORMAT_DATES);
        result = value1Date.isBefore(value2Date) ? -1 : value1Date.isAfter(value2Date) ? 1 : 0;
      } else if (typeof value1 === 'string' && typeof value2 === 'string') {
        result = value1.localeCompare(value2);
      } else {
        result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;
      }
      return (event.order * result);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.rows && !changes.rows.firstChange)
      this.table.reset();
  }
}

