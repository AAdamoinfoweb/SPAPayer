import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestisciAttivitaPianificateComponent } from './gestisci-attivita-pianificate.component';

describe('GestisciAttivitaPianificateComponent', () => {
  let component: GestisciAttivitaPianificateComponent;
  let fixture: ComponentFixture<GestisciAttivitaPianificateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestisciAttivitaPianificateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestisciAttivitaPianificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
