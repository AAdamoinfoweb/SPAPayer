import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {map} from "rxjs/operators";
import {XsrfService} from "../../services/xsrf.service";

@Component({
  selector: 'app-generic-error',
  templateUrl: './generic-error.component.html',
  styleUrls: ['./generic-error.component.scss']
})
export class GenericErrorComponent implements OnInit {

  urlBack: string;
  private getUrlBack: string = '/getUrlBack';

  constructor(private route: Router, private http: HttpClient, private xsrfService: XsrfService) {
  }

  ngOnInit(): void {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append("XSRF-TOKEN", this.xsrfService.xsrfToken)
    this.http.get(environment.bffBaseUrl + this.getUrlBack, {
      withCredentials: true,
      headers: headers,
    })
      .pipe(map((body: any) => {
       if(body.url)
         this.urlBack = body.url
      })).subscribe();
  }

  tornaAlServizio() {
    this.route.navigateByUrl(this.urlBack);
  }

}
