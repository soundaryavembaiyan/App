import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FirmnameLoginComponent } from './firmname-login.component';

xdescribe('FirmnameLoginComponent', () => {
  let component: FirmnameLoginComponent;
  let fixture: ComponentFixture<FirmnameLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FirmnameLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FirmnameLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
