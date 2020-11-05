import {EventEmitter, Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {environment} from '../../environments/environment';
import {catchError, map} from 'rxjs/operators';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {ParametriRicercaUtente} from '../modules/main/model/utente/ParametriRicercaUtente';
import {RicercaUtente} from '../modules/main/model/utente/RicercaUtente';
import {InserimentoModificaUtente} from '../modules/main/model/utente/InserimentoModificaUtente';
import {PermessoCompleto} from "../modules/main/model/permesso/PermessoCompleto";

@Injectable({
  providedIn: 'root'
})
export class PermessoService {

  private readonly permessiBaseUrl = '/gestisciUtenti/permessi';
  private readonly inserimentoModificaPermessiUrl = '';

  constructor(private http: HttpClient) {
  }

  letturaPermessi(codiceFiscale: string, idFunzione: string): Observable<PermessoCompleto[]> {
    const url = environment.bffBaseUrl + this.permessiBaseUrl;
    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', idFunzione);
    let params = new HttpParams();
    if (codiceFiscale != null) {
      params = params.set('codiceFiscale', codiceFiscale);
    }
    return this.http.get(`${url}`,
      {
        withCredentials: true,
        headers: h,
        params: params
      }).pipe(map((body: PermessoCompleto[]) => {
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

  inserimentoModificaPermessi(codiceFiscale: string, listaPermessi: PermessoCompleto[], idFunzione: string): Observable<any> {
    const url = environment.bffBaseUrl + this.permessiBaseUrl;
    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', idFunzione);
    const idSocieta: number[] = listaPermessi.map(value => value.societaId);
    h = h.append('idSocieta', idSocieta.toString());

    return this.http.put(`${url}/${codiceFiscale}`, listaPermessi,
      {
        withCredentials: true,
        headers: h
      }).pipe(map((body: any) => {
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
