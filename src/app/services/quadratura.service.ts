import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {catchError, map} from 'rxjs/operators';
import {ParametriRicercaQuadratura} from '../modules/main/model/quadratura/ParametriRicercaQuadratura';
import {Quadratura} from '../modules/main/model/quadratura/Quadratura';

@Injectable({
  providedIn: 'root'
})
export class QuadraturaService {
  // todo impostare url reali quadratura
  private readonly baseUrl = '/quadratura';
  private readonly letturaQuadratureUrl = '/letturaQuadrature';

  constructor(private http: HttpClient) { }

  recuperaQuadrature(parametriRicercaQuadratura: ParametriRicercaQuadratura, idFunzione: string): Observable<Quadratura[]> {
    const url = environment.bffBaseUrl + this.baseUrl + this.letturaQuadratureUrl;
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

  recuperaDettaglioQuadratura(idQuadratura: number, idFunzione: string): Observable<Quadratura> {
    const url = environment.bffBaseUrl + this.baseUrl + this.letturaQuadratureUrl + '/' + idQuadratura;
    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', idFunzione);

    return this.http.get(`${url}`, {
      withCredentials: true,
      headers: h
    }).pipe(map((body: Quadratura) => {
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
