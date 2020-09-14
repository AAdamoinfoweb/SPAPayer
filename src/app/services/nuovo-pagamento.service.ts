import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';
import {EventEmitter, Injectable, Output} from "@angular/core";
import {LivelloTerritoriale} from '../modules/main/model/LivelloTerritoriale';
import {Ente} from '../modules/main/model/Ente';

@Injectable({
  providedIn: 'root'
})
export class NuovoPagamentoService {

  livelloTerritorialeUrl = '/filtroLivelloTerritoriale';
  enteUrl = '/filtroEnti';


  constructor(private http: HttpClient) {
  }

  recuperaFiltroLivelloTerrotoriale(): Observable<LivelloTerritoriale[]> {
    return this.http.get(environment.bffBaseUrl + this.livelloTerritorialeUrl)
      .pipe(map((body: any) => {
        return body;
      }));
  }

  recuperaFiltroEnte(): Observable<Ente[]> {
    return this.http.get(environment.bffBaseUrl + this.enteUrl)
      .pipe(map((body: any) => {
        return body;
      }));
  }


}
