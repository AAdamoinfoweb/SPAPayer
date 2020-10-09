import {Component, Input, OnInit} from '@angular/core';
import {OverlayService} from '../../services/overlay.service';

@Component({
  selector: 'app-overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.scss']
})
export class OverlayComponent implements OnInit {
  @Input()
  caricamento: boolean;

  @Input()
  modale: string;

  constructor(private overlayService: OverlayService) { }

  ngOnInit(): void {
  }

  conferma(): void {
    this.overlayService.risultatoModaleEvent.emit(true);
  }

  annulla(): void {
    this.overlayService.risultatoModaleEvent.emit(false);
  }
}
