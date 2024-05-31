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

  selector: 'matter-info',
  templateUrl: 'matter-info.component.html',
  styleUrls: ['matter-info.component.scss']
})
export class MatterInfoComponent implements OnInit {
  @Input() type: string = 'create';
  @Input() data: any;
  @Output() childButtonEvent = new EventEmitter();
  events: string[] = [];
  advicates: any
  caseRegister: any = FormGroup;
  desc: any;
  //memberDetail:any=FormGroup;
  submitted = false;
  opponent_advocates: any = [];
  pipe = new DatePipe('en-US');
  isEdit: boolean = false;
  selectedPriority: string = "High";
  selectedStatus: string = "Active";
  editeMatterInfo: any;
  Documents: any;
  isAddDisable: boolean = false;
  readonly NoWhitespaceRegExp: RegExp = new RegExp("\\S");
  //minDate:any=new Date();
  constructor(private fb: FormBuilder, private oa: FormBuilder, private matterService: MatterService, private toast: ToastrService,
    private httpService: HttpService, private router: Router, private confirmationDialogService: ConfirmationDialogService) { }

  ngOnInit() {
    this.caseRegister = this.fb.group({
      title: ['',[Validators.required,Validators.pattern(this.NoWhitespaceRegExp)]],
      case_number: ['',[ Validators.required,Validators.pattern(this.NoWhitespaceRegExp)]],
      date_of_filling: [''],
      description: [''],
      tags:[''],
      case_type: [''],
      court_name: [''],
      judges: [''],
      status: ['Active'],
      priority: ['High']
    })
    if (this.data) {
      this.caseRegister.patchValue(this.data);
      if (this.data.date_of_filling) {
      this.caseRegister.controls["date_of_filling"].setValue(new Date(this.data.date_of_filling));
      }
      this.selectedStatus = this.data.status;
      this.selectedPriority = this.data.priority;
    }
    if (window.location.pathname.indexOf("matterEdit") > -1) {
      this.matterService.editLegalMatterObservable.subscribe((result: any) => {
        if (result) {
          this.editeMatterInfo = result;
          this.isEdit = true;
          const tagObject = '' // Prevent[obj obj]-tags
          this.caseRegister.controls['tags'].setValue(tagObject);
          const transformedData = {
            ...this.data,
            tags: this.data.tags?.name || this.data.tags
          };
          this.caseRegister.patchValue(this.editeMatterInfo);
          if (this.editeMatterInfo.date_of_filling) {
          this.caseRegister.controls["date_of_filling"].setValue(new Date(this.editeMatterInfo.date_of_filling));
          }
          this.selectedStatus = this.editeMatterInfo.status;
          this.selectedPriority = this.editeMatterInfo.priority;
          this.caseRegister.controls["case_number"].setValue(this.editeMatterInfo.caseNumber);
          this.caseRegister.controls["case_type"].setValue(this.editeMatterInfo.caseType);
          this.caseRegister.controls["court_name"].setValue(this.editeMatterInfo.courtName);
          this.getDocuments();
        }
        else if(result.error)
        this.toast.error(result.msg)
      }
      )
    }
  }

  get f() {
    return this.caseRegister.controls;
  }
  getDocuments() {
    this.httpService.sendGetRequest(URLUtils.legalHistoryDocuments(this.editeMatterInfo.id)).subscribe(
      (res: any) => {
        if (res) {
          this.Documents = res.documents;
        }
      });
  }
  // get member_name(){
  //   return this.caseRegister.memberDetail.get('member_name') as FormControl;
  // }
  receiveAutoMsgHandler(details: any) {
    if (details == null) {
      this.isAddDisable = true;
    } else {
      this.isAddDisable=false;
      this.advicates = details;
    }
    //console.log(" this.advicates------------>" + this.advicates)
  }
  getPriority(data: any) {
    this.caseRegister.controls.priority.patchValue(data ? data : "High");

  }
  getStatus(data: any) {
    this.caseRegister.controls.status.patchValue(data ? data : "Active");
  }
  addOpponenteAdvicate() {

  }
  onSubmit() {
    this.submitted = true;
    if (this.caseRegister.invalid) {
      return;
    }
    this.caseRegister.value.opponent_advocates = this.advicates;
    //this.caseRegister.value.status =this.caseRegister.status=="INVALID" || this.caseRegister.status=="VALID" ?"Active":this.caseRegister.status;
    //this.caseRegister.value.priority = this.caseRegister?.priority? this.caseRegister.priority:"High";
    //console.log(JSON.stringify(this.caseRegister.value));
    if (this.isEdit) {
      // this.caseRegister.value.date_of_filling = this.pipe.transform(this.caseRegister.value.date_of_filling, 'dd-MM-yyyy');
      let data = {
        "title": this.caseRegister.value.title,
        "case_number": this.caseRegister.value.case_number,
        //"date_of_filling": this.pipe.transform(this.caseRegister.value.date_of_filling, 'dd-MM-yyyy'),
        "date_of_filling": this.caseRegister.value.date_of_filling ? this.pipe.transform(this.caseRegister.value.date_of_filling, 'dd-MM-yyyy') : null,
        "description": this.caseRegister.value.description,
        "case_type": this.caseRegister.value.case_type,
        "court_name": this.caseRegister.value.court_name,
        "judges": this.caseRegister.value.judges,
        "priority": this.caseRegister.value.priority,
        "status": this.caseRegister.value.status,
        "affidavit_isfiled": "na",
        "affidavit_filing_date": "",
        "opponent_advocates": this.advicates?.length > 0 ? this.advicates : this.editeMatterInfo.opponentAdvocates,
        "clients": this.editeMatterInfo.clients.map((obj: any) => ({ "id": obj.id, "type": obj.type })),
        "group_acls": this.editeMatterInfo.groupAcls,
        "members": this.editeMatterInfo.members.map((obj: any) => ({ "id": obj.id })),
        "documents": this.Documents.map((obj: any) => ({
          "docid": obj.docid,
          "doctype": obj.doctype,
          "user_id": obj.user_id
        }))
      }
      //console.log(data)

      this.httpService.sendPutRequest(URLUtils.updateLegalMatter(this.editeMatterInfo.id), data).subscribe((res: any) => {
        console.log('up',res);
        if(!res.error){
          this.confirmationDialogService.confirm('Success', 'Congratulations! You have successfully updated the matter information for '+ this.caseRegister.value.title,false,'View Matter List','Cancel',true)
          .then((confirmed) => {
            if (confirmed) {
              this.router.navigate(['/matter/legalmatter/view']);
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
      this.childButtonEvent.emit(this.caseRegister.value);
    }
    // this.isGroups=true;
  }


  addEvent(type: string, event: any) {
    this.events.push(`${type}: ${event.value}`);
    //console.log("Date --->" + this.events);
  }
  OnCancel() {
    if (this.isEdit) {
      this.router.navigate(['/matter/legalmatter/view']);
    } else {
      this.caseRegister.reset();
    }
  }
}
