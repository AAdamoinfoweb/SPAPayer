import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {environment} from '../../../../../environments/environment';
import {Observable} from "rxjs";
import {Banner} from "../../model/Banner";
import {BannerService} from "../../../../services/banner.service";
import {PagamentoService} from "../../../../services/pagamento.service";
import {Bollettino} from "../../model/bollettino/Bollettino";
import {CampoDettaglioTransazione} from "../../model/bollettino/CampoDettaglioTransazione";
import {MenuService} from "../../../../services/menu.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  testoAccedi = 'Accedi';
  isAnonimo = false;

  constructor(
    private router: Router,
    private bannerService: BannerService,
    private pagamentoService: PagamentoService,
    private menuService: MenuService
  ) {
    this.menuService.userAutenticatedEvent
      .subscribe((isAnonimo: boolean) => {
        this.isAnonimo = isAnonimo;
        this.testoAccedi = isAnonimo ? 'Accedi' : 'Esci';
      });
    if (localStorage.getItem('access_jwt')) {
      this.router.navigate(['/riservata']);
      return;
    }

    // location.replace(environment.loginSpid);

  }

  ngOnInit(): void {
    // todo test confermaPagamento
    const chiamaConfermaPagamento = false; // cambiare a true per testare
    const email = 'giovanni.rubino@dxc.com'
    const bollettino = new Bollettino();
    bollettino.anno = 2020;
    bollettino.causale = 'causale di prova';
    bollettino.cfpiva = 'RBNGNN94C11A662V';
    bollettino.enteId = 1;
    bollettino.servizioId = 1;
    bollettino.importo = 90.5;
    bollettino.iuv = 'LEP12345';
    bollettino.numero = 'NUM987';
    const listaCampoDettaglioTransazione: CampoDettaglioTransazione[] = []
    const campoDettaglioTransazione = new CampoDettaglioTransazione();
    campoDettaglioTransazione.titolo = 'titolo';
    campoDettaglioTransazione.valore = 'valore';
    listaCampoDettaglioTransazione.push(campoDettaglioTransazione)
    bollettino.listaCampoDettaglioTransazione = listaCampoDettaglioTransazione;
    const body: Bollettino[] = [];
    body.push(bollettino);
    if (chiamaConfermaPagamento) {
      this.pagamentoService.confermaPagamento(body, email).subscribe();
    }

    const bannerObservable: Observable<Banner[]> = this.bannerService
      .letturaBanner(this.bannerService.timestamp, this.bannerService.attivo);
    bannerObservable.subscribe((banners) => {
      this.bannerService.bannerEvent.emit(banners);
    });
  }

  getLoginLink() {
    return this.isAnonimo ? environment.bffBaseUrl + '/loginLepida.htm' : environment.bffBaseUrl + '/logout';
  }
}