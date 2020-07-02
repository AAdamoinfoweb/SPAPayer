import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams, HttpResponse} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {XsrfService} from './xsrf.service';
import {environment} from '../../environments/environment';
import {Carrello} from "../modules/main/model/Carrello";
import {Pagamento} from "../modules/main/model/Pagamento";

@Injectable({
  providedIn: 'root'
})
export class PagamentoService {

  confermaPagamentoUrl = '/confermaPagamento';
  verificaEsitoPagamentoUrl = '/verificaEsitoPagamento';
  verificaQuietanzaUrl = '/verificaQuietanza';

  constructor(private http: HttpClient, private xsrfService: XsrfService) {
  }

  public confermaPagamento(body: any): Observable<string> {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append("XSRF-TOKEN", this.xsrfService.xsrfToken)
    let observable: Observable<string> = this.http.post(environment.bffBaseUrl + this.confermaPagamentoUrl, body,
      {observe: "response", headers: headers})
      .pipe(map((response: HttpResponse<any>) => {
        const headers: HttpHeaders = response.headers;
        this.xsrfService.xsrfToken = headers.get('XSRF-TOKEN');
        return response.body.url;
      }), catchError((err, caught) => {
        if (err.status == 401) {
          return of(null);
        } else
          return caught;
      }));
    return observable;
  }

  public verificaQuietanza(idSession: string): Observable<HttpResponse<any>> {
    return this.http.post(environment.bffBaseUrl + this.verificaQuietanzaUrl, idSession, {observe: "response"})
      .pipe(map((response: HttpResponse<any>) => {
        const headers: HttpHeaders = response.headers;
        this.xsrfService.xsrfToken = headers.get('XSRF-TOKEN');
        return response;
      }), catchError((err, caught) => {
        if (err.status == 401) {
          return of(null);
        } else
          return caught;
      }));
  }

  public verificaEsitoPagamento(ultima: boolean): Observable<any> {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append("XSRF-TOKEN", this.xsrfService.xsrfToken)
    // const params = new HttpParams();
    //     // params.set('ultima', String(ultima));
    return this.http.post(environment.bffBaseUrl + this.verificaEsitoPagamentoUrl, ultima,{headers: headers})
      .pipe(map((json: any) => {
        return json;
      }), catchError((err, caught) => {
        if (err.status == 401) {
          return of(null);
        } else
          return caught;
      }));
  }


}
