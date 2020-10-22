import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AggiungiSocietaComponent } from './aggiungi-societa.component';

describe('AggiungiSocietaComponent', () => {
  let component: AggiungiSocietaComponent;
  let fixture: ComponentFixture<AggiungiSocietaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AggiungiSocietaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AggiungiSocietaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
