import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';
import {Funzione} from '../modules/main/model/Funzione';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FunzioneService {

  private letturaFunzioniUrl = '/funzioni';

  constructor(private http: HttpClient) { }

  letturaFunzioni(): Observable<Funzione[]> {
    return this.http.get(environment.bffBaseUrl + this.letturaFunzioniUrl)
      .pipe(map((body: any) => {
        return body;
      }));
  }

}
