import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {LivelloTerritoriale} from '../modules/main/model/LivelloTerritoriale';
import {environment} from '../../environments/environment';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LivelloTerritorialeService {

  private readonly gestioneAnagraficheBasePath = '/gestisciLivelliTerritoriali';

  private readonly livelloTerritorialeBaseUrl = this.gestioneAnagraficheBasePath + '/livelloTerritoriale';

  private readonly eliminaLivelliTerritorialiurl = this.livelloTerritorialeBaseUrl + '/eliminaLivelloTerritoriale';

  constructor(private http: HttpClient) { }

  ricercaLivelliTerritoriali(livelloTerritorialeId: number, idFunzione: string): Observable<any> {
    const url = environment.bffBaseUrl + this.livelloTerritorialeBaseUrl;
    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', idFunzione);
    let params = new HttpParams();
    if (livelloTerritorialeId != null) {
      params = params.set('livelloTerritorialeId', String(livelloTerritorialeId));
    }

    return this.http.get(`${url}`,
      {
        withCredentials: true,
        headers: h,
        params: params
      }).pipe(map((body: any) => {
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

  eliminazioneLivelliTerritoriali(listaLivelloTerritorialeId: Array<number>, idFunzione: string): Observable<any> {
    const url = environment.bffBaseUrl + this.eliminaLivelliTerritorialiurl;
    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', idFunzione);

    return this.http.post(`${url}`, listaLivelloTerritorialeId,
      {
        withCredentials: true,
        headers: h
      }).pipe(map((body: any) => {
        return body;
      }));
  }

  aggiuntaLivelloTerritoriale(livelloTerritoriale: LivelloTerritoriale, idFunzione: string): Observable<any | HttpErrorResponse> {
    const url = environment.bffBaseUrl + this.livelloTerritorialeBaseUrl;
    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', idFunzione);

    return this.http.post(`${url}`, livelloTerritoriale,
      {
        withCredentials: true,
        headers: h
      }).pipe(map((body: any) => {
        return body;
      }),
      catchError((err, caught) => {
        if (err.status === 401 || err.status === 400) {
          return of(err);
        } else {
          return of(err);
        }
      }));
  }

  modificaLivelloTerritoriale(livelloTerritoriale: LivelloTerritoriale, idFunzione: string): Observable<any | HttpErrorResponse> {
    const url = environment.bffBaseUrl + this.livelloTerritorialeBaseUrl + '/' + livelloTerritoriale.id;
    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', idFunzione);

    return this.http.put(`${url}`, livelloTerritoriale,
      {
        withCredentials: true,
        headers: h
      }).pipe(map((body: any) => {
        return body;
      }),
      catchError((err, caught) => {
        if (err.status === 401 || err.status === 400) {
          return of(err);
        } else {
          return of(err);
        }
      }));
  }
}
