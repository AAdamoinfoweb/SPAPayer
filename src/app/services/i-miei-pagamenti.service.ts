import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {Ente} from '../modules/main/model/Ente';
import {DatiPagamento} from "../modules/main/model/DatiPagamento";
import {ParametriRicercaPagamenti} from "../modules/main/model/utente/ParametriRicercaPagamenti";

@Injectable({
  providedIn: 'root'
})
export class IMieiPagamentiService {

  private readonly ricercaPagamentiUrl = '/pagamenti';

  constructor(private readonly http: HttpClient) {
  }

  ricercaPagamenti(filtro: ParametriRicercaPagamenti): Observable<DatiPagamento[]> {
    let params = new HttpParams();
    if (filtro.livelloTerritorialeId) {
      params = params.set('livelloTerritorialeId', String(filtro.livelloTerritorialeId));
    }
    if (filtro.enteId) {
      params = params.set('enteId', String(filtro.enteId));
    }
    if (filtro.servizioId) {
      params = params.set('servizioId', String(filtro.servizioId));
    }
    if (filtro.numeroDocumento) {
      params = params.set('numeroDocumento', filtro.numeroDocumento);
    }
    if (filtro.dataScadenzaDa) {
      params = params.set('dataScadenzaDa', filtro.dataScadenzaDa.toString());
    }
    if (filtro.dataScadenzaA) {
      params = params.set('dataScadenzaDa', filtro.dataScadenzaDa.toString());
    }

    return this.http.get(environment.bffBaseUrl + this.ricercaPagamentiUrl, {
      params,
      withCredentials: true
    })
      .pipe(map((body: any) => {
        return body;
      }));
  }
}
