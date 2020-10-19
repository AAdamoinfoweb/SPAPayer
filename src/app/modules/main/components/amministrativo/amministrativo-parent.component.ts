import {Component, EventEmitter, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../../../environments/environment";
import {OverlayService} from "../../../../services/overlay.service";
import {AmministrativoService} from "../../../../services/amministrativo.service";
import {flatMap, map} from 'rxjs/operators';
import {Observable, of} from "rxjs";

@Component({
  selector: 'base-amm',
  template: '<div></div>'
})
export class AmministrativoParentComponent implements OnInit {

  public waitingEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();

  private inserimentoLogAzioneUrl = '/inserimentoLogAzione';

  constructor(
    protected router: Router,
    protected  overlayService: OverlayService,
    protected  route: ActivatedRoute, private http: HttpClient,
    protected amministrativoService: AmministrativoService) {
    this.overlayService.caricamentoEvent.emit(true);
    this.waitingEmitter.emit(true);
    this.route.queryParams.subscribe(value => {
      this.amministrativoService.idFunzione = atob(value.funzione);
      let h: HttpHeaders = new HttpHeaders();
      h = h.append('idFunzione', this.amministrativoService.idFunzione);
      let observable: Observable<any> = this.http.get(environment.bffBaseUrl + '/verificaAbilitazione', {
        headers: h,
        withCredentials: true
      }).pipe(map(() => {
        this.overlayService.caricamentoEvent.emit(false);
        this.waitingEmitter.emit(false);
        this.inserimentoLogAzione().subscribe();
        return of(null);
      }));
      observable.subscribe();
    });
  }

  ngOnInit(): void {
  }

  private inserimentoLogAzione(): Observable<any> {
    return this.http.post(environment.bffBaseUrl + this.inserimentoLogAzioneUrl, this.amministrativoService.idFunzione, {
      withCredentials: true
    });
  }
}
