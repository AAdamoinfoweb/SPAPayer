import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Societa} from '../modules/main/model/Societa';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SocietaService {

  letturaSocietaUrl = '/societa';

  constructor(private http: HttpClient) { }

  letturaSocieta(): Observable<Societa[]> {
    return this.http.get(environment.bffBaseUrl + this.letturaSocietaUrl)
      .pipe(map((body: any) => {
        return body;
      }));
  }

}
