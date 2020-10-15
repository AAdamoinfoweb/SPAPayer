import {ChangeDetectorRef, Component, HostListener, OnInit} from '@angular/core';
import {MenuService} from "./services/menu.service";
import {TipologicaSelectEnum} from './enums/tipologicaSelect.enum';
import {ToponomasticaService} from './services/toponomastica.service';
import {map} from 'rxjs/operators';
import {UserIdleService} from "angular-user-idle";
import {AuthguardService} from "./services/authguard.service";
import {Router} from "@angular/router";
import {OverlayService} from './services/overlay.service';
import {DatiPagamento} from './modules/main/model/bollettino/DatiPagamento';
import {EsitoEnum} from './enums/esito.enum';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = '';
  caricamento = false;
  datiPagamento = null;

  constructor(private menuService: MenuService,
              private router: Router,
              private cdr: ChangeDetectorRef,
              private authGuardService: AuthguardService,
              private idleService: UserIdleService,
              private toponomasticaService: ToponomasticaService,
              private overlayService: OverlayService) {
  }

  ngOnInit(): void {
    this.idleService.startWatching();
    this.idleService.onTimerStart().subscribe(count => console.log(count));
    this.idleService.onTimeout().subscribe(() => {
      this.logout();
    });

    this.menuService.getInfoUtente().subscribe((info) => {
      this.menuService.infoUtenteEmitter.emit(info);
    });

    this.overlayService.caricamentoEvent.subscribe(isLoading => {
      this.caricamento = isLoading;
      this.cdr.detectChanges();
    });

    this.overlayService.mostraModaleDettaglioPagamentoEvent.subscribe(datiPagamento => {
      this.datiPagamento = datiPagamento;
      this.cdr.detectChanges();
    });

    this.letturatipologicheSelect();

    // this.mockModaleDettaglioPagamento();
  }

  // @HostListener('window:beforeunload')
  logout() {
    this.authGuardService.logout().subscribe((url) => {
      this.idleService.stopWatching();
      this.idleService.stopTimer();
      if (url) {
        window.location.href = url;
      }
    });
  }

  letturatipologicheSelect(): void {
    this.toponomasticaService.recuperaProvince().pipe(map(res => {
      localStorage.setItem(TipologicaSelectEnum.PROVINCE, JSON.stringify(res));
    })).subscribe();

    this.toponomasticaService.recuperaComuni().pipe(map(res => {
      localStorage.setItem(TipologicaSelectEnum.COMUNI, JSON.stringify(res));
    })).subscribe();
  }

  mockModaleDettaglioPagamento(): void {
    const mockDettaglioPagamento = new DatiPagamento();
    mockDettaglioPagamento.dettaglioTransazioneId = null;
    mockDettaglioPagamento.enteId = 4;
    mockDettaglioPagamento.servizioId = 101;
    mockDettaglioPagamento.importo = 123;
    mockDettaglioPagamento.codiceAvviso = '001000000001066001';
    mockDettaglioPagamento.esitoPagamento = EsitoEnum.NON_PRESENTE;
    this.overlayService.mostraModaleDettaglioPagamentoEvent.emit(mockDettaglioPagamento);
  }
}
