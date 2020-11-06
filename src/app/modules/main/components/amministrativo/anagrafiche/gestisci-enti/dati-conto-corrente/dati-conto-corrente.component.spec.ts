import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatiContoCorrenteComponent } from './dati-conto-corrente.component';

describe('DatiContoCorrenteComponent', () => {
  let component: DatiContoCorrenteComponent;
  let fixture: ComponentFixture<DatiContoCorrenteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatiContoCorrenteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatiContoCorrenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
