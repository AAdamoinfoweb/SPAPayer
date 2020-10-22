import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DettaglioSocietaComponent } from './dettaglio-societa.component';

describe('DettaglioSocietaComponent', () => {
  let component: DettaglioSocietaComponent;
  let fixture: ComponentFixture<DettaglioSocietaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DettaglioSocietaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DettaglioSocietaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
