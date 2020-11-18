import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAttivitaPianificateComponent } from './form-attivita-pianificate.component';

describe('FormStatisticaComponent', () => {
  let component: FormAttivitaPianificateComponent;
  let fixture: ComponentFixture<FormAttivitaPianificateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormAttivitaPianificateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormAttivitaPianificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
