import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DettaglioLivelloTerritorialeComponent } from './dettaglio-livello-territoriale.component';

describe('DettaglioLivelloTerritorialeComponent', () => {
  let component: DettaglioLivelloTerritorialeComponent;
  let fixture: ComponentFixture<DettaglioLivelloTerritorialeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DettaglioLivelloTerritorialeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DettaglioLivelloTerritorialeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
