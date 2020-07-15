import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {UrlRitornoService} from "../../services/urlRitorno.service";

@Component({
  selector: 'app-nonautorizzato',
  templateUrl: './nonautorizzato.component.html',
  styleUrls: ['./nonautorizzato.component.scss']
})
export class NonautorizzatoComponent implements OnInit {

  urlRitorno: string;

  constructor(private route: Router, private urlRitornoService: UrlRitornoService) {
    this.urlRitorno = urlRitornoService.urlRitorno;
  }

  ngOnInit(): void {
  }

  tornaAlServizio() {
    this.route.navigateByUrl(this.urlRitorno);
  }
}
