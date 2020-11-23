import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestisciTipologiaServizioComponent } from './gestisci-tipologia-servizio.component';

describe('GestisciTipologiaServizioComponent', () => {
  let component: GestisciTipologiaServizioComponent;
  let fixture: ComponentFixture<GestisciTipologiaServizioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestisciTipologiaServizioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestisciTipologiaServizioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
