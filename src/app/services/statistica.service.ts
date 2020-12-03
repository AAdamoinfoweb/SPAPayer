import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {environment} from '../../environments/environment';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {ParametriRicercaStatistiche} from '../modules/main/model/statistica/ParametriRicercaStatistiche';
import {Statistica} from '../modules/main/model/statistica/Statistica';

@Injectable({
  providedIn: 'root'
})
export class StatisticaService {

  private readonly gestisciStatisticheBasePath = '/gestisciStatistiche';

  private readonly statisticheBaseUrl = this.gestisciStatisticheBasePath + '/statistiche';

  private readonly eliminaStatisticheUrl = this.gestisciStatisticheBasePath + '/eliminaStatistiche';
  private readonly eseguiQueryUrl = this.gestisciStatisticheBasePath + '/eseguiQuery';

  constructor(private http: HttpClient) {
  }

  ricercaStatistiche(parametriRicercaStatistiche: ParametriRicercaStatistiche, idFunzione: string): Observable<any[]> {
    const url = environment.bffBaseUrl + this.statisticheBaseUrl;
    // set headers
    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', idFunzione);
    // set params
    let params = new HttpParams();
    if (parametriRicercaStatistiche) {
      if (parametriRicercaStatistiche.attiva != null) {
        params = params.set('attiva', String(parametriRicercaStatistiche.attiva));
      }
      if (parametriRicercaStatistiche.avvioSchedulazione) {
        params = params.set('avvioSchedulazione', parametriRicercaStatistiche.avvioSchedulazione);
      }
      if (parametriRicercaStatistiche.fineSchedulazione) {
        params = params.set('fineSchedulazione', parametriRicercaStatistiche.fineSchedulazione);
      }
    }

    return this.http.get(`${url}`,
      {
        withCredentials: true,
        headers: h,
        params
      }).pipe(map((body: any[]) => {
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

  eliminaStatistiche(listaStatisticheId: Array<number>, idFunzione: string): Observable<any | HttpErrorResponse> {
    const url = environment.bffBaseUrl + this.eliminaStatisticheUrl;
    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', idFunzione);

    return this.http.post(`${url}`, listaStatisticheId,
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

  inserimentoStatistica(statistica: Statistica, idFunzione: string): Observable<number> {
    const url = environment.bffBaseUrl + this.statisticheBaseUrl;
    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', idFunzione);

    return this.http.post(`${url}`, statistica,
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

  modificaStatistica(statistica: Statistica, idFunzione: string): Observable<number | HttpErrorResponse> {
    const url = environment.bffBaseUrl + this.statisticheBaseUrl + '/' + statistica.id;
    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', idFunzione);

    return this.http.put(`${url}`, statistica,
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

  dettaglioStatistica(idStatistica: number, idFunzione: string): Observable<Statistica> {
    const url = environment.bffBaseUrl + this.statisticheBaseUrl + '/' + idStatistica;
    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', idFunzione);

    return this.http.get(`${url}`,
      {
        withCredentials: true,
        headers: h
      }).pipe(map((body: Statistica) => {
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

  eseguiQuery(query: string, idFunzione: string): Observable<any> {
    const url = environment.bffBaseUrl + this.eseguiQueryUrl;
    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', idFunzione);

    return this.http.post(`${url}`, query,
      {
        withCredentials: true,
        headers: h
      }).pipe(map((body: Statistica) => {
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
}
