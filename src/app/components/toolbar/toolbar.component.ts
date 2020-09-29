import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {tool, parse as toolParse} from "../../enums/Tool.enum";

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
    const tool = toolParse(event.currentTarget.id);
    this.onClick.emit(tool);
  }

}
