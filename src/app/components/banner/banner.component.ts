import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs";
import {Pagamento} from "../../modules/main/model/Pagamento";
import {flatMap, map} from "rxjs/operators";
import {Carrello} from "../../modules/main/model/Carrello";
import {BannerService} from "../../services/banner.service";
import {Banner} from "../../modules/main/model/Banner";

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent implements OnInit {

  constructor(private bannerService: BannerService) { }

  timestamp = '';
  attivo = '';
  banners: Banner[] = null;

  ngOnInit(): void {
    const observable: Observable<Banner[]> = this.bannerService.letturaBanner(this.timestamp, this.attivo);

    observable.subscribe((ret) => {
     this.banners = ret;
    });

  }

}
