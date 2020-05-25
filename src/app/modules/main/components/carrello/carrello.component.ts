import {AfterViewInit, Component, ElementRef, HostListener, Input, OnInit, Renderer2, ViewChild} from '@angular/core';
import {Breadcrumb} from "../../dto/Breadcrumb";
import {Router} from "@angular/router";
import {FormControl, FormGroup, NgForm, Validators} from "@angular/forms";

@Component({
  selector: 'app-carrello',
  templateUrl: './carrello.component.html',
  styleUrls: ['./carrello.component.scss']
})
export class CarrelloComponent implements OnInit, AfterViewInit {

  isDark: boolean = false;
  separator: string = "/";
  breadcrumbList = [];

  numeroPagamenti: number = 0;
  totalePagamento: number = 0;

  @Input()
  rid: string;

  email: string = 'mario.rossi@gmail.com';

  @ViewChild("videoPlayer", {static: false}) videoplayer: ElementRef;

  tooltipTitle: string = "In questa interfaccia vengono mostrate le pendenze che stanno per essere pagate ed è possibile procedere al pagamento.";
  userEmail: FormGroup;

  constructor(private router: Router, private renderer: Renderer2) {
    this.breadcrumbList.push(new Breadcrumb("Home", null, null));
    this.breadcrumbList.push(new Breadcrumb("Pagamenti", null, null));
    this.breadcrumbList.push(new Breadcrumb("Carrello", null, null));
  }

  ngAfterViewInit(): void {
    this.renderer.addClass(document.getElementById("it-breadcrumb-item-0"), "active");
    this.renderer.addClass(document.getElementById("it-breadcrumb-item-1"), "active");
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

  navigaInPresaInCaricoPagamento() {
    this.router.navigateByUrl("/presaincaricopagamento");
  }

  getNote(emailForm: NgForm): string {
    if (emailForm.controls.emailInput?.errors?.pattern) {
      return 'Il valore inserito deve essere un\'email';
    } else
      return 'inserisci indirizzo e-mail';
  }
}
