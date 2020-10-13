import {AfterViewInit, Component, ElementRef, Input, OnInit, Renderer2, ViewChild} from '@angular/core';
import {Breadcrumb} from '../../dto/Breadcrumb';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {PagamentoService} from '../../../../services/pagamento.service';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../../../environments/environment";
import {flatMap, map} from "rxjs/operators";
import {XsrfService} from "../../../../services/xsrf.service";
import {NuovoPagamentoService} from "../../../../services/nuovo-pagamento.service";
import {DettagliTransazione} from "../../model/bollettino/DettagliTransazione";
import {Banner} from "../../model/Banner";
import {getBannerType, LivelloBanner} from "../../../../enums/livelloBanner.enum";
import {BannerService} from "../../../../services/banner.service";
import {Bollettino} from "../../model/bollettino/Bollettino";
import {CampoDettaglioTransazione} from "../../model/bollettino/CampoDettaglioTransazione";
import {Pagamento} from "../../model/Pagamento";
import {Observable} from "rxjs";
import {DettaglioTransazioneEsito} from "../../model/bollettino/DettaglioTransazioneEsito";
import {EsitoEnum} from "../../../../enums/esito.enum";
import {OverlayService} from "../../../../services/overlay.service";
import {MenuService} from "../../../../services/menu.service";

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

  email = null;

  @ViewChild('videoPlayer', {static: false}) videoplayer: ElementRef;

  tooltipTitle = 'In questa interfaccia vengono mostrate le pendenze che stanno per essere pagate ed è possibile procedere al pagamento.';
  userEmail: FormGroup;

  loading = false;
  urlBack: string;

  constructor(private router: Router, private renderer: Renderer2,
              private nuovoPagamentoService: NuovoPagamentoService,
              private overlayService: OverlayService,
              private menuService: MenuService,
              private bannerService: BannerService,
              private el: ElementRef,
              private route: ActivatedRoute) {
    this.breadcrumbList = [];
    this.breadcrumbList.push(new Breadcrumb(0, 'Home', null, null));
    this.breadcrumbList.push(new Breadcrumb(1, 'Pagamenti', null, null));
    this.breadcrumbList.push(new Breadcrumb(2, 'Carrello', null, null));
    this.route.queryParams.subscribe((params) => {
      this.rid = params.rid;
    });
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

  private creaListaBollettini() {
    let bollettini: Bollettino[] = [];
    for (var key in localStorage) {
      if (key.startsWith("boll-")) {
        let bollettino: Bollettino = JSON.parse(localStorage.getItem(key));
        bollettini.push(bollettino);
      }
    }
    return bollettini;
  }

  confermaPagamento() {
    this.overlayService.caricamentoEvent.emit(true);
    let observable;
    if (this.menuService.isUtenteAnonimo) {
      observable = this.nuovoPagamentoService.confermaPagamento(this.email, this.creaListaBollettini());
    } else {
      observable = this.nuovoPagamentoService.confermaPagamento(this.email);
    }
    observable.subscribe(resp => {
      this.overlayService.caricamentoEvent.emit(false);
      if (resp instanceof Array) {
        const banner: Banner = {
          titolo: 'Operazione non consentita!',
          testo: 'Uno o più bollettini sono già stati pagati o in corso di pagamento. Per maggiori informazioni contattare l’help desk',
          tipo: getBannerType(LivelloBanner.ERROR)
        };
        this.bannerService.bannerEvent.emit([banner]);
      } else {
        if (resp)
          window.location.href = resp;
      }
    }, () => this.overlayService.caricamentoEvent.emit(false));
  }

  tornaAlServizio() {
    window.location.href = this.urlBack;
  }
}
