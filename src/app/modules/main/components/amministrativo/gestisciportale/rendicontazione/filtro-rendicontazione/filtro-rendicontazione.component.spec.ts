import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltroRendicontazioneComponent } from './filtro-rendicontazione.component';

describe('FiltroRendicontazioneComponent', () => {
  let component: FiltroRendicontazioneComponent;
  let fixture: ComponentFixture<FiltroRendicontazioneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltroRendicontazioneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltroRendicontazioneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
