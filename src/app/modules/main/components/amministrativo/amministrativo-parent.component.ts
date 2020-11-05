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
  private idFunzioneString;

  constructor(protected router: Router, protected  route: ActivatedRoute,
              protected http: HttpClient, protected amministrativoService: AmministrativoService) {

    this.waitingEmitter.emit(true);
    this.amministrativoService.asyncAmministrativoSubject.subscribe(() => {
      this.route.url.subscribe((url) => {
        const basePath = '/' + url[0].path;
        let h: HttpHeaders = new HttpHeaders();
        this.idFunzioneString = String(this.amministrativoService.mappaFunzioni[basePath]);
        h = h.append('idFunzione', this.idFunzioneString);
        let observable: Observable<any> = this.http.get(environment.bffBaseUrl + '/verificaAbilitazione', {
          headers: h,
          withCredentials: true
        }).pipe(map(() => {
          this.waitingEmitter.emit(false);
          this.inserimentoLogAzione().subscribe();
          return of(null);
        }));
        observable.subscribe();
      });
    });
  }

  ngOnInit(): void {
  }

  private inserimentoLogAzione(): Observable<any> {
    return this.http.post(environment.bffBaseUrl + this.inserimentoLogAzioneUrl, this.idFunzioneString, {
      withCredentials: true
    });
  }
}
