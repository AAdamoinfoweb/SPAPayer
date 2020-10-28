import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DettaglioAccessoComponent } from './dettaglio-accesso.component';

describe('DettaglioAccessoComponent', () => {
  let component: DettaglioAccessoComponent;
  let fixture: ComponentFixture<DettaglioAccessoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DettaglioAccessoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DettaglioAccessoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
