import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import { URLUtils } from '../../urlUtils';
import { Utils } from '../../utils';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-firmname-login',
  templateUrl: './firmname-login.component.html',
  styleUrls: ['./firmname-login.component.css']
})
export class FirmnameLoginComponent implements OnInit {
  
  @Input('parentData') parentData: any;
  @Output() event = new EventEmitter<any>();
  
  submitted: boolean = false;
  firms: any[] = [];

  myForm = this.formBuilder.group({
    firmname: ['select', [Validators.required]],
    password: ['', [Validators.required]]
  })

  constructor(private formBuilder: FormBuilder,
              private httpservice: HttpService,
              private router: Router) { }

  ngOnInit() {
    this.firms = this.parentData['firms']
  }

  get f() { return this.myForm.controls; }

  cancelml() {
    this.event.emit({"msg":"firm-close"})
  }

  initSession(resp: any){
    if (resp['data']['account_status'] != null) {
      if (resp['data']['account_status'] == 'disable') {
        $("#id_alert").text("Your acccount has disabled, Please contact admin")
        return
      }
    }
    if (resp['data']['password_mode'] != null) {
      if (resp['data']['password_mode'] == 'reset') {
        // Let login component handle password reset.
        let d = resp['data']
        d['enteredPwd'] = this.myForm.value['password']
        d['firmId'] = this.myForm.value['firmname']
        this.event.emit({"msg":'resetpwd', "data": d})
      } else {
        if (resp['data']['plan'].toLowerCase() == Utils.productName) {
          localStorage.setItem('plan', resp['data']['plan'].toUpperCase())
        }
        else {
          $("#id_alert").text("Account not found")
          return
        }
        if(resp['data']['id'] != null) {
          localStorage.setItem('user_id', resp['data']['id'])
        }
        else {
          localStorage.removeItem('user_id')
        }
        localStorage.setItem('TOKEN', resp['token'])
        localStorage.setItem('name', resp['data']['name'])
        localStorage.setItem('role', resp['data']['role'])
        localStorage.setItem('isadmin', resp['data']['admin'])
        localStorage.setItem('jid', resp['data']['uid'])
        localStorage.setItem('firm_name', resp['data']['firm_name'])
        this.router.navigate(['/grid'])
      }
    }
  }

  login(data:any) {
    this.httpservice.sendPostRequest(URLUtils.login, data).subscribe(
      (resp:any) => {
        if(!resp['error']){
          if (resp['data']['plan'].toLowerCase() == Utils.productName){
            this.initSession(resp)
          } 
        } else {
          if (resp['plan'] != undefined && resp['plan'] != Utils.productName){
              $("#id_alert").text("Account not found")
          } else{
              $("#id_alert").text(resp['msg'])
          }
        }
      }
    )
  }
   

  onSubmit() {
    this.submitted = true
    if (this.myForm.invalid) { return; }
    let payload: any = {"email": this.parentData['email']}
    payload['userid'] = this.myForm.value['firmname']
    payload['password'] = this.myForm.value['password']
    this.login(payload)
  }

}
