import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {environment} from '../../environments/environment';
import {catchError, map} from 'rxjs/operators';
import {HttpClient, HttpParams} from '@angular/common/http';
import {ParametriRicercaUtente} from '../modules/main/model/utente/ParametriRicercaUtente';
import {RicercaUtente} from '../modules/main/model/utente/RicercaUtente';

@Injectable({
  providedIn: 'root'
})
export class UtenteService {

  private readonly ricercaUtentiUrl = '/utenti';
  private readonly letturaCodiceFiscaleUtenteUrl = '/codiceFiscale';

  constructor(private http: HttpClient) { }

  ricercaUtenti(parametriRicercaUtente: ParametriRicercaUtente): Observable<RicercaUtente[]> {
    let params = new HttpParams();
    if (parametriRicercaUtente.livelloTerritorialeId != null) {
      params = params.set('livelloTerritorialeId', String(parametriRicercaUtente.livelloTerritorialeId));
    }
    if (parametriRicercaUtente.societaId != null) {
      params = params.set('societaId', String(parametriRicercaUtente.societaId));
    }
    if (parametriRicercaUtente.enteId != null) {
      params = params.set('enteId', String(parametriRicercaUtente.enteId));
    }
    if (parametriRicercaUtente.servizioId != null) {
      params = params.set('servizioId', String(parametriRicercaUtente.servizioId));
    }
    if (parametriRicercaUtente.funzioneId != null) {
      params = params.set('funzioneId', String(parametriRicercaUtente.funzioneId));
    }
    if (parametriRicercaUtente.codiceFiscale != null) {
      params = params.set('codiceFiscale', parametriRicercaUtente.codiceFiscale);
    }
    if (parametriRicercaUtente.dataScadenzaDa != null) {
      params = params.set('dataScadenzaDa', String(parametriRicercaUtente.dataScadenzaDa));
    }
    if (parametriRicercaUtente.dataScadenzaA != null) {
      params = params.set('dataScadenzaA', String(parametriRicercaUtente.dataScadenzaA));
    }
    if (parametriRicercaUtente.ultimoAccessoDa != null) {
      params = params.set('ultimoAccessoDa', String(parametriRicercaUtente.ultimoAccessoDa));
    }
    if (parametriRicercaUtente.ultimoAccessoA != null) {
      params = params.set('ultimoAccessoA', String(parametriRicercaUtente.ultimoAccessoA));
    }

    return this.http.get(environment.bffBaseUrl + this.ricercaUtentiUrl, {
      params: params,
      withCredentials: true
    })
      .pipe(map((body: any) => {
        return body as RicercaUtente[];
      }),
      catchError((err, caught) => {
        if (err.status == 401 || err.status == 400) {
          return of(null);
        } else {
          return caught;
        }
      }));
  }

  letturaCodiceFiscale(codiceFiscaleParziale): Observable<string[]> {
    return this.http.get(environment.bffBaseUrl + this.letturaCodiceFiscaleUtenteUrl, {
      params: {
        codiceFiscaleParziale
      }
    })
      .pipe(map((body: any) => {
        return body;
      }));
  }

}
