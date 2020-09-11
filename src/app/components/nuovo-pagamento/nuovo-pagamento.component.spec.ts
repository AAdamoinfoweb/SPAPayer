import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NuovoPagamentoComponent } from './nuovo-pagamento.component';

describe('NuovoPagamentoComponent', () => {
  let component: NuovoPagamentoComponent;
  let fixture: ComponentFixture<NuovoPagamentoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NuovoPagamentoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NuovoPagamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
