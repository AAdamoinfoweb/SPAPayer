import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulazioneComponent } from './schedulazione.component';

describe('SchedulazioneComponent', () => {
  let component: SchedulazioneComponent;
  let fixture: ComponentFixture<SchedulazioneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchedulazioneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedulazioneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
