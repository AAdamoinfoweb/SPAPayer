import {HttpClient, HttpParams} from '@angular/common/http';
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
  private readonly inserimentoCarrelloUrl = '/carrello';
  private readonly campiPrecompilatiUrl = '/datiPagamento';
  private salvaPerDopoUrl = '/salvaPerDopo';
  private carrelloUrl = '/carrello';
  private confermaPagamentoUrl = '/confermaPagamento';

  compilazioneEvent: EventEmitter<FiltroServizio> = new EventEmitter<FiltroServizio>();
  prezzoEvent: EventEmitter<number> = new EventEmitter<number>();
  pulisciEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private readonly http: HttpClient) {
  }

  recuperaFiltroLivelloTerritoriale(): Observable<LivelloTerritoriale[]> {
    return this.http.get(environment.bffBaseUrl + this.filtroLivelloTerritorialeUrl, {withCredentials: true})
      .pipe(map((body: any) => {
        return body;
      }));
  }

  recuperaFiltroEnti(idLivelloTerritoriale): Observable<Ente[]> {
    return this.http.get(environment.bffBaseUrl + this.filtroEntiUrl, {
      withCredentials: true,
      params: {
        livelloTerritorialeId: idLivelloTerritoriale
      }
    })
      .pipe(map((body: any) => {
        return body;
      }));
  }

  recuperaFiltroServizi(idEnte): Observable<FiltroServizio[]> {
    return this.http.get(environment.bffBaseUrl + this.filtroServiziUrl, {
      withCredentials: true,
      params: {
        enteId: idEnte
      }
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
            return caught;
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
          return caught;
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
          return caught;
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
          return caught;
        }
      }));
  }

  getCarrello(): Observable<Carrello> {
    return this.http.get(environment.bffBaseUrl + this.carrelloUrl)
      .pipe(map((body: any) => body),
        catchError((err, caught) => {
          if (err.status == 401) {
            return of('');
          } else if (err.status == 500) {
            return of('');
          } else {
            return caught;
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
          return caught;
        }
      }));
  }

  confermaPagamento(email: string, list: Bollettino[] = []): Observable<any> {
    let observable: Observable<any> = this.http.post(environment.bffBaseUrl + this.confermaPagamentoUrl + "?email=" + email,
      JSON.stringify(list), {withCredentials: true})
      .pipe(map((body: any) => {
          if (body.url)
            return body.url;
          else
            return body;
        }),
        catchError((err, caught) => {
          if (err.status == 401 || err.status == 400) {
            return of(null);
          } else
            return caught;
        }));
    return observable;
  }
}
