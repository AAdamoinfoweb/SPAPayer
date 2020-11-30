import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
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

  private readonly stampaRTUrl = this.gestisciPortaleBasePath + '/stampaRT';
  private readonly stampaRPTUrl = this.gestisciPortaleBasePath + '/stampaRPT';
  private readonly stampaPRUrl = this.gestisciPortaleBasePath + '/stampaPR';
  private readonly stampaPDUrl = this.gestisciPortaleBasePath + '/stampaPD';
  private readonly stampaCommitMsgUrl = this.gestisciPortaleBasePath + '/stampaCommitMsg';

  private readonly inviaNotificaEnteUrl = this.gestisciPortaleBasePath + '/inviaNotificaEnte';
  private readonly inviaNotificaCittadinoUrl = this.gestisciPortaleBasePath + '/inviaNotificaCittadino';

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

  stampaRT(listaDettaglioTransazioneId: Array<number>, listaTransazioneId: Array<number>, idFunzione: string): Observable<Array<string>> {
    let params = new HttpParams();
    if (listaDettaglioTransazioneId) {
      params = params.set('listaDettaglioTransazioneId', listaDettaglioTransazioneId.join(', '));
    }
    if (listaTransazioneId) {
      params = params.set('listaTransazioneId', listaTransazioneId.join(', '));
    }

    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', idFunzione);

    return this.http.get(environment.bffBaseUrl + this.stampaRTUrl, {
      params: params,
      headers: h,
      withCredentials: true
    })
      .pipe(map((body: any) => {
          return body as Array<string>;
        }),
        catchError((err, caught) => {
          if (err.status == 401 || err.status == 400) {
            return of(null);
          } else {
            return of(null);
          }
        }));
  }

  stampaRPT(listaDettaglioTransazioneId: Array<number>, idFunzione: string): Observable<Array<string>> {
    let params = new HttpParams();
    if (listaDettaglioTransazioneId) {
      params = params.set('listaDettaglioTransazioneId', listaDettaglioTransazioneId.join(', '));
    }

    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', idFunzione);

    return this.http.get(environment.bffBaseUrl + this.stampaRPTUrl, {
      params: params,
      headers: h,
      withCredentials: true
    })
      .pipe(map((body: any) => {
          return body as Array<string>;
        }),
        catchError((err, caught) => {
          if (err.status == 401 || err.status == 400) {
            return of(null);
          } else {
            return of(null);
          }
        }));
  }

  stampaPR(listaTransazioneId: Array<number>, idFunzione: string): Observable<Array<string>> {
    let params = new HttpParams();
    if (listaTransazioneId) {
      params = params.set('listaTransazioneId', listaTransazioneId.join(', '));
    }

    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', idFunzione);

    return this.http.get(environment.bffBaseUrl + this.stampaPRUrl, {
      params: params,
      headers: h,
      withCredentials: true
    })
      .pipe(map((body: any) => {
          return body as Array<string>;
        }),
        catchError((err, caught) => {
          if (err.status == 401 || err.status == 400) {
            return of(null);
          } else {
            return of(null);
          }
        }));
  }

  stampaPD(listaTransazioneId: Array<number>, idFunzione: string): Observable<Array<string>> {
    let params = new HttpParams();
    if (listaTransazioneId) {
      params = params.set('listaTransazioneId', listaTransazioneId.join(', '));
    }

    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', idFunzione);

    return this.http.get(environment.bffBaseUrl + this.stampaPDUrl, {
      params: params,
      headers: h,
      withCredentials: true
    })
      .pipe(map((body: any) => {
          return body as Array<string>;
        }),
        catchError((err, caught) => {
          if (err.status == 401 || err.status == 400) {
            return of(null);
          } else {
            return of(null);
          }
        }));
  }

  stampaCommitMsg(transazioneId: number, listaNotificaId: Array<number>, idFunzione: string): Observable<Array<string>> {
    let params = new HttpParams();
    if (transazioneId) {
      params = params.set('transazioneId', String(transazioneId));
    }
    if (listaNotificaId) {
      params = params.set('listaNotificaId', listaNotificaId.join(', '));
    }

    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', idFunzione);

    return this.http.get(environment.bffBaseUrl + this.stampaCommitMsgUrl, {
      params: params,
      headers: h,
      withCredentials: true
    })
      .pipe(map((body: any) => {
          return body as Array<string>;
        }),
        catchError((err, caught) => {
          if (err.status == 401 || err.status == 400) {
            return of(null);
          } else {
            return of(null);
          }
        }));
  }

  inviaNotificaEnte(transazioneId: number, idFunzione: string): Observable<any> {
    let params = new HttpParams();
    if (transazioneId) {
      params = params.set('transazioneId', String(transazioneId));
    }

    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', idFunzione);

    return this.http.get(environment.bffBaseUrl + this.inviaNotificaEnteUrl, {
      params: params,
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

  inviaNotificaCittadino(transazioneId: number, idFunzione: string): Observable<any> {
    let params = new HttpParams();
    if (transazioneId) {
      params = params.set('transazioneId', String(transazioneId));
    }

    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', idFunzione);

    return this.http.get(environment.bffBaseUrl + this.inviaNotificaCittadinoUrl, {
      params: params,
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

}
