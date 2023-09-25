import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { HttpService } from '../../services/http.service';
import { URLUtils } from '../../urlUtils';

@Component({
  selector: 'app-forgotpwd',
  templateUrl: './forgotpwd.component.html',
  styleUrls: ['./forgotpwd.component.scss']
})
export class ForgotpwdComponent {

  @Output() event = new EventEmitter<any>();

  constructor(private formBuilder: FormBuilder,
              private httpservice: HttpService) { }

  submitted = false;
  show_password = false
  show_confirmpassword = false
  emailForm: any = FormGroup;
  showFirms: boolean = false;
  msg: string = "";
  firms: any[] = [];
  multiFirm: boolean = false;
 

  ngOnInit() {
    this.emailForm = this.formBuilder.group({email: ['', Validators.required],
                                             firm: ['']})
  }

  get f() { return this.emailForm.controls; }

  cancelml(){
    this.event.emit({'msg': 'forgot-cancel'})
  }

  onSubmit(){
    this.msg = ""
    this.submitted = true
    let form = this.emailForm
    if(form.invalid) { return; }
    let data: any = {"email": form.value['email']}
    if(this.showFirms){
      data['userid'] = form.value['firm']
    }
    this.httpservice.sendPutRequest(URLUtils.forgotPwd, data).subscribe(
      (resp: any) => {
        if(resp['error']){
          if(!this.showFirms){
            this.showFirms = true
            this.firms = resp['firms']['lauditor']
          }
        } else {
           this.event.emit({'msg':'forgot-success'})
        }
    })
  }

}
