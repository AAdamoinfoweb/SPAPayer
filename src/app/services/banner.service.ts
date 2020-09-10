import {HttpClient, HttpParams} from '@angular/common/http';
import {XsrfService} from './xsrf.service';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';
import {Banner} from '../modules/main/model/Banner';
import {EventEmitter, Injectable, Output} from "@angular/core";
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class BannerService {

  bannerUrl = '/banner';
  timestamp: string;
  attivo: boolean;
  banners: Banner[] = null;

  bannerEvent: EventEmitter<Banner[]> = new EventEmitter<Banner[]>();


  constructor(private http: HttpClient, private xsrfService: XsrfService) {
    this.timestamp = moment().format('YYYY-MM-DD[T]hh:mm:ss');
    this.attivo = true;
  }

  letturaBanner(timestamp, attivo): Observable<Banner[]> {
    return this.http.get(environment.bffBaseUrl + this.bannerUrl, {
      withCredentials: true,
      params: {
        timestamp,
        attivo
      }
    })
      .pipe(map((body: any) => {
        this.banners = body;
        return body;
      }));
  }


}
