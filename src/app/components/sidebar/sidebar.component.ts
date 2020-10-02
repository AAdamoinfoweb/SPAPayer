import {Component, OnInit} from '@angular/core';
import {environment} from '../../../environments/environment';
import {MenuService} from '../../services/menu.service';

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

  constructor(private menuService: MenuService) {
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
            this.menuService.userAutenticatedEvent.emit()
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
    return sub.nome === 'Accedi' || sub.nome === 'Esci' ? [environment.bffBaseUrl + sub.route] : [sub.route];
  }
}
