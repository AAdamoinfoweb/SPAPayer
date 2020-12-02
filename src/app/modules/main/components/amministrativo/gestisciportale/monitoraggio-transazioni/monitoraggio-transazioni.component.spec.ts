import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoraggioTransazioniComponent } from './monitoraggio-transazioni.component';

describe('MonitoraggioTransazioniComponent', () => {
  let component: MonitoraggioTransazioniComponent;
  let fixture: ComponentFixture<MonitoraggioTransazioniComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonitoraggioTransazioniComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitoraggioTransazioniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
