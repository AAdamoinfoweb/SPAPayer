import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestisciBannerComponent } from './gestisci-banner.component';

describe('GestisciBannerComponent', () => {
  let component: GestisciBannerComponent;
  let fixture: ComponentFixture<GestisciBannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestisciBannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestisciBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
