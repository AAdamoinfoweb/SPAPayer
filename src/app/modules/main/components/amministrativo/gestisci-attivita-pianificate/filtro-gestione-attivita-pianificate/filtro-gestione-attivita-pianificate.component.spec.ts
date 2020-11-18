import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltroGestioneAttivitaPianificateComponent } from './filtro-gestione-attivita-pianificate.component';

describe('FiltroGestioneAttivitaPianificateComponent', () => {
  let component: FiltroGestioneAttivitaPianificateComponent;
  let fixture: ComponentFixture<FiltroGestioneAttivitaPianificateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltroGestioneAttivitaPianificateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltroGestioneAttivitaPianificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
