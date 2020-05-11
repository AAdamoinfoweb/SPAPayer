import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PresaincaricopagamentoComponent } from './presaincaricopagamento.component';

describe('PresaincaricopagamentoComponent', () => {
  let component: PresaincaricopagamentoComponent;
  let fixture: ComponentFixture<PresaincaricopagamentoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PresaincaricopagamentoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PresaincaricopagamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
