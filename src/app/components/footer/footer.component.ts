import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  goToFeedback() {
    window.open("https://www.lepida.net/assistenza/richiesta-assistenza-payer", "_blank");
  }
}
