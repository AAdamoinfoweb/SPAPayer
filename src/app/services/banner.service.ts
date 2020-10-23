import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {XsrfService} from './xsrf.service';
import {Observable, of} from 'rxjs';
import {environment} from '../../environments/environment';
import {catchError, map} from 'rxjs/operators';
import {Banner} from '../modules/main/model/banner/Banner';
import {EventEmitter, Injectable} from '@angular/core';
import * as moment from 'moment';
import {ParametriRicercaBanner} from '../modules/main/model/banner/ParametriRicercaBanner';

@Injectable({
  providedIn: 'root'
})
export class BannerService {

  private readonly gestioneBannerBasePath = '/gestioneBanner';

  private bannerUrl = '/banner';
  private readonly ricercaBannerUrl = this.gestioneBannerBasePath + this.bannerUrl;
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

  ricercaBanner(parametriRicercaBanner: ParametriRicercaBanner, idFunzione: string): Observable<Banner[]> {
    let params = new HttpParams();
    params = params.set('timestamp', this.timestamp);
    if (parametriRicercaBanner.attivo != null) {
      params = params.set('attivo', String(parametriRicercaBanner.attivo));
    }
    if (parametriRicercaBanner.titoloParziale != null) {
      params = params.set('titoloParziale', parametriRicercaBanner.titoloParziale);
    }
    if (parametriRicercaBanner.testoParziale != null) {
      params = params.set('testoParziale', parametriRicercaBanner.testoParziale);
    }
    if (parametriRicercaBanner.inizio != null) {
      params = params.set('inizio', parametriRicercaBanner.inizio);
    }
    if (parametriRicercaBanner.fine != null) {
      params = params.set('fine', parametriRicercaBanner.fine);
    }

    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', idFunzione);

    return this.http.get(environment.bffBaseUrl + this.ricercaBannerUrl, {
      params: params,
      headers: h,
      withCredentials: true
    })
      .pipe(map((body: any) => {
        return body as Banner[];
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
