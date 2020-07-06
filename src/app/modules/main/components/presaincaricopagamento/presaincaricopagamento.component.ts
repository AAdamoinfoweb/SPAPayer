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
      this.pagamentoService.verificaQuietanza(this.idSession, "").subscribe();
    });
  }

  ngOnInit(): void {
    // this.timerId = setInterval(() => {this.timerMethod();}, 10000);
    this.timerId = source.subscribe(() => this.timerMethod());
  }

  timerMethod(): any {
    let ultima = false
    this.runCount = this.runCount + 1;
    if (this.runCount === 120) {
      ultima = true
      // clearInterval(this.timerId);
      this.timerId.unsubscribe();
    }
    const observable = this.pagamentoService.verificaEsitoPagamento(ultima);
    observable.subscribe();
  }

}
