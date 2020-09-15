import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompilaNuovoPagamentoComponent } from './compila-nuovo-pagamento.component';

describe('CompilaNuovoPagamentoComponent', () => {
  let component: CompilaNuovoPagamentoComponent;
  let fixture: ComponentFixture<CompilaNuovoPagamentoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompilaNuovoPagamentoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompilaNuovoPagamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
