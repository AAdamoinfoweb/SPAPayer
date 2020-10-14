import {Component, Input, OnInit} from '@angular/core';
import {OverlayService} from '../../services/overlay.service';
import {RichiestaDettaglioPagamento} from '../../modules/main/model/bollettino/RichiestaDettaglioPagamento';

@Component({
  selector: 'app-overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.scss']
})
export class OverlayComponent implements OnInit {
  @Input()
  caricamento: boolean;

  @Input()
  dettaglioPagamento: RichiestaDettaglioPagamento;

  constructor(private overlayService: OverlayService) { }

  ngOnInit(): void {
  }
}
