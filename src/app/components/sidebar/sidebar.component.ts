import {Component, OnInit} from '@angular/core';
import {environment} from '../../../environments/environment';
import {MenuService} from '../../services/menu.service';
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";

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

  constructor(private menuService: MenuService,
              private http: HttpClient,
              private router: Router) {
  }

  ngOnInit(): void {
    this.waiting = true;
    this.menuService.infoUtenteEmitter
      .subscribe((info) => {
        this.waiting = false;
        if (info) {
          localStorage.setItem('nome', info.nome);
          localStorage.setItem('cognome', info.cognome);

          if (!this.menuService.isUtenteAnonimo) {
            this.nomeUtente = `${localStorage.getItem('nome')} ${localStorage.getItem('cognome')}`;
            localStorage.setItem('email', info.email);
          }
          this.menuService.userEventChange.emit();
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
    if (sub.nome === 'Accedi') {
      localStorage.setItem('loginDaAnonimo', 'true');
      window.location.href = environment.bffBaseUrl + sub.route;
      //window.location.href = "http://service.pp.192-168-43-56.nip.io/api/loginLepida.htm?CodiceFiscale=STNSNT85T11C975A&nome=sante&cognome=sta&email=sante.stanisci@dxc.com";
    } else if (sub.nome === 'Esci') {
      this.http.get(environment.bffBaseUrl + '/logout', {withCredentials: true}).subscribe((body: any) => {
        if (body.url) {
          this.menuService.userEventChange.emit();
          window.location.href = body.url;
        }
      });
    } else {
      this.router.navigateByUrl(sub.route);
    }
  }
}
