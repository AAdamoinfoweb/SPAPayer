import {Component, Input, OnInit} from '@angular/core';
import {OverlayService} from '../../services/overlay.service';
import {DatiPagamento} from '../../modules/main/model/bollettino/DatiPagamento';

@Component({
  selector: 'app-overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.scss']
})
export class OverlayComponent implements OnInit {
  @Input()
  caricamento: boolean;

  constructor(private overlayService: OverlayService) { }

  ngOnInit(): void {
  }
}
