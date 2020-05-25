import {Component, HostListener, OnInit} from '@angular/core';
import {StickyService} from "./components/login-bar/StickyService";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private maxHeightOffset: number;

  constructor(private stickyService: StickyService) { }

  ngOnInit(): void {
    this.stickyService.stickyEvent.subscribe((value: number) => this.maxHeightOffset = value);
  }

  title = '';

  isSticky: boolean = false;

  @HostListener('window:scroll', ['$event'])
  checkScroll() {
    this.isSticky = window.pageYOffset >= this.maxHeightOffset;
  }
}
