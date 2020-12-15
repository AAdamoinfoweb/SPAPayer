import {Component, Input, OnInit} from '@angular/core';
import {FiltroServizio} from '../../model/FiltroServizio';
import {NuovoPagamentoService} from '../../../../services/nuovo-pagamento.service';
import {DatiPagamento} from '../../model/bollettino/DatiPagamento';
import {Breadcrumb} from '../../dto/Breadcrumb';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-nuovo-pagamento',
  templateUrl: './nuovo-pagamento.component.html',
  styleUrls: ['./nuovo-pagamento.component.scss']
})
export class NuovoPagamentoComponent implements OnInit {
  servizioSelezionato: FiltroServizio;
  breadcrumbList = [];
  titolo: string;

  @Input()
  datiPagamento: DatiPagamento;

  @Input()
  filtroPagamento = true;

  servizioId: number;


  constructor(private route: ActivatedRoute, private nuovoPagamentoService: NuovoPagamentoService) {
    this.nuovoPagamentoService.compilazioneEvent.subscribe(servizioSelezionato => {
      this.servizioSelezionato = servizioSelezionato;
    });
    this.route.queryParams.subscribe((params) => {
      this.servizioId = parseInt(params.servizio);
    });
  }

  ngOnInit(): void {
    this.inizializzaHeaderSezione();
  }

  inizializzaHeaderSezione(): void {
    if (this.datiPagamento) {
      this.titolo = 'Dettaglio Pagamento';
      this.breadcrumbList.push(new Breadcrumb(0, '< I Miei Pagamenti', '/iMieiPagamenti', null));
    } else {
      this.titolo = 'Nuovo Pagamento';
      this.breadcrumbList.push(new Breadcrumb(0, 'Home', null, null));
      this.breadcrumbList.push(new Breadcrumb(1, 'Pagamenti', null, null));
      this.breadcrumbList.push(new Breadcrumb(1, 'Nuovo Pagamento', null, null));
    }
  }

}
