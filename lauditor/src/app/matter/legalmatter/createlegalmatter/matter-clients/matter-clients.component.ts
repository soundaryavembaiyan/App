import { ConfirmationDialogService } from './../../../../confirmation-dialog/confirmation-dialog.service';
import { URLUtils } from 'src/app/urlUtils';
import { HttpService } from 'src/app/services/http.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({

    selector: 'matter-clients',
    templateUrl: 'matter-clients.component.html',
    styleUrls: ['matter-clients.component.scss']
})
export class MatterClientsComponent implements OnInit {

    @Output() selectedClientsEvent: EventEmitter<any> = new EventEmitter();
    @Output() corporateClientsEvent: EventEmitter<any> = new EventEmitter();
    @Input() data: any = {};
    @Input() clients: any = {};
    @Input() groups: any[] = [];
    @Output() temporaryClientsEvent: EventEmitter<any> = new EventEmitter();

    displayMouseOver: boolean = false;
    clientsList: any = [];
    selectedClients: any = [];
    searchText: any = '';
    tooltipgroupslist: any;
    tempList: any = [];
    tempClient: any = FormGroup;
    individualClient: any = FormGroup;
    entityClient: any = FormGroup;
    corporateClient: any = FormGroup;
    filteredData: any;
    inputsubmit: any;
    selectedType: string = 'individual';
    selectedClient: string = 'addclient';
    submitted = false;
    entitysubmitted:boolean=false;
    tempClients: any = [];
    ClientType:string='individual';
    CorpType:string='corporate';
    csvContent:any=[];

    corporateList:  any = [];
    corporateData:boolean=false;
    corpClients:any =[];
    selectedOption="";
    selectedprod='clients';
    selectedprodCorp='corporate';
    product = environment.product;

    constructor(private httpservice: HttpService, private fb: FormBuilder,
        private confirmationDialogService: ConfirmationDialogService,
        private httpService: HttpService,
        public toastr: ToastrService) { }

    ngOnInit() {
        this.httpservice.sendGetRequest(URLUtils.getCountry).subscribe((res: any) => {
            res.data.countries.forEach((item:any)=>{
                // console.log("item is "+JSON.stringify(item[0]));
                this.csvContent.push(item[0]);
            })
            this.csvContent.shift();

        });
        let tmClient: any = localStorage.getItem('tempClients');
        tmClient = JSON.parse(tmClient);
        if (tmClient != "null")
            this.tempClients = tmClient?.length > 0 ? tmClient : [];
        this.tempClient = this.fb.group({
            name: ['', Validators.required],
            lastName: ['', Validators.required],
            email: ['', Validators.required],
            confirmemail: ['', Validators.required],
            country: ['', Validators.required],
            phonenumber: [''],
            type: ['individual', Validators.required]
        })
        this.getClients();
        this.entityClient = this.fb.group({
            fullname: ['', Validators.required],
            contact_person: ['', Validators.required],
            email: ['', Validators.required],
            confirmemail: ['', Validators.required],
            country: ['', Validators.required],
            phonenumber: ['']
        });

    }

    get f() {
        return this.tempClient.controls;
    }
    get f1() {
        return this.entityClient.controls;
    }

