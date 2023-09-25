import { ConfirmationDialogService } from './../../../confirmation-dialog/confirmation-dialog.service';
import { Component, OnDestroy, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { URLUtils } from 'src/app/urlUtils';
import { FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-relationship-exchange',
    templateUrl: 'relationship-exchange.component.html',
    styleUrls: ['relationship-exchange.component.scss']
})
export class RelationshipExchangeComponent implements OnInit {

    @Input() reldata: any = {};
    @Input() activeTab: any;
    @Output() event = new EventEmitter<string>();
    relname: string = "";
    isDesc: boolean = false;
    profileInfo: any;
    searchText: any = '';
    currentTab: string = 'documents';
    currentInnerTab: string = 'sharedwithus';
    docsSharedwithus: any;
    docsSharedbyus: any = [];
    urlSafe: any;
    viewClientDocuments: boolean = true;
    viewFirmDocuments: boolean = false;
    clientDocuments: any = [];
    firmDocuments: any = [];
    allDocs: any = [];
    searchDocText: string = '';
    openconfirmationunmodifiedDoc: boolean = true;
    openconfirmationAddedDoc: boolean = true;
    openconfirmationRemovedDoc: boolean = true;
    viewSharedDoc: boolean = true;
    clientandfirmviewexpanded: boolean = false;
    sharedandUnsharedData: any = { 'add': [], 'remove': [], 'message': "" };
    isConformation: boolean = false;
    unchangedDocs: any = [];
    message: string = '';
    isEntityProfile: boolean = false;
    sharedIds: string[] = [];
    unsharedIds: string[] = [];
    clientId: string = "";
    grp_acls:any[]=[];
    isReverse:boolean=false;
    documents: any = [];
    showview: boolean = false;
    product= environment.product;
    category: any;
    
    constructor(private formBuilder: FormBuilder,
        private httpService: HttpService,
        private confirmationDialogService: ConfirmationDialogService,
        private sanitizer: DomSanitizer,
        private aroute: ActivatedRoute,
        private toast: ToastrService,
        private router: Router) {
    }

    ngOnInit() {
        this.clientId = this.reldata['client_id']
        this.grp_acls = this.reldata.groups.map((obj: any) => { return obj.id })
        this.reldata.clientType == 'Entity' ? this.isEntityProfile = true : this.isEntityProfile = false;

        if (this.activeTab == 'corporate' || environment.product == 'corporate') {

            this.httpService.sendGetRequest(URLUtils.relationshipExchangeInfoProfileCorp(this.reldata)).subscribe((res: any) => {
                if (res && res.data) {
                    this.profileInfo = res?.data;
                    //console.log('pro',this.profileInfo)
                }
            });
        }
        else {
            this.httpService.sendGetRequest(URLUtils.relationshipExchangeInfoProfile(this.reldata)).subscribe((res: any) => {
                if (res && res.data) {
                    this.profileInfo = res?.data;
                }
            });
        }

        this.documentsClick()
        console.log('Category:', this.category);
    }

