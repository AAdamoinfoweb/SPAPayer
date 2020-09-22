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
  confermaPagamentoL1Url = '/confermaPagamentoL1';
  verificaEsitoPagamentoUrl = '/verificaEsitoPagamento';
  verificaQuietanzaUrl = '/verificaQuietanza';
  quietanzaUrl = '/quietanza'
  redirectCarrelloUrl = '/cart/extCart.do'

  constructor(private http: HttpClient, private xsrfService: XsrfService) {
  }

  public confermaPagamentoL1(body: any): Observable<any> {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append("XSRF-TOKEN", this.xsrfService.xsrfToken)
    let observable: Observable<any> = this.http.post(environment.bffBaseUrl + this.confermaPagamentoL1Url, body,
      {withCredentials: true, headers: headers})
      .pipe(map((body: any) => body.url),
        catchError((err, caught) => {
          if (err.status == 401 || err.status == 400) {
            return of(null);
          } else
            return caught;
        }));
    return observable;
  }

  public verificaQuietanza(idSession: string, esito: string): Observable<string> {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append("XSRF-TOKEN", idSession)
    return this.http.post(environment.bffBaseUrl + this.verificaQuietanzaUrl, esito, {
      withCredentials: true,
      headers: headers
    })
      .pipe(map((body: any) => body.url),
        catchError((err, caught) => {
          if (err.status == 401) {
            return of("");
          } else
            return caught;
        }));
  }

  public verificaEsitoPagamento(idSession: string, ultima: boolean): Observable<any> {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append("XSRF-TOKEN", idSession)
    return this.http.post(environment.bffBaseUrl + this.verificaEsitoPagamentoUrl, ultima, {withCredentials: true, headers: headers})
      .pipe(map((json: any) => {
        return json ? json.url : null;
      }), catchError((err, caught) => {
        if (err.status == 401) {
          return of(null);
        } else
          return caught;
      }));
  }

  public quietanza(idSession: string, esito: string): Observable<string> {
    const params = new HttpParams()
    params.set('idSession', idSession);
    params.set('esito', esito);

    return this.http.get(environment.bffBaseUrl + this.quietanzaUrl+'?idSession='+idSession+'&esito='+esito, {


    })
      .pipe(map((body: any) => body.url),
        catchError((err, caught) => {
          if (err.status == 401) {
            return of("");
          } else
            return caught;
        }));
  }

  public redirectCarrello(buffer: any): Observable<string> {

    let s = '?buffer=' + buffer
    return this.http.get(environment.bffBaseUrl + this.redirectCarrelloUrl +s)
      .pipe(map((body: any) => body.url),
        catchError((err, caught) => {
          if (err.status == 401) {
            return of('');
          } else {
            return caught;
          }
        }));
  }


  public confermaPagamento(body: any, email: string): Observable<any> {
    let observable: Observable<any> = this.http.post(environment.bffBaseUrl + this.confermaPagamentoUrl, body,
      {withCredentials: true, params: {email}
      }
      )
      .pipe(map((body: any) => body.url),
        catchError((err, caught) => {
          if (err.status == 401 || err.status == 400) {
            return of(null);
          } else
            return caught;
        }));
    return observable;
  }

}
