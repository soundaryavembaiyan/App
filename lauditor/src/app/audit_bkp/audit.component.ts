// import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
// import { Router } from '@angular/router';
// import { HttpService } from 'src/app/services/http.service';
// import { URLUtils } from 'src/app/urlUtils';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { DatePipe } from '@angular/common';
// import { environment } from 'src/environments/environment';

// @Component({
//   selector: 'app-audit',
//   templateUrl: './audit.component.html',
//   styleUrls: ['./audit.component.scss']
// })
// export class AuditComponent implements OnInit {
// // <<<<<<< HEAD

//   product = environment.product;
//   categoryName: any = 'Dashboard';
//   name: string = "";
//   role: string = "GH";
//   roleId: string = "GH";

// // =======
//   p:any;
// // >>>>>>> edcf0ea9e0ec0584efd316b70ea2bd944dc70470
//   members: any = [];
//   membersList: any[] = [];
//   searchText: any = "";
//   ghname: string = "";
//   logForm: any = FormGroup;
//   submitted: boolean = false;
//   pipe = new DatePipe('en-US');
//   loglist: any[] = [];
//   data: any = {};
//   auditLogs: any;
//   filterByCategory: any;
//   isChecked: boolean = false;  // Boolean flag
//   auditSarch:string='';
//   categoryList: any = [
//     { name: 'Authorization', value: 'AUTH' },
//     { name: 'Groups', value: '' },
//     { name: 'Team Members', value: "TEAM MEMBER" },
//     { name: 'Relationships', value: 'RELATIONSHIP' },
//     { name: 'Share', value: "SHARED FOLDER" },
//     { name: 'Documents', value: 'DOCUMENT' },
//     { name: 'Merge PDF', value: 'MERGE PDF' },
//     { name: 'Legal Matters', value: 'LEGAL MATTER' },
//     { name: 'General Matters', value: 'GENERAL MATTER' },
//     { name: 'Timesheets', value: '' }
//   ]

//     categoryListContent: string[] = ["Authorization",
//     "Groups",
//     "Team Members",
//     "Relationships",
//     "Share",
//     "Documents",
//     "Merge PDF"
//   ]

//   categoryListConnect: string[] = ["Authorization",
//   "Groups",
//   "Team Members",
//   "Relationships",
//   "Share",
//   "Documents"
// ]


//   constructor(private httpService: HttpService,
//     private fb: FormBuilder,
//     private router: Router) { }

//   ngOnInit(): void {
// // <<<<<<< HEAD
//     this.logForm = this.fb.group({category: ['Authorization', Validators.required],
//      client: ['', Validators.required],
//      tm: ['', Validators.required],
//      search: [''],
//      fromDate: [''],
//      toDate: ['']});


//       var role = localStorage.getItem("role")
//       if (role != null) { this.roleId = role }
//       if (role == 'SU') { this.role = 'SuperUser' }
//       if (role == 'AAM') { this.role = 'Admin' }
//       if (role == 'TM') { this.role = 'Team Member' }
//       if (role == 'GH') { this.role = 'Group Head' }

    
// // =======
//     this.logForm = this.fb.group({
//       category: ['Authorization', Validators.required],
//       client: ['', Validators.required],
//       tm: ['', Validators.required],
//       search: [''],
//       fromDate: [''],
//       toDate: ['']
//     });
//     this.getAuditList();

// // >>>>>>> edcf0ea9e0ec0584efd316b70ea2bd944dc70470
//   }
 

//   isCheckBox(val:any){
//     this.isChecked=val;
//   }
//   get f() { return this.logForm.controls; }

//   close() {
//   }

//   onSubmit() {
//     let data = this.logForm.value
//     data['fromDate'] = this.pipe.transform(data['fromDate'], 'dd-MM-yyyy');
//     data['toDate'] = this.pipe.transform(data['toDate'], 'dd-MM-yyyy');
//     this.httpService.sendPutRequest(URLUtils.getAudit, data).subscribe(
//       (res: any) => {
//         this.loglist = res['data']
//       })
//   }
//   getAuditList() {
//     this.httpService.sendGetRequest(URLUtils.getAuditTrails).subscribe(
//       (res: any) => {
//         this.auditLogs = res.data.events;
//         this.filterByCategory = JSON.parse(JSON.stringify(this.auditLogs));
//       });

//   }
//   getCategory(val: any) {
//     let filterByCategory: any = [];
//     this.auditLogs.forEach((item: any) => {
//       if (item.name == val.value) {
//         filterByCategory.push(item);
//       }
//     });

//     this.filterByCategory = filterByCategory;
//     //console.log("filterByCategory " + JSON.stringify(this.auditLogs));
//   }
// }
