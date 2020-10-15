import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltriIMieiPagamentiComponent } from './filtri-i-miei-pagamenti.component';

describe('FiltriIMieiPagamentiComponent', () => {
  let component: FiltriIMieiPagamentiComponent;
  let fixture: ComponentFixture<FiltriIMieiPagamentiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltriIMieiPagamentiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltriIMieiPagamentiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
