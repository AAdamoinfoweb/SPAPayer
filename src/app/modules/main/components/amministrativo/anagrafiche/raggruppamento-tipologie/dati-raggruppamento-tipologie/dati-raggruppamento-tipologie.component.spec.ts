import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatiRaggruppamentoTipologieComponent } from './dati-raggruppamento-tipologie.component';

describe('DatiRaggruppamentoTipologieComponent', () => {
  let component: DatiRaggruppamentoTipologieComponent;
  let fixture: ComponentFixture<DatiRaggruppamentoTipologieComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatiRaggruppamentoTipologieComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatiRaggruppamentoTipologieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