    getClients() {
        let grps = this.groups.map((obj: any) => obj.id);
        let newGroups = [...this.groups];
        if (newGroups && newGroups.length > 2) {
            let tooltipGroupsArray = newGroups.splice(2, this.groups.length);
            // if (tooltipGroupsArray && tooltipGroupsArray.length > 0) {
            //     tooltipGroupsArray.forEach((element: any) => {
            //         this.tooltipgroupslist = this.tooltipgroupslist + ',' + element.name;
            //     });
            // this.tooltipgroupslist = this.tooltipgroupslist.slice(1);
            this.tooltipgroupslist = tooltipGroupsArray.map((item: any, i: number) => item.name);
        }
        this.httpservice.sendPutRequest(URLUtils.getFilterTypeAttachements,
            { 'group_acls': grps, 'attachment_type': 'clients' }
            ).subscribe(
                (res: any) => {
                    console.log('clientres',res)

                    if (!res['error'] && res['clients']?.length > 0)
                        this.clientsList = res['clients'];

                    this.tempList.length = this.clientsList.length;
                    if (this.clients && this.clients.length > 0) {
                        this.selectedClients = [...this.clients];
                        let res = this.clientsList.filter((el: any) => {
                            return !this.selectedClients.find((element: any) => {
                                return element.id === el.id;
                            });
                        });
                        this.clientsList = res;
                        // console.log('clist',this.clientsList)
                        // console.log('slist',this.selectedClients)
                        
                    }
                    if (this.selectedClients.length == 0) {
                        let checkbox = document.getElementById('selectAll') as HTMLInputElement | null;
                        if (checkbox != null)
                            checkbox.checked = false;
                    }
                }
                )


                this.httpservice.sendPutRequest(URLUtils.getFilterTypeAttachements,
                    { 'group_acls': grps, 'attachment_type': 'corporate' ,'product':this.product}
                    ).subscribe(
                        (res: any) => {
                            console.log('corpres',res)
        
                            if (!res['error'] && res['corporate']?.length > 0)
                                this.corporateList = res['corporate'];
                                console.log('corporateList',this.corporateList)
        
                            this.tempList.length = this.corporateList.length;
                            
                            if (this.clients && this.clients.length > 0) {
                                this.selectedClients = [...this.clients];
                                let res = this.corporateList.filter((el: any) => {
                                    return !this.selectedClients.find((element: any) => {
                                        return element.id === el.id;
                                    });
                                });

                                this.corporateList = res;
                                console.log('Ifcorplist',this.corporateList)
                                
                            }
                            if (this.selectedClients.length == 0) {
                                let checkbox = document.getElementById('selectAll') as HTMLInputElement | null;
                                if (checkbox != null)
                                    checkbox.checked = false;
                            }
                        }
                        )
    }


    onFilterValueChange() {
        this.tempList = this.clientsList.filter((data: any) => data?.name?.toLowerCase().includes(this.searchText?.toLowerCase()));
        this.tempList = this.corporateList.filter((data: any) => data?.name?.toLowerCase().includes(this.searchText?.toLowerCase()));
    }

    selectAll(event: any) {
        if (event?.target?.checked) {
            if (this.clientsList?.length > 0) {
                if (this.filteredData?.length > 0) {
                    this.selectedClients = this.selectedClients.concat(this.filteredData);
                    this.clientsList = this.clientsList.filter((el: any) => {
                        return !this.selectedClients.find((element: any) => {
                            return element.id === el.id;
                        });
                    });
                } else {
                    this.selectedClients = this.selectedClients.concat(this.clientsList);
                    this.clientsList = [];
                }
            }
        } else {
            this.clientsList = this.selectedClients.concat(this.clientsList);
            this.selectedClients = [];
        }
    }

    selectCorp(event: any) {
        if (event?.target?.checked) {
            if (this.corporateList?.length > 0) {
                //console.log('CC',this.corporateList)
                if (this.filteredData?.length > 0) {
                    this.selectedClients = this.selectedClients.concat(this.filteredData);
                    this.corporateList = this.corporateList.filter((el: any) => {
                        return !this.selectedClients.find((element: any) => {
                            return element.id === el.id;
                        });
                    });
                } else {
                    this.selectedClients = this.selectedClients.concat(this.corporateList);
                    this.corporateList = [];
                }
            }
        } else {
            this.corporateList = this.selectedClients.concat(this.corporateList);
            this.selectedClients = [];
        }
    }

    selectClient(group: any, value?: any) {
        this.selectedClients.push(group);
        let index = this.clientsList.findIndex((d: any) => d.id === group.id); //find index in your array
        this.clientsList.splice(index, 1);
        if (this.clientsList.length == 0) {
            let checkbox = document.getElementById('selectAll') as HTMLInputElement | null;
            if (checkbox != null)
                checkbox.checked = true;
        }
        console.log("Cli selected clients "+JSON.stringify(this.selectedClients));
    }

    selectCorporate(group: any, value?: any) {
        this.selectedClients.push(group);
        let index = this.corporateList.findIndex((d: any) => d.id === group.id); //find index in your array
        this.corporateList.splice(index, 1);
        if (this.corporateList.length == 0) {
            let checkbox = document.getElementById('selectAll') as HTMLInputElement | null;
            if (checkbox != null)
                checkbox.checked = true;
        }
        console.log("Corp selected clients "+JSON.stringify(this.selectedClients));
    }

