import {EventEmitter, Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {environment} from '../../environments/environment';
import {catchError, map} from 'rxjs/operators';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {ParametriRicercaUtente} from '../modules/main/model/utente/ParametriRicercaUtente';
import {RicercaUtente} from '../modules/main/model/utente/RicercaUtente';
import {InserimentoModificaUtente} from '../modules/main/model/utente/InserimentoModificaUtente';
import {BannerService} from './banner.service';
import {Utils} from '../utils/Utils';

@Injectable({
  providedIn: 'root'
})
export class UtenteService {

  private readonly utentiBaseUrl = '/gestisciUtenti/utenti';
  private readonly letturaCodiceFiscaleUtenteUrl = '/codiceFiscale';

  codiceFiscaleEvent: EventEmitter<string> = new EventEmitter<string>();
  utentePermessiAsyncSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  constructor(private http: HttpClient, private bannerService: BannerService) {
  }

  ricercaUtenti(parametriRicercaUtente: ParametriRicercaUtente, idFunzione: string): Observable<RicercaUtente[]> {
    let params = new HttpParams();
    if (parametriRicercaUtente) {
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
    }

    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', idFunzione);

    return this.http.get(environment.bffBaseUrl + this.utentiBaseUrl, {
      params: params,
      headers: h,
      withCredentials: true
    })
      .pipe(map((body: any) => {
          return body as RicercaUtente[];
        }),
        catchError((err, caught) => {
          if (err.status == 401 || err.status == 400) {
            return of(null);
          } else {
             return of(null);
          }
        }));
  }

  letturaCodiciFiscali(codiceFiscaleParziale, idFunzione: string): Observable<string[]> {
    let params = new HttpParams();
    if (codiceFiscaleParziale != null) {
      params = params.set('codiceFiscaleParziale', codiceFiscaleParziale);
    }
    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', idFunzione);
    return this.http.get(environment.bffBaseUrl + this.letturaCodiceFiscaleUtenteUrl, {
      params: params,
      headers: h,
      withCredentials: true
    })
      .pipe(map((body: any) => {
        return body;
      }));
  }

  inserimentoModificaUtentePermessi(codiceFiscale: string, datiUtente: InserimentoModificaUtente, idFunzione: string): Observable<any> {
    const url = environment.bffBaseUrl + this.utentiBaseUrl + 'Permessi';
    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', idFunzione);

    const listaPermessi = datiUtente.listaPermessi;
    if (listaPermessi.length > 0) {
      let idSocieta: number[] = listaPermessi.map(value => value.societaId);
      idSocieta = idSocieta.filter((value, index, self) => {
        return self.indexOf(value) === index;
      });
      if (!idSocieta.some(value => value === undefined || value === null)) {
        h = h.append('idSocieta', idSocieta.toString());
      }
    }

    return this.http.put(`${url}/${codiceFiscale}`, datiUtente,
      {
        withCredentials: true,
        headers: h
      }).pipe(map((body: any) => {
        this.bannerService.bannerEvent.emit([Utils.bannerOperazioneSuccesso()]);
        return body;
      }),
      catchError((err, caught) => {
        if (err.status == 401 || err.status == 400 || err.status == 500) {
          return of(err);
        } else {
           return of(null);
        }
      }));
  }

}
