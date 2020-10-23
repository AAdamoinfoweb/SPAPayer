import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltroGestioneLivelliTerritorialiComponent } from './filtro-gestione-livelli-territoriali.component';

describe('FiltroGestioneLivelliTerritorialiComponent', () => {
  let component: FiltroGestioneLivelliTerritorialiComponent;
  let fixture: ComponentFixture<FiltroGestioneLivelliTerritorialiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltroGestioneLivelliTerritorialiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltroGestioneLivelliTerritorialiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
