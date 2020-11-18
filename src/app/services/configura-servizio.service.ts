import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {RaggruppamentoTipologiaServizio} from '../modules/main/model/RaggruppamentoTipologiaServizio';
import {environment} from '../../environments/environment';
import {catchError, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ConfiguraServizioService {

  private readonly configuraServiziBasePath = '/configuraServizi';
  private filtroRaggruppamentoUrl = '/filtroRaggruppamento';

  constructor(private http: HttpClient) {
  }


  configuraServiziFiltroRaggruppamento(idFunzione: string) {
    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', idFunzione);

    return this.http.get(environment.bffBaseUrl + this.configuraServiziBasePath + this.filtroRaggruppamentoUrl, {
      headers: h,
      withCredentials: true
    })
      .pipe(map((body: any) => {
          return body as RaggruppamentoTipologiaServizio[];
        }),
        catchError((err, caught) => {
          if (err.status == 401 || err.status == 400) {
            return of(null);
          } else {
            return of(null);
          }
        }));
  }
}
