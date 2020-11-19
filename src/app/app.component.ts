import {ChangeDetectorRef, Component, HostListener, OnInit} from '@angular/core';
import {MenuService} from "./services/menu.service";
import {TipologicaSelectEnum} from './enums/tipologicaSelect.enum';
import {ToponomasticaService} from './services/toponomastica.service';
import {catchError, map} from 'rxjs/operators';
import {UserIdleService} from "angular-user-idle";
import {AuthguardService} from "./services/authguard.service";
import {Router} from "@angular/router";
import {OverlayService} from './services/overlay.service';
import {DatiPagamento} from './modules/main/model/bollettino/DatiPagamento';
import {EsitoEnum} from './enums/esito.enum';
import {of} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = '';
  mostraModale = false;
  datiPagamento: DatiPagamento = null;
  tipologiaServizio: any;
  idFunzione: string;

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

    this.overlayService.mostraModaleDettaglioPagamentoEvent
      .subscribe(datiPagamento => {
        this.datiPagamento = datiPagamento;
        this.mostraModale = datiPagamento != null;
        this.cdr.detectChanges();
      });

    this.overlayService.mostraModaleCampoEvent
      .subscribe(datiModaleCampo => {
        this.tipologiaServizio = datiModaleCampo;
        this.mostraModale = datiModaleCampo != null;
        this.cdr.detectChanges();
      });

    this.overlayService.mostraModaleTipoCampoEvent
      .subscribe(value => {
        if (value?.idFunzione) {
          this.idFunzione = value.idFunzione;
        }
        this.mostraModale = !!value;
        this.cdr.detectChanges();
      });

    this.menuService.getInfoUtente().subscribe((info) => {
      this.menuService.infoUtenteEmitter.emit(info);
    }, catchError((err, caught) => of(null)));

    this.letturatipologicheSelect();
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
    if (!localStorage.getItem(TipologicaSelectEnum.PROVINCE)) {
      this.toponomasticaService.recuperaProvince().pipe(map(res => {
        localStorage.setItem(TipologicaSelectEnum.PROVINCE, JSON.stringify(res));
      })).subscribe();
    }

    if (!localStorage.getItem(TipologicaSelectEnum.COMUNI)) {
      this.toponomasticaService.recuperaComuni().pipe(map(res => {
        localStorage.setItem(TipologicaSelectEnum.COMUNI, JSON.stringify(res));
      })).subscribe();
    }
  }
}
