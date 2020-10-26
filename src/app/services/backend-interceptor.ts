import {Injectable} from '@angular/core';
import {HttpClient, HttpEvent, HttpHandler, HttpRequest, HttpResponse} from '@angular/common/http';
import {catchError, switchMap, tap} from 'rxjs/operators';
import {throwError} from 'rxjs';
import {environment} from 'src/environments/environment';
import {RenewToken} from '../interfaces/renew-token';
import * as Sentry from '@sentry/browser';
import {OverlayService} from './overlay.service';

@Injectable({
  providedIn: 'root'
})
export class BackendInterceptorService {

  reqnew: any;

  constructor( private http: HttpClient, private overlayService: OverlayService ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler) {

    const accessjwt = localStorage.getItem('access_jwt');
    const username = localStorage.getItem('username');
    this.reqnew = request.clone({
      withCredentials: true
    });

    return next.handle(this.reqnew).pipe(tap((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) { // ad ogni risposta dal backend
        const accessToken = event.headers.get('access-token'); // cerco il nuovo access token
        if (accessToken) { // salvo i nuovi token
          localStorage.setItem('access_jwt', accessToken);
          localStorage.setItem('renew_jwt', event.headers.get('renew-token'));
        }
      }
    }),
    catchError(err => { // gestisco gli errori verso il backend
      if (err.status === 401 && accessjwt && !err.url.includes(environment.renewJwtUrl)) { // accesso negato
        const renew = this.renewToken();
        return renew.pipe(
          // lo switchmap mi permette di riscrivere la request di partenza, dopo il primo fallimento senza duplicare le chiamate
          switchMap((dati: RenewToken) => {
            localStorage.setItem('access_jwt', dati['access-token']);
            localStorage.setItem('renew_jwt', dati['renew-token']);
            this.reqnew  = request.clone({
              setHeaders: {
                  Authorization: dati['access-token'],
                  Username: username
              }
            });
            return next.handle(this.reqnew);
          })
        );
      }
      if (err.url.includes(environment.renewJwtUrl)) { // se mi va in errore il rinnovo del token, qualsiasi errore, esco per sicurezza
        if ( err.status !== 401 ) { // se lo status è diverso da token scaduto, traccio anche cosa è successo
          Sentry.captureException(err);
        }
        localStorage.clear();
        window.location.replace('/');
        return;
      } else {
        // se arrivo qui ho un errore che non rientra in nessun'altra casistica (500,404, ecc...) quindi loggo su Sentry
        Sentry.captureException(err);
        return throwError(err);
      }
    }),
    );
  }

  renewToken() {
    return this.http.post(environment.renewJwtUrl, {}, {withCredentials: true});
  }
}
