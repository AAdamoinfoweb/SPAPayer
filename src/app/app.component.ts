import {Component, HostListener, OnInit} from '@angular/core';
import {MenuService} from "./services/menu.service";
import {tipologicaSelect} from './enums/tipologicaSelect.enum';
import {ToponomasticaService} from './services/toponomastica.service';
import {map} from 'rxjs/operators';
import {UserIdleService} from "angular-user-idle";
import {AuthguardService} from "./services/authguard.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = '';

  constructor(private menuService: MenuService,
              private router: Router,
              private authGuardService: AuthguardService,
              private idleService: UserIdleService,
              private toponomasticaService: ToponomasticaService) {
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

    this.letturatipologicheSelect();
  }

  @HostListener('window:beforeunload')
  logout() {
    this.authGuardService.logout().subscribe((url) => {
      this.idleService.stopWatching();
      this.idleService.stopTimer();
      window.location.href = url;
    });
  }

  letturatipologicheSelect(): void {
    this.toponomasticaService.recuperaProvince().pipe(map(res => {
      localStorage.setItem(tipologicaSelect.PROVINCE, JSON.stringify(res));
    })).subscribe();

    this.toponomasticaService.recuperaComuni().pipe(map(res => {
      localStorage.setItem(tipologicaSelect.COMUNI, JSON.stringify(res));
    })).subscribe();
  }
}
