import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';
import {EventEmitter, Injectable, Output} from "@angular/core";
import {LivelloTerritoriale} from '../modules/main/model/LivelloTerritoriale';
import {Ente} from '../modules/main/model/Ente';
import {Servizio} from '../modules/main/model/Servizio';

@Injectable({
  providedIn: 'root'
})
export class NuovoPagamentoService {

  filtroLivelloTerritorialeUrl = '/filtroLivelloTerritoriale';
  filtroEntiUrl = '/filtroEnti';
  filtroServiziUrl = '/filtroServizi';


  constructor(private http: HttpClient) {
  }

  recuperaFiltroLivelloTerritoriale(): Observable<LivelloTerritoriale[]> {
    return this.http.get(environment.bffBaseUrl + this.filtroLivelloTerritorialeUrl)
      .pipe(map((body: any) => {
        return body;
      }));
  }

  recuperaFiltroEnti(): Observable<Ente[]> {
    return this.http.get(environment.bffBaseUrl + this.filtroEntiUrl)
      .pipe(map((body: any) => {
        return body;
      }));
  }

  recuperaFiltroServizi(): Observable<Servizio[]> {
    return this.http.get(environment.bffBaseUrl + this.filtroServiziUrl)
      .pipe(map((body: any) => {
        return body;
      }));
  }

}
