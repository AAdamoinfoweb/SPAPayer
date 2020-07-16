import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {UrlBackService} from "../../services/urlBack.service";

@Component({
  selector: 'app-nonautorizzato',
  templateUrl: './nonautorizzato.component.html',
  styleUrls: ['./nonautorizzato.component.scss']
})
export class NonautorizzatoComponent implements OnInit {

  urlBack: string;

  constructor(private route: Router, private urlBackService: UrlBackService) {
    this.urlBack = urlBackService.urlBack;
  }

  ngOnInit(): void {
  }

  tornaAlServizio() {
    this.route.navigateByUrl(this.urlBack);
  }
}
