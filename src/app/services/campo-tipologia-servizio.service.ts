import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, of} from "rxjs";
import {CampoForm} from "../modules/main/model/CampoForm";
import {catchError, map} from "rxjs/operators";
import {environment} from "../../environments/environment";
import {ParametriRicercaTipologiaServizio} from '../modules/main/model/tipologiaServizio/ParametriRicercaTipologiaServizio';
import {TipologiaServizio} from '../modules/main/model/tipologiaServizio/TipologiaServizio';
import {CampoTipologiaServizio} from "../modules/main/model/CampoTipologiaServizio";
import {ConfiguratoreCampiNuovoPagamento} from '../modules/main/model/campo/ConfiguratoreCampiNuovoPagamento';
import {InserimentoTipologiaServizio} from "../modules/main/model/campo/InserimentoTipologiaServizio";
import {ModificaTipologiaServizio} from "../modules/main/model/campo/ModificaTipologiaServizio";

@Injectable({
  providedIn: 'root'
})
export class CampoTipologiaServizioService {
  private readonly baseUrl = '/gestisciTipologiaServizi';
  private readonly tipologiaServizioUrl = '/tipologiaServizi';
  private readonly campiTipologiaServizioUrl = '/campiTipologiaServizio';
  private configurazioneCampiNuovoPagamentoUrl = '/configurazioneCampiNuovoPagamento';
  private inserimentoTipoCampoUrl = '/tipoCampo';

  constructor(private http: HttpClient) {
  }

  recuperaDettaglioTipologiaServizio(idTipologiaServizio: number, idFunzione): Observable<TipologiaServizio> {
    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', idFunzione);

    return this.http.get(environment.bffBaseUrl + this.baseUrl + this.tipologiaServizioUrl + '/' + idTipologiaServizio, {
      withCredentials: true,
      headers: h
    }).pipe(map((body: TipologiaServizio) => {
        return body;
      }),
      catchError((err, caught) => {
        if (err.status === 401 || err.status === 400) {
          return of(null);
        } else {
          return of(null);
        }
      }));
  }

  recuperaTipologieServizio(filtri: ParametriRicercaTipologiaServizio, idFunzione): Observable<TipologiaServizio[]> {

    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', idFunzione);

    let params = new HttpParams();
    if (filtri) {
      if (filtri.raggruppamentoId) {
        params = params.set('raggruppamentoId', String(filtri.raggruppamentoId));
      }
      if (filtri.codiceTipologia) {
        params = params.set('codiceTipologia', filtri.codiceTipologia);
      }
    }

    return this.http.get(environment.bffBaseUrl + this.baseUrl + this.tipologiaServizioUrl, {
      withCredentials: true,
      headers: h,
      params
    }).pipe(map((body: TipologiaServizio[]) => {
        return body;
      }),
      catchError((err, caught) => {
        if (err.status === 401 || err.status === 400) {
          return of(null);
        } else {
          return of(null);
        }
      }));
  }

  campiTipologiaServizio(tipologiaServizioId: number, idFunzione): Observable<CampoTipologiaServizio[]> {
    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', idFunzione);
    return this.http.get(environment.bffBaseUrl + this.baseUrl + this.campiTipologiaServizioUrl + `?tipologiaServizioId=${tipologiaServizioId}`, {
      withCredentials: true,
      headers: h
    }).pipe(map((body: CampoTipologiaServizio[]) => {
        return body;
      }),
      catchError((err, caught) => {
        if (err.status === 401 || err.status === 400) {
          return of(null);
        } else {
          return of(null);
        }
      }));
  }

  letturaConfigurazioneCampiNuovoPagamento(idFunzione): Observable<ConfiguratoreCampiNuovoPagamento> {
    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', idFunzione);
    return this.http.get(environment.bffBaseUrl + this.baseUrl +
      this.configurazioneCampiNuovoPagamentoUrl, {
      withCredentials: true,
      headers: h
    }).pipe(map((body: ConfiguratoreCampiNuovoPagamento) => {
        return body;
      }),
      catchError((err, caught) => {
        if (err.status === 401 || err.status === 400) {
          return of(null);
        } else {
          return of(null);
        }
      }));
  }

  eliminaTipologieServizioSelezionate(listaIdTipologieDaEliminare: number[], idFunzione): Observable<any> {
    // todo chiamare operation elimina
    return null;
  }

  inserimentoTipologiaServizio(body: InserimentoTipologiaServizio, idFunzione): Observable<number> {
    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', idFunzione);
    return this.http.post(environment.bffBaseUrl + this.baseUrl +
      this.tipologiaServizioUrl, body, {
      withCredentials: true,
      headers: h
    }).pipe(map((id: number) => {
        return id;
      }),
      catchError((err, caught) => {
        if (err.status === 401 || err.status === 400) {
          return of(null);
        } else {
          return of(null);
        }
      }));
  }

  modificaTipologiaServizio(id: number, body: ModificaTipologiaServizio, idFunzione): Observable<any> {
    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', idFunzione);
    return this.http.put(environment.bffBaseUrl + this.baseUrl +
      this.tipologiaServizioUrl + '/' + id, body, {
      withCredentials: true,
      headers: h
    }).pipe(map(() => {
        return null;
      }),
      catchError((err, caught) => {
        if (err.status === 401 || err.status === 400) {
          return of(null);
        } else {
          return of(null);
        }
      }));
  }

  inserimentoTipoCampo(body, idFunzione) {
    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', idFunzione);
    return this.http.post(environment.bffBaseUrl + this.baseUrl +
      this.inserimentoTipoCampoUrl, body, {
      withCredentials: true,
      headers: h
    }).pipe(map(() => {
        return null;
      }),
      catchError((err, caught) => {
        if (err.status === 401 || err.status === 400) {
          return of(null);
        } else {
          return of(null);
        }
      }));
  }
}

