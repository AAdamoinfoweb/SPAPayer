import {AfterViewInit, Component, ElementRef, HostListener, Input, OnInit, ViewChild} from '@angular/core';
import {LoginBarService} from '../../services/login-bar.service';
import {MenuService} from '../../services/menu.service';
import {environment} from 'src/environments/environment';

@Component({
  selector: 'app-login-bar',
  templateUrl: './login-bar.component.html',
  styleUrls: ['./login-bar.component.scss']
})
export class LoginBarComponent implements OnInit, AfterViewInit {

  constructor(private stickyService: LoginBarService,
              private menuService: MenuService) {
  }

  @ViewChild("containerLoginBar", {static: false}) containerLoginBar: ElementRef;

  @Input()
  isL1: boolean = true;

  testoAccedi = "Accedi";
  isAnonimo = false;

  ngOnInit(): void {
    this.menuService.userAutenticatedEvent
      .subscribe((isAnonimo: boolean) => {
        this.isAnonimo = isAnonimo;
        this.testoAccedi = isAnonimo ? 'Accedi' : 'Esci';
      });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.stickyService.stickyEvent.emit(this.containerLoginBar.nativeElement.offsetHeight);
  }

  ngAfterViewInit(): void {
    this.stickyService.stickyEvent.emit(this.containerLoginBar.nativeElement.offsetHeight);
  }

  getLoginLink() {
    return this.isAnonimo ? environment.bffBaseUrl + '/loginLepida.htm' : environment.bffBaseUrl + '/logout';
  }
}
