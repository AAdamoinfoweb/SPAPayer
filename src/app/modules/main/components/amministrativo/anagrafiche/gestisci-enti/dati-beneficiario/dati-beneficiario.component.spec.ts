import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatiBeneficiarioComponent } from './dati-beneficiario.component';

describe('DatiBeneficiarioComponent', () => {
  let component: DatiBeneficiarioComponent;
  let fixture: ComponentFixture<DatiBeneficiarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatiBeneficiarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatiBeneficiarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
