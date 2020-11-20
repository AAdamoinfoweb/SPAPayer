import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatiDestinatarioComponent } from './dati-destinatario.component';

describe('DatiDestinatarioComponent', () => {
  let component: DatiDestinatarioComponent;
  let fixture: ComponentFixture<DatiDestinatarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatiDestinatarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatiDestinatarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
