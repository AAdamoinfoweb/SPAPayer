import {AfterViewInit, Component, ElementRef, HostListener, Input, OnInit, ViewChild} from '@angular/core';
import {LoginBarService} from '../../services/login-bar.service';
import {MenuService} from '../../services/menu.service';
import {environment} from 'src/environments/environment';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-login-bar',
  templateUrl: './login-bar.component.html',
  styleUrls: ['./login-bar.component.scss']
})
export class LoginBarComponent implements OnInit, AfterViewInit {

  constructor(private stickyService: LoginBarService,
              private http: HttpClient,
              private menuService: MenuService) {
  }

  @ViewChild("containerLoginBar", {static: false}) containerLoginBar: ElementRef;
  isL1: boolean = true;

  testoAccedi = "Accedi";

  ngOnInit(): void {
    this.menuService.userEventChange
      .subscribe(() => {
        this.checkIfL1();
        this.testoAccedi = this.menuService.isUtenteAnonimo ? 'Accedi' : 'Esci';
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

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.stickyService.stickyEvent.emit(this.containerLoginBar.nativeElement.offsetHeight);
  }

  ngAfterViewInit(): void {
    this.stickyService.stickyEvent.emit(this.containerLoginBar.nativeElement.offsetHeight);
  }

  getLoginLink() {
    if (this.menuService.isUtenteAnonimo) {
      window.location.href = environment.bffBaseUrl + '/loginLepida.htm';
    } else {
      this.http.get(environment.bffBaseUrl + '/logout', {withCredentials: true}).subscribe((body: any) => {
        if (body.url) {
          this.menuService.userEventChange.emit();
          window.location.href = body.url;
        }
      });
    }
  }
}
