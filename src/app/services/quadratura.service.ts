import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {catchError, map} from 'rxjs/operators';
import {ParametriRicercaQuadratura} from '../modules/main/model/quadratura/ParametriRicercaQuadratura';
import {Quadratura} from '../modules/main/model/quadratura/Quadratura';
import {DettaglioQuadratura} from '../modules/main/model/quadratura/DettaglioQuadratura';
import {Societa} from '../modules/main/model/Societa';
import {Psp} from '../modules/main/model/quadratura/Psp';
import {Ente} from '../modules/main/model/Ente';

@Injectable({
  providedIn: 'root'
})
export class QuadraturaService {
  private readonly baseUrl = '/quadratura';
  private readonly filtroPsp = '/filtroPsp';
  private readonly filtroFlussoId = '/filtroFlussoId';
  private readonly scaricaFlussi = '/flussi';

  constructor(private http: HttpClient) { }

  recuperaQuadrature(parametriRicercaQuadratura: ParametriRicercaQuadratura, idFunzione: string): Observable<Quadratura[]> {
    const url = environment.bffBaseUrl + this.baseUrl;
    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', idFunzione);
    let params = new HttpParams();

    if (parametriRicercaQuadratura) {
      Object.keys(parametriRicercaQuadratura).forEach(parametro => {
        if (parametriRicercaQuadratura[parametro]) {
          params = params.set(parametro, String(parametriRicercaQuadratura[parametro]));
        }
      });
    }

    return this.http.get(`${url}`, {
      withCredentials: true,
      headers: h,
      params
    }).pipe(map((body: Quadratura[]) => {
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

  recuperaDettaglioQuadratura(idQuadratura: number, idFunzione: string): Observable<DettaglioQuadratura> {
    const url = environment.bffBaseUrl + this.baseUrl;
    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', idFunzione);

    return this.http.get(`${url}/${idQuadratura}`, {
      withCredentials: true,
      headers: h
    }).pipe(map((body: DettaglioQuadratura) => {
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

  recuperaFiltroPsp(idFunzione: string): Observable<Psp[]> {
    const url = environment.bffBaseUrl + this.baseUrl + this.filtroPsp;
    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', idFunzione);

    return this.http.get(`${url}`, {
      withCredentials: true,
      headers: h
    }).pipe(map((body: Psp[]) => {
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

  recuperaFiltroFlussoId(idFunzione: string): Observable<string[]> {
    const url = environment.bffBaseUrl + this.baseUrl + this.filtroFlussoId;
    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', idFunzione);

    return this.http.get(`${url}`, {
      withCredentials: true,
      headers: h
    }).pipe(map((body: string[]) => {
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

  downloadFlussi(listaFlussoQuadraturaPagoPaId: Array<number>, idFunzione: string): Observable<Array<string>> {
    const url = environment.bffBaseUrl + this.baseUrl + this.scaricaFlussi;
    let params = new HttpParams();
    if (listaFlussoQuadraturaPagoPaId) {
      params = params.set('listaFlussoQuadraturaPagoPaId', listaFlussoQuadraturaPagoPaId.join(', '));
    }

    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', idFunzione);

    return this.http.get(`${url}`, {
      params: params,
      headers: h,
      withCredentials: true
    })
      .pipe(map((body: any) => {
          return body as Array<string>;
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
