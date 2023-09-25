import { ConfirmationDialogService } from './../../../../confirmation-dialog/confirmation-dialog.service';
import { Router } from '@angular/router';
import { URLUtils } from 'src/app/urlUtils';
import { HttpService } from 'src/app/services/http.service';
import { MatterService } from './../../../matter.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
  

@Component({

  selector: 'general-matter-info',
  templateUrl: 'general-matter-info.component.html',
  styleUrls: ['general-matter-info.component.scss']
})
export class GeneralMatterInfoComponent implements OnInit {
  @Input() type: string = 'create';
  @Input() data: any;
  @Output() childButtonEvent = new EventEmitter();
  events: string[] = [];
  advicates: any
  generalForm: any = FormGroup;
  desc: any;
  //memberDetail:any=FormGroup;
  submitted = false;
  opponent_advocates: any = [];
  pipe = new DatePipe('en-US');
  isEdit: boolean = false;
  selectedPriority: string = "High";
  selectedStatus: string = "Active";
  editeMatterInfo: any;
  minDateEnd: any = new Date();
  Documents: any;
  readonly NoWhitespaceRegExp: RegExp = new RegExp("\\S");

  constructor(private fb: FormBuilder, private oa: FormBuilder, private matterService: MatterService,private toast: ToastrService,
    private httpService: HttpService, private router: Router, private confirmationDialogService: ConfirmationDialogService) { }

  ngOnInit() {
    this.generalForm = this.fb.group({
      title: ['',[Validators.required,Validators.pattern(this.NoWhitespaceRegExp)]],
      matterNumber: ['',[ Validators.required,Validators.pattern(this.NoWhitespaceRegExp)]],
      startdate: [''],
      closedate: [''],
      description: [''],
      matterType: [''],
      status: ['Active'],
      priority: ['High']
    })
    if (this.data) {
      this.generalForm.patchValue(this.data);
      if (this.data?.startdate && this.data.startdate != "") {
        this.generalForm.controls["startdate"].setValue(new Date(this.data.startdate));
        this.minDateEnd = new Date(this.data.startdate)
      }
      if (this.data?.closedate && this.data.closedate != "")
        this.generalForm.controls["closedate"].setValue(new Date(this.data.closedate));
      this.selectedStatus = this.data.status;
      this.selectedPriority = this.data.priority;
    }
    if (window.location.pathname.indexOf("matterEdit") > -1) {
      this.matterService.editGeneralMatterObservable.subscribe((result: any) => {
        if (result) {
          this.editeMatterInfo = result;
          this.isEdit = true;
          this.generalForm.patchValue(this.editeMatterInfo);
          if (this.editeMatterInfo?.startdate && this.editeMatterInfo.startdate != "") {
            this.generalForm.controls["startdate"].setValue(new Date(this.editeMatterInfo.startdate));
            this.minDateEnd = new Date(this.editeMatterInfo.startdate)
          }
          if (this.editeMatterInfo?.closedate && this.editeMatterInfo.closedate != "")
            this.generalForm.controls["closedate"].setValue(new Date(this.editeMatterInfo.closedate));
          this.selectedStatus = this.editeMatterInfo.status;
          this.selectedPriority = this.editeMatterInfo.priority;
          this.getDocuments();
        }
      })
    }
  }

  get f() {
    return this.generalForm.controls;
  }
  // get member_name(){
  //   return this.generalForm.memberDetail.get('member_name') as FormControl;
  // }
  receiveAutoMsgHandler(details: any) {
    this.advicates = details;
    //console.log(" this.advicates------------>" + this.advicates)
  }
  getPriority(data: any) {
    this.generalForm.controls.priority.patchValue(data ? data : "High");

  }
  getStatus(data: any) {
    this.generalForm.controls.status.patchValue(data ? data : "Active");
  }
  addOpponenteAdvicate() {

  }
  onSubmit() {
    this.submitted = true;
    if (this.generalForm.invalid) {
      return;
    }
    // if(!this.isEdit){
    // this.generalForm.value.startdate = this.pipe.transform(this.generalForm.value.startdate, 'dd-MM-yyyy');
    // this.generalForm.value.closedate = this.pipe.transform(this.generalForm.value.closedate, 'dd-MM-yyyy');
    // }
    //this.generalForm.value.status = this.generalForm.status == "INVALID" || this.generalForm.status == "VALID" ? "Active" : this.generalForm.status;
    // this.generalForm.value.priority = this.generalForm?.priority ? this.generalForm.priority : "High";
    if (this.isEdit) {
      let data = {
        "title": this.generalForm.value.title,
        "matter_number": this.generalForm.value.matterNumber,
        "startdate": this.pipe.transform(this.generalForm.value.startdate, 'dd-MM-yyyy'),
        "closedate": this.pipe.transform(this.generalForm.value.closedate, 'dd-MM-yyyy'),
        "description": this.generalForm.value.description,
        "matter_type": this.generalForm.value.matterType,
        "priority": this.generalForm.value.priority,
        "status": this.generalForm.value.status,
        "affidavit_isfiled": "na",
        "affidavit_filing_date": "",
        "clients": this.editeMatterInfo?.clients.map((obj: any) => ({ "id": obj.id, "type": obj.type })),
        "group_acls": this.editeMatterInfo.groupAcls,
        "members": this.editeMatterInfo?.members.map((obj: any) => ({ "id": obj.id })),
        "documents": this.Documents?.map((obj: any) => ({
          "docid": obj.docid,
          "doctype": obj.doctype,
          "user_id": obj.user_id
        }))
      }
      //console.log(data)

      this.httpService.sendPutRequest(URLUtils.updateGeneralMatter(this.editeMatterInfo.id), data).subscribe((res: any) => {
        if (!res.error) {
          this.confirmationDialogService.confirm('Success', 'Congratulations! You have successfully updated the matter information for ' + this.generalForm.value.title,false, 'View Matter List', 'Cancel', true)
            .then((confirmed) => {
              if (confirmed) {
                this.router.navigate(['/matter/generalmatter/view']);
              }
            })
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
    else {
      this.childButtonEvent.emit(this.generalForm.value);
    }
    // this.isGroups=true;
  }


  addEvent(type: string, event: any) {
    //  this.events.push(`${type}: ${event.value}`);
    //console.log("Date --->" + this.events);
  }
  addEventStart(type: string, event: any) {
    this.minDateEnd = event.value;
    //console.log(event.value);
  }
  OnCancel() {
    if (this.isEdit) {
      this.router.navigate(['/matter/generalmatter/view']);
    } else {
      this.generalForm.reset();
    }
  }
  getDocuments() {
    this.httpService.sendGetRequest(URLUtils.generalHistoryDocuments(this.editeMatterInfo.id)).subscribe(
      (res: any) => {
        if (res) {
          this.Documents = res.documents;
        }
      });
  }
}
