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

  buffer = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" +
    "<Buffer>\n" +
    "    <ProtocolVersion />\n" +
    "    <TagOrario>202007161139</TagOrario>\n" +
    "    <CodicePortale>PROVA</CodicePortale>\n" +
    "    <BufferDati>MDQwYTE2MDQtYzE3My00MGM2LWJjZTQtNjRjNzMyMDU5ZTZk</BufferDati>\n" +
    "    <Hash>b0ea8d556c7431abdcc0501bf73e840d</Hash>\n" +
    "</Buffer>"

  constructor() {
  }

  ngOnInit(): void {
  }

  getAction() {
    return environment.bffBaseUrl + '/redirectCarrello'
  }
}
