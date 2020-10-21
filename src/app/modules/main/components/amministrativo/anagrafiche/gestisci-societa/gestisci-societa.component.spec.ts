import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestisciSocietaComponent } from './gestisci-societa.component';

describe('GestisciSocietaComponent', () => {
  let component: GestisciSocietaComponent;
  let fixture: ComponentFixture<GestisciSocietaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestisciSocietaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestisciSocietaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
