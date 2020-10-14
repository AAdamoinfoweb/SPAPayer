import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {PagamentoService} from "../../../../services/pagamento.service";
import {interval} from "rxjs";
import {NuovoPagamentoService} from "../../../../services/nuovo-pagamento.service";

const source = interval(10000);

@Component({
  selector: 'app-presaincaricopagamento',
  templateUrl: './presaincaricopagamento.component.html',
  styleUrls: ['./presaincaricopagamento.component.scss']
})
export class PresaincaricopagamentoComponent implements OnInit {

  idSession: string;
  timerId;
  runCount = 0;
  msg;

  constructor(private route: ActivatedRoute,
              private nuovoPagamentoService: NuovoPagamentoService,
              private pagamentoService: PagamentoService) {
    this.route.queryParams.subscribe((params) => {
      this.idSession = params.idSession;
    });
  }

  ngOnInit(): void {
    this.runCount = this.runCount + 1;
    let observable;
    if (localStorage.getItem("nome") == null) {
      this.msg = "Appena possibile o al massimo entro 2 minuti verrà reindirizzato sul portale dell'ente.";
      observable = this.pagamentoService.verificaEsitoPagamento(this.idSession, false);
    } else {
      this.msg = "Appena possibile o al massimo entro 2 minuti verrà notificato l'esito del pagamento.";
      observable = this.nuovoPagamentoService.verificaEsitoPagamento(this.idSession, false);
    }

    let subscr = observable.subscribe((url) => {
      subscr.unsubscribe();
      return this.goToUrl(url);
    });
    this.timerId = source.subscribe(() => this.timerMethod());
  }

  timerMethod(): any {
    let ultima = false
    this.runCount = this.runCount + 1;
    if (this.runCount === 12) {
      ultima = true
      this.timerId.unsubscribe();
    }
    let observable;
    if (localStorage.getItem("nome") == null) {
      observable = this.pagamentoService.verificaEsitoPagamento(this.idSession, false);
    } else {
      observable = this.nuovoPagamentoService.verificaEsitoPagamento(this.idSession, false);
    }
    let subscr = observable.subscribe((url) => {
      subscr.unsubscribe();
      return this.goToUrl(url);
    });
  }

  private goToUrl(url: string) {
    if (url)
      window.location.href = url;
  }

}
