import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DettaglioEsitoNotificaComponent } from './dettaglio-esito-notifica.component';

describe('DettaglioEsitoNotificaComponent', () => {
  let component: DettaglioEsitoNotificaComponent;
  let fixture: ComponentFixture<DettaglioEsitoNotificaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DettaglioEsitoNotificaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DettaglioEsitoNotificaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
