import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {environment} from '../../environments/environment';
import {catchError, map} from 'rxjs/operators';
import {ParametriRicercaRendicontazione} from '../modules/main/model/rendicontazione/ParametriRicercaRendicontazione';
import {RicercaRendicontazione} from '../modules/main/model/rendicontazione/RicercaRendicontazione';

@Injectable({
  providedIn: 'root'
})
export class RendicontazioneService {

  private readonly rendicontazioneBseUrl = '/rendicontazioni';

  constructor(private readonly http: HttpClient) {
  }

  ricercaRendicontazioni(filtri: ParametriRicercaRendicontazione, idFunzione: string): Observable<RicercaRendicontazione> {
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
      if (filtri.dataPagamentoDa != null) {
        params = params.set('dataPagamentoDa', filtri.dataPagamentoDa);
      }
      if (filtri.dataPagamentoA != null) {
        params = params.set('dataPagamentoA', filtri.dataPagamentoA);
      }
      if (filtri.importoTransazioneDa != null) {
        params = params.set('importoTransazioneDa', String(filtri.importoTransazioneDa));
      }
      if (filtri.importoTransazioneA != null) {
        params = params.set('importoTransazioneA', String(filtri.importoTransazioneA));
      }
      if (filtri.flussoRendicontazioneId != null) {
        params = params.set('flussoRendicontazioneId', String(filtri.flussoRendicontazioneId));
      }
      if (filtri.dataCreazioneRendicontoDa != null) {
        params = params.set('dataCreazioneRendicontoDa', filtri.dataCreazioneRendicontoDa);
      }
      if (filtri.dataCreazioneRendicontoA != null) {
        params = params.set('dataCreazioneRendicontoA', filtri.dataCreazioneRendicontoA);
      }
      if (filtri.tipoFlussoId != null) {
        params = params.set('tipoFlussoId', String(filtri.tipoFlussoId));
      }
    }

    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', idFunzione);

    return this.http.get(environment.bffBaseUrl + this.rendicontazioneBseUrl, {
      params: params,
      headers: h,
      withCredentials: true
    })
      .pipe(map((body: any) => {
          return body as RicercaRendicontazione;
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
