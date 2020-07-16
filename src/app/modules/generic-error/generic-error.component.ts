import {Component, OnInit} from '@angular/core';
import {UrlBackService} from '../../services/urlBack.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-generic-error',
  templateUrl: './generic-error.component.html',
  styleUrls: ['./generic-error.component.scss']
})
export class GenericErrorComponent implements OnInit {

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
