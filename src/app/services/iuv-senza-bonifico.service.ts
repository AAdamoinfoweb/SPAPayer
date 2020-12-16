import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {environment} from '../../environments/environment';
import {catchError, map} from 'rxjs/operators';
import {SintesiIuvSenzaBonifico} from '../modules/main/model/iuvsenzabonifico/SintesiIuvSenzaBonifico';

@Injectable({
  providedIn: 'root'
})
export class IuvSenzaBonificoService {

  private readonly baseUrl = '/iuvSenzaBonifico';

  constructor(private http: HttpClient) {
  }

  ricercaIuvSenzaBonifico(idFunzione: string): Observable<SintesiIuvSenzaBonifico[]> {
    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', idFunzione);

    return this.http.get(environment.bffBaseUrl + this.baseUrl, {
      headers: h,
      withCredentials: true
    })
      .pipe(map((body: SintesiIuvSenzaBonifico[]) => {
          return body;
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
