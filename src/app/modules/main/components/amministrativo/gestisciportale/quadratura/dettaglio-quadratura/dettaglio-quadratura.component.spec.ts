import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DettaglioQuadraturaComponent } from './dettaglio-quadratura.component';

describe('DettaglioQuadraturaComponent', () => {
  let component: DettaglioQuadraturaComponent;
  let fixture: ComponentFixture<DettaglioQuadraturaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DettaglioQuadraturaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DettaglioQuadraturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
