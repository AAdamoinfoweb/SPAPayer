import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormEnteComponent } from './form-ente.component';

describe('FormEnteComponent', () => {
  let component: FormEnteComponent;
  let fixture: ComponentFixture<FormEnteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormEnteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormEnteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
