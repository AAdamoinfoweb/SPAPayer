import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestisciCampoTipologiaServizioComponent } from './gestisci-campo-tipologia-servizio.component';

describe('GestisciCampoTipologiaServizioComponent', () => {
  let component: GestisciCampoTipologiaServizioComponent;
  let fixture: ComponentFixture<GestisciCampoTipologiaServizioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestisciCampoTipologiaServizioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestisciCampoTipologiaServizioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
