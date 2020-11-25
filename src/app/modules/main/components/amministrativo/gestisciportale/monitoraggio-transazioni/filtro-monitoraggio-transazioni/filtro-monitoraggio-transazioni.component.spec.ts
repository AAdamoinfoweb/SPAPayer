import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltroMonitoraggioTransazioniComponent } from './filtro-monitoraggio-transazioni.component';

describe('FiltroMonitoraggioTransazioniComponent', () => {
  let component: FiltroMonitoraggioTransazioniComponent;
  let fixture: ComponentFixture<FiltroMonitoraggioTransazioniComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltroMonitoraggioTransazioniComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltroMonitoraggioTransazioniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
