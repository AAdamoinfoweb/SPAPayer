import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {environment} from '../../../environments/environment';
import {Observable} from "rxjs";
import {Banner} from "../../modules/main/model/Banner";
import {BannerService} from "../../services/banner.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private router: Router,
    private bannerService: BannerService
  ) {
    if (localStorage.getItem('access_jwt')) {
      this.router.navigate(['/riservata']);
      return;
    }

    // location.replace(environment.loginSpid);

  }

  ngOnInit(): void {
    const bannerObservable: Observable<Banner[]> = this.bannerService
      .letturaBanner(this.bannerService.timestamp, this.bannerService.attivo);
    bannerObservable.subscribe((banners) => {
      this.bannerService.bannerEvent.emit(banners);
    });
  }

}
