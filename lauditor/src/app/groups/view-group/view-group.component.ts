import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { URLUtils } from './../../urlUtils';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GroupModel } from '../group.model';
import { NavigationExtras, Router, ActivatedRoute } from '@angular/router';
import { ModalService } from 'src/app/model/model.service';
import { environment } from 'src/environments/environment';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
 

@Component({
  selector: 'app-view-group',
  templateUrl: './view-group.component.html',
  styleUrls: ['./view-group.component.scss'],
})
export class ViewGroupComponent implements OnInit {
  
  editData: any;
  viewItems: any;
  editGroupView: any;
  editGroupform: any = FormGroup;
  submitted = false;
  postGroup: any = GroupModel;
  members: any = [];
  editGroupItem: any;
  // boolean flags 
  editMember: boolean = false;
  editGroupShow: boolean = false;
  editGroupHead: boolean = false;
  DeleteGroup: boolean = false;
  groupInfo: boolean = false;
  showActivityLog: boolean = false;
  highlight: string = '';
  selectedGrpName: string = "";
  searchText: any = '';
  isDesc: boolean = false;

  product = environment.product;
  categoryName: any = 'Dashboard';
  name: string = "";
  created: string = "";
  role: string = "GH";
  roleId: string = "GH";
  
  constructor(private httpservice: HttpService,
              private formBuilder: FormBuilder,
              private toast: ToastrService, 
              private router: Router,
              private activeRoute: ActivatedRoute,
              private modal: ModalService,
              private cd: ChangeDetectorRef) { }
  
  ngOnInit(): void {
    this.getData();
    this.editGroupform = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      checkbox: []
    });

    this.activeRoute.params.subscribe(params => {
      this.highlight = params['highlight'];
    });


      var role = localStorage.getItem("role")
      if (role != null) { this.roleId = role }
      if (role == 'SU') { this.role = 'SuperUser' }
      if (role == 'AAM') { this.role = 'Admin' }
      if (role == 'TM') { this.role = 'Team Member' }
      if (role == 'GH') { this.role = 'Group Head' }

  }
  
  get f() { return this.editGroupform.controls; }

  editGroup(item: any) {
    this.editGroupShow = true;
    this.editGroupView = JSON.parse(JSON.stringify(item));
    this.editGroupItem = item;
    //console.log('editGroupShow', this.editGroupShow)
  }

  sort(property: any) {
    this.isDesc = !this.isDesc; //change the direction    
    // this.column = property;
    let direction = this.isDesc ? 1 : -1;
    this.viewItems.sort(function (a: any, b: any) {
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
    if (this.editGroupform.invalid) {
      return;
    }
    this.editGroupform.removeControl('checkbox');
    this.postGroup = this.editGroupform.value;
    this.httpservice.sendPatchRequest(URLUtils.updateGroup(this.editGroupItem), this.postGroup)
      .subscribe((res: any) => {
        this.getData();
        this.openModel('group-update-success')
      }, (error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403) {
          const errorMessage = error.error.msg || 'Unauthorized';
          this.toast.error(errorMessage);
          //console.log(error);
        }
  
      }
     )
    this.editGroupShow = false;
  }

  editGroupMembers(item: any) {
    this.editData = item;
    this.editMember = true;
    this.selectedGrpName = item['name']    
  }
  
  changePracticeHead(item: any) {
    this.editGroupHead = true;
    this.editData = item;
    this.selectedGrpName = item['name'];
  }
  
  deleteGroup(item: any) {
    this.DeleteGroup = true;
    this.editData = item;
    this.selectedGrpName = item['name'];
  }
  
  onReset() {
    this.submitted = false;
    this.editGroupform.reset();
    this.editGroupShow = false;
  }
  
  activityLog(grp: any){
    this.editData = grp
    this.showActivityLog = true
  }

  getData() {
    this.httpservice.sendGetRequest(URLUtils.getGroups).subscribe((res: any) => {
      this.viewItems = res?.data;
      console.log('viewItems',this.viewItems)
    })
  }
  isSelected() {

  }
  closeModal(id: any) {
        this.modal.close(id);
  }
  
  openModel(id: any) {
        this.modal.open(id);
  }

  onChildEvent(msg: string){
    if(msg == 'edit-members-done'){
      this.editMember = false
      this.modal.open('group-upmem-success')
      this.getData()
    }
    if(msg == 'edit-members-close'){
      this.editMember = false
    }
    if(msg == 'edit-group-head-close'){
      this.editGroupHead = false
    }
    if(msg == 'edit-group-head-done'){
      this.editGroupHead = false
      this.modal.open('group-gh-success')
      this.getData()
    }
    if(msg == 'group-delete-close'){
      this.DeleteGroup = false
    }
    if(msg == 'group-delete-done'){
      this.DeleteGroup = false
      this.modal.open('group-del-success')
      this.getData()
    }
  }

}
