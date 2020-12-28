import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {environment} from '../../environments/environment';
import {catchError, map} from 'rxjs/operators';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {PermessoCompleto} from '../modules/main/model/permesso/PermessoCompleto';

@Injectable({
  providedIn: 'root'
})
export class PermessoService {

  private readonly permessiBaseUrl = '/gestisciUtenti/permessi';

  constructor(private http: HttpClient) {
  }

  letturaPermessi(codiceFiscale: string, idFunzione: string): Observable<PermessoCompleto[]> {
    const url = environment.bffBaseUrl + this.permessiBaseUrl;
    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', idFunzione);
    let params = new HttpParams();
    if (codiceFiscale != null) {
      params = params.set('codiceFiscale', codiceFiscale);
    }
    return this.http.get(`${url}`,
      {
        withCredentials: true,
        headers: h,
        params: params
      }).pipe(map((body: PermessoCompleto[]) => {
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
