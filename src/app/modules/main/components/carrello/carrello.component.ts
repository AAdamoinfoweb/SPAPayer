import {AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {Breadcrumb} from '../../dto/Breadcrumb';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {NuovoPagamentoService} from "../../../../services/nuovo-pagamento.service";
import {Banner} from "../../model/banner/Banner";
import {getBannerType, LivelloBanner} from "../../../../enums/livelloBanner.enum";
import {BannerService} from "../../../../services/banner.service";
import {Bollettino} from "../../model/bollettino/Bollettino";
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
  isShow = true;
  waiting = false;
  private doSvuotaCarrello = false;

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
      if (params.esito) {
        this.isShow = false;

        if (menuService.isUtenteAnonimo) {
          for (var key in localStorage) {
            if (key.startsWith("boll-")) {
              localStorage.removeItem(key);
            }
          }
        } else {
          this.doSvuotaCarrello = true;
        }

        let banner: Banner;
        if (params.esito == "OK") {
          let mail = localStorage.getItem("email");
          banner = {
            titolo: 'Avviso',
            testo: 'Il pagamento è andato a buon fine, abbiamo inviato una mail di conferma all\'indirizzo: ' + mail,
            tipo: getBannerType(LivelloBanner.SUCCESS)
          };
        } else if (params.esito == "ERROR" || params.esito == "KO") {
          let msg = menuService.isUtenteAnonimo ? 'Rivolgersi all\'help desk per ulteriori informazioni' :
            'Consultare la sezione i Miei Pagamenti o rivolgersi all\'help desk per ulteriori informazioni';
          banner = {
            titolo: 'Avviso',
            testo: 'Il pagamento non è andato a buon fine. ' + msg,
            tipo: getBannerType(LivelloBanner.ERROR)
          };
        } else if (params.esito == "OP") {
          let msg = menuService.isUtenteAnonimo ? 'Rivolgersi all\'help desk per ulteriori informazioni' :
            'Consultare la sezione i Miei Pagamenti o rivolgersi all\'help desk per ulteriori informazioni';
          banner = {
            titolo: 'Avviso',
            testo: 'Il pagamento è in corso, al momento non è possibile conoscerne l\'esito del pagamento. ' + msg,
            tipo: getBannerType(LivelloBanner.WARNING)
          };
        }
        this.bannerService.bannerEvent.emit([banner]);
      } else {
        this.rid = params.rid;
      }
    });
  }

  ngAfterViewInit(): void {
    if (!this.waiting) {
      this.renderer.addClass(this.el.nativeElement.querySelector('#breadcrumb-item-0 > li'), 'active');
      this.renderer.addClass(this.el.nativeElement.querySelector('#breadcrumb-item-1 > li'), 'active');
      this.renderer.addClass(this.el.nativeElement.querySelector('#breadcrumb-item-2 > li > a'), 'active-bold');
    }
  }

  toggleVideo() {
    this.videoplayer.nativeElement.play();
  }

  ngOnInit(): void {
    if (this.doSvuotaCarrello) {
      this.waiting = true;
      this.nuovoPagamentoService.svuotaCarrello()
        .subscribe(() => {
          this.waiting = false;
          this.initForm();
        });
    } else {
      this.initForm();
    }
  }

  private initForm() {
    this.userEmail = new FormGroup({
      emailInput: new FormControl(this.email, [
        Validators.required,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')])
    });
    if (this.isShow && localStorage.getItem("email") != 'null') {
      this.email = localStorage.getItem("email");
    } else {
      this.email = null;
    }
  }

  navigaInPresaInCaricoPagamento() {
    localStorage.setItem("email", this.email);
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
    let observable;
    if (this.menuService.isUtenteAnonimo) {
      observable = this.nuovoPagamentoService.confermaPagamento(this.email, this.creaListaBollettini());
    } else {
      observable = this.nuovoPagamentoService.confermaPagamento(this.email);
    }
    observable.subscribe(resp => {
      if (resp instanceof Array) {
        //esito OK
        let numDocs = [];
        resp.forEach((value: any) => {
          if (value.esito == "OK" || value.esito == "DIFFERITO" || value == "PENDING") {
            numDocs.push(value.numeroDocumento);
          }
        });
        const banner: Banner = {
          titolo: 'Operazione non consentita!',
          testo: 'I bollettini numero ' + numDocs.join(", ") + ' sono già stati pagati o in corso di pagamento. Per maggiori informazioni consultare la sezione i miei pagamenti o contattare l’help desk',
          tipo: getBannerType(LivelloBanner.ERROR)
        };
        this.bannerService.bannerEvent.emit([banner]);
      } else {
        if (resp) {
          window.location.href = resp;
        }
      }
    }, () => {});
  }

  tornaAlServizio() {
    window.location.href = this.urlBack;
  }
}
