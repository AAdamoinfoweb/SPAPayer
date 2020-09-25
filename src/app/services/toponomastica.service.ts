import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Comune} from '../modules/main/model/Comune';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ToponomasticaService {

  private provinceUrl = '/province';
  private comuniUrl = '/comuni';

  constructor(private http: HttpClient) { }

  recuperaProvince(): Observable<Comune[]> {
    return this.http.get(environment.bffBaseUrl + this.provinceUrl)
      .pipe(map((body: any) => {
        return body;
      }));
  }

  recuperaComuni(): Observable<Comune[]> {
    return this.http.get(environment.bffBaseUrl + this.comuniUrl)
      .pipe(map((body: any) => {
        return body;
      }));
  }
}
