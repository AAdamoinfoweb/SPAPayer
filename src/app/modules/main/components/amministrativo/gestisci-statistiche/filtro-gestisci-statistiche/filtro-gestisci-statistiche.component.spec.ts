import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltroGestisciStatisticheComponent } from './filtro-gestisci-statistiche.component';

describe('FiltroGestisciStatisticheComponent', () => {
  let component: FiltroGestisciStatisticheComponent;
  let fixture: ComponentFixture<FiltroGestisciStatisticheComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltroGestisciStatisticheComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltroGestisciStatisticheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
