import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatiPortaleEsternoComponent } from './dati-portale-esterno.component';

describe('DatiPortaleEsternoComponent', () => {
  let component: DatiPortaleEsternoComponent;
  let fixture: ComponentFixture<DatiPortaleEsternoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatiPortaleEsternoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatiPortaleEsternoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
