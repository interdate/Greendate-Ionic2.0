import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageBingoPage } from './page-bingo.page';

describe('PageBingoPage', () => {
  let component: PageBingoPage;
  let fixture: ComponentFixture<PageBingoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageBingoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageBingoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
