import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-homeriservata',
  templateUrl: './homeriservata.component.html',
  styleUrls: ['./homeriservata.component.scss']
})
export class HomeriservataComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.router.navigateByUrl("/home");
  }

}
