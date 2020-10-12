import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ToolEnum} from "../../enums/Tool.enum";

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  @Output()
  onClick: EventEmitter<any> = new EventEmitter<any>();

  @Input()
  toolbarIcons: any[];

  readonly toolEnum = ToolEnum;

  constructor() { }

  ngOnInit(): void {
  }

  onClickTool(event) {
    this.onClick.emit(event);
  }

}