    documentsClick() {
        if (this.activeTab == 'corporate' || environment.product == 'corporate') {
            this.httpService.sendGetRequest(URLUtils.relationshipDocsSharedwithusCorp(this.reldata)).subscribe((res: any) => {
                if (res && res.documents){
                    if(this.reldata.clientType == 'Entity'){
                        this.docsSharedwithus = res?.documents?.general;
                    }
                    if(this.reldata.clientType == 'Consumer'){
                        let identity: any[] = []; 
                        let personal: any[] = []; 
                        identity = res?.documents?.identity;
                        personal = res?.documents?.personal;
                        this.docsSharedwithus = identity.concat(personal)
                    }
                }
            });

        } else {

            this.httpService.sendGetRequest(URLUtils.relationshipDocsSharedwithus(this.reldata)).subscribe((res: any) => {
                if (res && res.documents){
                    if(this.reldata.clientType == 'Entity'){
                        this.docsSharedwithus = res?.documents?.general;
                    }
                    if(this.reldata.clientType == 'Consumer'){
                        let identity: any[] = []; 
                        let personal: any[] = []; 
                        identity = res?.documents?.identity;
                        personal = res?.documents?.personal;
                        this.docsSharedwithus = identity.concat(personal)
                    }
                }
            });

        }
       
    }
    docssharedbyus() {

        if (this.activeTab == 'corporate' || environment.product == 'corporate'){

            this.httpService.sendGetRequest(URLUtils.relationshipDocsSharedbyusCorp(this.reldata)).subscribe((res: any) => {
                if (res && res.documents){
                    this.docsSharedbyus = res?.documents?.general;
                }
            });
    
            this.httpService.sendPutRequest(URLUtils.getFilteredDocuments,
                {"category":"client", "clients": this.clientId}).subscribe(
                (res: any) => {
                    this.clientDocuments = res?.data;
                    this.mergeClientandFirmDoc();
            },
            (error: HttpErrorResponse) => {
                if (error.status === 401 || error.status === 403) {
                  const errorMessage = error.error.msg || 'Unauthorized';
                  this.toast.error(errorMessage);
                  console.log(error);
                }
              }
            )
    
            this.httpService.sendPutRequest(URLUtils.getFilteredDocuments,
                {"category":"firm", "groups": this.grp_acls}).subscribe(
                (res: any) => {
                    this.firmDocuments = res?.data;
                    this.mergeClientandFirmDoc();
            },
            (error: HttpErrorResponse) => {
                if (error.status === 401 || error.status === 403) {
                  const errorMessage = error.error.msg || 'Unauthorized';
                  this.toast.error(errorMessage);
                  console.log(error);
                }
              }
            )
            // this.httpService.sendGetRequest(URLUtils.getFirmDocuments).subscribe((res: any) => {
            //     this.firmDocuments = res?.docs;
            //     this.mergeClientandFirmDoc();
            // });
            this.sharedandUnsharedData = { 'add': [], 'remove': [], 'message': "" };

        } else {
            this.httpService.sendGetRequest(URLUtils.relationshipDocsSharedbyus(this.reldata)).subscribe((res: any) => {
                if (res && res.documents){
                    this.docsSharedbyus = res?.documents?.general;
                }
            });
    
            this.httpService.sendPutRequest(URLUtils.getFilteredDocuments,
                {"category":"client", "clients": this.clientId}).subscribe(
                (res: any) => {
                    this.clientDocuments = res?.data;
                    this.mergeClientandFirmDoc();
            },
            (error: HttpErrorResponse) => {
                if (error.status === 401 || error.status === 403) {
                  const errorMessage = error.error.msg || 'Unauthorized';
                  this.toast.error(errorMessage);
                  console.log(error);
                }
              }
            )
    
            this.httpService.sendPutRequest(URLUtils.getFilteredDocuments,
                {"category":"firm", "groups": this.grp_acls}).subscribe(
                (res: any) => {
                    this.firmDocuments = res?.data;
                    this.mergeClientandFirmDoc();
                   
            },
            (error: HttpErrorResponse) => {
                if (error.status === 401 || error.status === 403) {
                  const errorMessage = error.error.msg || 'Unauthorized';
                  this.toast.error(errorMessage);
                  console.log(error);
                }
              }
            )
            // this.httpService.sendGetRequest(URLUtils.getFirmDocuments).subscribe((res: any) => {
            //     this.firmDocuments = res?.docs;
            //     this.mergeClientandFirmDoc();
            // });
            this.sharedandUnsharedData = { 'add': [], 'remove': [], 'message': "" };

        }
        
    }
    mergeClientandFirmDoc() {
        this.allDocs = [];
        let cdocs: any[] = [];
        let fdocs: any[] = [];
        let sharedIds = this.docsSharedbyus.map((obj: any) => { return obj.id})
        this.clientDocuments.forEach((item: any, index: number) => {
            if(sharedIds.indexOf(item.id) == -1){
                cdocs.push(item)
            }
        })
        this.firmDocuments.forEach((item: any, index: number) => {
            if(sharedIds.indexOf(item.id) == -1){
                fdocs.push(item)
            }
        })
        this.clientDocuments = cdocs
        this.firmDocuments = fdocs
        this.allDocs = this.allDocs.concat(this.clientDocuments);
        this.allDocs = this.allDocs.concat(this.firmDocuments);
    }

