import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatiPendenzaComponent } from './dati-pendenza.component';

describe('DatiPendenzaComponent', () => {
  let component: DatiPendenzaComponent;
  let fixture: ComponentFixture<DatiPendenzaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatiPendenzaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatiPendenzaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
