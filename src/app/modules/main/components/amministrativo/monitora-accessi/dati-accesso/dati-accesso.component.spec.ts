import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatiAccessoComponent } from './dati-accesso.component';

describe('DatiAccessoComponent', () => {
  let component: DatiAccessoComponent;
  let fixture: ComponentFixture<DatiAccessoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatiAccessoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatiAccessoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
