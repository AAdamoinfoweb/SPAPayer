import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatiParametroComponent } from './dati-parametro.component';

describe('DatiParametriComponent', () => {
  let component: DatiParametroComponent;
  let fixture: ComponentFixture<DatiParametroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatiParametroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatiParametroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
