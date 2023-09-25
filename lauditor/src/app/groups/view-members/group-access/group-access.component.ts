import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { URLUtils } from 'src/app/urlUtils';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
 

@Component({
  selector: 'app-group-access',
  templateUrl: './group-access.component.html',
  styleUrls: ['./group-access.component.scss']
})
export class GroupAccessComponent implements OnInit {


  @Input() memData: any;
  @Output() event = new EventEmitter<string>();

  product = environment.product;
  groupList: any[] = [];
  selectedIds: string[] = [];

  constructor(private formBuilder: FormBuilder, private toast: ToastrService, 
              private httpService: HttpService) { }
  
  ngOnInit(){
    this.loadGroups()
    this.selectedIds = this.memData.groups.map((x: any) => x.id)
  }

  cancel(){
    this.event.emit('group-access-close')
  }
  
  loadGroups(){
     this.httpService.sendGetRequest(URLUtils.getGroups).subscribe((res: any) => {
      this.groupList = res?.data;
    })
  }

  save(){
    var payload = {"groups": this.selectedIds}
    this.httpService.sendPatchRequest(URLUtils.updateMember(this.memData),
        payload).subscribe((res: any) => {
          this.event.emit('group-access-done')
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

  selectGrp(grp: any, checked: boolean){
    if(checked){
      this.selectedIds.push(grp.id)
    } else {
      this.selectedIds.splice(this.selectedIds.indexOf(grp.id), 1)
    }
  }

}