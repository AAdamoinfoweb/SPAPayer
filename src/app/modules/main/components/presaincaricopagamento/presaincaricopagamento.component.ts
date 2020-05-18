import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-presaincaricopagamento',
  templateUrl: './presaincaricopagamento.component.html',
  styleUrls: ['./presaincaricopagamento.component.scss']
})
export class PresaincaricopagamentoComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  goToFeedback() {
    window.location.href = "https://www.lepida.net/assistenza/richiesta-assistenza-payer"
  }
}
