import {Component, HostListener, OnInit} from '@angular/core';
import {environment} from '../../../environments/environment';
import {MenuService} from "../../services/menu.service";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  versionApplicativo: string;
  nomeUtente = '-----';
  private menu = [];

  constructor(private menuService: MenuService) {
  }

  ngOnInit(): void {
    this.menuService.getInfoUtente().subscribe((info) => {
      localStorage.setItem('nome', info.nome);
      localStorage.setItem('cognome', info.cognome);

      if (localStorage.getItem('nome')) {
        this.nomeUtente = `${localStorage.getItem('nome')} ${localStorage.getItem('cognome')}`;
      }
      this.menu = JSON.parse(atob(info.menu));
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

}
