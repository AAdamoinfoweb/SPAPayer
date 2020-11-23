import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {environment} from '../../environments/environment';
import {catchError, map} from 'rxjs/operators';
import {FiltroSelect} from '../modules/main/model/servizio/FiltroSelect';
import {FiltroVersante} from '../modules/main/model/transazione/FiltroVersante';

@Injectable({
  providedIn: 'root'
})
export class  GestisciPortaleService {

  private readonly gestisciPortaleBasePath = '/gestisciPortale';
  private readonly gestisciPortaleFiltroLivelloTerritorialeUrl = this.gestisciPortaleBasePath + '/filtroLivelloTerritoriale';
  private readonly gestisciPortaleFiltroSocietaUrl = this.gestisciPortaleBasePath + '/filtroSocieta';
  private readonly gestisciPortaleFiltroEnteUrl = this.gestisciPortaleBasePath + '/filtroEnte';
  private readonly gestisciPortaleFiltroServizioUrl = this.gestisciPortaleBasePath + '/filtroServizio';
  private readonly gestisciPortaleFiltroTransazioneUrl = this.gestisciPortaleBasePath + '/filtroTransazione';
  private readonly gestisciPortaleFiltroCanaleUrl = this.gestisciPortaleBasePath + '/filtroCanale';
  private readonly gestisciPortaleFiltroTipoFlussoUrl = this.gestisciPortaleBasePath + '/filtroTipoFlusso';
  private readonly gestisciPortaleFiltroVersanteUrl = this.gestisciPortaleBasePath + '/filtroVersante';

  constructor(private readonly http: HttpClient) {
  }

  gestisciPortaleFiltroLivelloTerritoriale(idFunzione: string): Observable<FiltroSelect[]> {
    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', idFunzione);

    return this.http.get(environment.bffBaseUrl + this.gestisciPortaleFiltroLivelloTerritorialeUrl, {
      headers: h,
      withCredentials: true
    })
      .pipe(map((body: any) => {
          return body as FiltroSelect;
        }),
        catchError((err, caught) => {
          if (err.status == 401 || err.status == 400) {
            return of(null);
          } else {
            return of(null);
          }
        }));
  }

  gestisciPortaleFiltroSocieta(idFunzione: string): Observable<FiltroSelect[]> {
    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', idFunzione);

    return this.http.get(environment.bffBaseUrl + this.gestisciPortaleFiltroSocietaUrl, {
      headers: h,
      withCredentials: true
    })
      .pipe(map((body: any) => {
          return body as FiltroSelect;
        }),
        catchError((err, caught) => {
          if (err.status == 401 || err.status == 400) {
            return of(null);
          } else {
            return of(null);
          }
        }));
  }

  gestisciPortaleFiltroEnte(idFunzione: string): Observable<FiltroSelect[]> {
    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', idFunzione);

    return this.http.get(environment.bffBaseUrl + this.gestisciPortaleFiltroEnteUrl, {
      headers: h,
      withCredentials: true
    })
      .pipe(map((body: any) => {
          return body as FiltroSelect;
        }),
        catchError((err, caught) => {
          if (err.status == 401 || err.status == 400) {
            return of(null);
          } else {
            return of(null);
          }
        }));
  }

  gestisciPortaleFiltroServizio(idFunzione: string): Observable<FiltroSelect[]> {
    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', idFunzione);

    return this.http.get(environment.bffBaseUrl + this.gestisciPortaleFiltroServizioUrl, {
      headers: h,
      withCredentials: true
    })
      .pipe(map((body: any) => {
          return body as FiltroSelect;
        }),
        catchError((err, caught) => {
          if (err.status == 401 || err.status == 400) {
            return of(null);
          } else {
            return of(null);
          }
        }));
  }

  gestisciPortaleFiltroTransazione(idFunzione: string): Observable<FiltroSelect[]> {
    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', idFunzione);

    return this.http.get(environment.bffBaseUrl + this.gestisciPortaleFiltroTransazioneUrl, {
      headers: h,
      withCredentials: true
    })
      .pipe(map((body: any) => {
          return body as FiltroSelect;
        }),
        catchError((err, caught) => {
          if (err.status == 401 || err.status == 400) {
            return of(null);
          } else {
            return of(null);
          }
        }));
  }

  gestisciPortaleFiltroCanale(idFunzione: string): Observable<FiltroSelect[]> {
    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', idFunzione);

    return this.http.get(environment.bffBaseUrl + this.gestisciPortaleFiltroCanaleUrl, {
      headers: h,
      withCredentials: true
    })
      .pipe(map((body: any) => {
          return body as FiltroSelect;
        }),
        catchError((err, caught) => {
          if (err.status == 401 || err.status == 400) {
            return of(null);
          } else {
            return of(null);
          }
        }));
  }

  gestisciPortaleFiltroTipoFlusso(idFunzione: string): Observable<FiltroSelect[]> {
    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', idFunzione);

    return this.http.get(environment.bffBaseUrl + this.gestisciPortaleFiltroTipoFlussoUrl, {
      headers: h,
      withCredentials: true
    })
      .pipe(map((body: any) => {
          return body as FiltroSelect;
        }),
        catchError((err, caught) => {
          if (err.status == 401 || err.status == 400) {
            return of(null);
          } else {
            return of(null);
          }
        }));
  }

  gestisciPortaleFiltroVersante(idFunzione: string): Observable<FiltroVersante[]> {
    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', idFunzione);

    return this.http.get(environment.bffBaseUrl + this.gestisciPortaleFiltroVersanteUrl, {
      headers: h,
      withCredentials: true
    })
      .pipe(map((body: any) => {
          return body as FiltroVersante;
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
