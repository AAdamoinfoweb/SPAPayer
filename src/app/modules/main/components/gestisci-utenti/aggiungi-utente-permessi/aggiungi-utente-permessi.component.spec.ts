import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AggiungiUtentePermessiComponent } from './aggiungi-utente-permessi.component';

describe('AggiungiUtentePermessiComponent', () => {
  let component: AggiungiUtentePermessiComponent;
  let fixture: ComponentFixture<AggiungiUtentePermessiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AggiungiUtentePermessiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AggiungiUtentePermessiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
