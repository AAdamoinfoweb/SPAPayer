import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatiNotificaComponent } from './dati-notifica.component';

describe('DatiNotificaComponent', () => {
  let component: DatiNotificaComponent;
  let fixture: ComponentFixture<DatiNotificaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatiNotificaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatiNotificaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
