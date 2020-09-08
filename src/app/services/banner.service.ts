import {HttpClient, HttpParams} from '@angular/common/http';
import {XsrfService} from './xsrf.service';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';
import {Banner} from '../modules/main/model/Banner';
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class BannerService {

  bannerUrl = '/banner';

  constructor(private http: HttpClient, private xsrfService: XsrfService) {
  }

  letturaBanner(timestamp, attivo): Observable<Banner[]> {
    return this.http.get(environment.bffBaseUrl + this.bannerUrl, {
      withCredentials: true,
      params: {
        timestamp: timestamp,
        attivo: attivo}
    })
      .pipe(map((body: any) => {
          return body;
      }));
  }


}
