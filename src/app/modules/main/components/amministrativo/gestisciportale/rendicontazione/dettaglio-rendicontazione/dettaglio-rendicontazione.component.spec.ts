import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DettaglioRendicontazioneComponent } from './dettaglio-rendicontazione.component';

describe('DettaglioRendicontazioneComponent', () => {
  let component: DettaglioRendicontazioneComponent;
  let fixture: ComponentFixture<DettaglioRendicontazioneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DettaglioRendicontazioneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DettaglioRendicontazioneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
