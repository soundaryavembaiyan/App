import { ConfirmationDialogService } from './../../../confirmation-dialog/confirmation-dialog.service';
import { Router } from '@angular/router';
import { MatterService } from './../../matter.service';
import { URLUtils } from './../../../urlUtils';
import { HttpService } from '../../../services/http.service';
import { Component, Input, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-viewlegalmatter',
  templateUrl: './viewlegalmatter.component.html',
  styleUrls: ['./viewlegalmatter.component.scss'],
})
export class ViewlegalmatterComponent implements OnInit {
  @Input() data: any;
  @BlockUI()
  blockUI!: NgBlockUI;
  legalMatters: any = [];
  isDesc: boolean = false;
  searchText: any = '';
  pipe = new DatePipe('en-US');
  hoveredGroups: any;
  product = environment.product;
  value: any = 1;
  options: any = [
    { name: "Internal Matters", value: 1 }, 
    { name: "External Matters", value: 2 }
  ];
  selectedOption: any;

  itemsPerPage: number = 10; // Initialize with the number of items per page
  currentPage: number = 1;
  

  constructor(private httpservice: HttpService, private http: HttpClient, private matterService: MatterService, 
    private router: Router, private toast: ToastrService,
    private confirmationDialogService: ConfirmationDialogService,private spinnerService: NgxSpinnerService) { }

  ngOnInit() {
    // if(this.product == 'corporate'){
    //   this.selectedOption = 'External Matters'
    // this.getExternalMatters();
    //}
    // else{
    //   this.selectedOption = 'Internal Matters'
      this.getLegalMatters();
    //}
    //console.log('this.selectedOption',this.selectedOption)
  }
  getLegalMatters() {
    this.spinnerService.show()
    this.httpservice.sendGetRequest(URLUtils.getLegalMatter).subscribe((res: any) => {
      this.legalMatters = res && res["matters"];
      this.spinnerService.hide()
    })
  }

  getExternalMatters() {
    this.spinnerService.show()
    this.httpservice.sendGetRequest(URLUtils.getLegalExternalMatter).subscribe((res: any) => {
      this.legalMatters = res && res["matters"];
      this.spinnerService.hide()
    })
  }

  onOptionSelect(event: any) {
    this.selectedOption = event.target.value;
    // Perform additional actions based on the selected option
    // For example, you can call a function or update other variables
    //console.log('Selected option:', this.selectedOption);
    // Your additional actions here
    if(this.selectedOption=="External Matters"){
      this.getExternalMatters()

    }else{
      this.getLegalMatters()

    }
  }
  
  getDocuments(id: any) {
    this.httpservice.sendGetRequest(URLUtils.legalHistoryDocuments(id)).subscribe(
      (res: any) => {
        if (res) {
          return res.documents;
        }
      });
    return new Array();
  }
  sort(property: any) {
    this.isDesc = !this.isDesc; //change the direction    
    // this.column = property;
    let direction = this.isDesc ? 1 : -1;

    this.legalMatters.sort(function (a: any, b: any) {
      if (a[property] < b[property]) {
        return -1 * direction;
      }
      else if (a[property] > b[property]) {
        return 1 * direction;
      }
      else {
        return 0;
      }
    });
  };
  updateGroups(legalMatter: any) {
    this.matterService.editLegalMatter(legalMatter);
    this.router.navigate(['/matter/legalmatter/updateGroups'])
  }
  loadEditMatterInfo(legalMatter: any) {
    this.matterService.editLegalMatter(legalMatter);
    this.router.navigate(['/matter/legalmatter/matterEdit'])

  }
  loadViewDetails(legalMatter: any,type:any) {
    const legal = { ...legalMatter, type: type };
    this.matterService.editLegalMatter(legal);
    this.router.navigate(['/matter/legalmatter/viewDetails'])
    
    if(this.product == 'corporate' && this.selectedOption !='External Matters'){
    this.router.navigate(['/matter/legalmatter/externalviewDetails'])
    }
   
  }
  onMouseOver(grps: any) {
    let newList = [...grps]
    this.hoveredGroups = [];
    //console.log('hoveredGroups',this.hoveredGroups)
    if (grps.length > 2) {
      let sliceArray = newList.splice(2, grps.length);
      this.hoveredGroups = sliceArray.map((item: any, i: number) => item.name);
    }
  }
  updateMatterStatus(legalMatter: any, status: string) {
    let Documents = this.getDocuments(legalMatter.id);
    let s = status == 'Closed' ? 'close' : 'reopen';
    let test = s + ' ' + legalMatter.title + ' ?';
    this.confirmationDialogService.confirm('Confirmation', 'Are you sure do you want to ' + test, true)
      .then((confirmed) => {
        if (confirmed) {
          let obj = {
            "title": legalMatter.title,
            "case_number": legalMatter.caseNumber,
            "date_of_filling": this.pipe.transform(legalMatter.date_of_filling, 'dd-MM-yyyy'),
            "description": legalMatter.description,
            "case_type": legalMatter.caseType,
            "court_name": legalMatter.courtName,
            "judges": legalMatter.judges,
            "priority": legalMatter.priority,
            "status": status,
            "affidavit_isfiled": "na",
            "affidavit_filing_date": "",
            "clients": legalMatter.clients.map((obj: any) => ({ "id": obj.id, "type": obj.type })),
            "members": legalMatter.members.map((obj: any) => ({ "id": obj.id })),
            //"owner": legalMatter.owner.map((obj: any) => ({ "id": obj.id, "name": obj.name })),
            "owner": legalMatter.owner,
            "tags":legalMatter.tags,
            "documents": legalMatter.documents?.map((obj: any) => ({
              "docid": obj.docid,
              "doctype": obj.doctype,
              "user_id": obj.user_id
            })),
            "group_acls": legalMatter.groupAcls,
            "opponent_advocates": legalMatter.opponentAdvocates
          }
          console.log(status)
        this.httpservice.sendUpdateRequest(URLUtils.updateLegalMatter(legalMatter.id), obj).subscribe((res: any) => {
          if (!res.error) {
            let s = status == 'Closed' ? 'closed' : 'reopened';
            let test = s + ' ' + legalMatter.title + ' matter.';
            this.confirmationDialogService.confirm('Success', 'Congratulations! You have successfully ' + test, false, 'View Matter List', 'Cancel', true)
              .then((confirmed) => {
                if (confirmed) {
                  this.getLegalMatters();
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
        );
      }
    })
}
delete (legalMatter: any) {
  this.confirmationDialogService.confirm('Confirmation', legalMatter.title + ' matter contains ' + legalMatter.documents?.length + ' documents. Are you sure do you want to delete this matter?', true, 'Yes', 'No')
    .then((confirmed) => {
      if (confirmed) {
        this.httpservice.sendDeleteRequest(URLUtils.deleteLegalMatter(legalMatter.id)).subscribe((res: any) => {
          //console.log(legalMatter.id + 'ifs deleted');
          if (!res.error) {
            this.confirmationDialogService.confirm('Success', 'Congratulations! You have successfully deleted ' + legalMatter.title, false, 'View Matter List', 'Cancel', true)
              .then((confirmed) => {
                if (confirmed) {
                  this.getLegalMatters();
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
        });
      }
    })
}
}
