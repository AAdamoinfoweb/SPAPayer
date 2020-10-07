import {HttpClient} from '@angular/common/http';
import {XsrfService} from './xsrf.service';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';
import {Banner} from '../modules/main/model/Banner';
import {EventEmitter, Injectable} from "@angular/core";
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class BannerService {

  private bannerUrl = '/banner';
  timestamp: string;
  attivo: boolean;

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
        return body;
      }));
  }

}
