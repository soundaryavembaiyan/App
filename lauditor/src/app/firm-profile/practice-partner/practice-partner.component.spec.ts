import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PracticePartnerComponent } from './practice-partner.component';

describe('PracticePartnerComponent', () => {
  let component: PracticePartnerComponent;
  let fixture: ComponentFixture<PracticePartnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PracticePartnerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PracticePartnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
