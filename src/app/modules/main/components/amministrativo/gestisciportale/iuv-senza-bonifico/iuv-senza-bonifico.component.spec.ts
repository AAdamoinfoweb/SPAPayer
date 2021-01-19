import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IuvSenzaBonificoComponent } from './iuv-senza-bonifico.component';

describe('IuvSenzaBonificoComponent', () => {
  let component: IuvSenzaBonificoComponent;
  let fixture: ComponentFixture<IuvSenzaBonificoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IuvSenzaBonificoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IuvSenzaBonificoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
