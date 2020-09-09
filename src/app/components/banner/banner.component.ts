import {Component, OnInit} from '@angular/core';
import {BannerService} from '../../services/banner.service';
import {Banner} from '../../modules/main/model/Banner';
import {livelloBanner} from '../../enums/livelloBanner.enum';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent implements OnInit {

  constructor(private bannerService: BannerService) { }

  timestamp;
  attivo;
  banners: Banner[];
  livello;
  classe: string[] = ['alert alert-dismissible fade show'];

  ngOnInit(): void {
    this.bannerService.bannerEvent.subscribe((banners: Banner[]) => {
      this.banners = banners;
      this.livello = livelloBanner.INFO.livello;
      this.classe.push(livelloBanner.INFO.classe);
    });
  }
}
