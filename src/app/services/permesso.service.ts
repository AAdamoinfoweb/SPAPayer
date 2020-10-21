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

  private readonly permessiBaseUrl = '/gestioneUtenti/permessi';
  private readonly inserimentoModificaPermessiUrl = '';

  constructor(private http: HttpClient) {
  }


  inserimentoModificaPermessi(codiceFiscale: string, listaPermessi: PermessoCompleto[], idFunzione: string): Observable<any> {
    const url = environment.bffBaseUrl + this.permessiBaseUrl;
    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', idFunzione);

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
          return caught;
        }
      }));
  }

}
