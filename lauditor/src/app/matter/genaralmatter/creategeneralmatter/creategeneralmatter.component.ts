import { Router } from '@angular/router';
import { ConfirmationDialogService } from './../../../confirmation-dialog/confirmation-dialog.service';
import { HttpService } from 'src/app/services/http.service';
import { URLUtils } from 'src/app/urlUtils';
import { Component, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-creategeneralmatter',
  templateUrl: './creategeneralmatter.component.html',
  styleUrls: ['./creategeneralmatter.component.scss']
})
export class CreategeneralmatterComponent implements OnInit {

  selectedTabItem = 'matter-info';
  matterInfo: any;
  highLightTeamMem: boolean = false;
  InfotoOtherTabs: any = {};
  groups: any = [];
  clients: any = [];
  teammembers: any = [];
  clientsData: any = [];
  groupsData: any = [];
  teammembersData: any = [];
  docsData: any = [];
  tempClients: any;
  corpClients: any;
  corpData: any = [];
  pipe = new DatePipe('en-US');
  corporate: any = [];
  @Output() selectedClients: any;
  product = environment.product;
  tmGrp: any = [];

  constructor(private httpService: HttpService, private toast: ToastrService,
    private router: Router, private confirmationDialogService: ConfirmationDialogService) { }

  ngOnInit() {

  }

  receiveMatterIngo(mInfo: any) {
    if (mInfo) {
      this.InfotoOtherTabs = {
        "Title": mInfo.title,
        "Type": mInfo.case_type
      }
      this.matterInfo = mInfo;
      //this.selectedTabItem = 'matter-clients';
      if(this.product == 'corporate'){
        this.selectedTabItem = 'matter-groups';
      }
      else{
        this.selectedTabItem = 'matter-clients';
      }
    }
  }

  selectedGroups(groups: any) {
    this.groups = groups;
    //this.selectedGroups = groups;
    this.groupsData = this.groups.map((obj: any) => obj.id);
    //this.selectedTabItem = 'matter-team-member';
    if(this.product == 'corporate'){
      this.selectedTabItem = 'matter-clients';
    }
    else{
      this.selectedTabItem = 'matter-team-member';
    }
    // this.clients=[];
    // this.teammembers=[];
  }
  selectedClientGrp(clients: any) {
    this.clients = clients;
  }

  // selectedClient(clients: any) {
  //   this.clients = clients;
  //   this.clientsData = this.clients.map((obj: any) => ({ "id": obj.id, "type": obj.type }));
  //   this.selectedTabItem = 'matter-groups';
  //   this.teammembers = [];
  //   this.selectedClients = this.corporate
  // }
  
  selectedClient(clients: any) {
    this.clients = clients;
    const corporateClient = this.clients.find((client: any) => client.type === 'corporate');
    this.corpClients = corporateClient ? corporateClient.id : '';

    this.clientsData = this.clients.map((obj: any) => ({ id: obj.id, type: obj.type }));
    //this.selectedTabItem = 'matter-groups';
    if(this.product == 'corporate'){
      this.selectedTabItem = 'matter-team-member';
    }
    else{
      this.selectedTabItem = 'matter-groups';
    }
    this.selectedClients = this.corpClients;
  }

  temporaryClients(clients: any) {
    this.tempClients = clients;
  }
  selectedTeammemberes(teammembers: any) {
    this.highLightTeamMem = true;
    this.teammembers = teammembers;
    this.teammembersData = this.teammembers.map((obj: any) => ({ "id": obj.id }));
    this.selectedTabItem = 'matter-documents';
  }
  selectedTmGrpId(tm: any) {
    this.tmGrp = tm;
    this.teammembers = this.tmGrp
  }
  selectedDocuments(documents: any) {
    this.docsData = documents.map((obj: any) => ({
      "docid": obj.docid,
      "doctype": obj.doctype,
      "user_id": obj.user_id
    }));
    this.postData();
  }
  corporateClients(clients: any) {
    this.corpClients = clients;
  }
  postData() {
    let legalMatter = {};
    legalMatter = {
      "title": this.matterInfo.title,
      "matter_number": this.matterInfo.matterNumber,
      "startdate": this.matterInfo.startdate && this.pipe.transform(this.matterInfo.startdate, 'dd-MM-yyyy'),
      "closedate": this.matterInfo.closedate && this.pipe.transform(this.matterInfo.closedate, 'dd-MM-yyyy'),
      "description": this.matterInfo.description,
      "matter_type": this.matterInfo.matterType,
      "priority": this.matterInfo.priority ?? "High",
      "status": this.matterInfo.status ?? "Active",
      "affidavit_isfiled": "na",
      "affidavit_filing_date": "",
      "clients": this.clientsData,
      "group_acls": this.groupsData,
      "members": this.teammembersData,
      "documents": this.docsData,
      "temporaryClients": this.tempClients,
      "corporate": this.corpClients
    }
    this.confirmationDialogService.confirm('Confirmation', 'Are you sure you want to create ' + this.matterInfo.title + '?', true, 'Yes', 'No')
      .then((confirmed) => {
        if (confirmed) {
          this.httpService.sendPostRequest(URLUtils.createGeneralMatter, legalMatter).subscribe((res: any) => {
            if (!res.error) {
              if (this.docsData.length > 0) {
                this.add_documents_from_matter(res.matter_id)
              }
              this.confirmationDialogService.confirm('Success', 'Congratulations! You have successfully created the matter.', true, 'View Matter List', 'Add Matter', true)
                .then((confirmed) => {
                  if (confirmed) {
                    this.router.navigate(['/matter/generalmatter/view']);
                  } else {
                    window.location.reload();
                  }
                })
            }
            else if (res.error)
              this.toast.error(res.msg);
          },
            (error: HttpErrorResponse) => {
              if (error.status === 401 || error.status === 403) {
                const errorMessage = error.error.msg || 'Unauthorized';
                this.toast.error(errorMessage);
                //console.log(error);
              }
            })
        }
      })
      .catch(() => { });
  }

  add_documents_from_matter(matter_id: any) {
    const doc: string[] = this.docsData.map((item: any) => item.docid);
    let data = {
      "matter_id": matter_id,
      documents: doc
    }
    this.httpService.sendPatchRequest(URLUtils.updateDocwithMatters, data).subscribe((res: any) => {
      //console.log(res)
    })
  }
}
