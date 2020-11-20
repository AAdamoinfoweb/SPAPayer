import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestisciStatisticheComponent } from './gestisci-statistiche.component';

describe('GestisciStatisticheComponent', () => {
  let component: GestisciStatisticheComponent;
  let fixture: ComponentFixture<GestisciStatisticheComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestisciStatisticheComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestisciStatisticheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
