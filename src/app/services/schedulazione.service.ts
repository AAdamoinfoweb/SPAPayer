import {EventEmitter, Injectable} from '@angular/core';
import {AsyncSubject, BehaviorSubject, Observable, of} from 'rxjs';
import {environment} from '../../environments/environment';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {ParametriRicercaEnte} from '../modules/main/model/ente/ParametriRicercaEnte';
import {SintesiEnte} from '../modules/main/model/ente/SintesiEnte';
import {EnteCompleto} from '../modules/main/model/ente/EnteCompleto';
import {ContoCorrente} from "../modules/main/model/ente/ContoCorrente";
import {Comune} from "../modules/main/model/Comune";
import {Provincia} from "../modules/main/model/Provincia";
import {EsitoInserimentoModificaEnte} from "../modules/main/model/ente/EsitoInserimentoModificaEnte";
import {Logo} from "../modules/main/model/ente/Logo";
import {RegexSchedulazione} from "../modules/main/model/schedulazione/RegexSchedulazione";

@Injectable({
  providedIn: 'root'
})
export class SchedulazioneService {

  private readonly schedulazioneRegexBasePath = '/regexSchedulazione';

  constructor(private http: HttpClient) {
  }

  regexSchedulazione(idFunzione: string): Observable<RegexSchedulazione | HttpErrorResponse> {
    const url = environment.bffBaseUrl + this.schedulazioneRegexBasePath;
    let h: HttpHeaders = new HttpHeaders();
    h = h.append('idFunzione', idFunzione);

    return this.http.get(`${url}`,
      {
        withCredentials: true,
        headers: h
      }).pipe(map((body: RegexSchedulazione) => {
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
