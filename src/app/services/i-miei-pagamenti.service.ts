import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {environment} from '../../environments/environment';
import {catchError, map} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {ParametriRicercaPagamenti} from '../modules/main/model/utente/ParametriRicercaPagamenti';
import {DettagliTransazione} from '../modules/main/model/bollettino/DettagliTransazione';
import {DatiPagamento} from '../modules/main/model/bollettino/DatiPagamento';

@Injectable({
  providedIn: 'root'
})
export class IMieiPagamentiService {

  private readonly ricercaPagamentiUrl = '/pagamenti';
  private readonly eliminaBollettinoUrl = '/eliminaBollettino';
  private readonly inserimentoPagamentiUrl = '/inserimentoPagamentiCarrello';
  private readonly stampaAttestatiPagamentoUrl = '/stampaAttestatiPagamento';

  constructor(private readonly http: HttpClient) {
  }

  ricercaPagamenti(filtro: ParametriRicercaPagamenti): Observable<DatiPagamento[]> {
    let params = new HttpParams();
    if (filtro.livelloTerritorialeId) {
      params = params.set('livelloTerritorialeId', String(filtro.livelloTerritorialeId));
    }
    if (filtro.enteId) {
      params = params.set('enteId', String(filtro.enteId));
    }
    if (filtro.servizioId) {
      params = params.set('servizioId', String(filtro.servizioId));
    }
    if (filtro.numeroDocumento) {
      params = params.set('numeroDocumento', filtro.numeroDocumento);
    }
    if (filtro.dataPagamentoDa) {
      params = params.set('dataPagamentoDa', filtro.dataPagamentoDa.toString());
    }
    if (filtro.dataPagamentoA) {
      params = params.set('dataPagamentoA', filtro.dataPagamentoA.toString());
    }

    return this.http.get(environment.bffBaseUrl + this.ricercaPagamentiUrl, {
      params,
      withCredentials: true
    })
      .pipe(map((body: any) => {
        return body;
      }));
  }

  eliminaBollettino(value: DettagliTransazione) {
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

  stampaAttestatiPagamento(listaIdentificativi: number[]): Observable<string[]> {
    let params = new HttpParams();
    const listaIdentficativiString = listaIdentificativi.join(',');
    params = params.set('listaIdentificativi', listaIdentficativiString);
    return this.http.get(environment.bffBaseUrl + this.stampaAttestatiPagamentoUrl,
      {params, withCredentials: true}).pipe(map((body: string[]) => {
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


  inserimentoPagamentiCarrello(pagamenti: DatiPagamento[]): Observable<any> {
    const url = environment.bffBaseUrl + this.inserimentoPagamentiUrl;
    return this.http.post(url , JSON.stringify(pagamenti),
      {withCredentials: true}).pipe(map((body: any) => body),
      catchError((err, caught) => {
        if (err.status == 401 || err.status == 400) {
          return of(null);
        } else {
          return caught;
        }
      }));
  }

}
