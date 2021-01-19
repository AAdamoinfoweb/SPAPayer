import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltroConfiguraPortaliEsterniComponent } from './filtro-configura-portali-esterni.component';

describe('FiltroConfiguraPortaliEsterniComponent', () => {
  let component: FiltroConfiguraPortaliEsterniComponent;
  let fixture: ComponentFixture<FiltroConfiguraPortaliEsterniComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltroConfiguraPortaliEsterniComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltroConfiguraPortaliEsterniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
