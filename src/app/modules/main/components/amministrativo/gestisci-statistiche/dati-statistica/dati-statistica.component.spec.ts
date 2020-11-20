import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatiStatisticaComponent } from './dati-statistica.component';

describe('DatiStatisticaComponent', () => {
  let component: DatiStatisticaComponent;
  let fixture: ComponentFixture<DatiStatisticaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatiStatisticaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatiStatisticaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
