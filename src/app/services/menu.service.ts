import {Injectable} from "@angular/core";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {Observable, of} from "rxjs";
import {environment} from "../../environments/environment";
import {catchError, map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private getInfoUtenteUrl: string = '/getInfoUtente';

  constructor(private http: HttpClient) {
  }

  public getInfoUtente(): Observable<any> {
    return this.http.get(environment.bffBaseUrl + this.getInfoUtenteUrl, {
      withCredentials: true
    })
      .pipe(map((body: any) => {
        return body;
      }), catchError((err, caught) => {
        if (err.status == 401) {
          return of(null);
        } else
          return of(null);
      }));
  }
}