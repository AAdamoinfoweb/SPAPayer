import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoraAccessiComponent } from './monitora-accessi.component';

describe('MonitoraAccessiComponent', () => {
  let component: MonitoraAccessiComponent;
  let fixture: ComponentFixture<MonitoraAccessiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonitoraAccessiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitoraAccessiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
