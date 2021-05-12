import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, of} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {environment} from "../../environments/environment";
import {ParametriRicercaTipologiaServizio} from '../modules/main/model/tipologiaServizio/ParametriRicercaTipologiaServizio';
import {TipologiaServizio} from '../modules/main/model/tipologiaServizio/TipologiaServizio';
import {CampoTipologiaServizio} from "../modules/main/model/CampoTipologiaServizio";
import {ConfiguratoreCampiNuovoPagamento} from '../modules/main/model/campo/ConfiguratoreCampiNuovoPagamento';
import {InserimentoTipologiaServizio} from "../modules/main/model/campo/InserimentoTipologiaServizio";
import {ModificaTipologiaServizio} from "../modules/main/model/campo/ModificaTipologiaServizio";
import {ParametriRicercaServizio} from '../modules/main/model/servizio/ParametriRicercaServizio';
import {InserimentoTipoCampo} from '../modules/main/model/campo/InserimentoTipoCampo';
import {BannerService} from './banner.service';
import {Utils} from '../utils/Utils';

@Injectable({
  providedIn: 'root'
})
export class CampoTipologiaServizioService {

  public items: CampoTipologiaServizio[] = [];

  private readonly baseUrl = '/gestisciTipologiaServizi';
  private readonly tipologiaServizioUrl = '/tipologiaServizi';
  private readonly eliminaTipologiaServizioUrl = this.tipologiaServizioUrl + '/eliminaTipologiaServizi';
  private readonly campiTipologiaServizioUrl = '/campiTipologiaServizio';
  private configurazioneCampiNuovoPagamentoUrl = '/configurazioneCampiNuovoPagamento';
  private inserimentoTipoCampoUrl = '/tipoCampo';

  constructor(private http: HttpClient, private bannerService: BannerService) {
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

  recuperaTipologieServizio(filtri: ParametriRicercaTipologiaServizio | ParametriRicercaServizio, idFunzione): Observable<TipologiaServizio[]> {

    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', idFunzione);

    let params = new HttpParams();
    if (filtri) {
      if (filtri.raggruppamentoId) {
        params = params.set('raggruppamentoId', String(filtri.raggruppamentoId));
      }
      if (filtri instanceof ParametriRicercaTipologiaServizio && typeof filtri.tipologia === 'string') {
        params = params.set('codiceTipologia', filtri.tipologia);
      } else if (filtri instanceof ParametriRicercaTipologiaServizio && filtri.tipologia?.codice) {
        params = params.set('codiceTipologia', filtri.tipologia?.codice);
      } else if (filtri instanceof ParametriRicercaServizio && filtri.tipologiaServizio instanceof TipologiaServizio && filtri.tipologiaServizio?.codice) {
        params = params.set('codiceTipologia', filtri.tipologiaServizio.codice);
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
    const url = environment.bffBaseUrl + this.baseUrl + this.eliminaTipologiaServizioUrl;
    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', idFunzione);

    return this.http.post(`${url}`, listaIdTipologieDaEliminare,
      {
        withCredentials: true,
        headers: h
      }).pipe(map((body: any) => {
        this.bannerService.bannerEvent.emit([Utils.bannerOperazioneSuccesso()]);
        return body;
    }),
      catchError((err, caught) => {
        if (err.status === 401 || err.status === 400) {
          return of(err);
        } else {
          return of(err);
        }
      }));
  }

  inserimentoTipologiaServizio(body: InserimentoTipologiaServizio, idFunzione): Observable<number> {
    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', idFunzione);
    return this.http.post(environment.bffBaseUrl + this.baseUrl +
      this.tipologiaServizioUrl, body, {
      withCredentials: true,
      headers: h
    }).pipe(map((id: number) => {
        this.bannerService.bannerEvent.emit([Utils.bannerOperazioneSuccesso()]);
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
        this.bannerService.bannerEvent.emit([Utils.bannerOperazioneSuccesso()]);
        return null;
      }),
      catchError((err, caught) => {
        if (err.status === 401 || err.status === 400) {
          return of('error');
        } else {
          return of('error');
        }
      }));
  }

  inserimentoTipoCampo(inserimentoTipoCampo: InserimentoTipoCampo, idFunzione): Observable<number> {
    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', idFunzione);
    return this.http.post(environment.bffBaseUrl + this.baseUrl +
      this.inserimentoTipoCampoUrl, inserimentoTipoCampo, {
      withCredentials: true,
      headers: h
    }).pipe(map((idTipoCampo: number) => {
        return idTipoCampo;
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

