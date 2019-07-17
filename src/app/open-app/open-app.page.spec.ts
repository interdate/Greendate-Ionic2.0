import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenAppPage } from './open-app.page';

describe('OpenAppPage', () => {
  let component: OpenAppPage;
  let fixture: ComponentFixture<OpenAppPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenAppPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenAppPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
