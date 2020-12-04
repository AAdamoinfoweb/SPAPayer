import {Component, OnInit} from '@angular/core';
import {environment} from '../../../environments/environment';
import {MenuService} from '../../services/menu.service';
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {AmministrativoService} from "../../services/amministrativo.service";
import {OverlayService} from "../../services/overlay.service";

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
  isUtenteAnonimo: boolean;
  selectedElement: string = '';

  constructor(private overlayService: OverlayService,
              private amministrativoService: AmministrativoService,
              public menuService: MenuService,
              private http: HttpClient,
              private router: Router) {
  }

  ngOnInit(): void {
    this.waiting = true;
    this.menuService.infoUtenteEmitter
      .subscribe((info) => {
        if (info) {
          localStorage.setItem('nome', info.nome);
          localStorage.setItem('cognome', info.cognome);

          if (!this.menuService.isUtenteAnonimo) {
            this.isUtenteAnonimo = false;
            this.nomeUtente = `${localStorage.getItem('nome')} ${localStorage.getItem('cognome')}`;
            localStorage.setItem('email', info.email);
          } else {
            this.isUtenteAnonimo = true;
            // next = false per utente anonimo
            this.amministrativoService.asyncAmministrativoSubject.next(false);
            this.amministrativoService.asyncAmministrativoSubject.complete();
          }

          let menuTemp = JSON.parse(decodeURIComponent(atob(info.menu)).replace(/\+/g, ' '));
          let idx = menuTemp.findIndex(o => o["mappaFunzioni"]);
          if (idx != -1 && menuTemp[idx]["mappaFunzioni"]) {
            this.amministrativoService.mappaFunzioni = JSON.parse(menuTemp[idx]["mappaFunzioni"]);
            // next = true per utente amministrativo
            this.amministrativoService.asyncAmministrativoSubject.next(true);
            this.amministrativoService.asyncAmministrativoSubject.complete();
            menuTemp.splice([idx], 1);
          } else {
            // next = false per utente autenticato senza permessi amministrativi
            this.amministrativoService.asyncAmministrativoSubject.next(false);
            this.amministrativoService.asyncAmministrativoSubject.complete();
          }
          // orderBy posizione sotto menu dinamici
          let posizione = 3;
          menuTemp = menuTemp.map(sottoMenu => {
            if (!(['Informazioni', 'Contattaci', 'Esci', 'Accedi', 'Pagamenti'].includes(sottoMenu.nome))) {
              sottoMenu.posizione = posizione;
              posizione++;
            }
            return sottoMenu;
          });

          this.menu = menuTemp;
          this.waiting = false;
          this.menuService.userEventChange.emit();
          this.menuService.menuCaricatoEvent.emit();
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

  getRouterLink(item: any, allItem: any[] = []) {
    if (item.route) {
      if (item.nome === 'Accedi') {
        localStorage.setItem('loginDaAnonimo', 'true');
       window.location.href = environment.bffBaseUrl + item.route;
       // window.location.href = "http://service.pp.192-168-43-56.nip.io/api/loginLepida.htm?CodiceFiscale=STNSNT85T11C975A&nome=sante&cognome=sta&email=sante.stanisci@dxc.com";
        //window.location.href = "http://service.pp.192-168-43-56.nip.io/api/loginLepida.htm?CodiceFiscale=FGLLRA86D69D548K&nome=Laura&cognome=Fogli&email=laura.fogli@dxc.com"
      } else if (item.nome === 'Esci') {
        this.http.get(environment.bffBaseUrl + '/logout', {withCredentials: true}).subscribe((body: any) => {
          if (body.url) {
            localStorage.clear();
            this.menuService.userEventChange.emit();
            window.location.href = body.url;
          }
        });
      } else if (environment.menuLinks.map(value => value.nome).includes(item.nome)) {
        window.open(environment.menuLinks.find(value => value.nome === item.nome).url);
      } else {
        this.router.navigateByUrl(item.route);
      }
    } else {
      if (item['isExpanded']) {
        this.selectedElement = item['nome'];
      } else {
        this.selectedElement = null;
      }
    }
  }
}
