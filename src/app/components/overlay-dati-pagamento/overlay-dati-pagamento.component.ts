import {Component, Input, OnInit} from '@angular/core';
import {OverlayService} from '../../services/overlay.service';
import {DatiPagamento} from '../../modules/main/model/bollettino/DatiPagamento';

@Component({
  selector: 'app-overlay-dati-pagamento',
  templateUrl: './overlay-dati-pagamento.component.html',
  styleUrls: ['./overlay-dati-pagamento.component.scss']
})
export class OverlayDatiPagamentoComponent implements OnInit {

  @Input()
  datiPagamento: DatiPagamento;

  constructor(private overlayService: OverlayService) { }

  ngOnInit(): void {
  }
}
