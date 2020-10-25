import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DettaglioBannerComponent } from './dettaglio-banner.component';

describe('DettaglioBannerComponent', () => {
  let component: DettaglioBannerComponent;
  let fixture: ComponentFixture<DettaglioBannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DettaglioBannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DettaglioBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
