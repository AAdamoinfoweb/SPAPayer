import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {Societa} from '../modules/main/model/societa/Societa';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {PermessoCompleto} from "../modules/main/model/permesso/PermessoCompleto";

@Injectable({
  providedIn: 'root'
})
export class SocietaService {

  private filtroSocietaUrl = '/filtroSocieta';

  private societaBaseUrl = '/gestioneAnagrafiche/societa'

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

    return this.http.put(`${url}`,
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
          return caught;
        }
      }));
  }

}
