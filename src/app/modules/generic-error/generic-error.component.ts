import {Component, OnInit} from '@angular/core';
import {UrlRitornoService} from '../../services/urlRitorno.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-generic-error',
  templateUrl: './generic-error.component.html',
  styleUrls: ['./generic-error.component.scss']
})
export class GenericErrorComponent implements OnInit {

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
