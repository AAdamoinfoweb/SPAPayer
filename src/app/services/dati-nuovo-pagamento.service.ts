import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {catchError, map} from 'rxjs/operators';
import {Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatiNuovoPagamentoService {

  private recuperaDatiPagamentoUrl = '/datiPagamento';

  constructor(private http: HttpClient) {}

  recuperaDatiPagamento(body: any): Observable<any> {
    let observable: Observable<any> = this.http.post(environment.bffBaseUrl + this.recuperaDatiPagamentoUrl, body)
      .pipe(map((body: any) => body.url),
        catchError((err, caught) => {
          if (err.status == 401 || err.status == 400) {
            return of(null);
          } else {
            return caught;
          }
        }));
    return observable;
  }
}
