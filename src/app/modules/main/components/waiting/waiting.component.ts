import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {PagamentoService} from "../../../../services/pagamento.service";
import {NuovoPagamentoService} from "../../../../services/nuovo-pagamento.service";

@Component({
  selector: 'app-waiting',
  templateUrl: './waiting.component.html',
  styleUrls: ['./waiting.component.scss']
})
export class WaitingComponent implements OnInit {

  constructor(private route: ActivatedRoute, private nuovoPagamentoService: NuovoPagamentoService) {
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.nuovoPagamentoService.verificaQuietanza(params.idSession, params.esito)
        .subscribe(url => {
          window.location.href = url;
        });
    });
  }

}