    removeClient(group: any) {
        let index = this.selectedClients.findIndex((d: any) => d.id === group.id); //find index in your array
        this.selectedClients.splice(index, 1);
        this.clientsList.push(group);
        if (this.selectedClients.length == 0 || this.clientsList.length == 1) {
            let checkbox = document.getElementById('selectAll') as HTMLInputElement | null;
            if (checkbox != null)
                checkbox.checked = false;
        }
    }
    saveClients() {
        let selectedIds = this.tempClients.map((s: any) => s.id);
        this.temporaryClientsEvent.emit(selectedIds)
        let clients = this.selectedClients.filter((element:any) => element.type !== "corporate");
        this.selectedClientsEvent.emit(clients);
        let corp = this.selectedClients.find((element:any) => element.type === "corporate");
        this.corporateClientsEvent.emit(corp.id);

    }

    onClickCorp() {
        let flag = false;
        for (let i = 0; i < this.selectedClients.length; i++) {
            console.log("Corp selected clients",this.selectedClients)
            if (this.selectedClients[i].type === "corporate") {
                this.selectedClients[i] = this.selectedOption;
                flag = true;
                break;
            }
        }
        if (!flag) {
            this.selectedClients.push(this.selectedOption);
        }
    }


    OnCancel() {
        this.clientsList = this.clientsList.concat(this.selectedClients);
        this.selectedClients = [];
    }
    OnFormCancel() {
        this.searchText = ' ';
        this.onFilterValueChange();
        this.submitted = false;
        this.entitysubmitted = false;
    }
    keyup() {
        if (this.searchText == ' ')
            this.searchText = this.searchText.replace(/\s/g, "");
        this.filteredData = this.clientsList.filter((item: any) => item.name.toLocaleLowerCase().includes(this.searchText));
        let checkbox = document.getElementById('selectAll') as HTMLInputElement | null;
        if (checkbox != null)
            checkbox.checked = false;
    }
    getType(e:any,type:any) {
        this.ClientType=e.target.name;
        this.CorpType
        this.tempClient.controls.type.patchValue(type);
    }
    oneEntitySubmit(){
        this.entitysubmitted = true;
        if (this.entityClient.invalid) {
            return;
        }
        if(this.inputsubmit=='entity'){
            let object={
                "fullname":this.entityClient.value.fullname,
                "contact_person":this.entityClient.value.contact_person,
                "email":this.entityClient.value.email,
                "contact_phone":this.entityClient.value.phonenumber,
                "country":this.entityClient.value.country,
                "group_acls":this.groups.map((obj: any) => obj.id)
            }
            this.httpService.sendPostRequest(URLUtils.matterEntity, object).subscribe((res: any) => {
                    if (!res.error) {
                        let dObj={
                            id:res?.createdId,
                            name:res?.name,
                            type:'entity'
                        }
                        this.selectedClients.push(dObj);
                        this.confirmationDialogService.confirm('Success for Entity', `Congratulations! You have successfully created Entity  ${this.tempClient.value.name} to  ${this.data.Title}`, false, 'Add Team Members', 'Cancel', true)
                            .then((confirmed) => {
                                this.OnFormCancel();
                            })
                    }
                },
                (error: HttpErrorResponse) => {
                    if (error.status === 401) {
                      const errorMessage = error.error.msg || 'Unauthorized';
                      this.toastr.error(errorMessage);
                      console.log(error);
                    }
              
                  }
              )

        }
        this.onResetentity();
    }
    onindividualSubmit(){
        this.submitted = true;
       if (this.tempClient.invalid) {
        return;
        }
        if(this.inputsubmit=='temp'){

           let obj= {
                "first_name":this.tempClient.value.name,
                "last_name":this.tempClient.value.lastName,
                "email":this.tempClient.value.email,
                "country":this.tempClient.value.country,
                "group_acls":this.groups.map((obj: any) => obj.id)
            }
            this.httpService.sendPostRequest(URLUtils.matterIndiviuals, obj).subscribe((res: any) => {
                    if (!res.error) {
                        let dObj={
                            id:res?.createdId,
                            name:res?.name,
                            type:'consumer'
                        }
                        this.selectedClients.push(dObj);
                        this.confirmationDialogService.confirm('Success', 'Congratulations! You have successfully sent relationship request ', false, 'Add Team Members', 'Cancel', true)
                            .then((confirmed) => {
                                this.OnFormCancel();
                            })
                    }
                    // else{
                    //     this.confirmationDialogService.confirm('failed', 'sorry! You have sent duplicate  request ', false, 'Add Team Members', 'Cancel', true)

                    // }
                },
                (error: HttpErrorResponse) => {
                    if (error.status === 401) {
                      const errorMessage = error.error.msg || 'Unauthorized';
                      this.toastr.error(errorMessage);
                      console.log(error);
                    }
              
                  })
        }
        
        this.onReset();
    }

