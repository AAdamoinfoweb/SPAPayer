import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {environment} from '../../environments/environment';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {ParametriRicercaStatistiche} from '../modules/main/model/statistica/ParametriRicercaStatistiche';
import {AttivitaPianificata} from '../modules/main/model/attivitapianificata/AttivitaPianificata';
import {SintesiAttivitaPianificata} from '../modules/main/model/attivitapianificata/SintesiAttivitaPianificata';
import {FiltroSelect} from '../modules/main/model/servizio/FiltroSelect';

@Injectable({
  providedIn: 'root'
})
export class AttivitaPianificataService {

  private readonly gestisciAttivitaPianificateBasePath = '/gestisciAttivitaPianificate';

  private readonly attivitaPianificataBaseUrl = this.gestisciAttivitaPianificateBasePath + '/attivitaPianificate';

  private readonly eliminaAttivitaPianificateUrl = this.gestisciAttivitaPianificateBasePath + '/eliminaAttivitaPianificate';

  private readonly filtroAttivitaPianificataBeanUrl = this.gestisciAttivitaPianificateBasePath + '/filtroAttivitaPianificataBean';

  constructor(private http: HttpClient) {
  }

  recuperaFiltroAttivitaPianificataBean(idFunzione: string): Observable<FiltroSelect[]> {
    const url = environment.bffBaseUrl + this.filtroAttivitaPianificataBeanUrl;
    // set headers
    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', idFunzione);
    return this.http.get(`${url}`,
      {
        withCredentials: true,
        headers: h
      }).pipe(map((body: any[]) => {
        return body as FiltroSelect[];
      }),
      catchError((err, caught) => {
        if (err.status === 401 || err.status === 400) {
          return of(null);
        } else {
          return of(null);
        }
      }));
  }

  ricercaAttivitaPianificate(parametriRicercaStatistiche: ParametriRicercaStatistiche, idFunzione: string): Observable<SintesiAttivitaPianificata[]> {
    const url = environment.bffBaseUrl + this.attivitaPianificataBaseUrl;
    // set headers
    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', idFunzione);
    // set params
    let params = new HttpParams();
    if (parametriRicercaStatistiche?.attiva != null) {
      params = params.set('attiva', String(parametriRicercaStatistiche.attiva));
    }
    if (parametriRicercaStatistiche?.avvioSchedulazione) {
      params = params.set('avvioSchedulazione', parametriRicercaStatistiche.avvioSchedulazione);
    }
    if (parametriRicercaStatistiche?.fineSchedulazione) {
      params = params.set('fineSchedulazione', parametriRicercaStatistiche.fineSchedulazione);
    }

    return this.http.get(`${url}`,
      {
        withCredentials: true,
        headers: h,
        params
      }).pipe(map((body: any[]) => {
        return body as SintesiAttivitaPianificata[];
      }),
      catchError((err, caught) => {
        if (err.status === 401 || err.status === 400) {
          return of(null);
        } else {
          return of(null);
        }
      }));
  }

  eliminaAttivitaPianificate(listaAttivitaPianificateId: Array<number>, idFunzione: string): Observable<any | HttpErrorResponse> {
    const url = environment.bffBaseUrl + this.eliminaAttivitaPianificateUrl;
    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', idFunzione);

    return this.http.post(`${url}`, listaAttivitaPianificateId,
      {
        withCredentials: true,
        headers: h
      }).pipe(map((body: any) => {
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

  inserimentoAttivitaPianificata(attivitaPianificata: AttivitaPianificata, idFunzione: string): Observable<number> {
    const url = environment.bffBaseUrl + this.attivitaPianificataBaseUrl;
    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', idFunzione);

    return this.http.post(`${url}`, attivitaPianificata,
      {
        withCredentials: true,
        headers: h
      }).pipe(map((body: number) => {
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

  modificaAttivitaPianificata(attivitaPianificata: AttivitaPianificata, idFunzione: string): Observable<number | HttpErrorResponse> {
    const url = environment.bffBaseUrl + this.attivitaPianificataBaseUrl + '/' + attivitaPianificata.id;
    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', idFunzione);

    return this.http.put(`${url}`, attivitaPianificata,
      {
        withCredentials: true,
        headers: h
      }).pipe(map((body: number) => {
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

  dettaglioAttivitaPianificata(idAttivitaPianificata: number, idFunzione: string): Observable<AttivitaPianificata> {
    const url = environment.bffBaseUrl + this.attivitaPianificataBaseUrl + '/' + idAttivitaPianificata;
    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', idFunzione);

    return this.http.get(`${url}`,
      {
        withCredentials: true,
        headers: h
      }).pipe(map((body: AttivitaPianificata) => {
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

}
