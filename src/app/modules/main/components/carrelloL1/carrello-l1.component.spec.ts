import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CarrelloL1Component} from './carrello-l1.component';

describe('CarrelloComponent', () => {
  let component: CarrelloL1Component;
  let fixture: ComponentFixture<CarrelloL1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarrelloL1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarrelloL1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
