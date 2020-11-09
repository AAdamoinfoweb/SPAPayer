import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {ParametriRicercaEnte} from '../modules/main/model/ente/ParametriRicercaEnte';
import {SintesiEnte} from '../modules/main/model/ente/SintesiEnte';
import {EnteCompleto} from '../modules/main/model/ente/EnteCompleto';

@Injectable({
  providedIn: 'root'
})
export class EnteService {

  private readonly gestisciEntiBasePath = '/gestisciEnti';

  private readonly entiBaseUrl = this.gestisciEntiBasePath + '/enti';

  private readonly eliminaEntiUrl = this.entiBaseUrl + '/eliminaEnti';

  constructor(private http: HttpClient) {
  }

  ricercaEnti(parametriRicercaEnte: ParametriRicercaEnte, idFunzione: string): Observable<SintesiEnte[]> {
    const url = environment.bffBaseUrl + this.entiBaseUrl;
    // set headers
    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', idFunzione);
    // set params
    let params = new HttpParams();
    if (parametriRicercaEnte) {
      if (parametriRicercaEnte.societaId != null) {
        params = params.set('societaId', String(parametriRicercaEnte.societaId));
      }
      if (parametriRicercaEnte.livelloTerritorialeId != null) {
        params = params.set('livelloTerritorialeId', String(parametriRicercaEnte.livelloTerritorialeId));
      }
      if (parametriRicercaEnte.comune != null) {
        params = params.set('codiceComune', parametriRicercaEnte.comune);
      }
      if (parametriRicercaEnte.provincia != null) {
        params = params.set('codiceProvincia', parametriRicercaEnte.provincia);
      }
    }

    return this.http.get(`${url}`,
      {
        withCredentials: true,
        headers: h,
        params
      }).pipe(map((body: SintesiEnte[]) => {
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

  eliminaEnti(listaEntiId: Array<number>, idFunzione: string): Observable<any> {
    const url = environment.bffBaseUrl + this.eliminaEntiUrl;
    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', idFunzione);

    return this.http.post(`${url}`, listaEntiId,
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

  inserimentoEnte(ente: EnteCompleto, idFunzione: string): Observable<any> {
    const url = environment.bffBaseUrl + this.entiBaseUrl;
    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', idFunzione);

    return this.http.post(`${url}`, ente,
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

  modificaEnte(ente: EnteCompleto, idFunzione: string): Observable<any> {
    const url = environment.bffBaseUrl + this.entiBaseUrl + '/' + ente.id;
    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', idFunzione);

    return this.http.put(`${url}`, ente,
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
