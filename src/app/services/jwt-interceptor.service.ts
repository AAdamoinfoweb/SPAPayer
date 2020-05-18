import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JwtInterceptorService implements HttpInterceptor {

  tokenJWT: string;

  constructor( ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // add authorization header with jwt token if available
    const renewtoken = localStorage.getItem('renew_jwt');
    const username = localStorage.getItem('username');
    this.tokenJWT = localStorage.getItem('access_jwt');

    if (request.url === environment.renewJwtUrl && renewtoken) {
      this.tokenJWT = renewtoken;
    }

    if (this.tokenJWT) {
        request = request.clone({
            setHeaders: {
                Authorization: this.tokenJWT,
                Username: username
            }
        });
    }
    return next.handle(request);
  }
}
