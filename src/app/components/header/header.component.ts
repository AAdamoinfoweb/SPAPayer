import {Component, HostListener, Input, OnInit} from '@angular/core';
import {LoginBarService} from '../../services/login-bar.service';
import {NavigationEnd, Router} from '@angular/router';
import {filter} from 'rxjs/operators';
import {MenuService} from '../../services/menu.service';
import {environment} from 'src/environments/environment';
import {NuovoPagamentoService} from '../../services/nuovo-pagamento.service';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  private maxHeightOffset: number;

  isSticky: boolean = false;

  testoAccedi = 'Accedi';
  urlNuovoPagamento = "/nuovoPagamento";

  isPaginaNuovoPagamento: boolean = window.location.pathname === this.urlNuovoPagamento;
  prezzoCarrello: number;
  isL1: boolean = true;

  constructor(private stickyService: LoginBarService, private router: Router,
              private http: HttpClient,
              private nuovoPagamentoService: NuovoPagamentoService, private menuService: MenuService) {
  }

  ngOnInit(): void {
    this.menuService.userEventChange
      .subscribe(() => {
        this.checkIfL1();
        this.testoAccedi = this.menuService.isUtenteAnonimo ? 'Accedi' : 'Esci';
      });

    this.stickyService.stickyEvent.subscribe((value: number) => this.maxHeightOffset = value);
    this.router.events.pipe(filter(evento => evento instanceof NavigationEnd)).subscribe(event => {
      this.isPaginaNuovoPagamento = window.location.pathname === this.urlNuovoPagamento;
    });
    this.nuovoPagamentoService.prezzoEvent.subscribe((prezzo: number) => {
      this.prezzoCarrello = this.prezzoCarrello == null ? prezzo : this.prezzoCarrello + prezzo;
    });
  }

  private checkIfL1() {
    this.isL1 = true;
    for (var key in localStorage) {
      if (key == 'nome') {
        this.isL1 = false;
        break;
      }
    }
  }

  @HostListener('window:scroll', ['$event'])
  checkScroll() {
    this.isSticky = window.pageYOffset >= this.maxHeightOffset;
  }

  ritornaAHomePage() {
    window.open("/", "_self");
  }

  getLoginLink() {
    if (this.menuService.isUtenteAnonimo) {
      window.location.href = environment.bffBaseUrl + '/loginLepida.htm';
    } else {
      this.http.get(environment.bffBaseUrl + '/logout',{withCredentials: true}).subscribe((body: any) => {
        if (body.url) {
          localStorage.clear();
          this.menuService.userEventChange.emit();
          window.location.href = body.url;
        }
      });
    }
  }

  goToCarrello() {
    this.router.navigateByUrl('/carrello');
  }
}
