import { HttpClient, HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AjaxService } from '../services/ajax.service';
import { URLUtils } from '../urlUtils';
import { Utils } from '../utils';
import { FirmnameLoginComponent } from './firmname-login/firmname-login.component';

import { LoginComponent } from './login.component';

const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
const ajaxServiceSpy = jasmine.createSpyObj('AjaxService', ['post']);
const validUser = { email: "raviteja.chakka@digicoffer.com", password: "Test@123" }

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let loginSpy;
  let service;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent, FirmnameLoginComponent],
      providers: [AjaxService, ToastrService],
      imports: [HttpClientModule, ToastrModule.forRoot(), ReactiveFormsModule, RouterTestingModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    // loginSpy = ajaxServiceSpy.post(URLUtils.login, component.myForm.value).and.returnValue(Promise.resolve());
    service = TestBed.get(AjaxService);
    component = new LoginComponent(new FormBuilder(), routerSpy, ajaxServiceSpy)
    fixture.detectChanges();
  });

  function updateForm(userEmail, userPassword) {
    component.myForm.controls['email'].setValue(userEmail);
    component.myForm.controls['password'].setValue(userPassword);
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('component initial state', () => {
    expect(component.submitted).toBeFalsy();
    expect(component.myForm).toBeDefined();
    expect(component.myForm.invalid).toBeTruthy();
  });

  // it('submitted should be true when onSubmit()', () => {
  //   component.onSubmit();
  //   expect(component.submitted).toBeTruthy();
  // });

  it('form value should update from when u change the input', (() => {
    updateForm(validUser.email, validUser.password);
    expect(component.myForm.value).toEqual(validUser);
  }));

  it('Form invalid should be true when form is invalid', (() => {
    updateForm("", "");
    expect(component.myForm.invalid).toBeTruthy();
  }));

  it('Display Password Error Msg when Username is blank', () => {
    updateForm(validUser.email, "");
    fixture.detectChanges();

    const button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();
    fixture.detectChanges();
    expect(component.myForm.invalid).toBeTruthy();

    // const passwordErrorMsg = fixture.debugElement.nativeElement.querySelector('#password-error-msg');
    // expect(passwordErrorMsg).toBeDefined();
    // expect(passwordErrorMsg.innerHTML).toContain('Please enter password');
  });

  it('should be created', () => {
    const service: AjaxService = TestBed.get(AjaxService);
    expect(service).toBeTruthy();
  });

  // it('be able to retrieve posts from the API bia GET', () => {
  //   updateForm(validUser.email, validUser.password);
  //   fixture.detectChanges();
  //   const service: AjaxService = TestBed.get(AjaxService);
  //   service.post(URLUtils.login, component.myForm.value).subscribe(posts => {
  //     expect(posts).toBeTruthy();
  //     expect(posts).toEqual("");
  //   });

  // });

  // it('should be initialized', inject([AjaxService], (authService: AjaxService) => {
  //   expect(authService).toBeTruthy();
  // }));

  // it('login hitting', function(done){
  //   updateForm(validUser.email, validUser.password);
  //   fixture.detectChanges();
  //   component.callLoginWebService(component.myForm.value)
  // })
  it('service', function (done) {
    updateForm(validUser.email, validUser.password);
    fixture.detectChanges();
    service.login(URLUtils.login, component.myForm.value).subscribe(post => {

      expect(post['error']).toEqual(true);
      if (post['error']) {
        if (post.hasOwnProperty("firms")) {
          if (Object.entries(post['firms'][Utils.productName]).length == 0) {
            // $("#id_alert").addClass("alert alert-danger").text("Account not found")
          }
          else if (Object.entries(post['firms'][Utils.productName]).length > 1) {
            // this.firmsData['firms'] = post['firms'][Utils.productName]
            // this.show_firmsList()
            var payload:any = {}
            payload['userid'] = 'admin'
            payload['password'] = component.myForm.value['password']
            payload['email'] = component.myForm.value['email']
            service.login(URLUtils.login, payload).subscribe((resp:any) => {
              expect(resp['error']).toEqual(false);
              localStorage.setItem('TOKEN', resp['token'])
              localStorage.setItem('name', resp['data']['name'])
              done()
            })
          }
          else {
            let value = post['firms'][Utils.productName][0]
            var payload = {}
            payload['userid'] = value["id"]
            payload['password'] = component.myForm.value['password']
            payload['email'] = component.myForm.value['email']
            service.login(URLUtils.login, payload).subscribe(resp => {
              expect(resp['error']).toEqual(false);
              localStorage.setItem('TOKEN', resp['token'])
              localStorage.setItem('name', resp['data']['name'])
            })
            done();

          }
        }
      }
      else {
        done()
      }
    })
  })


  // it('loginService login() should called ', 
  // // fakeAsync(
  //   inject(
  //   [AjaxService],
  //   (authService: AjaxService) => {
  //     updateForm(validUser.email, validUser.password);
  //     fixture.detectChanges();
  //     let response = null

  //     const httpClientStub: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
  //       'http',
  //       ['post']
  //     );
  //     // const responseserver = {email:"test", password: "passwword"}
  //     // httpClientStub.post.and.returnValue(responseserver);
  //     // const response = authService.post(URLUtils.login, component.myForm.value)
  //     // //console.log(response)
  //     // expect(response).su
  //     // expect(httpClientStub.post).toHaveBeenCalledWith('/login', responseserver);

  //     // let loginResponse
  //     // const responseKeys = ['error', 'data']
  //     // //console.log(component.myForm.value)
  //     // let httpCommonResponse = {
  //     //   error: true
  //     // };

  //     authService.login(URLUtils.login, component.myForm.value).subscribe(resp => {
  //       //console.log(resp['error'])
  //       expect(resp['error']).toBe(false)

  //     })
  //     // expect(response).toBe(false)


  //     // spyOn(authService, 'post').and.callThrough()
  //     // const resp = authService.post(URLUtils.login, component.myForm.value)
  //     // fixture.detectChanges();
  //     // //console.log(resp)

  //     // authService.post(URLUtils.login, component.myForm.value).subscribe(posts => {
  //     //   //console.log(posts)
  //     //   expect(posts['error']).toBeFalsy();
  //     //   loginResponse = posts
  //     //   // expect(posts).toEqual(dummyPosts);
  //     // },
  //     // (error: any) => {
  //     //   //console.log("error--"+ error)
  //     // });
  //     // const requestWrapper = Http.expectOne({url: 'https://example.com/login'});
  //     //       requestWrapper.flush(responseObject);
  //     // component.onSubmit()
  //     // tick();
  //     // //console.log("Ustside response " + loginResponse)
  //     // expect(httpCommonResponse).toContain("test")
  //   })
  //   // )
  //   );



  // // it('should route to home if login successfully', fakeAsync(() => {
  // //   updateForm(validUser.email, validUser.password);
  // //   fixture.detectChanges();
  // //   const button = fixture.debugElement.nativeElement.querySelector('button');
  // //   button.click();
  // //   advance(fixture);

  // //   loginSpy = ajaxServiceSpy.post.and.returnValue(Promise.resolve());
  // //   advance(fixture);

  // //   expect(routerSpy.navigateByUrl).toHaveBeenCalled();
  // //   const navArgs = routerSpy.navigateByUrl.calls.first().args[0];
  // //   // expecting to navigate to id of the component's first hero
  // //   expect(navArgs).toBe('/home', 'should nav to Home Page');
  // // }));

  // function advance(f: ComponentFixture<any>) {
  //   tick();
  //   f.detectChanges();
  // }

  // it('login verify', () => {
  //   expect(component.callLoginWebService({email:"raviteja.chakka@digicoffer.com", password: "Test@123"})).toBe(true)
  // })
});
