import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatiTransazioneComponent } from './dati-transazione.component';

describe('DatiTransazioneComponent', () => {
  let component: DatiTransazioneComponent;
  let fixture: ComponentFixture<DatiTransazioneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatiTransazioneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatiTransazioneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
