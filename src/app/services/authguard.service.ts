import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthguardService implements CanActivate {

  constructor(private router: Router, private http: HttpClient) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (localStorage.getItem('access_jwt')) {
      return true;
    }
    this.router.navigate(['/']);
    return false;
  }

  logout(): Observable<string> {
    return this.http.get(environment.bffBaseUrl + '/logout', {withCredentials: true})
      .pipe(map((body: any) => {
        localStorage.removeItem('nome');
        localStorage.removeItem('cognome');
        localStorage.removeItem('access_jwt');
        localStorage.removeItem('renew_jwt');
        return body.url;
      }));
  }

}
