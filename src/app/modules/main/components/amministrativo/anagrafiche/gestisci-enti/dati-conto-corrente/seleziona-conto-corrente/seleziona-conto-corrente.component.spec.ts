import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelezionaContoCorrenteComponent } from './seleziona-conto-corrente.component';

describe('SelezionaContoCorrenteComponent', () => {
  let component: SelezionaContoCorrenteComponent;
  let fixture: ComponentFixture<SelezionaContoCorrenteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelezionaContoCorrenteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelezionaContoCorrenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
