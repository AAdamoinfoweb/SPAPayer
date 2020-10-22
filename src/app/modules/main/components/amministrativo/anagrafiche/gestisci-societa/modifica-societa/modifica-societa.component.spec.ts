import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificaSocietaComponent } from './modifica-societa.component';

describe('ModificaSocietaComponent', () => {
  let component: ModificaSocietaComponent;
  let fixture: ComponentFixture<ModificaSocietaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModificaSocietaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModificaSocietaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