    // onSubmit() {
    //     this.submitted = true;
    //     console.log(this.tempClient);
    //     if (this.inputsubmit == 'invite') {
    //         if (this.tempClient.value.type === 'entity') {
    //             let obj = {
    //                 "entityName": this.tempClient.value.name,
    //                 "fullname": this.tempClient.value.name,
    //                 "contact_person": this.tempClient.value.name,
    //                 "email": this.tempClient.value.email,
    //                 "contactPhone": this.tempClient.value.phonenumber,
    //                 "country": "USA",
    //                 "groups": this.groups.map((obj: any) => obj.id)
    //             }
    //              this.httpService.sendPostRequest(URLUtils.inviteEntity, obj).subscribe((res: any) => {
    //                 if (!res.error) {
    //                      this.confirmationDialogService.confirm('Success', 'Congratulations! You have successfully sent relationship request ', false, 'Add Team Members', 'Cancel', true)
    //                          .then((confirmed) => {
    //                              this.OnFormCancel();
    //                         })
    //                  }
    //              })
    //         } else {
    //             let obj = {
    //                 "first_name": this.tempClient.value.name,
    //                 "last_name": this.tempClient.value.name,
    //                 "email": this.tempClient.value.email,
    //                 "country": "USA",
    //                 "groups": this.groups.map((obj: any) => obj.id)
    //             }
    //              this.httpService.sendPostRequest(URLUtils.inviteConsumer, obj).subscribe((res: any) => {
    //                  if (!res.error) {
    //                     this.confirmationDialogService.confirm('Success', `Congratulations! You have successfully created temp client  ${this.tempClient.value.name} to  ${this.data.Title}`, false, 'Add Team Members', 'Cancel', true)
    //                          .then((confirmed) => {
    //                             this.OnFormCancel();
    //                          })
    //                  }
    //              })
    //         }
    //     } else if (this.inputsubmit == 'temp') {

    //         let obj = {
    //             "name": this.tempClient.value.name,
    //             "lastName": this.tempClient.value.lastName,
    //             "email": this.tempClient.value.email,
    //             "phone": this.tempClient.value.phonenumber,
    //             "clientType": this.tempClient.value.type,
    //             "country": "USA"
    //         }
    //         this.httpService.sendPostRequest(URLUtils.tempClientPost, obj).subscribe((res: any) => {
    //             //console.log("error "+JSON.stringify(res)); 
    //             this.tempClients.push(res);
    //             localStorage.setItem('tempClients', JSON.stringify(this.tempClients));
    //             this.onReset();
                //  this.tempClient.reset();

                // if (!res.error) {
                //     this.confirmationDialogService.confirm('Success', `${res.msg}`, false, 'Add Team Members', 'Cancel', true)
                //         .then((confirmed) => {
                //             this.OnFormCancel();
                //         })
                // }
    //         }, error => {
    //             //console.log("error "+JSON.stringify(error)); 
    //             this.toastr.error(error.error.errors[0].msg)
    //         },)
    //     }
    // }
    onReset() {
        this.submitted = false;
        this.tempClient.controls['name'].setValue(' ');
        this.tempClient.controls['lastName'].setValue(' ');
        this.tempClient.controls['email'].setValue(' ');
        this.tempClient.controls['confirmemail'].setValue(' ');
        this.tempClient.controls['country'].setValue(' ');
        this.tempClient.controls['phonenumber'].setValue(' ');

    }
    onResetentity() {
        this.entitysubmitted = false;
        this.entityClient.controls['fullname'].setValue(' ');
        this.entityClient.controls['contact_person'].setValue(' ');
        this.entityClient.controls['email'].setValue(' ');
        this.entityClient.controls['confirmemail'].setValue(' ');
        this.entityClient.controls['country'].setValue(' ');
        this.entityClient.controls['phonenumber'].setValue(' ');

    }

    removeTempClient(val: any) {
        let index = this.tempClients.findIndex((d: any) => d.id === val.id); //find index in your array
        this.tempClients.splice(index, 1);
        localStorage.setItem('tempClients', JSON.stringify(this.tempClients));
    }


    getCorp(){
        this.corporateData=true;
    }

    getClient(){
        this.corporateData=false;
        this.tempList==true
    }
}
