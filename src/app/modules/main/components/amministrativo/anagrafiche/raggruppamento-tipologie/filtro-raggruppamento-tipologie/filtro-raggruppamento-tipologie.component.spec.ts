import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltroRaggruppamentoTipologieComponent } from './filtro-raggruppamento-tipologie.component';

describe('FiltroRaggruppamentoTipologieComponent', () => {
  let component: FiltroRaggruppamentoTipologieComponent;
  let fixture: ComponentFixture<FiltroRaggruppamentoTipologieComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltroRaggruppamentoTipologieComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltroRaggruppamentoTipologieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
