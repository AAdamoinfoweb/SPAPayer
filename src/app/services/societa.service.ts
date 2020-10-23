import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {Societa} from '../modules/main/model/Societa';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SocietaService {

  private readonly gestioneAnagraficheBasePath = '/gestioneAnagrafiche';

  private readonly filtroSocietaUrl = '/filtroSocieta';

  private readonly societaBaseUrl = this.gestioneAnagraficheBasePath + '/societa';

  private readonly eliminaSocietaUrl = this.gestioneAnagraficheBasePath + '/eliminaSocieta';

  constructor(private http: HttpClient) { }

  filtroSocieta(): Observable<Societa[]> {
    return this.http.get(environment.bffBaseUrl + this.filtroSocietaUrl)
      .pipe(map((body: any) => {
        return body;
      }));
  }

  ricercaSocieta(societaId: number, idFunzione: string): Observable<any> {
    const url = environment.bffBaseUrl + this.societaBaseUrl;
    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', idFunzione);
    let params = new HttpParams();
    if (societaId != null) {
      params = params.set('societaId', String(societaId));
    }

    return this.http.get(`${url}`,
      {
        withCredentials: true,
        headers: h,
        params: params
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

  eliminazioneSocieta(listaSocietaId: Array<number>, idFunzione: string): Observable<any> {
    const url = environment.bffBaseUrl + this.eliminaSocietaUrl;
    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', idFunzione);

    return this.http.post(`${url}`, listaSocietaId,
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

  aggiuntaSocieta(societa: Societa, idFunzione: string): Observable<any> {
    const url = environment.bffBaseUrl + this.societaBaseUrl;
    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', idFunzione);

    return this.http.post(`${url}`, societa,
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

  modificaSocieta(societa: Societa, idFunzione: string): Observable<any> {
    const url = environment.bffBaseUrl + this.societaBaseUrl + '/' + societa.id;
    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', idFunzione);

    return this.http.put(`${url}`, societa,
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
}
