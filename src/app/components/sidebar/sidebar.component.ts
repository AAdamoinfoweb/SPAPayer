import {Component, HostListener, OnInit} from '@angular/core';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  versionApplicativo: string;
  nomeUtente = '-----';

  constructor() { }

  ngOnInit(): void {

    this.versionApplicativo = environment.sentry.release;
    if (localStorage.getItem('nome')) {
      this.nomeUtente = `${localStorage.getItem('nome')} ${localStorage.getItem('cognome')}`;
    }

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
