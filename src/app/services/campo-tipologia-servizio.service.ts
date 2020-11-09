import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable, of} from "rxjs";
import {CampoForm} from "../modules/main/model/CampoForm";
import {catchError, map} from "rxjs/operators";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CampoTipologiaServizioService {
  private readonly baseUrl = '/gestisciCampoTipologiaServizio';
  private readonly letturaCampiUrl = '/campoTipologiaServizio';

  constructor(private http: HttpClient) {
  }

  letturaCampi(tipologiaServizioId: number, idFunzione: string = "17"): Observable<CampoForm[]> {

    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', idFunzione);
    return this.http.get(environment.bffBaseUrl + this.baseUrl + this.letturaCampiUrl + `?tipologiaServizioId=${tipologiaServizioId}`, {
      withCredentials: true,
      headers: h
    }).pipe(map((body: CampoForm[]) => {
        return body;
      }),
      catchError((err, caught) => {
        if (err.status === 401 || err.status === 400) {
          return of(null);
        } else {
          return of(null);
        }
      }));
  }

}

