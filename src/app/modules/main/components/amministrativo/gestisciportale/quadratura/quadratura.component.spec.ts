import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuadraturaComponent } from './quadratura.component';

describe('QuadraturaComponent', () => {
  let component: QuadraturaComponent;
  let fixture: ComponentFixture<QuadraturaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuadraturaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuadraturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
