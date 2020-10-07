import {Component, OnInit} from '@angular/core';
import {environment} from '../../../environments/environment';
import {MenuService} from '../../services/menu.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  versionApplicativo: string;
  nomeUtente = '-----';
  menu = [];
  waiting: boolean;

  constructor(private menuService: MenuService, private router: Router) {
  }

  ngOnInit(): void {
    this.waiting = true;
    this.menuService.infoUtenteEmitter
      .subscribe((info) => {
        this.waiting = false;
        if (info) {
          localStorage.setItem('nome', info.nome);
          localStorage.setItem('cognome', info.cognome);

          if (localStorage.getItem('nome') !== 'null') {
            this.menuService.userAutenticatedEvent.emit(false);
            this.nomeUtente = `${localStorage.getItem('nome')} ${localStorage.getItem('cognome')}`;
          }
          this.menu = JSON.parse(decodeURIComponent(atob(info.menu)).replace(/\+/g, ' '));
        }
      });
    this.versionApplicativo = environment.sentry.release;
  }

  logout() {
    const inizioLogout = new Promise((resolve) => {
      localStorage.clear();
      resolve('done');
    });

    inizioLogout.finally(() => {
      location.replace(environment.logoutSpid);
    });
  }

  getRouterLink(sub: any) {
    if (sub.nome === 'Accedi' || sub.nome === 'Esci') {
      localStorage.setItem('loginDaAnonimo', 'true');
      window.location.href = "http://service.pp.192-168-43-56.nip.io/api/loginLepida.htm?CodiceFiscale=STNSNT85T11C975A&nome=sante&cognome=sta";
      //environment.bffBaseUrl + sub.route;
    } else {
      this.router.navigateByUrl(sub.route);
    }
  }
}
