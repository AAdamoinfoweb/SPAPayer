import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {PagamentoService} from "../../../../services/pagamento.service";
import {MenuService} from "../../../../services/menu.service";

@Component({
  selector: 'app-waiting-l1',
  templateUrl: './waiting-l1.component.html',
  styleUrls: ['./waiting-l1.component.scss']
})
export class WaitingL1Component implements OnInit {

  constructor(private route: ActivatedRoute,
              private pagamentoService: PagamentoService,
              private menuService: MenuService) {
  }

  ngOnInit(): void {
    localStorage.clear();
    this.menuService.isL1Event.emit(true);
    this.route.queryParams.subscribe((params) => {
      this.pagamentoService.verificaQuietanza(params.idSession, params.esito)
        .subscribe(url => {
          window.location.href = url;
        });
    });
  }

}
