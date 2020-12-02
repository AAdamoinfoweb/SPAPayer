import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DettaglioPendenzaComponent } from './dettaglio-pendenza.component';

describe('DettaglioPendenzaComponent', () => {
  let component: DettaglioPendenzaComponent;
  let fixture: ComponentFixture<DettaglioPendenzaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DettaglioPendenzaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DettaglioPendenzaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
