import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RendicontazioneComponent } from './rendicontazione.component';

describe('RendicontazioneComponent', () => {
  let component: RendicontazioneComponent;
  let fixture: ComponentFixture<RendicontazioneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RendicontazioneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RendicontazioneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
