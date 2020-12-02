import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatiRendicontazioneComponent } from './dati-rendicontazione.component';

describe('DatiRendicontazioneComponent', () => {
  let component: DatiRendicontazioneComponent;
  let fixture: ComponentFixture<DatiRendicontazioneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatiRendicontazioneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatiRendicontazioneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
