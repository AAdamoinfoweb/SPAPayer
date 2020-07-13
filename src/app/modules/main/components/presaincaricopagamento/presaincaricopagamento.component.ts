import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {PagamentoService} from "../../../../services/pagamento.service";
import {interval} from "rxjs";

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

  constructor(private route: ActivatedRoute, private pagamentoService: PagamentoService) {
    this.route.queryParams.subscribe((params) => {
      this.idSession = params.idSession;

    });
  }

  ngOnInit(): void {
    this.runCount = this.runCount + 1;
    const observable = this.pagamentoService.verificaEsitoPagamento(this.idSession, false);
    observable.subscribe((url) => this.goToUrl(url));
    this.timerId = source.subscribe(() => this.timerMethod());
  }

  timerMethod(): any {
    let ultima = false
    this.runCount = this.runCount + 1;
    if (this.runCount === 12) {
      ultima = true
      // clearInterval(this.timerId);
      this.timerId.unsubscribe();
    }
    const observable = this.pagamentoService.verificaEsitoPagamento(this.idSession, ultima);
    observable.subscribe((url) => this.goToUrl(url));
  }

  private goToUrl(url: string) {
    if (url)
      window.location.href = url;
  }

}
