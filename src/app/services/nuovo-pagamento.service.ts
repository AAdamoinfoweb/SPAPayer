import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {environment} from '../../environments/environment';
import {catchError, map} from 'rxjs/operators';
import {EventEmitter, Injectable, Output} from '@angular/core';
import {LivelloTerritoriale} from '../modules/main/model/LivelloTerritoriale';
import {Ente} from '../modules/main/model/Ente';
import {FiltroServizio} from '../modules/main/model/FiltroServizio';
import {CampiNuovoPagamento} from '../modules/main/model/CampiNuovoPagamento';
import {DettaglioTransazioneEsito} from '../modules/main/model/bollettino/DettaglioTransazioneEsito';
import {Bollettino} from '../modules/main/model/bollettino/Bollettino';
import {EsitoEnum} from '../enums/esito.enum';
import {DettagliTransazione} from "../modules/main/model/bollettino/DettagliTransazione";
import {Carrello} from "../modules/main/model/Carrello";
import {Logo} from "../modules/main/model/ente/Logo";

@Injectable({
  providedIn: 'root'
})
export class NuovoPagamentoService {

  private readonly filtroLivelloTerritorialeUrl = '/filtroLivelloTerritoriale';
  private readonly filtroEntiUrl = '/filtroEnti';
  private readonly filtroServiziUrl = '/filtroServizi';

  private readonly campiNuovoPagamentoUrl = '/campiNuovoPagamento';
  private readonly verificaBollettinoUrl = '/verificaBollettino';
  private readonly eliminaBollettinoUrl = '/eliminaBollettino';
  private readonly inserimentoBollettinoUrl = '/bollettino';
  private readonly letturaBollettinoUrl = '/bollettino/';
  private readonly inserimentoCarrelloUrl = '/carrello';
  private readonly campiPrecompilatiUrl = '/datiPagamento';
  private salvaPerDopoUrl = '/salvaPerDopo';
  private carrelloUrl = '/carrello';
  private confermaPagamentoUrl = '/confermaPagamento';
  private verificaQuietanzaUrl = '/verificaQuietanza';
  private svuotaCarrelloUrl = '/svuotaCarrello';
  private verificaEsitoPagamentoUrl = '/verificaEsitoPagamento';

  compilazioneEvent: EventEmitter<FiltroServizio> = new EventEmitter<FiltroServizio>();
  prezzoEvent: EventEmitter<any> = new EventEmitter<any>();
  pulisciEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  private logoEnteUrl = '/logoEnte';

  constructor(private readonly http: HttpClient) {
  }

  recuperaFiltroLivelloTerritoriale(filtroPagamento: boolean = false, mostraTutti: boolean = false): Observable<LivelloTerritoriale[]> {
    let params = new HttpParams();
    params = params.set('filtroPagamento', filtroPagamento ? 'true' : 'false'); // gestisce casi true, false, null, undefined
    params = params.set('mostraTutti', String(mostraTutti));
    return this.http.get(environment.bffBaseUrl + this.filtroLivelloTerritorialeUrl, {withCredentials: true, params})
      .pipe(map((body: any) => {
        return body;
      }));
  }

  recuperaFiltroEnti(idLivelloTerritoriale?, societaId?: number, filtroPagamento: boolean = false, mostraTutti = false): Observable<Ente[]> {
    let params = new HttpParams();
    if (idLivelloTerritoriale) {
      params = params.set('livelloTerritorialeId', idLivelloTerritoriale);
    }
    if (societaId) {
      params = params.set('societaId', String(societaId));
    }
    params = params.set('filtroPagamento', filtroPagamento ? 'true' : 'false'); // gestisce casi true, false, null, undefined
    params = params.set('mostraTutti', mostraTutti ? 'true' : 'false'); // gestisce casi true, false, null, undefined

    return this.http.get(environment.bffBaseUrl + this.filtroEntiUrl, {
      params: params,
      withCredentials: true
    })
      .pipe(map((body: any) => {
        return body;
      }));
  }

  recuperaFiltroServizi(idEnte?, filtroPagamento: boolean = false, mostraTutti = false): Observable<FiltroServizio[]> {
    let params = new HttpParams();
    if (idEnte) {
      params = params.set('enteId', idEnte);
    }
    params = params.set('filtroPagamento', filtroPagamento ? 'true' : 'false'); // gestisce casi true, false, null, undefined
    params = params.set('mostraTutti', mostraTutti ? 'true' : 'false'); // gestisce casi true, false, null, undefined

    return this.http.get(environment.bffBaseUrl + this.filtroServiziUrl, {
      params: params,
      withCredentials: true
    })
      .pipe(map((body: any) => {
        return body;
      }));
  }

  recuperaCampiSezioneDati(idServizio): Observable<CampiNuovoPagamento> {
    return this.http.get(environment.bffBaseUrl + this.campiNuovoPagamentoUrl, {
      withCredentials: true,
      params: {
        servizioId: idServizio
      }
    })
      .pipe(map((body: any) => {
        return body;
      }));
  }

