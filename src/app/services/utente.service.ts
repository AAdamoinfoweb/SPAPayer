import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {environment} from '../../environments/environment';
import {catchError, map} from 'rxjs/operators';
import {HttpClient, HttpParams} from '@angular/common/http';
import {RicercaUtente} from '../modules/main/model/utente/RicercaUtente';

@Injectable({
  providedIn: 'root'
})
export class UtenteService {

  private readonly ricercaUtentiUrl = '/utenti';
  private readonly letturaCodiceFiscaleUtenteUrl = '/codiceFiscale';

  constructor(private http: HttpClient) { }

  ricercaUtenti(livelloTerritorialeId?, societaId?, enteId?, servizioId?, funzioneId?, codiceFiscale?,
                dataScadenzaDa?, dataScadenzaA?, ultimoAccessoDa?, ultimoAccessoA?): Observable<RicercaUtente[]> {
    let params = new HttpParams();
    if (livelloTerritorialeId != null) {
      params = params.set('livelloTerritorialeId', livelloTerritorialeId);
    }
    if (societaId != null) {
      params = params.set('societaId', societaId);
    }
    if (enteId != null) {
      params = params.set('enteId', enteId);
    }
    if (servizioId != null) {
      params = params.set('servizioId', servizioId);
    }
    if (funzioneId != null) {
      params = params.set('funzioneId', funzioneId);
    }
    if (codiceFiscale != null) {
      params = params.set('codiceFiscale', codiceFiscale);
    }
    if (dataScadenzaDa != null) {
      params = params.set('dataScadenzaDa', dataScadenzaDa);
    }
    if (dataScadenzaA != null) {
      params = params.set('dataScadenzaA', dataScadenzaA);
    }
    if (ultimoAccessoDa != null) {
      params = params.set('ultimoAccessoDa', ultimoAccessoDa);
    }
    if (ultimoAccessoA != null) {
      params = params.set('ultimoAccessoA', ultimoAccessoA);
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
