import {AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {StickyService} from "./StickyService";

@Component({
  selector: 'app-login-bar',
  templateUrl: './login-bar.component.html',
  styleUrls: ['./login-bar.component.scss']
})
export class LoginBarComponent implements OnInit, AfterViewInit {

  constructor(private stickyService: StickyService) { }

  @ViewChild("containerLoginBar", {static: false}) containerLoginBar: ElementRef;

  ngOnInit(): void {
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.stickyService.stickyEvent.emit(this.containerLoginBar.nativeElement.offsetHeight);
  }

  ngAfterViewInit(): void {
    this.stickyService.stickyEvent.emit(this.containerLoginBar.nativeElement.offsetHeight);
  }

}
