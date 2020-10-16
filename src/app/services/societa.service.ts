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

  private filtroSocietaUrl = '/filtroSocieta';

  constructor(private http: HttpClient) { }

  filtroSocieta(): Observable<Societa[]> {
    return this.http.get(environment.bffBaseUrl + this.filtroSocietaUrl)
      .pipe(map((body: any) => {
        return body;
      }));
  }

}
