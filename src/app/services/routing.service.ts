import {EventEmitter, Injectable} from "@angular/core";
import {Router} from "@angular/router";
import {DatiPagamento} from "../modules/main/model/bollettino/DatiPagamento";

@Injectable({
  providedIn: 'root'
})
export class RoutingService {

  constructor(private router: Router) {
  }

  public configuraRouterAndNavigate(basePathFunzionePath: string, state) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([basePathFunzionePath], {state});
  }
}
