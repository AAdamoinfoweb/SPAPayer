import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RaggruppamentoTipologieComponent } from './raggruppamento-tipologie.component';

describe('RaggruppamentoTipologieComponent', () => {
  let component: RaggruppamentoTipologieComponent;
  let fixture: ComponentFixture<RaggruppamentoTipologieComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RaggruppamentoTipologieComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RaggruppamentoTipologieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
