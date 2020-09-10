import {Component, HostListener, OnInit} from '@angular/core';
import {StickyService} from "./components/login-bar/StickyService";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
  }

  title = '';
}
