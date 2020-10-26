import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltroGestioneEntiComponent } from './filtro-gestione-enti.component';

describe('FiltroGestioneEntiComponent', () => {
  let component: FiltroGestioneEntiComponent;
  let fixture: ComponentFixture<FiltroGestioneEntiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltroGestioneEntiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltroGestioneEntiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
