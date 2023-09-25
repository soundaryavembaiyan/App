import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AjaxService } from '../services/ajax.service';
import { ConfirmationDialogService } from '../../../../commonlib/confirmation-dialog/confirmation-dialog.service';
import { URLUtils } from '../urlUtils';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  const validUser = { fullname: "ravi", email: "raviteja.chakka@digicoffer.com", contact_person: "Ravi", contact_phone: "9999999999" }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      providers: [AjaxService, ToastrService, ConfirmationDialogService],
      imports: [ToastrModule.forRoot(), HttpClientModule, RouterTestingModule, ReactiveFormsModule],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function updateForm(fullName, email, contactPerson, contactPhone) {
    component.myForm.controls['fullname'].setValue(fullName);
    component.myForm.controls['email'].setValue(email);
    component.myForm.controls['contact_person'].setValue(contactPerson);
    component.myForm.controls['contact_phone'].setValue(contactPhone);
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('component initial state', () => {
    expect(component.submitted).toBeFalsy();
    expect(component.myForm).toBeDefined();
    expect(component.myForm.invalid).toBeTruthy();
  });

  it('form value should update from when u change the input', (() => {
    updateForm(validUser.fullname, validUser.email, validUser.contact_person, validUser.contact_phone);
    expect(component.myForm.value).toEqual(validUser);
  }));

  it('Form invalid should be true when form is invalid', (() => {
    updateForm("", "", "", "");
    expect(component.myForm.invalid).toBeTruthy();
  }));

  it('Display Password Error Msg when Username is blank', () => {
    updateForm("", validUser.email, "", "");
    fixture.detectChanges();

    const button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();
    fixture.detectChanges();
    expect(component.myForm.invalid).toBeTruthy();
  });

  it('onSubmit', () => {
    updateForm(validUser.fullname, validUser.email, validUser.contact_person, validUser.contact_phone);
    fixture.detectChanges();
    component.onSubmit()
    fixture.detectChanges()
    expect(component.submitted).toBeTruthy();
    const el = fixture.nativeElement.querySelector('#id_alert');
    expect(el.innerText.toString()).toEqual('')
  });

});
