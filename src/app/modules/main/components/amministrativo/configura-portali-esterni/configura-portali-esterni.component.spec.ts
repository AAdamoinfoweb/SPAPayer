import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfiguraPortaliEsterniComponent } from './configura-portali-esterni.component';

describe('ConfiguraPortaliEsterniComponent', () => {
  let component: ConfiguraPortaliEsterniComponent;
  let fixture: ComponentFixture<ConfiguraPortaliEsterniComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfiguraPortaliEsterniComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfiguraPortaliEsterniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
