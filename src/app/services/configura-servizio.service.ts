import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {environment} from '../../environments/environment';
import {catchError, map} from 'rxjs/operators';
import {ParametriRicercaEnte} from '../modules/main/model/ente/ParametriRicercaEnte';
import {FiltroSelect} from '../modules/main/model/servizio/FiltroSelect';
import {Servizio} from '../modules/main/model/servizio/Servizio';
import {ParametriRicercaServizio} from '../modules/main/model/servizio/ParametriRicercaServizio';
import {SintesiServizio} from '../modules/main/model/servizio/SintesiServizio';
import * as moment from 'moment';
import {Utils} from '../utils/Utils';
import {base64} from "ngx-custom-validators/src/app/base64/validator";

@Injectable({
  providedIn: 'root'
})
export class ConfiguraServizioService {

  private readonly configuraServiziBasePath = '/configuraServizi';
  private filtroLivelloTerritorialeUrl = '/filtroLivelloTerritoriale';
  private filtroRaggruppamentoUrl = '/filtroRaggruppamento';
  private filtroTipologiaUrl = '/filtroTipologiaServizio';
  private filtroUfficioUrl = '/filtroUfficio';
  private filtroPortaleEsternoUrl = '/filtroPortaleEsterno';
  private serviziUrl = '/servizi';
  private eliminaServiziUrl = '/eliminaServizi';

  constructor(private http: HttpClient) {
  }

  configuraServiziFiltroTipologia(idFunzione: string) {
    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', idFunzione);

    return this.http.get(environment.bffBaseUrl + this.configuraServiziBasePath + this.filtroTipologiaUrl, {
      headers: h,
      withCredentials: true
    })
      .pipe(map((body: any) => {
          return body as FiltroSelect[];
        }),
        catchError((err, caught) => {
          if (err.status == 401 || err.status == 400) {
            return of(null);
          } else {
            return of(null);
          }
        }));
  }

  configuraServiziFiltroLivelloTerritoriale(societaId: any, idFunzione: any) {
    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', idFunzione);

    let params = new HttpParams();
    params = params.set('societaId', String(societaId));

    return this.http.get(environment.bffBaseUrl + this.configuraServiziBasePath + this.filtroLivelloTerritorialeUrl, {
      params,
      headers: h,
      withCredentials: true
    })
      .pipe(map((body: any) => {
          return body as FiltroSelect[];
        }),
        catchError((err, caught) => {
          if (err.status == 401 || err.status == 400) {
            return of(null);
          } else {
            return of(null);
          }
        }));
  }

  configuraServiziFiltroRaggruppamento(params: ParametriRicercaEnte, idFunzione: any) {
    return this.getListaEnti('/filtroRaggruppamento', params, idFunzione);
  }

  configuraServiziFiltroEnteImpositore(params: ParametriRicercaEnte, idFunzione: any) {
    return this.getListaEnti('/filtroEnteImpositore', params, idFunzione);
  }

  filtroEnti(parametriRicercaEnte: ParametriRicercaEnte) {
    let params = new HttpParams();
    if (parametriRicercaEnte) {
      params = params.set('filtroRicerca ', 'true');
      if (parametriRicercaEnte.societaId != null) {
        params = params.set('societaId', String(parametriRicercaEnte.societaId));
      }
      if (parametriRicercaEnte.livelloTerritorialeId != null) {
        params = params.set('livelloTerritorialeId', String(parametriRicercaEnte.livelloTerritorialeId));
      }
    }

    return this.http.get(environment.bffBaseUrl + this.configuraServiziBasePath + '/filtroEnteImpositore', {
      params,
      withCredentials: true
    })
      .pipe(map((body: any) => {
          return body as FiltroSelect[];
        }),
        catchError((err, caught) => {
          if (err.status == 401 || err.status == 400) {
            return of(null);
          } else {
            return of(null);
          }
        }));
  }

  configuraServiziFiltroEnteBeneficiario(params: ParametriRicercaEnte, idFunzione: any) {
    return this.getListaEnti('/filtroEnteBeneficiario', params, idFunzione);
  }

  filtroServizio(params: ParametriRicercaEnte, idFunzione: any) {
    return this.getListaEnti('/filtroServizio', params, idFunzione);
  }

  filtroLivelliIntegrazione(params: ParametriRicercaEnte, idFunzione: any) {
    return this.getListaEnti('/filtroLivelloIntegrazione', params, idFunzione);
  }

  private getListaEnti(serviceName: string, parametriRicercaEnte: ParametriRicercaEnte, idFunzione: string) {
    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', idFunzione);

    let params = new HttpParams();
    if (parametriRicercaEnte) {
      if (parametriRicercaEnte.societaId != null) {
        params = params.set('societaId', String(parametriRicercaEnte.societaId));
      }
      if (parametriRicercaEnte.livelloTerritorialeId != null) {
        params = params.set('livelloTerritorialeId', String(parametriRicercaEnte.livelloTerritorialeId));
      }
    }

    return this.http.get(environment.bffBaseUrl + this.configuraServiziBasePath + serviceName, {
      params,
      headers: h,
      withCredentials: true
    })
      .pipe(map((body: any) => {
          return body as FiltroSelect[];
        }),
        catchError((err, caught) => {
          if (err.status == 401 || err.status == 400) {
            return of(null);
          } else {
            return of(null);
          }
        }));
  }

