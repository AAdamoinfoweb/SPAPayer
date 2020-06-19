import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {Observable, of} from "rxjs";
import {Pagamento} from "../modules/main/model/Pagamento";
import {map} from "rxjs/operators";
import {XsrfService} from "./xsrf.service";
import {Carrello} from "../modules/main/model/Carrello";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ListaPagamentiService {

  verificaRidUrl = "/verificaRid";
  getCarrelloUrl = "";

  constructor(private http: HttpClient, private xsrfService: XsrfService) {
  }

  public verificaRid(rid: string): Observable<any> {
    return this.http.post(environment.bffBaseUrl + this.verificaRidUrl, rid, {observe: "response"}).pipe(map((response: any) => {
      const headers: Headers = response.headers;
      this.xsrfService.xsrfToken = headers.get('XSRF-TOKEN');
      return response;
    }));
  }

  public getCarrello(): Observable<Carrello> {
    let headers: HttpHeaders = new HttpHeaders();
    headers.append("XSRF-TOKEN", this.xsrfService.xsrfToken)
    return this.http.get(environment.bffBaseUrl + this.getCarrelloUrl, {headers: headers}).pipe(map((body: any) => {
      let listaPagamenti: Pagamento[] = [];

      var json = JSON.parse(body);

      let carrello: Carrello = new Carrello();
      carrello.email = json["email"];
      carrello.totale = json["totale"];
      for (let dett in json["dettagli"]) {
        let pagamento: Pagamento = new Pagamento();
        pagamento.numDocumento = dett["numeroDocumento"];
        pagamento.importo = dett["importo"];
        pagamento.causale = dett["causale"];
        pagamento.servizio = dett["servizio"];
        pagamento.ente = dett["ente"];
        pagamento.anno = dett["anno"];
        listaPagamenti.push(pagamento);
      }
      carrello.dettagli = listaPagamenti;
      return carrello;
    }));
  }
}
