import { ActivatedRoute, Router } from '@angular/router';
import { URLUtils } from 'src/app/urlUtils';
import { HttpService } from 'src/app/services/http.service';
import { EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Component, Injectable } from '@angular/core';
import { ConfirmationDialogService } from 'src/app/confirmation-dialog/confirmation-dialog.service';
import { ConfirmationDialogComponent } from 'src/app/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-practice-partner',
  templateUrl: './practice-partner.component.html',
  styleUrls: ['./practice-partner.component.scss']
})
@Injectable()
export class PracticePartnerComponent {
  @Input() member: any;
  selectedValue: string = "view";
  selectedMatter: string = "practicepartner";
  selectedValueButton: string = "yes";

  isDisplay:boolean=true;
  isDisabled: any;
  disable = false;
  myForm: any;

  selectedUser: any;
  activeTab = '';
  searchText: string = '';
  partner: any;
  partnerns: any;
  arg: any;
  members: any[]=[]

  isReverse:boolean=false;
  partnerList: any[] = [];

  selectedMember:any;
  isEdit:boolean=false;
  isAdd:boolean = false;
  searchValue:string = '';
  submitted = false;
 
  minLength:any;
  maxLength:any;
  link:any;
  namePattern = /^[A-Z][A-z\s]*$/; ///^[A-Z][a-z]*$/;
  emailPattern = /^[a-za-z0-9._%+-]+@[a-za-z0-9.-]+\.[a-za-z]{2,}$/;
  //emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
 
  //email:any;
  payload: any;
  data: any;
 
 

  constructor(private fb: FormBuilder,
    private httpservice: HttpService, 
    private router: Router,
    private toast: ToastrService,
    private activeRoute: ActivatedRoute,
    private confirmationDialogService: ConfirmationDialogService) { }


  ngOnInit() {
    //Get Practice partner API
    this.getData()

    this.myForm = this.fb.group({
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      designation: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(10), Validators.maxLength(10)]],
      email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
      practice: ['', [Validators.required]],
    })


  }

  getData() {
    this.httpservice.sendGetRequest(URLUtils.getPartners).subscribe(
      (res: any) => {
        if (res.errors == false) {
          //this.members = res.data.members;
          this.members = res.data.members;
          this.members.reverse();
          this.data = res;
        }

      }
    )
  }

  editMember(member: any) {
    this.selectedMember = member;
    this.isEdit = true;
  }

  addMember(){
    this.isAdd = true;
  }

  addPartner() {

    this.submitted = true;
    
    var addPartner = this.myForm.value

    let payload = {
      "first_name": addPartner.first_name,
      "last_name": addPartner.last_name,
      "designation": addPartner.designation,
      "phone": addPartner.phone,
      "email": addPartner.email,
      "practice": addPartner.practice

    }

    if (this.myForm.valid) {
      this.httpservice.sendPostRequest(URLUtils.addPartners, payload).subscribe((res: any) => {

        if (res.error == false) {
          this.toast.success("Details Added Successfully");
          this.getData();
          this.backToInfo();
        }
        else if (res.error == true) {
          this.toast.error(res.msg);
        }
      })

    }

   
  }

  deletePartner(member: any) {
    //let isDeleted: boolean = false;
    this.selectedMember = member;
    this.confirmationDialogService.confirm('Confirmation', ' Are you sure! Do you want to Delete this Partner?!', true, 'Yes', 'No')
      .then((confirmed) => {
        if (confirmed) {
          this.httpservice.sendDeleteRequest(URLUtils.deletePartners(this.selectedMember)).subscribe((res: any) => {

            if (!res.error) {

              if (confirmed) {
                this.toast.success("Practice Partner Deleted Successfully");
                this.getData();
                this.backToInfo();
              }
              else {
                this.toast.error(res.msg);
              }
            }
          });
        }
      })
  }

  editPartner(member: any) {
    this.submitted = true;
    this.isEdit = true;

    var addPartner = this.myForm.value

    let payload = {
      "first_name": addPartner.first_name,
      "last_name": addPartner.last_name,
      "designation": addPartner.designation,
      "phone": addPartner.phone,
      "email": addPartner.email,
      "practice": addPartner.practice
    }


    if (this.myForm.valid) {
      this.httpservice.sendPutRequest(URLUtils.updatePartners(this.selectedMember), payload).subscribe((res: any) => {
        if (res.errors == false) {
          this.toast.success("Details Updated Successfully");

          this.getData();
          this.backToInfo();

        }
        else if (res.errors == true) {
          this.toast.error(res.msg);
        }

      })

    }

  }

  sortingFile(val: any) {
    this.isReverse = !this.isReverse;
    if (this.isReverse) {
      this.members = this.members?.sort((p1: any, p2: any) => (p1[val] < p2[val]) ? 1 : (p1[val] > p2[val]) ? -1 : 0);
      
    } else {
      this.members = this.members?.sort((p1: any, p2: any) => (p1[val] > p2[val]) ? 1 : (p1[val] < p2[val]) ? -1 : 0);
      
    }
  }

  onClick(value: string) {
    this.selectedMatter = value;
  }

  isActive(value: string) {
    this.selectedValue = value;
    this.selectedValueButton = value;
  }

  onKeydown(event: any) {
    if (event.key === "Enter" || event.type === "click") {
      this.httpservice.sendGetEmailRequest(URLUtils.searchMessages({ "token": localStorage.getItem('TOKEN'), "rows": 10, "search": this.searchText })).subscribe(
        (res: any) => {

        })
    }
  }

  onReset() {
    this.submitted = false;
    this.myForm.reset();
    this.isEdit = false;
    this.isAdd = false;
  }
  
  backToInfo(){
    this.selectedMember = true
    this.isEdit = false
    this.isAdd = false
 }


}


