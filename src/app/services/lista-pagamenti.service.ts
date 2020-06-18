import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {Observable, of} from "rxjs";
import {Pagamento} from "../modules/main/model/Pagamento";
import {map} from "rxjs/operators";
import {XsrfService} from "./xsrf.service";
import {Carrello} from "../modules/main/model/Carrello";

@Injectable({
  providedIn: 'root'
})
export class ListaPagamentiService {

  verificaRidUrl = "/verificaRid";
  getCarrelloUrl = "";

  constructor(private http: HttpClient, private xsrfService: XsrfService) {
  }

  public getListaPagamenti(rid: string): Observable<Pagamento[]> {
    let listaPagamenti: Pagamento[] = []
    listaPagamenti.push(new Pagamento(new Date(), "001233468129", "TARI", "Comune di Bologna", new Date(), 120.00));
    listaPagamenti.push(new Pagamento(new Date(), "001233463789", "IMU", "Comune di Ferrara", new Date(), 572.56));
    return of(listaPagamenti);
  }

  public verificaRid(rid: string): Observable<any> {
    return this.http.post(this.verificaRidUrl, rid, {observe: "response"}).pipe(map((response: any) => {
      const headers: Headers = response.headers;
      const cookie: string = headers.get('set-cookie');
      this.xsrfService.xsrfToken = cookie.split('=')[0];
      return response;
    }));
  }

  public getCarrello(): Observable<Carrello> {
    let headers: HttpHeaders = new HttpHeaders();
    headers.append("XSRF-TOKEN", this.xsrfService.xsrfToken)
    return this.http.get(this.getCarrelloUrl, {headers: headers}).pipe(map((body: any) => {
      let listaPagamenti: Pagamento[] = [];

      let carrello: Carrello = new Carrello();
      carrello.dettagli = listaPagamenti;
      return carrello;
    }));
  }
}
