import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormStatisticaComponent } from './form-statistica.component';

describe('FormStatisticaComponent', () => {
  let component: FormStatisticaComponent;
  let fixture: ComponentFixture<FormStatisticaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormStatisticaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormStatisticaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
