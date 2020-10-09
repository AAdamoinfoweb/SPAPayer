import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.scss']
})
export class OverlayComponent implements OnInit {
  @Input()
  caricamento: boolean;

  @Input()
  modaleConferma: boolean;

  constructor() { }

  ngOnInit(): void {
  }

}
