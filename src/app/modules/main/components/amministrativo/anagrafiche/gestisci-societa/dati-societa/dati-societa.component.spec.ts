import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatiSocietaComponent } from './dati-societa.component';

describe('DatiSocietaComponent', () => {
  let component: DatiSocietaComponent;
  let fixture: ComponentFixture<DatiSocietaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatiSocietaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatiSocietaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
