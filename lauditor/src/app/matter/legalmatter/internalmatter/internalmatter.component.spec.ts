/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { InternalmatterComponent } from './internalmatter.component';

describe('InternalmatterComponent', () => {
  let component: InternalmatterComponent;
  let fixture: ComponentFixture<InternalmatterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InternalmatterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalmatterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
