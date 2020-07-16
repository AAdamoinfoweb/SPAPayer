import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {PagamentoService} from '../../services/pagamento.service';

@Component({
  selector: 'app-nonautorizzato',
  templateUrl: './redirect-page.component.html',
  styleUrls: ['./redirect-page.component.scss']
})
export class RedirectPageComponent implements OnInit {


  constructor(private route: Router, private pagamentoService: PagamentoService) {
  }

  ngOnInit(): void {
  }

  quietanza() {
    const idSessione = 'da inserire';
    const esito = 'da inserire';
    const observable = this.pagamentoService.quietanza(idSessione, esito);
    let sub = observable.subscribe(value => sub.unsubscribe());
  }
  redirectCarrello() {
    const buffer = 'da inserire';
    const observable = this.pagamentoService.redirectCarrello(buffer);
    let sub = observable.subscribe(value => sub.unsubscribe());
  }
}
