import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IMieiPagamentiComponent } from './i-miei-pagamenti.component';

describe('IMieiPagamentiComponent', () => {
  let component: IMieiPagamentiComponent;
  let fixture: ComponentFixture<IMieiPagamentiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IMieiPagamentiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IMieiPagamentiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
