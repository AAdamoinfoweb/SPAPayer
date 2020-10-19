import {Component, EventEmitter, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../../../environments/environment";
import {OverlayService} from "../../../../services/overlay.service";

@Component({
  selector: 'base-amm',
  template: '<div></div>'
})
export class AmministrativoParentComponent implements OnInit {

  public waiting = false;
  public idFunzione;

  constructor(
    protected router: Router,
    protected  overlayService: OverlayService,
    protected  route: ActivatedRoute, private http: HttpClient) {
      this.overlayService.caricamentoEvent.emit(true);
      this.waiting = true;
      this.route.queryParams.subscribe(value => {
        this.idFunzione = atob(value.funzione);
        let h: HttpHeaders = new HttpHeaders();
        h = h.append('idFunzione', this.idFunzione);
        this.http.get(environment.bffBaseUrl + '/verificaAbilitazione', {headers: h, withCredentials: true}).subscribe(() => {
          this.overlayService.caricamentoEvent.emit(false);
          this.waiting = false;
        });
      });
  }

  ngOnInit(): void {

  }
}
