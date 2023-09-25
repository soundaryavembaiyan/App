import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/services/http.service';
import { URLUtils } from 'src/app/urlUtils';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
  

@Component({
    selector: 'delete-group',
    templateUrl: 'delete-group.component.html',
    styleUrls: ['delete-group.component.scss']
})
export class DeleteGroupComponent implements OnInit {
    
    @Input() data:any
    @Output() event = new EventEmitter<string>();

    product = environment.product;
    searchText:any;
    groups: any = [];
    grpName: string = "";
    counts: any = {documents: 0, matters: 0, relationships: 0, members: 0}
    selectedGrp: any = {}; 
    
    constructor(private router: Router, private toast: ToastrService,
                private httpService: HttpService){ }

    ngOnInit(): void {
        this.grpName = this.data.name
        this.loadResources()
        this.loadGroups()
    }

    cancel(){
        this.event.emit('group-delete-close')
    }

    select(grp: any){
        this.selectedGrp = grp
    }

    loadResources(){
        this.httpService.sendGetRequest(URLUtils.getGroupResources(this.data)).subscribe((res: any) => {
            this.counts = res.counts
        }, error => {
          //console.log("error------>" + error);
      })
    }
    
    loadGroups(){
      this.httpService.sendGetRequest(URLUtils.getGroups).subscribe((res: any) => {
        this.groups = res?.data;
        this.groups.forEach((item: any, index: number) => {
            if(item.name == this.grpName){
                this.groups.splice(index, 1)
            }
        })
      })
    }
    
    deleteMemberGroup() {
       let isDeleted: boolean = false;
       let d = {'id': this.data['id'], 'newid': this.selectedGrp['id']};
       this.httpService.sendDeleteRequest(URLUtils.deleteGroup(d)).subscribe((res: any) => {
          this.event.emit('group-delete-done')
          isDeleted = res;
        }, (error: HttpErrorResponse) => {
            if (error.status === 401 || error.status === 403) {
              const errorMessage = error.error.msg || 'Unauthorized';
              this.toast.error(errorMessage);
              console.log(error);
            }
      
          })
    }
}
