import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltroGestioneBannerComponent } from './filtro-gestione-banner.component';

describe('FiltroGestioneBannerComponent', () => {
  let component: FiltroGestioneBannerComponent;
  let fixture: ComponentFixture<FiltroGestioneBannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltroGestioneBannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltroGestioneBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
