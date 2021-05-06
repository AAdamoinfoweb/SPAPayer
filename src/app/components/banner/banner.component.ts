import {Component, OnInit} from '@angular/core';
import {BannerService} from '../../services/banner.service';
import {Banner} from '../../modules/main/model/banner/Banner';
import {getBannerType, LivelloBanner} from '../../enums/livelloBanner.enum';
import * as moment from 'moment';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent implements OnInit {


  timestamp;
  attivo;
  banners: Banner[] = [];
  livello;
  classe: string = 'alert alert-dismissible fade show';

  BannerType = LivelloBanner;
  getBannerType = getBannerType;

  dataSistema: string;

  constructor(private bannerService: BannerService) {
  }

  ngOnInit(): void {
    this.bannerService.bannerEvent.subscribe((banners: Banner[]) => {
      this.dataSistema = moment().format('DD-MM-YYYY HH:mm:ss');
      const bannersTemp = banners.map(banner => {
        this.classe = banner.tipo ? banner.tipo.classe : getBannerType(LivelloBanner.INFO).classe;
        banner.classe = this.classe;
        return banner;
      });
      this.banners = this.banners.concat(bannersTemp);
    });
  }

  onClick(banner: Banner) {
    this.banners = this.banners.filter(value => value !== banner);
  }

}
