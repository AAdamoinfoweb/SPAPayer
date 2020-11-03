import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatiEnteComponent } from './dati-ente.component';

describe('DatiEnteComponent', () => {
  let component: DatiEnteComponent;
  let fixture: ComponentFixture<DatiEnteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatiEnteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatiEnteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
