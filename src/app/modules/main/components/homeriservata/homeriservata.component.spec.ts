import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {HomeriservataComponent} from './homeriservata.component';

describe('HomeriservataComponent', () => {
  let component: HomeriservataComponent;
  let fixture: ComponentFixture<HomeriservataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeriservataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeriservataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
