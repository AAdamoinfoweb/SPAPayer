import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, of} from "rxjs";
import {CampoForm} from "../modules/main/model/CampoForm";
import {catchError, map} from "rxjs/operators";
import {environment} from "../../environments/environment";
import {ParametriRicercaTipologiaServizio} from '../modules/main/model/tipologiaServizio/ParametriRicercaTipologiaServizio';
import {TipologiaServizio} from '../modules/main/model/tipologiaServizio/TipologiaServizio';

@Injectable({
  providedIn: 'root'
})
export class CampoTipologiaServizioService {
  private readonly baseUrl = '/gestisciTipologiaServizi';
  private readonly tipologiaServizioUrl = '/tipologiaServizi';
  private readonly campiTipologiaServizioUrl = '/campiTipologiaServizio';

  constructor(private http: HttpClient) {
  }

  recuperaTipologieServizio(filtri: ParametriRicercaTipologiaServizio, idFunzione): Observable<TipologiaServizio[]> {

    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', idFunzione);

    let params = new HttpParams();
    if (filtri) {
      if (filtri.raggruppamento) {
        params = params.set('raggruppamento', filtri.raggruppamento);
      }
      if (filtri.codice) {
        params = params.set('codice', filtri.codice);
      }
    }

    return this.http.get(environment.bffBaseUrl + this.baseUrl + this.tipologiaServizioUrl, {
      withCredentials: true,
      headers: h,
      params
    }).pipe(map((body: TipologiaServizio[]) => {
        return body;
      }),
      catchError((err, caught) => {
        if (err.status === 401 || err.status === 400) {
          return of(null);
        } else {
          return of(null);
        }
      }));
  }

  campiTipologiaServizio(tipologiaServizioId: number, idFunzione): Observable<CampoForm[]> {

    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', idFunzione);
    return this.http.get(environment.bffBaseUrl + this.baseUrl + this.campiTipologiaServizioUrl + `?tipologiaServizioId=${tipologiaServizioId}`, {
      withCredentials: true,
      headers: h
    }).pipe(map((body: CampoForm[]) => {
        return body;
      }),
      catchError((err, caught) => {
        if (err.status === 401 || err.status === 400) {
          return of(null);
        } else {
          return of(null);
        }
      }));
  }

}

