import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Comune} from '../modules/main/model/Comune';
import {environment} from '../../environments/environment';
import {Provincia} from '../modules/main/model/Provincia';

@Injectable({
  providedIn: 'root'
})
export class ToponomasticaService {

  private provinceUrl = '/province';
  private comuniUrl = '/comuni';

  constructor(private http: HttpClient) { }

  recuperaProvince(): Observable<Provincia[]> {
    return this.http.get(environment.bffBaseUrl + this.provinceUrl, {withCredentials: true})
      .pipe(map((body: Provincia[]) => {
        return body;
      }));
  }

  recuperaComuni(): Observable<Comune[]> {
    return this.http.get(environment.bffBaseUrl + this.comuniUrl, {withCredentials: true})
      .pipe(map((body: Comune[]) => {
        return body;
      }));
  }
}
