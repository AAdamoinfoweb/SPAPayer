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
    TagOrario: "202007161733",
    CodicePortale: "PROVA",
    BufferDati: "NmU5NTE2NTktMGFlYy00MzEyLWJjYzItNjI3MDg2NmE4NDJl",
    Hash: "15d2631e372329a9dd0606f1fd59fb05"
  }

  constructor() {
  }

  ngOnInit(): void {
  }

  getAction() {
    return environment.bffBaseUrl + '/redirectCarrello'
  }
}
