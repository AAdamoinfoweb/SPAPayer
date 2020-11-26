import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {environment} from '../../environments/environment';
import {catchError, map} from 'rxjs/operators';
import {ParametriRicercaTransazioni} from '../modules/main/model/transazione/ParametriRicercaTransazioni';
import {SintesiTransazione} from '../modules/main/model/transazione/SintesiTransazione';
import {Transazione} from '../modules/main/model/transazione/Transazione';
import {DettaglioPendenza} from '../modules/main/model/transazione/DettaglioPendenza';
import {EsitoNotifica} from "../modules/main/model/transazione/EsitoNotifica";

@Injectable({
  providedIn: 'root'
})
export class MonitoraggioTransazioniService {

  private readonly monitoraggioTransazioniBaseUrl = '/monitoraggioTransazioni';
  private readonly dettaglioPendenzaUrl = this.monitoraggioTransazioniBaseUrl + '/dettaglioTransazioni';

  constructor(private readonly http: HttpClient) {
  }

  ricercaTransazioni(filtri: ParametriRicercaTransazioni, idFunzione: string): Observable<SintesiTransazione[]> {
    let params = new HttpParams();
    if (filtri) {
      if (filtri.societaId != null) {
        params = params.set('societaId', String(filtri.societaId));
      }
      if (filtri.livelloTerritorialeId != null) {
        params = params.set('livelloTerritorialeId', String(filtri.livelloTerritorialeId));
      }
      if (filtri.enteId != null) {
        params = params.set('enteId', String(filtri.enteId));
      }
      if (filtri.servizioId != null) {
        params = params.set('servizioId', String(filtri.servizioId));
      }
      if (filtri.transazioneId != null) {
        params = params.set('transazioneId', String(filtri.transazioneId));
      }
      if (filtri.tipologiaServizioId != null) {
        params = params.set('tipologiaServizioId', String(filtri.tipologiaServizioId));
      }
      if (filtri.canaleId != null) {
        params = params.set('canaleId', String(filtri.canaleId));
      }
      if (filtri.dataTransazioneDa != null) {
        params = params.set('dataTransazioneDa', filtri.dataTransazioneDa);
      }
      if (filtri.dataTransazioneA != null) {
        params = params.set('dataTransazioneA', filtri.dataTransazioneA);
      }
      if (filtri.importoTransazioneDa != null) {
        params = params.set('importoTransazioneDa', String(filtri.importoTransazioneDa));
      }
      if (filtri.importoTransazioneA != null) {
        params = params.set('importoTransazioneA', String(filtri.importoTransazioneA));
      }
      if (filtri.flussoRendicontazione != null) {
        params = params.set('flussoRendicontazione', String(filtri.flussoRendicontazione));
      }
      if (filtri.flussoQuadratura != null) {
        params = params.set('flussoQuadratura', String(filtri.flussoQuadratura));
      }
      if (filtri.pagatore != null) {
        params = params.set('pagatore', filtri.pagatore);
      }
      if (filtri.statoTransazione != null) {
        params = params.set('statoTransazione', String(filtri.statoTransazione));
      }
      if (filtri.iuv != null) {
        params = params.set('iuv', filtri.iuv);
      }
      if (filtri.emailNotifica != null) {
        params = params.set('emailNotifica', filtri.emailNotifica);
      }
      if (filtri.versanteIndirizzoIP != null) {
        params = params.set('versanteIndirizzoIP', filtri.versanteIndirizzoIP);
      }
    }

    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', idFunzione);

    return this.http.get(environment.bffBaseUrl + this.monitoraggioTransazioniBaseUrl, {
      params: params,
      headers: h,
      withCredentials: true
    })
      .pipe(map((body: SintesiTransazione[]) => {
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

  dettaglioTransazione(id: number, idFunzione: string): Observable<Transazione> {
    const url = environment.bffBaseUrl + this.monitoraggioTransazioniBaseUrl;
    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', idFunzione);

    return this.http.get(`${url}/${id}`, {
      headers: h,
      withCredentials: true
    })
      .pipe(map((body: any) => {
          return body as Transazione;
        }),
        catchError((err, caught) => {
          if (err.status == 401 || err.status == 400) {
            return of(null);
          } else {
            return of(null);
          }
        }));
  }

  dettaglioPendenza(id: number, idFunzione: string): Observable<DettaglioPendenza> {
    const url = environment.bffBaseUrl + this.dettaglioPendenzaUrl;
    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', idFunzione);

    return this.http.get(`${url}/${id}`, {
      headers: h,
      withCredentials: true
    })
      .pipe(map((body: any) => {
          return body as DettaglioPendenza;
        }),
        catchError((err, caught) => {
          if (err.status == 401 || err.status == 400) {
            return of(null);
          } else {
            return of(null);
          }
        }));
  }

  dettaglioEsitoNotifica(id: number, idFunzione: string): Observable<EsitoNotifica> {
    const url = environment.bffBaseUrl + this.monitoraggioTransazioniBaseUrl;
    const esitoNotificaPath = '/esitoNotifiche';

    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', idFunzione);

    return this.http.get(`${url}/${id}/${esitoNotificaPath}`, {
      headers: h,
      withCredentials: true
    })
      .pipe(map((body: any) => {
          return body as EsitoNotifica;
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
