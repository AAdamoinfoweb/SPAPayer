import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatiNuovoPagamentoComponent } from './dati-nuovo-pagamento.component';

describe('DatiNuovoPagamentoComponent', () => {
  let component: DatiNuovoPagamentoComponent;
  let fixture: ComponentFixture<DatiNuovoPagamentoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatiNuovoPagamentoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatiNuovoPagamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
