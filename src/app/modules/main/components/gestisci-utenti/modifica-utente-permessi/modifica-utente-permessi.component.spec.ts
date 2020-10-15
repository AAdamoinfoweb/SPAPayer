import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificaUtentePermessiComponent } from './modifica-utente-permessi.component';

describe('ModificaUtentePermessiComponent', () => {
  let component: ModificaUtentePermessiComponent;
  let fixture: ComponentFixture<ModificaUtentePermessiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModificaUtentePermessiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModificaUtentePermessiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
