import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private router: Router,
  ) {
    if (localStorage.getItem('access_jwt')) {
      this.router.navigate(['/riservata']);
      return;
    }

    // location.replace(environment.loginSpid);

  }

  ngOnInit(): void {
  }

}
