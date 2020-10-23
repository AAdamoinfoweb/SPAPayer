import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestisciLivelliTerritorialiComponent } from './gestisci-livelli-territoriali.component';

describe('GestisciLivelliTerritorialiComponent', () => {
  let component: GestisciLivelliTerritorialiComponent;
  let fixture: ComponentFixture<GestisciLivelliTerritorialiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestisciLivelliTerritorialiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestisciLivelliTerritorialiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
