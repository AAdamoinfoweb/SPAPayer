import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {environment} from '../../environments/environment';
import {catchError, map} from 'rxjs/operators';
import {EventEmitter, Injectable, Output} from "@angular/core";
import {LivelloTerritoriale} from '../modules/main/model/LivelloTerritoriale';
import {Ente} from '../modules/main/model/Ente';
import {Servizio} from '../modules/main/model/Servizio';
import {CampiNuovoPagamento} from '../modules/main/model/CampiNuovoPagamento';
import {DettaglioTransazioneEsito} from '../modules/main/model/bollettino/DettaglioTransazioneEsito';
import {Bollettino} from "../modules/main/model/bollettino/Bollettino";
import {EsitoEnum} from "../enums/esito.enum";

@Injectable({
  providedIn: 'root'
})
export class NuovoPagamentoService {

  private filtroLivelloTerritorialeUrl = '/filtroLivelloTerritoriale';
  private filtroEntiUrl = '/filtroEnti';
  private filtroServiziUrl = '/filtroServizi';
  private campiNuovoPagamentoUrl = '/campiNuovoPagamento';
  private verificaBollettinoUrl = '/verificaBollettino';
  private inserimentoBollettinoUrl = '/bollettino';
  private inserimentoCarrelloUrl = '/carrello';

  compilazioneEvent: EventEmitter<Servizio> = new EventEmitter<Servizio>();
  prezzoEvent: EventEmitter<number> = new EventEmitter<number>();
  pulisciEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private http: HttpClient) {
  }

  recuperaFiltroLivelloTerritoriale(): Observable<LivelloTerritoriale[]> {
    return this.http.get(environment.bffBaseUrl + this.filtroLivelloTerritorialeUrl)
      .pipe(map((body: any) => {
        return body;
      }));
  }

  recuperaFiltroEnti(idLivelloTerritoriale): Observable<Ente[]> {
    let params = new HttpParams();
    if (idLivelloTerritoriale) {
      params = params.set('livelloTerritorialeId', idLivelloTerritoriale);
    }

    return this.http.get(environment.bffBaseUrl + this.filtroEntiUrl, {
      params: params
    })
      .pipe(map((body: any) => {
        return body;
      }));
  }

  recuperaFiltroServizi(idEnte): Observable<Servizio[]> {
    let params = new HttpParams();
    if (idEnte) {
      params = params.set('enteId', idEnte);
    }

    return this.http.get(environment.bffBaseUrl + this.filtroServiziUrl, {
      params: params
    })
      .pipe(map((body: any) => {
        return body;
      }));
  }

  recuperaCampiSezioneDati(idServizio): Observable<CampiNuovoPagamento> {
    return this.http.get(environment.bffBaseUrl + this.campiNuovoPagamentoUrl, {
      params: {
        servizioId: idServizio
      }
    })
      .pipe(map((body: any) => {
        return body;
      }));
  }

  verificaBollettino(numero = null, idDettaglioTransazione = null): Observable<EsitoEnum> {
    let params = {};
    if (numero)
      params = {numero};
    else if (idDettaglioTransazione)
      params = {idDettaglioTransazione};

    return this.http.get(environment.bffBaseUrl + this.verificaBollettinoUrl, {
      params: params, withCredentials: true
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
let b = [
  {
    "servizioId": 6,
    "enteId": 3,
    "cfpiva": "VRDNTN80A01A662Q",
    "importo": 450,
    "numero": "documento 30",
    "anno": "2020",
    "causale": "finanziamento",
    "iuv": "iuv test",
    "listaCampoDettaglioTransazione": [
      {
        "titolo": "titolo di prova",
        "valore": "valore di prova"
      }
    ]
  },
  {
    "servizioId": 6,
    "enteId": 3,
    "cfpiva": "VRDNTN80A01A662Q",
    "importo": 400,
    "numero": "documento 38",
    "anno": "2020",
    "causale": "finanziamento",
    "iuv": "iuv test",
    "listaCampoDettaglioTransazione": [
      {
        "titolo": "titolo test",
        "valore": "valore test"
      }
    ]
  }
];
    return this.http.post(environment.bffBaseUrl + this.inserimentoBollettinoUrl, "ss",
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

  inserimentoCarrello(value: DettaglioTransazioneEsito)  {
    return this.http.post(environment.bffBaseUrl + this.inserimentoCarrelloUrl, value,
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
}
