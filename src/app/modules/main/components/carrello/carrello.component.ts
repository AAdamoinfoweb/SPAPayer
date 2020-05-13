import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Pagamento} from "../../model/Pagamento";
import {Breadcrumb} from "../../dto/Breadcrumb";
import {Router} from "@angular/router";

@Component({
  selector: 'app-carrello',
  templateUrl: './carrello.component.html',
  styleUrls: ['./carrello.component.scss']
})
export class CarrelloComponent implements OnInit {
  isDark: boolean = false;
  separator: string = "/";
  items = [];

  listaPagamenti: Pagamento[] = [];

  email: string = '';

  @ViewChild("videoPlayer", { static: false }) videoplayer: ElementRef;
  isPlay: boolean = false;

  constructor(private router: Router) {
    this.items.push(new Breadcrumb("Home", null, null));
    this.items.push(new Breadcrumb("Pagamenti", null, null));
    this.items.push(new Breadcrumb("Carrello", null, null));
  }


  toggleVideo() {
    this.videoplayer.nativeElement.play();
  }

  ngOnInit(): void {
    this.listaPagamenti.push(new Pagamento(new Date(), "001233468129", "TARI", "Comune di Bologna", new Date(), 120.00));
    this.listaPagamenti.push(new Pagamento(new Date(), "001233463789", "IMU", "Comune di Ferrara", new Date(), 572.56));
  }

  get totale(): number {
    return this.listaPagamenti.reduce((accum, item) => accum + item.importo, 0);
  }

  goToPresaInCaricoPagamento() {
    this.router.navigateByUrl("/presaincaricopagamento");
  }

}
