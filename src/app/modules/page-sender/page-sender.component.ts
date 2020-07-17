import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {PagamentoService} from '../../services/pagamento.service';
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-redirect',
  templateUrl: './page-sender.component.html',
  styleUrls: ['./page-sender.component.scss']
})
export class PageSenderComponent implements OnInit {

  buffer = {
    ProtocolVersion: null,
    TagOrario: "202007171803",
    CodicePortale: "PROVA",
    BufferDati: "NDk4ZjZmNDUtZjlhYi00ZDBhLTk0YjgtOTI3MjhjYzhkZTNk",
    Hash: "e82e2c600781e3cd21e40a2044bb1317"
  }

  constructor() {
  }

  ngOnInit(): void {
  }

  getAction() {
    return environment.bffBaseUrl + '/cart/extCart.do'
  }
}
