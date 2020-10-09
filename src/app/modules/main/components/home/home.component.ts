import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {environment} from '../../../../../environments/environment';
import {Observable, of} from "rxjs";
import {Banner} from "../../model/Banner";
import {BannerService} from "../../../../services/banner.service";
import {PagamentoService} from "../../../../services/pagamento.service";
import {Bollettino} from "../../model/bollettino/Bollettino";
import {CampoDettaglioTransazione} from "../../model/bollettino/CampoDettaglioTransazione";
import {MenuService} from "../../../../services/menu.service";
import {NuovoPagamentoService} from "../../../../services/nuovo-pagamento.service";
import {flatMap} from "rxjs/operators";
import {DettaglioTransazioneEsito} from "../../model/bollettino/DettaglioTransazioneEsito";
import {EsitoEnum} from "../../../../enums/esito.enum";
import {DettagliTransazione} from "../../model/bollettino/DettagliTransazione";
import {SpinnerService} from '../../../../services/spinner.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  testoAccedi = 'Accedi';
  isAnonimo = true;

  constructor(
    private router: Router,
    private nuovoPagamentoService: NuovoPagamentoService,
    private bannerService: BannerService,
    private pagamentoService: PagamentoService,
    private menuService: MenuService,
    private spinnerService: SpinnerService
  ) {
    this.menuService.userAnonimousEvent
      .subscribe((isAnonimo: boolean) => {
        this.isAnonimo = isAnonimo;
        if (!this.isAnonimo) {
          nuovoPagamentoService.getCarrello().subscribe((value) => this.nuovoPagamentoService.prezzoEvent.emit(value.totale));
        }
      });
    if (localStorage.getItem('loginDaAnonimo')) {
      let bollettini: Bollettino[] = [];
      for (var key in localStorage) {
        if (key.startsWith("boll-")) {
          let bollettino: Bollettino = JSON.parse(localStorage.getItem(key));
          bollettini.push(bollettino);
        }
      }
      if (bollettini.length > 0) {
        this.spinnerService.caricamentoEvent.emit(true);
        let observable: Observable<any> = this.nuovoPagamentoService.inserimentoBollettino(bollettini)
          .pipe(flatMap((result) => {
            let dettaglio: DettagliTransazione = new DettagliTransazione();
            result.forEach((value: DettaglioTransazioneEsito) => {
              if (value.esito !== EsitoEnum.OK && value.esito !== EsitoEnum.PENDING) {
                dettaglio.listaDettaglioTransazioneId.push(value.dettaglioTransazioneId);
              }
            });
            return this.nuovoPagamentoService.inserimentoCarrello(dettaglio);
          }));
        observable.subscribe(() => {
          nuovoPagamentoService.getCarrello().subscribe((value) => this.nuovoPagamentoService.prezzoEvent.emit(value.totale));
          this.clearLocalStorage();
          this.spinnerService.caricamentoEvent.emit(false);
          this.router.navigateByUrl("/nuovoPagamento");
        });
      }
      localStorage.removeItem('loginDaAnonimo');
    }

    if (localStorage.getItem('access_jwt')) {
      this.router.navigate(['/riservata']);
      return;
    }

  }

  ngOnInit(): void {
    const bannerObservable: Observable<Banner[]> = this.bannerService
      .letturaBanner(this.bannerService.timestamp, this.bannerService.attivo);
    bannerObservable.subscribe((banners) => {
      this.bannerService.bannerEvent.emit(banners);
    });
  }

  getLoginLink() {
    if (this.isAnonimo) {
      window.location.href = environment.bffBaseUrl + '/loginLepida.htm';
    } else {
      // NOTING TO DO
    }
  }

  private clearLocalStorage() {
    for (var key in localStorage) {
      if (key.startsWith("boll-")) {
        localStorage.removeItem(key);
      }
    }
  }
}
