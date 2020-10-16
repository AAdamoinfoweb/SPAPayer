import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltroGestioneUtentiComponent } from './filtro-gestione-utenti.component';

describe('FiltroGestioneUtentiComponent', () => {
  let component: FiltroGestioneUtentiComponent;
  let fixture: ComponentFixture<FiltroGestioneUtentiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltroGestioneUtentiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltroGestioneUtentiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
