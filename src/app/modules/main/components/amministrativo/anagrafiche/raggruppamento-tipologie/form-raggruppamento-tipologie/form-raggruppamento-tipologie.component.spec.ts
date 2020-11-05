import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormRaggruppamentoTipologieComponent } from './form-raggruppamento-tipologie.component';

describe('FormRaggruppamentoTipologieComponent', () => {
  let component: FormRaggruppamentoTipologieComponent;
  let fixture: ComponentFixture<FormRaggruppamentoTipologieComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormRaggruppamentoTipologieComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormRaggruppamentoTipologieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
