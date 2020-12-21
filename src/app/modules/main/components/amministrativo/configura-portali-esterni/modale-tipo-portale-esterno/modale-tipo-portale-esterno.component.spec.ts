import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModaleTipoPortaleEsternoComponent } from './modale-tipo-portale-esterno.component';

describe('ModaleTipoPortaleEsternoComponent', () => {
  let component: ModaleTipoPortaleEsternoComponent;
  let fixture: ComponentFixture<ModaleTipoPortaleEsternoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModaleTipoPortaleEsternoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModaleTipoPortaleEsternoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
