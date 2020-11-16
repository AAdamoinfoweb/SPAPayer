import {EventEmitter, Injectable} from '@angular/core';
import {AsyncSubject, BehaviorSubject, Observable, of} from 'rxjs';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {ParametriRicercaEnte} from '../modules/main/model/ente/ParametriRicercaEnte';
import {SintesiEnte} from '../modules/main/model/ente/SintesiEnte';
import {EnteCompleto} from '../modules/main/model/ente/EnteCompleto';
import {ContoCorrente} from "../modules/main/model/ente/ContoCorrente";
import {Comune} from "../modules/main/model/Comune";
import {Provincia} from "../modules/main/model/Provincia";
import {EsitoInserimentoModificaEnte} from "../modules/main/model/ente/EsitoInserimentoModificaEnte";
import {Logo} from "../modules/main/model/ente/Logo";
import {ParametriRicercaStatistiche} from "../modules/main/model/statistica/ParametriRicercaStatistiche";
import {Statistica} from "../modules/main/model/statistica/Statistica";

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

  eliminaStatistiche(listaStatisticheId: Array<number>, idFunzione: string): Observable<any> {
    const url = environment.bffBaseUrl + this.eliminaStatisticheUrl;
    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', idFunzione);

    return this.http.post(`${url}`, listaStatisticheId,
      {
        withCredentials: true,
        headers: h
      }).pipe(map((body: any) => {
      return body;
    }));
  }

  inserimentoStatistica(statistica: Statistica, idFunzione: string): Observable<any> {
    const url = environment.bffBaseUrl + this.statisticheBaseUrl;
    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', idFunzione);

    return this.http.post(`${url}`, statistica,
      {
        withCredentials: true,
        headers: h
      }).pipe(map((body: any) => {
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

  modificaStatistica(statistica: Statistica, idFunzione: string): Observable<any> {
    const url = environment.bffBaseUrl + this.statisticheBaseUrl + '/' + statistica.id;
    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', idFunzione);

    return this.http.put(`${url}`, statistica,
      {
        withCredentials: true,
        headers: h
      }).pipe(map((body: any) => {
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
