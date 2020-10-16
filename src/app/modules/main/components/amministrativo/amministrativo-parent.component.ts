import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../../../environments/environment";
import {OverlayService} from "../../../../services/overlay.service";

@Component({
  template: ''
})
export class AmministrativoParentComponent implements OnInit {

  constructor(
    protected functionEndpoint: string,
    protected router: Router,
    protected  overlayService: OverlayService,
    protected  route: ActivatedRoute, private http: HttpClient) {
  }

  protected idFunzione;

  ngOnInit(): void {
    this.overlayService.caricamentoEvent.emit(true);
    this.route.params.subscribe(value => {
      this.idFunzione = atob(value.funzione);
      let headers: HttpHeaders = new HttpHeaders();
      headers = headers.append('idFunzione', this.idFunzione);
      this.http.get(environment.bffBaseUrl + '/' + this.functionEndpoint, {headers: headers}).subscribe(() => {
        this.overlayService.caricamentoEvent.emit(false);
      });
    });
  }
}
