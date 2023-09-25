import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidationErrors } from '@angular/forms';
import { HttpService } from 'src/app/services/http.service';
import { URLUtils } from 'src/app/urlUtils';
import { GroupModel } from '../group.model';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-create-members',
  templateUrl: './create-members.component.html',
  styleUrls: ['./create-members.component.scss']
})
export class CreateMembersComponent implements OnInit {

  //isShowDiv = false;
  product = environment.product;
  createMemberForm: any = FormGroup;
  submitted = false;
  postMember: any = GroupModel;
  memDetails: boolean = true;
  assignToGrp: boolean = false;
  groupList: any[] = [];
  selectedGroups: any[] = [];
  showForm: boolean = true;
  showMemlist: boolean = false;
  successModel: boolean = false;
  successMemName: string = "";
  successGrpCount: string = "";
  searchText: string = "";
  mismatch: boolean = false;
  currencyList = ["USDollar(USD)",
                  "Euro(EUR)",
                  "JapaneseYen(JPY)",
                  "Pound(GBP)",
                  "AustralianDollar(AUD)",
                  "CanadianDollar(CAD)",
                  "SwissFranc(CHF)",
                  "KuwaitiDinar(KWD)",
                  "BahrainiDinar(BHD)", 
                  "IndianRupee(INR)" ]
  msg: string | undefined;
  
  constructor(private formBuilder: FormBuilder,
              private httpService: HttpService, 
              private toast: ToastrService,
              private router: Router) { }

  ngOnInit() {
    this.createMemberForm = this.formBuilder.group({
      name: ['', Validators.required],
      designation: ['', Validators.required],
      email:['', [Validators.required, Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)]],
      emailConfirm:['', [Validators.required, Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)]],
      currency:['USDollar(USD)',Validators.required],
      defaultRate:['',Validators.required],
    });
    this.loadGroups()
  }

  // convenience getter for easy access to form fields
  get f() { return this.createMemberForm.controls; }


  resetEmailConf(){
    this.createMemberForm.controls['emailConfirm'].setErrors(null)
  }

  onSubmit() {
    this.submitted = true;
    this.mismatch = false;

    console.log('form', this.createMemberForm)
    let form = this.createMemberForm
    if(form.value['email'] != form.value['emailConfirm']){
      form.controls['emailConfirm'].setErrors({'mismatch': true})
    }
    if (this.createMemberForm.invalid) { return; }
    var payload = this.createMemberForm.value;
    payload["groups"] = this.selectedGroups?.map((obj: any) => obj.id);
    this.httpService.sendPostRequest(URLUtils.addMember, payload).subscribe((res: any) => {
          this.successModel = true;
          this.successMemName = payload['name']
          this.successGrpCount = payload['groups'].length

    }, (error: HttpErrorResponse) => {
      if (error.status == 400) {
        this.backToInfo()
        this.mismatch = true
      }
      if (error.status === 401 || error.status === 403) {
        const errorMessage = error.error.msg || 'Unauthorized';
        this.toast.error(errorMessage);
        console.log(error);
      }

    })
  }
  
  
  closeForm(){

  }

  loadGroups(){
     this.httpService.sendGetRequest(URLUtils.getGroups).subscribe((res: any) => {
      this.groupList = res?.data;
    })
  }
  onSearch(elm: any){
    this.searchText = elm.target.value
  }
  backToInfo(){
     this.showMemlist = false
     this.showForm = true
  }
  onReset() {
    this.submitted = false;
    this.createMemberForm.reset();
    this.router.navigate(['/view-member'])
  }

  selMembers(){
    let form = this.createMemberForm
    if(form.value['email'] != form.value['emailConfirm']){
      form.controls['emailConfirm'].setErrors({'mismatch': true})
    }
    this.submitted = true;
    if (this.createMemberForm.invalid) {return; }
    this.showForm = false
    this.showMemlist = true
  }
  
  selectGrp(grp: any, checked: boolean){
    let index = this.selectedGroups.indexOf(grp)
    if(checked && index == -1){
      this.selectedGroups.push(grp)
    } else {
      this.selectedGroups.splice(index, 1)
    }
  }
  successResp(action: string){
    if(action == 'view'){
       this.router.navigate(['/view-member'])
    }
    if(action == 'add'){
      this.successMemName = ""
      this.successGrpCount = ""
      this.successModel = false
      this.showForm = true
      this.createMemberForm.reset()
      this.selectedGroups = []
      this.showMemlist = false
    }
  }
  
}




