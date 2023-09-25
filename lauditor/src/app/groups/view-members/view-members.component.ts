import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { URLUtils } from 'src/app/urlUtils';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GroupModel } from '../group.model';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { environment } from 'src/environments/environment';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
 



@Component({
  selector: 'app-view-members',
  templateUrl: './view-members.component.html',
  styleUrls: ['./view-members.component.scss']
})
export class ViewMembersComponent implements OnInit {
  
  product = environment.product;
  viewMembers:any;
  createMemberForm: any = FormGroup;
  submitted = false;
  postMember: any = GroupModel;
  memData: any = {};
  showEditMemForm: boolean = false;
  showGroupAccessForm: boolean = false;
  showSuccessModal: boolean = false;
  searchText: any = '';
  isDesc: boolean = false;
  memberCount: any;

  constructor(private formBuilder: FormBuilder,
              private httpService: HttpService,
              public dialog: MatDialog, private toast: ToastrService, 
              private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.createMemberForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      email:['',Validators.required],
      emailConform:['',Validators.required],
      currency:['',Validators.required]
    });
    this.getMembers()
  }

  // convenience getter for easy access to form fields
  get f() { return this.createMemberForm.controls; }

  sort(property: any) {
    this.isDesc = !this.isDesc; //change the direction    
    // this.column = property;
    let direction = this.isDesc ? 1 : -1;
    this.viewMembers.sort(function (a: any, b: any) {
      let ap = a[property];
      let bp = b[property];
      if(typeof(ap) == 'string'){ ap = ap.toLowerCase() }
      if(typeof(bp) == 'string'){ bp = bp.toLowerCase() }
      if (ap < bp) {
        return -1 * direction;
      }
      else if (a[property] > b[property]) {
        return 1 * direction;
      }
      else {
        return 0;
      }
    });
  }
  onSubmit() {
    this.submitted = true;
    if (this.createMemberForm.invalid) {
      return;
    }
    this.postMember = this.createMemberForm.value;
    this.httpService.sendPostRequest(URLUtils.updateMember, this.postMember).subscribe((res: any) => {
      //console.log(res);
    },(error: HttpErrorResponse) => {
      if (error.status === 401 || error.status === 403) {
        const errorMessage = error.error.msg || 'Unauthorized';
        this.toast.error(errorMessage);
        console.log(error);
      }
    })
  }

  getMembers(){
    this.httpService.sendGetRequest(URLUtils.getMembers).subscribe((res:any)=>{
        this.viewMembers = res.data.users;
        this.memberCount = res.data
        console.log('count',this.memberCount?.count)
        console.log('total',this.memberCount?.total)
    })
  }

  onReset() {
    this.submitted = false;
    this.createMemberForm.reset();
  }

  del(member: any){
    this.memData = member
  }
  
  deleteMember(){
    this.httpService.sendDeleteRequest(URLUtils.deleteMember(this.memData)).subscribe((res: any) => {
      this.getMembers()
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
  
  UpdateGroupMembers(member:any){

  }
  
  groupAccess(member: any){
    this.memData = member
    this.showGroupAccessForm = true
  }
  
  editMem(member: any){
    this.memData = member
    this.showEditMemForm = true
  }

  onChildEvent(msg: string){
    if(msg == 'group-access-close'){
      this.showGroupAccessForm = false
    }
    if(msg == 'group-access-done'){
      this.showGroupAccessForm = false
      this.getMembers()
    }
    if(msg == 'edit-member-close'){
      this.showEditMemForm = false
    }
    if(msg == 'edit-member-done'){
      this.showEditMemForm = false
      this.showSuccessModal = true
      this.getMembers()
    }
  }
  
  resetPwd(team:any){
    this.httpService.sendPostRequest(URLUtils.resetMemberPassword, {"memberId": this.memData.id}).subscribe((res: any) => {
      this.getMembers()
    },
    (error: HttpErrorResponse) => {
      if (error.status === 401 || error.status === 403) {
        const errorMessage = error.error.msg || 'Unauthorized';
        this.toast.error(errorMessage);
        console.log(error);
      }
    })
  }
}

