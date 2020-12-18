import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {environment} from '../../environments/environment';
import {catchError, map} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {FiltroSelect} from '../modules/main/model/servizio/FiltroSelect';
import {ParametriRicercaConfiguraPortaleEsterno} from '../modules/main/model/configuraportaliesterni/ParametriRicercaConfiguraPortaleEsterno';
import {SintesiConfiguraPortaleEsterno} from '../modules/main/model/configuraportaliesterni/SintesiConfiguraPortaleEsterno';
import {ConfiguraPortaleEsterno} from '../modules/main/model/configuraportaliesterni/ConfiguraPortaleEsterno';

@Injectable({
  providedIn: 'root'
})
export class ConfiguraPortaliEsterniService {

  private readonly basePath = '/configuraPortaliEsterni';
  private readonly filtroPortaleEsternoPath = '/filtroPortaleEsterno';
  private readonly filtroTipoPortaleEsternoPath = '/filtroTipoPortaleEsterno';
  private readonly eliminaPortaleEsternoPath = '/eliminaPortaleEsterno';


  constructor(private http: HttpClient) {
  }

  configuraPortaliEsterniFiltroPortaleEsterno(idFunzione: string) {
    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', idFunzione);

    return this.http.get(environment.bffBaseUrl + this.basePath + this.filtroPortaleEsternoPath, {
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

  configuraPortaliEsterniFiltroTipoPortaleEsterno(idFunzione: string) {
    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', idFunzione);

    return this.http.get(environment.bffBaseUrl + this.basePath + this.filtroTipoPortaleEsternoPath, {
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

  ricercaPortaliEsterni(parametriRicerca: ParametriRicercaConfiguraPortaleEsterno, idFunzione: string): Observable<SintesiConfiguraPortaleEsterno[]> {
    let params = new HttpParams();

    if (parametriRicerca) {
      if (parametriRicerca.codicePortaleEsterno != null) {
        params = params.set('codicePortaleEsterno', parametriRicerca.codicePortaleEsterno);
      }
      if (parametriRicerca.idTipoPortaleEsterno != null) {
        params = params.set('idTipoPortaleEsterno', String(parametriRicerca.idTipoPortaleEsterno));
      }
    }

    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', idFunzione);

    return this.http.get(environment.bffBaseUrl + this.basePath, {
      params: params,
      headers: h,
      withCredentials: true
    })
      .pipe(map((body: any) => {
          return body as SintesiConfiguraPortaleEsterno[];
        }),
        catchError((err, caught) => {
          if (err.status == 401 || err.status == 400) {
            return of(null);
          } else {
            return of(null);
          }
        }));
  }

  dettaglioPortaleEsterno(id: number, idFunzione: string): Observable<ConfiguraPortaleEsterno> {
    const url = environment.bffBaseUrl + this.basePath;
    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', idFunzione);

    return this.http.get(`${url}/${id}`, {
      headers: h,
      withCredentials: true
    })
      .pipe(map((body: any) => {
          return body as ConfiguraPortaleEsterno;
        }),
        catchError((err, caught) => {
          if (err.status == 401 || err.status == 400) {
            return of(null);
          } else {
            return of(null);
          }
        }));
  }

  inserimentoPortaleEsterno(datiPortaleEsterno: ConfiguraPortaleEsterno, idFunzione: string): Observable<number> {
    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', idFunzione);

    return this.http.post(environment.bffBaseUrl + this.basePath, datiPortaleEsterno, {
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

  modificaPortaleEsterno(id: number, datiPortaleEsterno: ConfiguraPortaleEsterno, idFunzione: string): Observable<any | HttpErrorResponse> {
    const url = environment.bffBaseUrl + this.basePath;
    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', idFunzione);

    return this.http.put(`${url}/${id}`, datiPortaleEsterno, {
      headers: h,
      withCredentials: true
    })
      .pipe(map((body: any) => {
          return body;
        }),
        catchError((err, caught) => {
          if (err.status == 401 || err.status == 400) {
            return of(err);
          } else {
            return of(err);
          }
        }));
  }

  eliminaPortaleEsterno(listaPortaleEsternoId: Array<number>, idFunzione: string): Observable<any> {
    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', idFunzione);

    return this.http.post(environment.bffBaseUrl + this.eliminaPortaleEsternoPath, listaPortaleEsternoId, {
      headers: h,
      withCredentials: true
    })
      .pipe(map((body: any) => {
        return body;
      }));
  }

}