    onReset() {
        this.isConformation = false;
        this.sharedandUnsharedData.remove = [];
        this.sharedandUnsharedData.add = [];
        this.docssharedbyus();
        //this.toast.error('Documents Not selected!');
    }
    onConfirmReset() {
        this.isConformation = false;
    }
    unShare(doc: any) {
        doc['highlight'] = true
        console.log('doc:', doc);
        console.log('doc:', doc?.category);
        this.sharedandUnsharedData.remove.push(doc);
        let i = this.sharedandUnsharedData.add.findIndex((d: any) => d.id === doc.id); //find index in your array
        if (i > -1) {
            this.sharedandUnsharedData.add.splice(i, 1);
        }
        
        //Old one!
        //doc.category == 'firm' ? this.firmDocuments.push(doc) : this.clientDocuments.push(doc);

        //New one for corporate and other products!
        if (this.product == 'corporate') {
            doc.category == 'firm' ? this.clientDocuments.push(doc) : this.firmDocuments.push(doc);
        }
        if (this.product != 'corporate') {
            doc?.category == 'firm' ? this.firmDocuments.push(doc) : this.clientDocuments.push(doc);
            doc?.category == 'client' ? this.clientDocuments.push(doc) : this.firmDocuments.push(doc);
        }

        console.log('doc.category:', doc?.category);
        // console.log('Client result:', doc?.category === 'client');
        // console.log('Firm result:', doc?.category === 'firm');

        let index = this.docsSharedbyus.findIndex((d: any) => d.id === doc.id); //find index in your array
        this.docsSharedbyus.splice(index, 1);
    }
    share(doc: any, type: string) {
        doc['highlight'] = true
        this.sharedandUnsharedData.add.push(doc);
        this.docsSharedbyus.push(doc);
        let index = this.sharedandUnsharedData.remove.findIndex((d: any) => d.id === doc.id); //find index in your array
        if(index > -1){
            this.sharedandUnsharedData.remove.splice(index, 1);
        }
        if (type == 'client') {
            let index = this.clientDocuments.findIndex((d: any) => d.id === doc.id); //find index in your array
            this.clientDocuments.splice(index, 1);
        } else {
            let index = this.firmDocuments.findIndex((d: any) => d.id === doc.id); //find index in your array
            this.firmDocuments.splice(index, 1);
        }
    }
    shareClick() {
        this.isConformation = !this.isConformation;
        let val = [...this.sharedandUnsharedData.add, ...this.sharedandUnsharedData.remove];
        this.unchangedDocs = this.docsSharedbyus.filter((el: any) => {
            return !val.find((element: any) => {
                return element.id === el.id;
            });
        });
    }
    updateShareandUnshareDoc() {
        

        if (this.activeTab == 'corporate' || environment.product == 'corporate'){
            let data = {
                'add': this.sharedandUnsharedData.add.map((obj: any) => ({ "docid": obj.id, "doctype": "general" })),
                'message': this.message,
                'remove': this.sharedandUnsharedData.remove.map((obj: any) => ({ "docid": obj.id, "doctype": "general" })),
                "relid":this.reldata?.id
            }
            this.httpService.sendPostRequest(URLUtils.shareRelationshipDocumentsCorp,data).subscribe((res: any) => {
                if (!res.error) {
                    let aroute = this.aroute
                    this.confirmationDialogService.confirm('Success',
                        'Congratulations!! You have successfully completed document exchange actions with ' + this.profileInfo.fullname,false, '', '', false,"sm", false)
                        .then(() => {})
                    this.event.emit('exchange-close')
                } else {
                    alert(res.msg);
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
        else {
            let data = {
                'add': this.sharedandUnsharedData.add.map((obj: any) => ({ "docid": obj.id, "doctype": "general" })),
                'message': this.message,
                'remove': this.sharedandUnsharedData.remove.map((obj: any) => ({ "docid": obj.id, "doctype": "general" })),
            }
            this.httpService.sendPutRequest(URLUtils.shareRelationshipDocuments(this.reldata), data).subscribe((res: any) => {
                if (!res.error) {
                    let aroute = this.aroute
                    this.confirmationDialogService.confirm('Success',
                        'Congratulations!! You have successfully completed document exchange actions with ' + this.profileInfo.fullname,false, '', '', false,"sm", false)
                        .then(() => {})
                    this.event.emit('exchange-close')
                } else {
                    alert(res.msg);
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
        
    }
    copyWithmeDoc(doc: any) {
        let args = {'relId': this.reldata.id, 'docid': doc.id }
        this.confirmationDialogService.confirm('Confirm', 'Are you sure! You want to copy ' + doc.name,true, 'Yes', 'No')
        //this.confirmationDialogService.confirm('Confirm', ' Are you sure! Do you want to copy!', true, 'Yes', 'No')
            .then((confirmed) => {
                if (confirmed) {
                    this.httpService.sendGetRequest(URLUtils.relationshipCopyDoc(args)).subscribe((res: any) => {
                        if(res.error){
                            this.confirmationDialogService.confirm('Error', res.msg,true, "Ok", "Close", false,"sm");
                        }
                        if(!res.error){
                            this.confirmationDialogService.confirm('Success', res.msg,true, "Ok", "Close", false,"sm");
                        }
                    });
                }
            }).catch(() => {});
    }
    viewDoc(id: any) {
        let args = {
            'relId': this.reldata.id,
            'docid': id
        }
        if (this.activeTab == 'corporate' || environment.product == 'corporate'){

            this.httpService.sendGetRequest(URLUtils.relationshipViewDocCorp(args)).subscribe((res: any) => {
                if (res && !res.error) {
                    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(res.url);
                    let obj = {
                        'isIframe': true,
                        'url': this.urlSafe
                    }
                    this.confirmationDialogService.confirm('View', obj,true, "Ok", "Close", false,"lg");
                }
                else {
                    alert(res.msg)
                }
            });

        } else {

            this.httpService.sendGetRequest(URLUtils.relationshipViewDoc(args)).subscribe((res: any) => {
                if (res && !res.error) {
                    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(res.url);
                    let obj = {
                        'isIframe': true,
                        'url': this.urlSafe
                    }
                    this.confirmationDialogService.confirm('View', obj,true, "Ok", "Close", false,"lg");
                }
                else {
                    alert(res.msg)
                }
            });

        }
        
    }
    

    viewGenDoc(id: any){
        this.httpService.sendGetRequest(URLUtils.viewDocuments({"id": id})).subscribe((res: any) => {
            if (res && !res.error) {
                this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(res.data.url);
                let obj = {
                    'isIframe': true,
                    'url': this.urlSafe
                }
                this.confirmationDialogService.confirm('View', obj,true, "Ok", "Close", false,"lg");
            }
            else {
                alert(res.msg)
            }
        });
    }
    
     sort(property: any, docsShared: any) {
        let docs = docsShared;
        this.isDesc = !this.isDesc; //change the direction    
        // this.column = property;
        let direction = this.isDesc ? 1 : -1;
        docs.sort(function (a: any, b: any) {
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
    
        sortingFile(val: any) {
            this.isReverse = !this.isReverse;
            if (this.isReverse) {
                this.documents = this.documents?.sort((p1: any, p2: any) => (p1[val] < p2[val]) ? 1 : (p1[val] > p2[val]) ? -1 : 0);
            } else {
                this.documents = this.documents?.sort((p1: any, p2: any) => (p1[val] > p2[val]) ? 1 : (p1[val] < p2[val]) ? -1 : 0);
            }
        }

    
    cancel() {
        this.event.emit('exchange-close')
        }
       
    /**
                 this.confirmationDialogService.confirm('Confirm', 'Changes you made will not be saved. Do you want to continue?' ,true, 'Yes', 'No')
                .then((confirmed) => {
                    if (confirmed) {
                        
                    }
                    else{
                        this.event.emit('exchange-close')
                    }
                }).catch(() => {});
     */

}


