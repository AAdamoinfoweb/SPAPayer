import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {PagamentoService} from "../../../../services/pagamento.service";

@Component({
  selector: 'app-waiting',
  templateUrl: './waiting.component.html',
  styleUrls: ['./waiting.component.scss']
})
export class WaitingComponent implements OnInit {

  constructor(private route: ActivatedRoute, private pagamentoService: PagamentoService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.pagamentoService.verificaQuietanza(params.idSession, params.esito).subscribe();

    });
  }

}