  configuraServiziFiltroUfficio(value: number, idFunzione: string) {
    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', idFunzione);

    let params = new HttpParams();
    params = params.set('enteId', String(value));

    return this.http.get(environment.bffBaseUrl + this.configuraServiziBasePath + this.filtroUfficioUrl, {
      params,
      headers: h,
      withCredentials: true
    })
      .pipe(map((body: any) => {
          return body as FiltroSelect[];
        }),
        catchError((err, caught) => {
          if (err.status == 401 || err.status == 400) {
            return of(null);
          } else {
            return of(null);
          }
        }));
  }

  configuraServiziFiltroPortaleEsterno(idFunzione: string) {
    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', idFunzione);

    return this.http.get(environment.bffBaseUrl + this.configuraServiziBasePath + this.filtroPortaleEsternoUrl, {
      headers: h,
      withCredentials: true
    })
      .pipe(map((body: any) => {
          return body as FiltroSelect[];
        }),
        catchError((err, caught) => {
          if (err.status == 401 || err.status == 400) {
            return of(null);
          } else {
            return of(null);
          }
        }));
  }

  dettaglioServizio(servizioId: number, idFunzione: string): Observable<Servizio> {
    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', idFunzione);

    return this.http.get(environment.bffBaseUrl + this.configuraServiziBasePath + this.serviziUrl + '/' + servizioId, {
      headers: h,
      withCredentials: true
    })
      .pipe(map((body: any) => {
          return body as Servizio;
        }),
        catchError((err, caught) => {
          if (err.status == 401 || err.status == 400) {
            return of(null);
          } else {
            return of(null);
          }
        }));
  }

  inserimentoServizio(servizio: Servizio, idFunzione: string): Observable<number> {
    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', idFunzione);

    return this.http.post(environment.bffBaseUrl + this.configuraServiziBasePath + this.serviziUrl, servizio, {
      headers: h,
      withCredentials: true
    })
      .pipe(map((body: any) => {
          return body as number;
        }),
        catchError((err, caught) => {
          if (err.status == 401 || err.status == 400) {
            return of(null);
          } else {
            return of(null);
          }
        }));
  }

  eliminaServizioSelezionati(serviziId: number[], idFunzione: string): Observable<any> {
    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', idFunzione);

    return this.http.post(environment.bffBaseUrl + this.configuraServiziBasePath + this.eliminaServiziUrl, serviziId, {
      headers: h,
      withCredentials: true
    })
      .pipe(map((body: any) => {
          return null;
        }),
        catchError((err, caught) => {
          if (err.status == 401 || err.status == 400) {
            return of('error');
          } else {
            return of('error');
          }
        }));
  }

  recuperaServizio(filtri: ParametriRicercaServizio, idFunzione: any) {
    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', idFunzione);

    let params = new HttpParams();
    if (filtri) {
      if (filtri.servizioId) {
        params = params.set('servizioId', String(filtri.servizioId));
      }
      if (filtri.raggruppamentoId) {
        params = params.set('raggruppamentoId', String(filtri.raggruppamentoId));
      }
      if (filtri.tipologiaServizio) {
        if (filtri.tipologiaServizio.id) {
          params = params.set('tipologiaServizioId', String(filtri.tipologiaServizio.id));
        } else {
          params = params.set('tipologiaServizioId', String(0));
        }
      }
      if (filtri.livelloIntegrazioneId) {
        params = params.set('livelloIntegrazioneId', String(filtri.livelloIntegrazioneId));
      }
      if (filtri.enteImpositoreId) {
        params = params.set('enteImpositoreId', String(filtri.enteImpositoreId));
      }
      if (filtri.enteBeneficiarioId) {
        params = params.set('enteBeneficiarioId', String(filtri.enteBeneficiarioId));
      }
      if (filtri.abilitaDa) {
        params = params.set('scadenzaAbilitazioneDa', moment(filtri.abilitaDa, Utils.FORMAT_DATE_CALENDAR).format(Utils.FORMAT_LOCAL_DATE_TIME));
      }
      if (filtri.abilitaA) {
        params = params.set('scadenzaAbilitazioneA', moment(filtri.abilitaA, Utils.FORMAT_DATE_CALENDAR).format(Utils.FORMAT_LOCAL_DATE_TIME_TO));
      }
      if (filtri.attivo != null) {
        params = params.set('flagAttivo', String(filtri.attivo));
      }
    }

    return this.http.get(environment.bffBaseUrl + this.configuraServiziBasePath + this.serviziUrl, {
      params,
      headers: h,
      withCredentials: true
    })
      .pipe(map((body: any) => {
          return body as SintesiServizio[];
        }),
        catchError((err, caught) => {
          if (err.status == 401 || err.status == 400) {
            return of(null);
          } else {
            return of(null);
          }
        }));
  }

  modificaServizio(servizio: Servizio, idFunzione: any) {
    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', idFunzione);

    return this.http.put(environment.bffBaseUrl + this.configuraServiziBasePath + this.serviziUrl + '/' + servizio.id, servizio, {
      headers: h,
      withCredentials: true
    })
      .pipe(map((body: any) => {
          return body as number;
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
