import {Component, HostListener, OnInit} from '@angular/core';
import {StickyService} from '../login-bar/StickyService';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  private maxHeightOffset: number;

  constructor(private stickyService: StickyService) { }

  ngOnInit(): void {
    this.stickyService.stickyEvent.subscribe((value: number) => this.maxHeightOffset = value);
  }

  isSticky: boolean = false;

  @HostListener('window:scroll', ['$event'])
  checkScroll() {
    this.isSticky = window.pageYOffset >= this.maxHeightOffset;
  }

  ritornaAHomePage() {
    window.open("/", "_blank");
  }

}
