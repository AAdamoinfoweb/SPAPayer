import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable, of} from "rxjs";
import {Pagamento} from "../modules/main/model/Pagamento";

@Injectable({
  providedIn: 'root'
})
export class ListaPagamentiService {
  constructor(private http: HttpClient) {
  }

  public getListaPagamenti(rid: string): Observable<Pagamento[]> {
    let listaPagamenti: Pagamento[] = []
    listaPagamenti.push(new Pagamento(new Date(), "001233468129", "TARI", "Comune di Bologna", new Date(), 120.00));
    listaPagamenti.push(new Pagamento(new Date(), "001233463789", "IMU", "Comune di Ferrara", new Date(), 572.56));
    return of(listaPagamenti);
  }
}
