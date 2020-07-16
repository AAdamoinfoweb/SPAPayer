import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {Observable, of} from "rxjs";
import {Pagamento} from "../modules/main/model/Pagamento";
import {catchError, map} from "rxjs/operators";
import {XsrfService} from "./xsrf.service";
import {Carrello} from "../modules/main/model/Carrello";
import {environment} from "../../environments/environment";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class ListaPagamentiService {

  verificaRidUrl = "/verificaRid";
  getCarrelloUrl = "/getCarrello";

  constructor(private http: HttpClient, private xsrfService: XsrfService) {
  }

  public verificaRid(rid: string): Observable<HttpResponse<any>> {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append("XSRF-TOKEN", this.xsrfService.xsrfToken)
    return this.http.post(environment.bffBaseUrl + this.verificaRidUrl, rid, {
      withCredentials: true,
      headers: headers,
      observe: "response"
    })
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

  public getCarrello(): Observable<Carrello> {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append("XSRF-TOKEN", this.xsrfService.xsrfToken)
    return this.http.get(environment.bffBaseUrl + this.getCarrelloUrl, {
      withCredentials: true,
      headers: headers
    })
      .pipe(map((json: any) => {
        let listaPagamenti: Pagamento[] = [];

        let carrello: Carrello = new Carrello();
        carrello.email = json["email"];
        carrello.totale = json["totale"];
        json["dettaglio"].forEach((dett) => {
          let pagamento: Pagamento = new Pagamento();
          pagamento.numDocumento = dett["numeroDocumento"];
          pagamento.importo = dett["importo"];
          pagamento.causale = dett["causale"];
          pagamento.servizio = dett["servizio"];
          pagamento.ente = dett["ente"];
          pagamento.anno = dett["anno"];
          listaPagamenti.push(pagamento);
        });
        carrello.dettaglio = listaPagamenti;
        return carrello;
      }), catchError((err, caught) => {
        if (err.status == 401) {
          return of(null);
        } else
          return caught;
      }));
  }
}
