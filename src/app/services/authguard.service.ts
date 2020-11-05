import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable, of} from 'rxjs';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {NuovoPagamentoService} from "./nuovo-pagamento.service";
import {MenuService} from "./menu.service";
import {Bollettino} from "../modules/main/model/bollettino/Bollettino";

@Injectable({
  providedIn: 'root'
})
export class AuthguardService implements CanActivate {

  private logoutUrl = '/logout';

  constructor(private router: Router,
              private nuovoPagamentoService: NuovoPagamentoService,
              private menuService: MenuService,
              private http: HttpClient) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let index = route.url.findIndex(value => value.path == 'nuovoPagamento');
    if (index !== -1 && !this.menuService.isUtenteAnonimo && !localStorage.getItem("loginDaAnonimo")) {
      this.nuovoPagamentoService.getCarrello().subscribe((value) => this.nuovoPagamentoService.prezzoEvent.emit({value: value.totale}));
    } else if (index !== -1 && this.menuService.isUtenteAnonimo) {
      let totale = 0;
      for (var key in localStorage) {
        if (key.startsWith("boll-")) {
          let bollettino: Bollettino = JSON.parse(localStorage.getItem(key));
          totale += bollettino.importo;
        }
      }
      this.nuovoPagamentoService.prezzoEvent.emit({value: totale});
    }
    return true;
  }

  logout(): Observable<string> {
    return this.http.get(environment.bffBaseUrl + this.logoutUrl, {withCredentials: true})
      .pipe(map((body: any) => {
        localStorage.removeItem('nome');
        localStorage.removeItem('cognome');
        localStorage.removeItem('access_jwt');
        localStorage.removeItem('renew_jwt');
        return body.url;
      }), catchError((err, caught) => {
        return of(null);
      }));
  }

}
