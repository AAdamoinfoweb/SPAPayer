import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltroQuadraturaComponent } from './filtro-quadratura.component';

describe('FiltroQuadraturaComponent', () => {
  let component: FiltroQuadraturaComponent;
  let fixture: ComponentFixture<FiltroQuadraturaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltroQuadraturaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltroQuadraturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
