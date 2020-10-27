import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormLivelloTerritorialeComponent } from './form-livello-territoriale.component';

describe('DettaglioLivelloTerritorialeComponent', () => {
  let component: FormLivelloTerritorialeComponent;
  let fixture: ComponentFixture<FormLivelloTerritorialeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormLivelloTerritorialeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormLivelloTerritorialeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
