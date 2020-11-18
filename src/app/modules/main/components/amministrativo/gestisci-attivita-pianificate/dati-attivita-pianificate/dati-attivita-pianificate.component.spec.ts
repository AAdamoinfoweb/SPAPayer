import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatiAttivitaPianificateComponent } from './dati-attivita-pianificate.component';

describe('DatiStatisticaComponent', () => {
  let component: DatiAttivitaPianificateComponent;
  let fixture: ComponentFixture<DatiAttivitaPianificateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatiAttivitaPianificateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatiAttivitaPianificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
