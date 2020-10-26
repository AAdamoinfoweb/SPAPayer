import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatiLivelloTerritorialeComponent } from './dati-livello-territoriale.component';

describe('DatiLivelloTerritorialeComponent', () => {
  let component: DatiLivelloTerritorialeComponent;
  let fixture: ComponentFixture<DatiLivelloTerritorialeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatiLivelloTerritorialeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatiLivelloTerritorialeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
