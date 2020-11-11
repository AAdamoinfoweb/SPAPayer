import {EventEmitter, Injectable} from "@angular/core";
import {DatiPagamento} from '../modules/main/model/bollettino/DatiPagamento';
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class OverlayService {

  constructor(private router: Router) {
  }

  mostraModaleDettaglioEvent: EventEmitter<any> = new EventEmitter<any>();

  gestisciErrore(): void {
    this.router.navigateByUrl("/erroregenerico");
  }
}
