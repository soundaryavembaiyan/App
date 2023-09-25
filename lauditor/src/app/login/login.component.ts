import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Utils } from '../utils';
import { URLUtils } from '../urlUtils';
import { HttpService } from '../services/http.service';
import { environment } from '../../environments/environment';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
	
	submitted = false;
	firmsShow = true;
	firmsData:any = { firms: []}
	showPassword = false;
	showMultiLogin: boolean = false;
	showResetForm: boolean = false;
	showLoginForm: boolean = true;
	showForgotForm: boolean = false;
	resetData: any = {};
  	myForm: any = FormGroup;
  	msg: string = ""
	product = environment.product;
	//tag = 'Lauditor';

	constructor(private formBuilder: FormBuilder,
				private router: Router,
				private httpservice: HttpService){ }
	
	ngOnInit() {
		localStorage.removeItem("TOKEN")
		const alert_msg:any=localStorage.getItem('alert_msg')
		if (localStorage.getItem('alert_msg') != null) {
			this.msg = alert_msg
			localStorage.removeItem('alert_msg')
		}
		else if (localStorage.getItem('error_alert_msg') != null) {
			const error_alert_msg:any=localStorage.getItem('error_alert_msg')
			this.msg = error_alert_msg
			localStorage.removeItem('error_alert_msg')
		}
		this.myForm = this.formBuilder.group({
      		email:['', [Validators.required, Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)]],
			password: ['', Validators.required],
			plan: [this.product]
		})
	}

	get f() { return this.myForm.controls; }

	initSession(resp:any) {
		if (resp['data']['account_status'] != null) {
			if (resp['data']['account_status'] == 'disable') {
				this.msg = "Your acccount has disabled, Please contact admin"
				return
			}
		}
		if (resp['data']['password_mode'] != null) {
			if (resp['data']['password_mode'] == 'reset') {
				this.resetData = resp['data'];
				this.resetData['enteredPwd'] = this.myForm.value['password'];
				this.showResetForm = true;
				this.showMultiLogin = false
				this.showLoginForm = false
				return
			}
		}
		if (resp['data']['plan'].toLowerCase() == Utils.productName) {
			localStorage.setItem('plan', resp['data']['plan'].toUpperCase())
		}
		else {
			this.msg = "Account not found"
			return
		}

		if (resp['data']['id'] != null) {
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
		// localStorage.setItem('user_id', resp['data']['user_id'])
		this.router.navigate(['/grid'])
	}
	 onSubmit() {
		this.submitted = true
		this.msg = ""
	 	if (this.myForm.invalid) { return; }
		this.callLoginWebService(this.myForm.value)
	}

	callLoginWebService(data:any) {
		this.httpservice.sendPostRequest(URLUtils.login, data).subscribe(
			(resp:any) => {
				if(!resp['error']){
					if (resp['data']['plan'].toLowerCase() == Utils.productName){
						this.initSession(resp)
					} else {
						this.msg = "Account not found"
					}
				} else {
					if (resp.hasOwnProperty("firms")) {
						let firms = Object.entries(resp['firms'][Utils.productName])
						if(firms.length == 0) {
							this.msg = "Account not found"
						}
						else if (firms.length > 1) {
							this.firmsData['firms'] = resp['firms'][Utils.productName]
							this.firmsData['email'] = this.myForm.value['email']
							this.showFirmsList()
						} else {
							let value = resp['firms'][Utils.productName][0]
							var payload:any;
							payload['userid'] = value["id"]
							payload['password'] = this.myForm.value['password']
							payload['email'] = this.myForm.value['email']
							this.callLoginWebService(payload)
						}
					} else {
						if (resp['plan'] != undefined && resp['plan'] != Utils.productName)
							this.msg = "Account not found"
						else
							this.msg = resp['msg']
					}
				}
			}
		)
	 }

	showFirmsList() {
		this.showLoginForm = false
		this.showMultiLogin = true
		this.showResetForm = false
	}

	forgotPwd(){
		this.showLoginForm = false
		this.showForgotForm = true
	}

	onChildEvent(msg: any){
		if(msg["msg"] == 'firm-close') {
			this.showMultiLogin = false
			this.showResetForm = false
			this.showLoginForm = true
		}
		if(msg["msg"] == 'firm-done') {
			
		}
		if(msg["msg"] == 'resetpwd'){
			this.resetData = msg['data']
			this.showResetForm = true
			this.showMultiLogin = false
			this.showLoginForm = false
		}
		if(msg["msg"] == 'reset-success'){
			this.showLoginForm = true
			this.showResetForm = false
			this.showMultiLogin = false
			this.msg = "Password reset successfull! Please login"
		}
		if(msg['msg'] == 'forgot-success'){
			this.showLoginForm = true
			this.showForgotForm = false
			this.msg = "Please check your email for temporary password."
		}
		if(msg['msg'] == 'forgot-cancel'){
			this.showLoginForm = true
			this.showForgotForm = false
		}
	}

	 change_password_type() {
		this.showPassword = !this.showPassword
		$("#toggle-password").removeClass()
		if (this.showPassword)
			$("#toggle-password").addClass("fa fa-eye-slash toggle-password")
		else
			$("#toggle-password").addClass("fa fa-eye toggle-password")
	 }


}
