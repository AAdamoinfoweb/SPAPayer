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
  idBollettino: number;

  constructor(private overlayService: OverlayService) { }

  ngOnInit(): void {
  }
}
