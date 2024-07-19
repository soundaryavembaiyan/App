import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { HttpService } from 'src/app/services/http.service';
import { URLUtils } from 'src/app/urlUtils';
import {map, startWith} from 'rxjs/operators';
import { ConfirmationDialogService } from 'src/app/confirmation-dialog/confirmation-dialog.service';
import { environment } from 'src/environments/environment';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
 


@Component({
  selector: 'entity', 
  templateUrl: 'entity.component.html',
  styleUrls: ['entity.component.scss'],
  
})
export class EntityComponent implements OnInit {

  constructor(private httpservice: HttpService,
              private fb:FormBuilder,
              private router: Router, private toast: ToastrService, 
              private confirmationDialogService: ConfirmationDialogService,
              private cd: ChangeDetectorRef){}

  product = environment.product;
  relationshipData: any;
  relationshipSubscribe: Subscription = new Subscription;
  submitted: boolean = false;
  createRelationform: any = {}; 
  groupList: any[] = [];
  selectedGroups: any[] = [];
  groupFilter: string = "";
  entityList: any[] = [];
  selectedEntity = new FormControl("");
  selectedEntityObject = {entityId: ""};
  filteredEntities: any;
  
  showForm: boolean = false;
  formMode: string = 'request';
  msg: string = "";
  countryList: any;
  reqError: any = {show: false, msg: ""}
  seid: string = "";
  emptySearchError: boolean = false;
  showConfirm: boolean = false;
  showSuccess: boolean = false;
  selname: string = "";
  createdId: string = "";
  isDisabled=true;
  countries: any;
  body: any;
  closeMode: boolean = false;


  get f() { return this.createRelationform.controls; }

  onOptSel(event: any){
    this.selectedEntityObject = event.option.value
    this.selectedEntity.setValue(event.option.value.name)
  }


  ngOnInit(): void {
    this.createRelationform = this.fb.group({
      entityName: [{ value: '', disabled: this.isDisabled }, Validators.required],
      email: [{ value: '', disabled: this.isDisabled }, Validators.required],
      confirmEmail: [{ value: '', disabled: this.isDisabled }, Validators.required],
      contactPerson: [{ value: '', disabled: this.isDisabled }, Validators.required],
      contactPhone: [{ value: '', disabled: this.isDisabled }, Validators.required, Validators.pattern('^[0-9]*$')],
      grpsearch: [''],
      country: [{ value: '', disabled: this.isDisabled }, Validators.required],
      //selectedEntity:['',Validators.pattern(this.NoWhitespaceRegExp)]
    }),
      //console.log('CR',this.createRelationform)

      this.loadEntityList();
    //this.loadEntityLauditor();

    this.filteredEntities = this.selectedEntity.valueChanges.pipe(
      startWith(''),
      map(value => {
        let filterValue = value;
        if (typeof (value) == 'string') {
          filterValue = value.toLowerCase()
        }
        return this.entityList.filter(option => option.name.toLowerCase().includes(filterValue));
      })
    );
    this.loadCountries()
    //Get Country API
    this.httpservice.sendGetRequest(URLUtils.country).subscribe(
      (res: any) => {
        this.countries = res.data.countries;
        this.countries.shift();
      }
    )
  }

  ngOnDestroy() {
    if (this.relationshipSubscribe) {
        this.relationshipSubscribe.unsubscribe();
    }
  }

  onReset(){
    /*
    this.confirmationDialogService.confirm('Confirm', 'Changes you made will not be saved. Do you want to continue?' ,true, 'Yes', 'No')
    .then((confirmed) => {
        if (confirmed) {
            
        }
    });
    */
    this.createRelationform.reset();
    this.selectedEntity.setValue(''); // Clear the input value
    this.showForm = false;
    this.reqError.show = false;
    this.msg = '';
    this.closeMode = true; //remove the formMode msg & selectedGrps
  }

  onSubmit(){
    this.submitted = true
  }

  onGrpSearch(evt: any){
      this.groupFilter = evt.target.value
  }
  
