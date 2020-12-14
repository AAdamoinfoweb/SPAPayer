import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltroIuvSenzaBonificoComponent } from './filtro-iuv-senza-bonifico.component';

describe('FiltroIuvSenzaBonificoComponent', () => {
  let component: FiltroIuvSenzaBonificoComponent;
  let fixture: ComponentFixture<FiltroIuvSenzaBonificoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltroIuvSenzaBonificoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltroIuvSenzaBonificoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
