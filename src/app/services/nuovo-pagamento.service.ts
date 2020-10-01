import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {environment} from '../../environments/environment';
import {catchError, map} from 'rxjs/operators';
import {EventEmitter, Injectable, Output} from "@angular/core";
import {LivelloTerritoriale} from '../modules/main/model/LivelloTerritoriale';
import {Ente} from '../modules/main/model/Ente';
import {Servizio} from '../modules/main/model/Servizio';
import {CampiNuovoPagamento} from '../modules/main/model/CampiNuovoPagamento';

@Injectable({
  providedIn: 'root'
})
export class NuovoPagamentoService {

  filtroLivelloTerritorialeUrl = '/filtroLivelloTerritoriale';
  filtroEntiUrl = '/filtroEnti';
  filtroServiziUrl = '/filtroServizi';
  campiNuovoPagamentoUrl = '/campiNuovoPagamento';
  verificaBollettinoUrl = '/verificaBollettino';
  inserimentoBollettinoUrl = '/bollettino';


  constructor(private http: HttpClient) {
  }

  recuperaFiltroLivelloTerritoriale(): Observable<LivelloTerritoriale[]> {
    return this.http.get(environment.bffBaseUrl + this.filtroLivelloTerritorialeUrl)
      .pipe(map((body: any) => {
        return body;
      }));
  }

  recuperaFiltroEnti(idLivelloTerritoriale): Observable<Ente[]> {
    return this.http.get(environment.bffBaseUrl + this.filtroEntiUrl, {
      params: {
        livelloTerritorialeId: idLivelloTerritoriale
      }
    })
      .pipe(map((body: any) => {
        return body;
      }));
  }

  recuperaFiltroServizi(idEnte): Observable<Servizio[]> {
    return this.http.get(environment.bffBaseUrl + this.filtroServiziUrl, {
      params: {
        enteId: idEnte
      }
    })
      .pipe(map((body: any) => {
        return body;
      }));
  }

  recuperaCampiSezioneDati(idServizio): Observable<CampiNuovoPagamento> {
    return this.http.get(environment.bffBaseUrl + this.campiNuovoPagamentoUrl, {
      params: {
        servizioId: idServizio
      }
    })
      .pipe(map((body: any) => {
        return body;
      }));
  }

  verificaBollettino(numero?, idDettaglioTransazione?): Observable<string> {
    return this.http.get(environment.bffBaseUrl + this.verificaBollettinoUrl, {
      params: {
        numero,
        idDettaglioTransazione
      }
    })
      .pipe(map((body: any) => body.url),
        catchError((err, caught) => {
          if (err.status == 401) {
            return of('');
          } else {
            return caught;
          }
        }));
  }

  inserimentoBollettino(body: any): void {
    this.http.post(environment.bffBaseUrl + this.inserimentoBollettinoUrl, body,
      {withCredentials: true}).pipe(map((body: any) => body.url),
      catchError((err, caught) => {
        if (err.status == 401 || err.status == 400) {
          return of(null);
        } else {
          return caught;
        }
      }));
  }
}
