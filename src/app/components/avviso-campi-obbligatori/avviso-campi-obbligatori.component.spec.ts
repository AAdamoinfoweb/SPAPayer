import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvvisoCampiObbligatoriComponent } from './avviso-campi-obbligatori.component';

describe('AvvisoCampiObbligatoriComponent', () => {
  let component: AvvisoCampiObbligatoriComponent;
  let fixture: ComponentFixture<AvvisoCampiObbligatoriComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvvisoCampiObbligatoriComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvvisoCampiObbligatoriComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