  searchEntity(){
    this.reqError.show = false;
    this.closeMode = false;
    if(this.selectedEntityObject.entityId.length > 0){
      this.emptySearchError = false;
      this.httpservice.sendGetRequest(URLUtils.relationshipEntityDetails(this.selectedEntityObject)).subscribe((res: any) => {
        if(!res.error){
          ['entityName', 'email', 'contactPhone', 'contactPerson', 'country'].forEach((item: any, index: number) => {
            let ctl = this.createRelationform.controls[item]
            ctl.setValue(res.data[item])
            ctl.disable()
          })
          this.createRelationform.controls['confirmEmail'].setValue(res.data['email'])
          this.formMode = 'request'
          this.showForm = true
          this.selname = res.data['entityName']
          this.msg = `Entity ${res.data['entityName']} Found!`
          this.loadGroups()
          this.selectedEntity.setValue("")
          this.selectedGroups = []
          this.seid = this.selectedEntityObject['entityId']
          this.selectedEntityObject = {entityId: ""};
        }
      })
    } else {
        if(this.selectedEntity.value === ' '){
          this.emptySearchError = true;
          this.msg = ` `
          return;
        }
        // this.emptySearchError = false;
        ['entityName','email','contactPhone', 'contactPerson', 'country', 'confirmEmail'].forEach((item: any, index: number) => {
              this.createRelationform.controls[item].setValue("")
              this.createRelationform.controls[item].enable()
        })
        if(this.selectedEntity.value !== ' '){
        this.emptySearchError = false;
        this.formMode = 'invite'
        this.selname = this.createRelationform.value['entityName']
        this.showForm = true
        this.msg = `${this.selectedEntity.value} - not found. Please fill in the details below to send the relationship invite.`
        }
        this.loadGroups()
        this.selectedGroups = []
        this.selectedEntity.setValue("")
    }
  }

  loadGroups(){
      this.httpservice.sendGetRequest(URLUtils.getGroups).subscribe((res: any) => {
          this.groupList = res?.data;
          this.cd.detectChanges()
      })
  }
  
  loadEntityList(){
    this.httpservice.sendGetRequest(URLUtils.relationshipSearchEntities).subscribe((res: any) => {
        this.entityList = res?.data;
        this.cd.detectChanges()
    })
  }

  // loadEntityLauditor(){
  //   this.httpservice.sendGetRequest(URLUtils.relationshipSearchLauditor).subscribe((res: any) => {
  //       this.entityList = res?.data;
  //       this.cd.detectChanges()
  //   })
  // }

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
      //this.router.navigate([`/relationship/view/business/${this.createdId}`])
      this.router.navigate([`/relationship/view/business`])
    }
   if(option == 'add'){
       this.showSuccess = false
       this.onReset()
       this.msg = ""
       this.selectedGroups = []
       this.loadGroups()
       this.router.navigate(["/relationship/add/entity"])
    }
  }

  getConfirmation() {
    let val = this.createRelationform.value
    //console.log('val',val)
    if (this.formMode == 'invite') {
      this.submitted = true
      this.selname = val['entityName']
      // Check if confirm email matches
      if (val.email !== val.confirmEmail && val.confirmEmail != '') {
        this.createRelationform.controls['confirmEmail'].setErrors({ 'mismatch': true });
      }
      else{
        //this.createRelationform.controls['confirmEmail'].setErrors({ 'required': true });
      }

      if (val.confirmEmail == '' || val.contactPerson == '' || val.country == '' || val.email == '' || val.entityName == '') {
        this.submitted = true
        this.toast.error(' Please verify all your information before sending the invite.')
        return;
      }
    }
    //this.submitted = true
    if (this.createRelationform.invalid) { return; }
    this.showConfirm = true
  }

  sendReq(){
      this.submitted = true
      if (this.createRelationform.invalid){return; }
      if(this.formMode == 'request'){
         let body = {"entityId": this.seid,
                     "description": "Description",
                     "groupAcls": this.selectedGroups.map((x) => { return x.id })}
        this.httpservice.sendPostRequest(URLUtils.relationshipEntityRequest, body).subscribe(
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
        //console.log('1Body',this.body)
      }
      if(this.formMode == 'invite'){
         let val = this.createRelationform.value
         let body = {"fullname": val['entityName'],
                     "email": val['email'],
                     "country": val['country'],
                     "contact_phone": val['contactPhone'],
                     "contact_person": val['contactPerson'],
                     "group_acls": this.selectedGroups.map((x) => { return x.id })}
         this.httpservice.sendPostRequest(URLUtils.relationshipInviteEntity, body).subscribe(
            (resp: any) => {
              if(resp.error){
                this.reqError.show = false
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
          })
        //console.log('2reerr',this.body)
      }
    }

    restrictSpaces(event: any) {
      let inputValue: string = event.target.value;
      if (inputValue.length > 0 && inputValue.charAt(0) === ' ') {
        inputValue = inputValue.substring(1);
        event.target.value = inputValue;
        return;
      }
    }

}
