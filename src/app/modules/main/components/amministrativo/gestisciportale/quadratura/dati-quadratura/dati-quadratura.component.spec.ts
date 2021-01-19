import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatiQuadraturaComponent } from './dati-quadratura.component';

describe('DatiQuadraturaComponent', () => {
  let component: DatiQuadraturaComponent;
  let fixture: ComponentFixture<DatiQuadraturaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatiQuadraturaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatiQuadraturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
