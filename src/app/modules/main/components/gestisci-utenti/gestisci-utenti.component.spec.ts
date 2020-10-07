import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestisciUtentiComponent } from './gestisci-utenti.component';

describe('GestioneUtentiComponent', () => {
  let component: GestisciUtentiComponent;
  let fixture: ComponentFixture<GestisciUtentiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestisciUtentiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestisciUtentiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