  recuperaValoriCampiPrecompilati(servizioId, enteId, tipologiaServizioId,
                                  livelloIntegrazioneId, valoriPerPrecompilazione: object): Observable<Object> {
    return this.http.get(environment.bffBaseUrl + this.campiPrecompilatiUrl, {
      withCredentials: true,
      params: {
        servizioId,
        enteId,
        tipologiaServizioId,
        livelloIntegrazioneId,
        ...valoriPerPrecompilazione
      }
    })
      .pipe(map((body: any) => {
        return body;
      }));
  }

  letturaBollettino(idDettaglioTransazione): Observable<Bollettino> {
    return this.http.get(environment.bffBaseUrl + this.letturaBollettinoUrl + idDettaglioTransazione, {
      withCredentials: true
    })
      .pipe(map((body: any) => {
          return body;
        }));
  }

  verificaBollettino(numero = null, idDettaglioTransazione = null): Observable<EsitoEnum> {
    let params = {};
    if (numero) {
      params = {numero};
    } else if (idDettaglioTransazione) {
      params = {idDettaglioTransazione};
    }

    return this.http.get(environment.bffBaseUrl + this.verificaBollettinoUrl, {
      params, withCredentials: true
    })
      .pipe(map((body: any) => EsitoEnum[body]),
        catchError((err, caught) => {
          if (err.status == 401) {
            return of('');
          } else if (err.status == 500) {
            return of('');
          } else {
             return of(null);
          }
        }));
  }

  inserimentoBollettino(bollettini: Bollettino[]): Observable<DettaglioTransazioneEsito[]> {
    return this.http.post(environment.bffBaseUrl + this.inserimentoBollettinoUrl, JSON.stringify(bollettini),
      {withCredentials: true}).pipe(map((body: any) => {
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

  inserimentoCarrello(value: DettagliTransazione): Observable<any> {
    return this.http.post(environment.bffBaseUrl + this.inserimentoCarrelloUrl, JSON.stringify(value),
      {withCredentials: true}).pipe(map((body: any) => {
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

  salvaPerDopo(value: DettagliTransazione): Observable<any> {
    return this.http.post(environment.bffBaseUrl + this.salvaPerDopoUrl, JSON.stringify(value),
      {withCredentials: true}).pipe(map((body: any) => {
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

  getCarrello(): Observable<Carrello> {
    return this.http.get(environment.bffBaseUrl + this.carrelloUrl, {withCredentials: true})
      .pipe(map((body: any) => body),
        catchError((err, caught) => {
          if (err.status == 401) {
            return of('');
          } else if (err.status == 500) {
            return of('');
          } else {
             return of(null);
          }
        }));
  }

  eliminaBollettino(value: DettagliTransazione): Observable<any> {
    return this.http.post(environment.bffBaseUrl + this.eliminaBollettinoUrl, JSON.stringify(value),
      {withCredentials: true}).pipe(map((body: any) => {
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

  confermaPagamento(email: string, list: Bollettino[] = []): Observable<any> {
    let observable: Observable<any> = this.http.post(environment.bffBaseUrl + this.confermaPagamentoUrl + "?email=" + email,
      JSON.stringify(list), {withCredentials: true})
      .pipe(map((body: any) => {
          if (body.url) {
            return body.url;
          } else {
            return body;
          }
        }),
        catchError((err, caught) => {
          if (err.status == 401 || err.status == 400) {
            return of(null);
          } else {
            return of(null);
          }
        }));
    return observable;
  }

  public verificaQuietanza(idSession: string, esito: string): Observable<string> {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append("XSRF-TOKEN", idSession);
    return this.http.post(environment.bffBaseUrl + this.verificaQuietanzaUrl, esito, {
      withCredentials: true,
      headers: headers
    })
      .pipe(map((body: any) => body.url),
        catchError((err, caught) => {
          if (err.status == 401) {
            return of("");
          } else {
            return of(null);
          }
        }));
  }

  svuotaCarrello(): Observable<any> {
    return this.http.post(environment.bffBaseUrl + this.svuotaCarrelloUrl, null,
      {withCredentials: true}).pipe(map((body: any) => {
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

  public verificaEsitoPagamento(idSession: string, ultima: boolean): Observable<any> {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append("XSRF-TOKEN", idSession)
    return this.http.post(environment.bffBaseUrl + this.verificaEsitoPagamentoUrl, ultima, {withCredentials: true, headers: headers})
      .pipe(map((json: any) => {
        return json ? json.url : null;
      }), catchError((err, caught) => {
        if (err.status == 401) {
          return of(null);
        } else {
          return of(null);
        }
      }));
  }

  getLogoEnte(enteId: number): Observable<Logo> {
    let params = new HttpParams();
    params = params.set('enteId', enteId.toString()); // gestisce casi true, false, null, undefined
    return this.http.get(environment.bffBaseUrl + this.logoEnteUrl, {withCredentials: true, params})
      .pipe(map((body: any) => {
        return body as Logo;
      }), catchError((err, caught) => {
        if (err.status == 401) {
          return of(null);
        } else {
          return of(null);
        }
      }));
  }
}
