import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {XsrfService} from "../../services/xsrf.service";
import {environment} from "../../../environments/environment";
import {map} from "rxjs/operators";
import {OverlayService} from '../../services/overlay.service';

@Component({
  selector: 'app-nonautorizzato',
  templateUrl: './nonautorizzato.component.html',
  styleUrls: ['./nonautorizzato.component.scss']
})
export class NonautorizzatoComponent implements OnInit {

  urlBack: string;
  private getUrlBack: string = '/getBackUrl';

  constructor(private route: Router, private http: HttpClient, private xsrfService: XsrfService) {
  }

  ngOnInit(): void {
    this.http.get(environment.bffBaseUrl + this.getUrlBack, {
      withCredentials: true
    })
      .pipe(map((body: any) => {
        if (body && body.url) {
          this.urlBack = body.url
        }
      })).subscribe();
  }

  tornaAlServizio() {
    window.location.href = this.urlBack;
  }
}
