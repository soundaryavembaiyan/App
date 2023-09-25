import { Component, OnDestroy, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { URLUtils } from 'src/app/urlUtils';
import { FormBuilder } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
  

@Component({
    selector: 'app-relationship-group-access',
    templateUrl: 'relationship-group-access.component.html',
    styleUrls: ['relationship-group-access.component.scss']
})
export class RelationshipGroupAccessComponent implements OnInit {

	  @Input() reldata: any = {};
    @Input() activeTab: any;
    @Output() event = new EventEmitter<string>();

    product = environment.product;
    groupList: any[] = [];
  	selectedIds: string[] = [];
  	relname: string = "";
    showConfirm: boolean = false;
    //isDisabled = true;   ||  [disabled]="isDisabled"
    

	constructor(private formBuilder: FormBuilder, private toast: ToastrService,
              private httpService: HttpService) { 
	}

	ngOnInit(){
    	this.loadGroups()
    	this.selectedIds = this.reldata.groups.map((obj: any) => { return obj.id })
    	this.relname = this.reldata.name
  	}

	loadGroups(){
     	this.httpService.sendGetRequest(URLUtils.getGroups).subscribe((res: any) => {
      		this.groupList = res?.data;
          //console.log('groupList', this.groupList)
    	})
    }

    cancel(){
    	this.event.emit('group-access-close')
    }

    confirmSave(){
      this.showConfirm = true;
    }

  save() {
    //this.reldata = false
    //this.isDisabled = this.reldata.invalid;

    var payload = { "acls": this.selectedIds }

      //Corporate
      if(this.activeTab == 'corporate' || environment.product == 'corporate'){ 
      this.httpService.sendPatchRequest(URLUtils.relationshipGroupAclsCorp(this.reldata),
        payload).subscribe((res: any) => {
          this.event.emit("group-access-done")
        },
        (error: HttpErrorResponse) => {
          if (error.status === 401 || error.status === 403) {
            const errorMessage = error.error.msg || 'Unauthorized';
            this.toast.error(errorMessage);
            console.log(error);
          }
        })
      }
       //All
      else{
        this.httpService.sendPutRequest(URLUtils.relationshipGroupAcls(this.reldata),
        payload).subscribe((res: any) => {
          this.event.emit("group-access-done")
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
      console.log('activeTab', this.activeTab)
  }

    selectGrp(grp: any, checked: boolean){
    if(checked){
      this.selectedIds.push(grp.id)
      //console.log('selectedIds', this.selectedIds)
    } else {
      this.selectedIds.splice(this.selectedIds.indexOf(grp.id), 1)
    }
  }

}
 
