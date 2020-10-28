import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltroMonitoraggioAccessiComponent } from './filtro-monitoraggio-accessi.component';

describe('FiltroMonitoraggioAccessiComponent', () => {
  let component: FiltroMonitoraggioAccessiComponent;
  let fixture: ComponentFixture<FiltroMonitoraggioAccessiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltroMonitoraggioAccessiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltroMonitoraggioAccessiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
