import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestisciServiziComponent } from './gestisci-servizi.component';

describe('GestisciServiziComponent', () => {
  let component: GestisciServiziComponent;
  let fixture: ComponentFixture<GestisciServiziComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestisciServiziComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestisciServiziComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
