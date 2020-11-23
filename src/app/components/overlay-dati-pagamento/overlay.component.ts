import {Component, ContentChild, Input, OnInit, TemplateRef} from '@angular/core';
import {OverlayService} from '../../services/overlay.service';
import {DatiPagamento} from '../../modules/main/model/bollettino/DatiPagamento';

@Component({
  selector: 'app-overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.scss']
})
export class OverlayComponent implements OnInit {

  @Input()
  isModaleGrande: boolean;

  @ContentChild(TemplateRef) template: TemplateRef<any>;

  constructor() { }

  ngOnInit(): void {
  }
}
