import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {RaggruppamentoTipologiaServizio} from '../modules/main/model/RaggruppamentoTipologiaServizio';
import {environment} from '../../environments/environment';
import {catchError, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RaggruppamentoTipologiaServizioService {

  private readonly raggruppamentoTipologieBasePath = '/raggruppamentoTipologie';
  private readonly baseUrl = this.raggruppamentoTipologieBasePath + '/raggruppamentoTipologiaServizio';
  private readonly eliminaRaggruppamentoUrl = this.baseUrl + '/eliminaRaggruppamentoTipologiaServizio';

  constructor(private http: HttpClient) { }

  ricercaRaggruppamentoTipologiaServizio(raggruppamentoTipologiaServizioId: number, idFunzione: string): Observable<RaggruppamentoTipologiaServizio[]> {
    let params = new HttpParams();
    if (raggruppamentoTipologiaServizioId != null) {
      params = params.set('raggruppamentoTipologiaServizioId', String(raggruppamentoTipologiaServizioId));
    }

    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', idFunzione);

    return this.http.get(environment.bffBaseUrl + this.baseUrl, {
      params: params,
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

  inserimentoRaggruppamentoTipologiaServizio(raggruppamentoTipologiaServizio: RaggruppamentoTipologiaServizio, idFunzione: string): Observable<any> {
    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', idFunzione);

    return this.http.post(environment.bffBaseUrl + this.baseUrl, raggruppamentoTipologiaServizio, {
      headers: h,
      withCredentials: true
    })
      .pipe(map((body: any) => {
          return body;
        }),
        catchError((err, caught) => {
          if (err.status == 401 || err.status == 400) {
            return of(null);
          } else {
            return of(null);
          }
        }));
  }

  modificaRaggruppamentoTipologiaServizio(raggruppamentoTipologiaServizio: RaggruppamentoTipologiaServizio, idFunzione: string): Observable<any> {
    const url = environment.bffBaseUrl + this.baseUrl;
    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', idFunzione);

    return this.http.put(`${url}/${raggruppamentoTipologiaServizio.id}`, raggruppamentoTipologiaServizio, {
      headers: h,
      withCredentials: true
    })
      .pipe(map((body: any) => {
          return body;
        }),
        catchError((err, caught) => {
          if (err.status == 401 || err.status == 400) {
            return of(null);
          } else {
            return of(null);
          }
        }));
  }

  eliminaRaggruppamentoTipologiaServizio(listaRaggruppamentoTipologiaServizioId: Array<number>, idFunzione: string): Observable<any> {
    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', idFunzione);

    return this.http.post(environment.bffBaseUrl + this.eliminaRaggruppamentoUrl, listaRaggruppamentoTipologiaServizioId, {
      headers: h,
      withCredentials: true
    })
      .pipe(map((body: any) => {
          return body;
        }));
  }

}
