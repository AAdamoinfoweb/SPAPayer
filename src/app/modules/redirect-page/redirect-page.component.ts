import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {PagamentoService} from '../../services/pagamento.service';

@Component({
  selector: 'app-redirect',
  templateUrl: './redirect-page.component.html',
  styleUrls: ['./redirect-page.component.scss']
})
export class RedirectPageComponent implements OnInit {


  constructor(private route: Router, private pagamentoService: PagamentoService) {
  }

  ngOnInit(): void {
  }

  quietanza() {
    const idSessione = '1i951659-0aec-4312-bcc2-6270866a848p';
    const esito = 'OK';
    const observable = this.pagamentoService.quietanza(idSessione, esito);
    observable.subscribe();
  }
  redirectCarrello() {
    const buffer = {
      ProtocolVersion: null,
      TagOrario: '202007161550',
      CodicePortale: 'PROVA',
      // tslint:disable-next-line:max-line-length
      BufferDati: 'NmU5NTE2NTktMGFlYy00MzEyLWJjYzItNjI3MDg2NmE4NDJl',
      Hash: '9050073eb95cc042e7f1e77227a7dc93'
    };

    const observable = this.pagamentoService.redirectCarrello(buffer);
    observable.subscribe();
  }
}
