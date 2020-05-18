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

  listaPagamenti: Pagamento[] = [];

  email: string = 'mario.rossi@gmail.com';

  @ViewChild("videoPlayer", {static: false}) videoplayer: ElementRef;

  tooltipTitle: string = "In questa interfaccia vengono mostrate le pendenze che stanno per essere pagate ed è possibile procedere al pagamento.";
  userEmail: FormGroup;

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

    this.listaPagamenti.push(new Pagamento(new Date(), "001233468129", "TARI", "Comune di Bologna", new Date(), 120.00));
    this.listaPagamenti.push(new Pagamento(new Date(), "001233463789", "IMU", "Comune di Ferrara", new Date(), 572.56));
  }

  get emailInput() {
    return this.userEmail.get("emailInput");
  }

  get totale(): number {
    return this.listaPagamenti.reduce((accum, item) => accum + item.importo, 0);
  }

  goToPresaInCaricoPagamento() {
    this.router.navigateByUrl("/presaincaricopagamento");
  }

}
