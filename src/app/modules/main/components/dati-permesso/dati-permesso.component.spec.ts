import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatiPermessoComponent } from './dati-permesso.component';

describe('DatiPermessoComponent', () => {
  let component: DatiPermessoComponent;
  let fixture: ComponentFixture<DatiPermessoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatiPermessoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatiPermessoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
