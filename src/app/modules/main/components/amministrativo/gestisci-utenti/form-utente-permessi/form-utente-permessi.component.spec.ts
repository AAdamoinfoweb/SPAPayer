import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormUtentePermessiComponent } from './form-utente-permessi.component';

describe('AggiungiUtentePermessiComponent', () => {
  let component: FormUtentePermessiComponent;
  let fixture: ComponentFixture<FormUtentePermessiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormUtentePermessiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormUtentePermessiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
