import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormConfiguraPortaliEsterniComponent } from './form-configura-portali-esterni.component';

describe('FormConfiguraPortaliEsterniComponent', () => {
  let component: FormConfiguraPortaliEsterniComponent;
  let fixture: ComponentFixture<FormConfiguraPortaliEsterniComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormConfiguraPortaliEsterniComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormConfiguraPortaliEsterniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
