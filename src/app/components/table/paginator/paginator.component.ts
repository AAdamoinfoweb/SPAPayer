import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent implements OnInit {

  @Input()
  collectionSize: number;
  @Input()
  rowsPerPageOptions: number[];

  @Output()
  onChangePageSize: EventEmitter<any> = new EventEmitter<any>();

  @Input()
  pageSize: any;
  page = 1;

  constructor() { }

  ngOnInit(): void {
  }

  onChangeSize(event): void {
    this.pageSize = event.target.innerText;
    this.onChangePageSize.emit(this.pageSize);
  }

}
