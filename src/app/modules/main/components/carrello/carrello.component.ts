import {AfterViewInit, Component, ElementRef, Input, OnInit, Renderer2, ViewChild} from '@angular/core';
import {Breadcrumb} from '../../dto/Breadcrumb';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {PagamentoService} from '../../../../services/pagamento.service';
import {UrlBackService} from "../../../../services/urlBack.service";

@Component({
  selector: 'app-carrello',
  templateUrl: './carrello.component.html',
  styleUrls: ['./carrello.component.scss']
})
export class CarrelloComponent implements OnInit, AfterViewInit {

  isDark = false;
  separator = '/';
  breadcrumbList = [];

  numeroPagamenti = 0;
  totalePagamento = 0;

  rid: string;

  email = 'mario.rossi@gmail.com';

  @ViewChild('videoPlayer', {static: false}) videoplayer: ElementRef;

  tooltipTitle = 'In questa interfaccia vengono mostrate le pendenze che stanno per essere pagate ed è possibile procedere al pagamento.';
  userEmail: FormGroup;

  loading = false;
  urlBack;

  constructor(private router: Router, private renderer: Renderer2, private el: ElementRef, private route: ActivatedRoute,
              private pagamentoService: PagamentoService, private urlBackService: UrlBackService) {
    this.breadcrumbList = [];
    this.breadcrumbList.push(new Breadcrumb(0, 'Home', null, null));
    this.breadcrumbList.push(new Breadcrumb(1, 'Pagamenti', null, null));
    this.breadcrumbList.push(new Breadcrumb(2, 'Carrello', null, null));
    this.route.queryParams.subscribe((params) => {
      this.rid = params.rid;
    });
    this.urlBack = urlBackService.urlBack;
  }

  ngAfterViewInit(): void {
    this.renderer.addClass(this.el.nativeElement.querySelector('#breadcrumb-item-0 > li'), 'active');
    this.renderer.addClass(this.el.nativeElement.querySelector('#breadcrumb-item-1 > li'), 'active');
    this.renderer.addClass(this.el.nativeElement.querySelector('#breadcrumb-item-2 > li > a'), 'active-bold');
  }

  toggleVideo() {
    this.videoplayer.nativeElement.play();
  }

  ngOnInit(): void {
    this.userEmail = new FormGroup({
      emailInput: new FormControl(this.email, [
        Validators.required,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')])
    });
  }

  navigaInPresaInCaricoPagamento() {
    this.confermaPagamento();
  }

  getNote(emailForm: NgForm): string {
    if (emailForm.controls.emailInput?.errors?.pattern) {
      return 'Il valore inserito deve essere un\'email';
    } else {
      return 'inserisci indirizzo e-mail';
    }
  }

  confermaPagamento() {
    this.loading = true;
    this.pagamentoService.confermaPagamento(this.email)
      .subscribe(url => {
        this.loading = false;
        if (url) {
          window.location.href = url;
        }
      });
  }

  tornaAlServizio() {
    this.router.navigateByUrl(this.urlBack);
  }
}
