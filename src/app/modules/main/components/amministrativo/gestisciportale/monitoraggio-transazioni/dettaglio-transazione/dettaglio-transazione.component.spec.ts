import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DettaglioTransazioneComponent } from './dettaglio-transazione.component';

describe('DettaglioTransazioneComponent', () => {
  let component: DettaglioTransazioneComponent;
  let fixture: ComponentFixture<DettaglioTransazioneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DettaglioTransazioneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DettaglioTransazioneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
