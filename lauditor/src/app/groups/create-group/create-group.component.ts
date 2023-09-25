import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/services/http.service';
import { GroupModel } from '../group.model';
import { URLUtils } from './../../urlUtils';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.scss']
})
export class CreateGroupComponent implements OnInit {

  product = environment.product;

  successMsg: string = '';
  isShowDiv = false;
  registerForm: any = FormGroup;
  submitted = false;
  postGroup: any = GroupModel;
  membersList: any;
  groupHeadsList: any;
  members: any = [];
  selectedGroupHead: any = [];
  isChecked: boolean = false;
  searchText: any = '';
  ghSearchText: any = '';
  isMembers: boolean = false;
  isGroupInfo: boolean = true;
  isGroupHead: boolean = false;
  hideAddMember: boolean = true;
  displayMembers: boolean = false;
  successModel: boolean = false;
  successGrpName: string = "";
  showMemList: boolean = true;
  showSelMem: boolean = false;  
  error:string = '';
  
  constructor(private formBuilder: FormBuilder,
              private httpService: HttpService,
              private toast: ToastrService,
              private router: Router) {}

  ngOnInit() {
    this.getMembers();
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      checkbox: []
    });
  }

  getMembers() {
    this.httpService.sendGetRequest(URLUtils.getMembers).subscribe((res: any) => {
      this.membersList = res?.data?.users;
      this.membersList.forEach((item: any) => {
        item.isSelected = false;
      });
    })
  }
  isAllSelected() {
    this.membersList = this.membersList.forEach((item: any) => {
      return item.isSelected == true;
    })
  }
  // convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }

  onSubmit(am: boolean){
    let errorMsgsArr=[];
    this.submitted = true;
    if (this.registerForm.invalid) { return; }
    this.registerForm.removeControl('checkbox');
    this.postGroup = this.registerForm.value;
    let id = this.selectedGroupHead?.map((obj: any) => obj.id)
    this.postGroup.groupHead = id.toString();
    this.postGroup.members = this.members?.map((obj: any) => obj.id);
    if(!am){
      this.httpService.sendPostRequest(URLUtils.addGroup, this.postGroup).subscribe(
        (res: any) => {
        this.successModel = true;
        this.successGrpName = this.postGroup['name']
        },(err: HttpErrorResponse) => {

          if (err.status === 401 || err.status === 403) {
            const errorMessage = err.error.msg || 'Unauthorized';
            this.toast.error(errorMessage);
            console.log(err);
          }

        errorMsgsArr = err?.error?.errors;
        if(errorMsgsArr.length>0){
          let obj=errorMsgsArr.find((obj:any) => obj.field === "name");
          this.error=obj?.msg;
          this.isGroupInfo=true;
          this.isMembers=false;
          this.isGroupHead=false;
        }
        });
        
    } else{
      this.isMembers = true;
      this.isGroupInfo = false;
    }
  }

  successResp(action: string){
    if(action == 'view'){
      //this.router.navigate([`/view-group/${this.successGrpName}`])
      this.router.navigate([`/view-group`])
    }
    if(action == 'add'){
      this.registerForm.reset()
      this.selectedGroupHead = []
      this.members = []
      this.showMemList = true
      this.showSelMem = false
      this.successModel = false
      this.isGroupInfo = true
      this.isGroupHead = false
      this.submitted = false
    }
  }

  onReset() {
    this.submitted = false;
    this.router.navigate([`/view-group`])
  }
  removeMember(mem: any) {
    let index = this.members.indexOf(mem)
    this.members.splice(index, 1);
  }
  addMemberslist() {
    if(this.showMemList){
      this.showMemList = false
      this.showSelMem = true
    } else {
      this.isGroupHead = true
      this.isMembers = false
      this.selectedGroupHead = []
    }
  }
  backToMembers() {
    this.isGroupInfo = false;
    this.isMembers = true;
    this.isGroupHead = false;
  }
  backToGroupInfo() {
    if(this.showMemList){
      this.isGroupInfo = true;
      this.isMembers = false;
      this.isGroupHead = false;
    } else {
      this.showMemList = true;
      this.showSelMem = false;
    }
  }
  closeClickMembers() {
    this.isMembers = false;
    this.router.navigate(['/view-group'])
  }
  removeAllMembers() {
    this.members = [];
  }
  switchToMlist(){
    this.showMemList = true
    this.showSelMem = false
  }
  switchToSlist(){
    this.showMemList = false
    this.showSelMem = true
  }
  memberSelectSwitch(action: string) {
    if(action = "selmem"){
      this.showSelMem = true
    } else if(action = "addGroup"){
      this.showMemList = true
      this.showSelMem = false
    }
  }
  
  selectMember(member: any, event: any) {
    let index = this.members.indexOf(member)
    if(event.target.checked && index == -1){
      this.members.push(member);
    } else {
      this.members.splice(index, 1);
    }
  }
  
  selectGpHead(data: any, member: any) {
    this.selectedGroupHead = [];
    this.selectedGroupHead.push(data);
  }
  onSearchChange() {  
    this.error="";
  }
}
