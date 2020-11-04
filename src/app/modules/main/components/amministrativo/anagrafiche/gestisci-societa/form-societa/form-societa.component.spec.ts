import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSocietaComponent } from './form-societa.component';

describe('DettaglioSocietaComponent', () => {
  let component: FormSocietaComponent;
  let fixture: ComponentFixture<FormSocietaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormSocietaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormSocietaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
