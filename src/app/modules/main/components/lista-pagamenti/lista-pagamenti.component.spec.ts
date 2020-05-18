import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaPagamentiComponent } from './lista-pagamenti.component';

describe('ListaPagamentiComponent', () => {
  let component: ListaPagamentiComponent;
  let fixture: ComponentFixture<ListaPagamentiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaPagamentiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaPagamentiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
