import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltroGestioneSocietaComponent } from './filtro-gestione-societa.component';

describe('FiltroGestioneSocietaComponent', () => {
  let component: FiltroGestioneSocietaComponent;
  let fixture: ComponentFixture<FiltroGestioneSocietaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltroGestioneSocietaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltroGestioneSocietaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
