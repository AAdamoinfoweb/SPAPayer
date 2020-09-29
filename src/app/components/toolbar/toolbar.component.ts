import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {tool} from "../../enums/Tool.enum";

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  @Output()
  onClick: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

  onClickTool(event) {
    this.onClick.emit(event);
  }

}
