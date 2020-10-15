import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ListaPagamentiL1Component} from './lista-pagamenti-l1.component';

describe('ListaPagamentiComponent', () => {
  let component: ListaPagamentiL1Component;
  let fixture: ComponentFixture<ListaPagamentiL1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaPagamentiL1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaPagamentiL1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
