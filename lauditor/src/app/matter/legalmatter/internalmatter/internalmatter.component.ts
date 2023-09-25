import { ConfirmationDialogService } from '../../../confirmation-dialog/confirmation-dialog.service';
import { Router } from '@angular/router';
import { MatterService } from '../../matter.service';
import { URLUtils } from '../../../urlUtils';
import { HttpService } from '../../../services/http.service';
import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-internalmatter',
  templateUrl: './internalmatter.component.html',
  styleUrls: ['./internalmatter.component.scss']
})

export class InternalmatterComponent implements OnInit {
  legalMatters: any = [];
  isDesc: boolean = false;
  searchText: any = '';
  pipe = new DatePipe('en-US');
  hoveredGroups: any;
  matterList: any;
  constructor(private httpservice: HttpService, private matterService: MatterService, private router: Router,
    private confirmationDialogService: ConfirmationDialogService) { }

  ngOnInit() {
    this.getLegalMatters();
    this.getGeneralMatters();
  }
  getLegalMatters() {
    this.httpservice.sendGetRequest(URLUtils.getLegalMatter).subscribe((res: any) => {
      this.legalMatters = res && res["matters"];
    })
  }
  getGeneralMatters() {
    this.httpservice.sendGetRequest(URLUtils.getGenMatterEventList).subscribe((res: any) => {
      this.matterList = [];
      this.matterList = res?.matters;
    //   if (this.editInfo)
    //     this.onChangeMatter(null);
      //this.matterList = res?.matters?.owner;
      //console.log('matterList', this.matterList)
    });
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
  loadViewDetails(legalMatter: any) {
    this.matterService.editLegalMatter(legalMatter);
    this.router.navigate(['/matter/legalmatter/viewDetails'])
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
            "date_of_filling":this.pipe.transform(legalMatter.date_of_filling, 'dd-MM-yyyy'),
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
            "documents":legalMatter.documents?.map((obj: any) => ({
              "docid": obj.docid,
              "doctype": obj.doctype,
              "user_id": obj.user_id
            })),
             "group_acls": legalMatter.groupAcls,
             "opponent_advocates": legalMatter.opponentAdvocates
              }
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
        });
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
        });
      }
    })

}
}
