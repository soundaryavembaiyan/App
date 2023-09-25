import { Component, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpService } from 'src/app/services/http.service';
import { URLUtils } from 'src/app/urlUtils';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
  

@Component({
    selector: 'individual',
    templateUrl: 'individual.component.html',
    styleUrls: ['individual.component.scss']
})
export class IndividualComponent {
    
    constructor(private fb:FormBuilder,
                private httpservice: HttpService,
                private router: Router, private toast: ToastrService,
                private cd: ChangeDetectorRef){}

    submitted:boolean= false;
    confirmEmail: any;

    searchForm: any = this.fb.group({email: ['', [Validators.required,Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)]]})
    sfSubmitted: boolean = false;
    showForm: boolean = false;
    formMode: string = 'request'; //invite
    searchTerm: string = "";
    consumerId: string = "";
    msg: string = "";
    groupList: any[] = [];
    selectedGroups: any[] = [];
    groupFilter: string = "";
    reqError: any = {show: false, msg: ""}
    countryList: any;
    selname: string = "";
    showConfirm: boolean = false;
    showSuccess: boolean = false;
    createdId: string = "";
    searchText:any;
    isDisabled=true;
    createRelationform: any = {};
    countries: any; 
    product = environment.product;


    ngOnInit(){
        this.createRelationform = this.fb.group({
        firstName: [{value: '', disabled: this.isDisabled}, Validators.required],
        country: [{value: '', disabled: this.isDisabled}, Validators.required],
        confirmEmail: [{value: '', disabled: this.isDisabled}, Validators.required, Validators.email],
        lastName:[{value: '', disabled: this.isDisabled}, Validators.required],
        grpsearch:[]});

        this.loadGroups()
        this.loadCountries()

        this.httpservice.sendGetRequest(URLUtils.country).subscribe(
            (res: any) => {
              this.countries = res.data.countries;
              this.countries.shift();
            }
          )
    }
    
    get email() { return this.searchForm.get('email'); }
    get f() { return this.createRelationform.controls; }

    onSubmit(){
        this.submitted = true;
    }

    onGrpSearch(evt: any){
        this.groupFilter = evt.target.value
    }

    search(){
        this.sfSubmitted = true
        this.reqError.show = false;
        if (this.searchForm.invalid) { return; }
        let semail = this.searchForm.value['email']
        this.httpservice.sendPostRequest(URLUtils.relationshipSearchConsumer,
        {"email": semail }).subscribe((resp: any) => {
            if(!resp.error){
                this.consumerId = resp['consumerId']
                this.msg = resp.msg
                let fields = ["firstName", "lastName", "country"]
                fields.forEach((item: string, index: number) => {
                    let ctl = this.createRelationform.controls[item]
                    ctl.setValue(resp[item])
                    ctl.disable()
                })
                this.selname = `${resp['firstName']} ${resp['lastName']}`
                let ce = this.createRelationform.controls['confirmEmail']
                ce.setValue(semail)
                ce.disable()
                this.showForm = true
                this.formMode = 'request'
                this.loadGroups()
                this.selectedGroups = []
            } else {
                this.showForm = true
                this.createRelationform.reset();
                this.formMode = 'invite'
                this.msg = `${semail} - not found. Please fill in the details below to send the relationship invite.`
                this.loadGroups()
                this.selectedGroups = []
                let fields = ["firstName", "lastName", "country", "confirmEmail"]
                fields.forEach((item: string, index: number) => {
                    this.createRelationform.controls[item].enable()
                })

            }
        })
    }

    resetEmailConf(){
        this.createRelationform.controls['confirmEmail'].setErrors(null)
    }

    getConfirmation(){
        let vals = this.createRelationform.value
        if(this.formMode == 'invite'){
            this.selname = `${vals['firstName']} ${vals['lastName']}`
        }
        let semail = this.searchForm.value['email']
        let form = this.createRelationform
        if(form.controls['confirmEmail'].value != semail){
            form.controls['confirmEmail'].setErrors({'mismatch': true})
        }
        this.submitted = true;
        if (this.createRelationform.invalid) { return; }
        this.showConfirm = true
    }
    
    onReset() {
        this.submitted = false;
        this.createRelationform.reset();
        this.showForm = false;
        this.searchForm.controls['email'].setValue("")
    }
    loadGroups(){
        this.httpservice.sendGetRequest(URLUtils.getGroups).subscribe((res: any) => {
            this.groupList = res?.data;
        })
    }
    loadCountries(){
        this.httpservice.sendGetRequest(URLUtils.getCountries).subscribe((res: any) => {
            this.countryList = res.data['countries']
        })

    

    }
    selgrp(grp: any){
        this.selectedGroups.push(grp)
        this.groupList.splice(this.groupList.indexOf(grp), 1);
    }
    restore(grp: any){
        this.selectedGroups.splice(this.selectedGroups.indexOf(grp), 1);
        this.groupList.push(grp)
    }

    successResp(option: string){
        if(option == 'view'){
            //this.router.navigate([`/relationship/view/individuals/${this.createdId}`])
            this.router.navigate([`/relationship/view/individuals`])
        }
        if(option == 'add'){
            this.showSuccess = false
            this.onReset()
            this.msg = ""
            this.selectedGroups =[]
            this.loadGroups()
            this.router.navigate(["/relationship/add/individual"])
        }
    }

    sendReq(){
        this.createRelationform.controls['confirmEmail'].setErrors(null)
        this.submitted = true
        let form = this.createRelationform;
        let semail = this.searchForm.value['email']
        if(form.controls['confirmEmail'].value != semail){
            form.controls['confirmEmail'].setErrors({'mismatch': true})
        }
        if (this.createRelationform.invalid) { return; }
        if(this.formMode == 'request'){
            let body = {"consumerId": this.consumerId,
                        "description": "Description",
                        "groupAcls": this.selectedGroups.map((x) => { return x.id })}
            this.httpservice.sendPostRequest(URLUtils.relationshipConsumerRequest, body).subscribe(
                (resp: any) => { 
                    if(resp.error){
                        this.reqError.show = true
                        this.reqError.msg = resp.msg
                        this.toast.error(resp.msg);
                    } else {
                        this.showConfirm = false
                        this.showSuccess = true
                        this.createdId = resp['createdId']
                    }
                },
                (error: HttpErrorResponse) => {
                    if (error.status === 401 || error.status === 403) {
                      const errorMessage = error.error.msg || 'Unauthorized';
                      this.toast.error(errorMessage);
                      console.log(error);
                    }
                  }
                )
        }
        if(this.formMode == 'invite'){
            var vals = this.createRelationform.value
            let body = {"first_name": vals['firstName'],
                        "last_name": vals['lastName'],
                        "email": vals['confirmEmail'],
                        "country": vals['country'],
                        "group_acls": this.selectedGroups.map((x) => { return x.id })}
            this.httpservice.sendPostRequest(URLUtils.relationshipInviteConsumer, body).subscribe(
                (resp: any) => {
                    if(resp.error){
                        this.reqError.show = true
                        this.reqError.msg = resp.msg
                        this.toast.error(resp.msg);
                    } else {
                        this.showConfirm = false
                        this.showSuccess = true
                        this.createdId = resp['createdId']
                    }
            },
            (error: HttpErrorResponse) => {
                if (error.status === 401 || error.status === 403) {
                  const errorMessage = error.error.msg || 'Unauthorized';
                  this.toast.error(errorMessage);
                  console.log(error);
                }
              }
              )
        }
    }

}
