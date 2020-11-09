import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltroGestioneTipologiaServizioComponent } from './filtro-gestione-tipologia-servizio.component';

describe('FiltroGestioneTipologiaServizioComponent', () => {
  let component: FiltroGestioneTipologiaServizioComponent;
  let fixture: ComponentFixture<FiltroGestioneTipologiaServizioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltroGestioneTipologiaServizioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltroGestioneTipologiaServizioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
