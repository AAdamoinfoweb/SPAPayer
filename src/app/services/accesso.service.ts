import {Injectable} from '@angular/core';
import {ParametriRicercaAccesso} from '../modules/main/model/accesso/ParametriRicercaAccesso';
import {Observable, of} from 'rxjs';
import {Accesso} from '../modules/main/model/accesso/Accesso';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {catchError, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AccessoService {
  private readonly baseUrl = '/monitoraggioAccessi';
  private readonly letturaAccessiUrl = '/accessi';

  constructor(private http: HttpClient) { }

  recuperaAccessi(parametriRicercaAccesso: ParametriRicercaAccesso, idFunzione: string): Observable<Accesso[]> {
    const url = environment.bffBaseUrl + this.baseUrl + this.letturaAccessiUrl;
    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', idFunzione);
    let params = new HttpParams();

    if (parametriRicercaAccesso) {
      Object.keys(parametriRicercaAccesso).forEach(parametro => {
        if (parametriRicercaAccesso[parametro]) {
          params = params.set(parametro, String(parametriRicercaAccesso[parametro]));
        }
      });
    }

    return this.http.get(`${url}`, {
      withCredentials: true,
      headers: h,
      params
    }).pipe(map((body: Accesso[]) => {
        return body;
      }),
      catchError((err, caught) => {
        if (err.status === 401 || err.status === 400) {
          return of(null);
        } else {
          return of(null);
        }
      }));;
  }
}
