import { Router } from '@angular/router';
import { ConfirmationDialogService } from './../../../confirmation-dialog/confirmation-dialog.service';
import { HttpService } from 'src/app/services/http.service';
import { URLUtils } from 'src/app/urlUtils';
import { Component, Input, OnInit, Output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-createlegalmatter',
  templateUrl: './createlegalmatter.component.html',
  styleUrls: ['./createlegalmatter.component.scss']
})
export class CreatelegalmatterComponent implements OnInit {
  pipe = new DatePipe('en-US');
  selectedTabItem = 'matter-info';
  //selectedTabItem = 'matter-clients';
  matterInfo: any;
  highLightTeamMem:boolean=false;
  InfotoOtherTabs: any = {};
  groups: any = [];
  clients: any = [];
  teammembers: any = [];
  clientsData: any = [];
  groupsData: any = [];
  corpData:any = [];
  teammembersData: any = [];
  docsData: any = [];
  tempClients:any;
  corpClients:any;
  corporate:any =[];
  @Output() selectedClients:any;
  product = environment.product;

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
      this.selectedTabItem = 'matter-groups';
    }
  }
  selectedGroups(groups: any) {
    this.groups = groups;
    this.groupsData = this.groups.map((obj: any) => obj.id);
    this.selectedTabItem = 'matter-clients';
    this.clients=[];
    this.teammembers=[];
  }
  selectedClient(clients: any) {
    this.clients = clients;
    //console.log('cli',this.clients)
    this.clientsData = this.clients.map((obj: any) => ({ "id": obj.id, "type": obj.type }));
    //console.log('clientsData',this.clientsData)
    this.selectedTabItem = 'matter-team-member';
    this.teammembers=[];
    this.selectedClients = this.corporate
    //console.log('selectedClients',this.corporate)

  }
  temporaryClients(clients:any){
    this.tempClients=clients;
  }
  corporateClients(clients:any){
    this.corpClients=clients;
    this.corpData = this.corpClients
  }
  selectedTeammemberes(teammembers: any) {
    this.highLightTeamMem = true;
    this.teammembers = teammembers;
    this.teammembersData = this.teammembers.map((obj: any) => ({ "id": obj.id }));
    this.selectedTabItem = 'matter-documents';
  }
  selectedDocuments(documents: any) {
    this.docsData = documents.map((obj: any) => ({
      "docid": obj.docid,
      "doctype": obj.doctype,
      "user_id": obj.user_id
    }));
    this.postData();
  }
  postData() {
    let legalMatter = {};
   // this.matterInfo.date_of_filling = this.pipe.transform(this.matterInfo.date_of_filling, 'dd-MM-yyyy');
    legalMatter = {
      "title": this.matterInfo.title,
      "case_number": this.matterInfo.case_number,
      "date_of_filling": this.matterInfo.date_of_filling && this.pipe.transform(this.matterInfo.date_of_filling, 'dd-MM-yyyy'),
      "description": this.matterInfo.description,
      "case_type": this.matterInfo.case_type,
      "court_name": this.matterInfo.court_name,
      "judges": this.matterInfo.judges,
      "priority": this.matterInfo.priority,
      "status": this.matterInfo.status,
      "affidavit_isfiled": "na",
      "affidavit_filing_date": "",
      "opponent_advocates": this.matterInfo.opponent_advocates,
      "clients": this.clientsData,
      "group_acls": this.groupsData,
      "members": this.teammembersData,
      "documents": this.docsData,
      "temporaryClients":this.tempClients,
      "corporate":this.corpClients 
    }

    // console.log("clients",this.clientsData)
    // console.log("corporate",this.corpClients)

    this.confirmationDialogService.confirm('Confirmation', 'Are you sure you want to create ' + this.matterInfo.title +' ?',true,'Yes','No')
      .then((confirmed) => {
        if (confirmed) {
          this.httpService.sendPostRequest(URLUtils.createLegalMatter, legalMatter).subscribe((res: any) => {
            if (!res.error) {
              if(this.docsData.length>0){
                this.add_documents_from_matter(res.matter_id)
              }
              this.confirmationDialogService.confirm('Success', 'Congratulations! You have successfully created the ' + this.matterInfo.title,true, 'View Matter List','Add Matter',true)
                .then((confirmed) => {
                  if (confirmed) {
                    localStorage.removeItem('tempClients');
                    this.router.navigate(['/matter/legalmatter/view']);
                  }else{
                    window.location.reload();
                  }
                })
            }
            else if(res.error)
              this.toast.error(res.msg)
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
        
      })
      .catch(() => {});
  }


  add_documents_from_matter(matter_id:any){
    const doc: string[] = this.docsData.map((item:any) => item.docid);
    let data = {
      "matter_id":matter_id,
      documents: doc
    }
    this.httpService.sendPatchRequest(URLUtils.updateDocwithMatters,data).subscribe((res:any)=>{
      console.log(res)
    })


  }
}
