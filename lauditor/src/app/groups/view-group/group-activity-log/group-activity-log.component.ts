import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/services/http.service';
import { URLUtils } from 'src/app/urlUtils';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
 

@Component({
    selector: 'group-activity-log',
    templateUrl: 'group-activity-log.component.html',
    styleUrls: ['group-activity-log.component.scss']
})
export class GroupActivityLogComponent implements OnInit {
    
    @Input() data: any;
    @Output() event = new EventEmitter<string>();

    product = environment.product;
    members: any = [];
    membersList: any[] = [];
    searchText: any = "";
    ghname: string = "";
    logForm: any = FormGroup;
    submitted: boolean = false;
    pipe = new DatePipe('en-US');
    loglist: any[] = [];
    categoryList: string[] = ["Authorization",
                              "Groups",
                              "Team Members",
                              "Relationships",
                              "Share",
                              "Documents",
                              "Merge PDF",
                              "Matters",
                              "Timesheets"]
    
    constructor(private httpService: HttpService,
                private fb: FormBuilder, private toast: ToastrService, 
                private router: Router){ }
    
    ngOnInit(): void {
        this.logForm = this.fb.group({category: ['Authorization', Validators.required],
                                               client: ['', Validators.required],
                                               tm: ['', Validators.required],
                                               search: [''],
                                               fromDate: [''],
                                               toDate: ['']});
    }

    get f() { return this.logForm.controls; }
    
    close() {
        this.event.emit('activity-log-close')
    }

    onSubmit(){
        let data = this.logForm.value
        data['fromDate'] = this.pipe.transform(data['fromDate'], 'dd-MM-yyyy');
        data['toDate'] = this.pipe.transform(data['toDate'], 'dd-MM-yyyy');
        this.httpService.sendPutRequest(URLUtils.getGroupAuditLogs(this.data), data).subscribe(
            (res: any) => {
                this.loglist = res['data']
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
}
