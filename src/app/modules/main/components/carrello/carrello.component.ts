import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Pagamento} from "../../model/Pagamento";
import {Breadcrumb} from "../../dto/Breadcrumb";
import {Router} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-carrello',
  templateUrl: './carrello.component.html',
  styleUrls: ['./carrello.component.scss']
})
export class CarrelloComponent implements OnInit {
  isDark: boolean = false;
  separator: string = "/";
  breadcrumbList = [];

  listaPagamentiLength: number = 0;
  listaPagamentiTotal: number = 0;

  email: string = 'mario.rossi@gmail.com';

  @ViewChild("videoPlayer", {static: false}) videoplayer: ElementRef;

  tooltipTitle: string = "In questa interfaccia vengono mostrate le pendenze che stanno per essere pagate ed è possibile procedere al pagamento.";
  userEmail: FormGroup;
  isShown: boolean = true;

  constructor(private router: Router) {
    this.breadcrumbList.push(new Breadcrumb("Home", null, null));
    this.breadcrumbList.push(new Breadcrumb("Pagamenti", null, null));
    this.breadcrumbList.push(new Breadcrumb("Carrello", null, null));
  }

  toggleVideo() {
    this.videoplayer.nativeElement.play();
  }

  ngOnInit(): void {
    this.userEmail = new FormGroup({
      emailInput: new FormControl(this.email, [
        Validators.required,
        Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")])
    });
  }

  goToPresaInCaricoPagamento() {
    this.router.navigateByUrl("/presaincaricopagamento");
  }

}
