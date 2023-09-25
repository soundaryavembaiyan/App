import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from "@angular/router";
// import { CustomValidator } from '../customvalidator';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-resetpwd',
  templateUrl: './resetpwd.component.html',
  styleUrls: ['./resetpwd.component.scss']
})
export class ResetpwdComponent implements OnInit {

  @Input('parentData') parentData: any;
  @Output() event = new EventEmitter<any>();

  constructor(private formBuilder: FormBuilder,
              private httpservice: HttpService,
              private router: Router) { }

  submitted = false;
  show_password = false
  show_confirmpassword = false
  myForm: any = FormGroup;
  msg: string = "Please reset your password!"
 

  ngOnInit() {
    this.myForm = this.formBuilder.group({password: ['', Validators.required],
                                         confirmPassword: ['', Validators.required]})
  
  }

  get f() { return this.myForm.controls; }

  onSubmit(){
    this.msg = ""
    this.submitted = true
    let form = this.myForm
    if(form.value['password'] != form.value['confirmPassword']){
      form.controls['confirmPassword'].setErrors({'mismatch': true})
    }
    if(this.myForm.invalid) { return; }
    let url = `/password/${this.parentData['pk']}/user/${this.parentData['user_id']}/update`
    let data = {"field": "password",
                "old_password": this.parentData['enteredPwd'],
                "password": form.value['password']}
    this.httpservice.sendPutRequest(url, data).subscribe(
      (resp: any) => {
        if(!resp['error']){
           this.event.emit({"msg": "reset-success", "resp": resp['msg']})
        }
    })
  }

}
