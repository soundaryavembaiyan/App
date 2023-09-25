import { map } from 'rxjs/operators';
import { ConfirmationDialogService } from './../../confirmation-dialog/confirmation-dialog.service';
import { EmailService } from './../../email/email.service';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { ModalService } from 'src/app/model/model.service';
import { HttpService } from 'src/app/services/http.service';
import { URLUtils } from 'src/app/urlUtils';
import { DocumentService } from '../document.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
 
@Component({
    selector: 'document-view',
    templateUrl: 'document-view.component.html',
    styleUrls: ['document-view.component.scss']
})
export class DocumentViewComponent implements OnInit {
    p: any=1;
    product = environment.product;
    sourcePath: any;
    query: any;
    fileName: string = "simple.pdf";
    relationshipSubscribe: any;
    documents: any = [];
    keyword = 'name';
    relationshipList: any;
    data: any;
    pdfSrc: any;
    viewer: string = "google";
    editDocform: any = FormGroup;
    submitted: any;
    editDoc: any;
    isDelete: boolean = false;
    bsValue: any;
    pipe = new DatePipe('en-US');
    viewMode = 1;
    value: any = 1;
    mergedDocuments: any;
    options: any = [{ name: "View-Uploaded", value: 1 }, { name: "View-Merged", value: 2 }];
    optionc: any = [{ name: "View-Uploaded", value: 1 }];
    public urlSafe: SafeResourceUrl;
    firmdocuments: any;
    filterKey: any;
    matterList: any;
    viewItemsList: any;
    remergeDetails: any;
    convretRes: any = [];
    clientDetails: any;
    term: any;
    isSelectGroup: boolean = false;
    selectedGroupItems: any = [];
    groupViewItems: any = [];
    matters: any;
    errorMsg: boolean = false;
    isReverse: boolean = false;
    selectedValue: any;
    isFromEmail: boolean = false;
    selectedAttachments: any = [];
    fromCount : any;
    toCount : any;
    constructor(private httpservice: HttpService, private toast: ToastrService,
        private router: Router, private formBuilder: FormBuilder, private modalService: ModalService, public sanitizer: DomSanitizer,
        private documentService: DocumentService, private emailService: EmailService,
        private confirmationDialogService: ConfirmationDialogService) {
        this.urlSafe = '';
        this.filterKey = this.router.url.split("/").splice(-2)[1];
        this.router.events.subscribe((val: any) => {
            if (val instanceof NavigationEnd) {
                this.filterKey = window.location.pathname.split("/").splice(-2)[1];
                this.filterKey == 'client' ? localStorage.removeItem('groupIds') : localStorage.removeItem('clientData');
                this.documents = [];
                this.selectedGroupItems = [];
                this.clientDetails = [];
                // removeing checked items while tab change
                this.groupViewItems.forEach((item: any) => {
                    item.isChecked = false;
                })
            }
        })

    }
    ngOnInit(): void {
        this.emailService.emailObservable.subscribe((result: any) => {
            if (result) {
                this.isFromEmail = result;
            }
        });
        let client: any = localStorage.getItem('clientData');
        this.clientDetails = JSON.parse(client);
        let groupids: any = localStorage.getItem('groupIds');
        this.selectedGroupItems = JSON.parse(groupids);
        //console.log("client data " + this.clientDetails);
        this.relationshipSubscribe = this.httpservice.getFeaturesdata(URLUtils.getAllRelationship).subscribe((res: any) => {
            this.data = res?.data?.relationships;
            this.data.forEach((item: any) => {
                if (item.name == this.clientDetails?.name) {
                    this.selectedValue = item;
                }
            })
            //console.log("selected value" + JSON.stringify(this.selectedValue));
        });
        this.viewItemsList = this.documentService.getItems();
        let MergeDoc = this.documentService.getItems();
        if (MergeDoc?.isMerge) {
            this.viewMode = 2;
            this.value = 2
        }
        this.editDocform = this.formBuilder.group({
            name: ['', Validators.required],
            description: ['', Validators.required],
            expiration_date: ['']
        });
        if (this.clientDetails || this.selectedGroupItems) {
            this.getAllDocuments();
        }
        // this.getAllDocuments();
        this.httpservice.sendGetRequest(URLUtils.getGroups).subscribe((res: any) => {
            this.groupViewItems = res?.data;
            this.groupViewItems.forEach((item: any) => {
                item.isChecked = false;
            })
        })
        //console.log("checked item " + JSON.stringify(this.groupViewItems));
    }
    selectDuration(date: any) {
        this.bsValue = date;
    }
    deleteDocument(val: any) {
        let selectedId: any = [];
        selectedId.push(val.id)
        let documentId: any = {
            docids: selectedId
        };
        this.httpservice.sendPostRequest(URLUtils.deleteDocument, documentId).subscribe((res: any) => {
            //console.log("res" + res);
            this.modalService.open('custom-modal-1');
            this.isDelete = true;
            this.getAllDocuments();
        },
        (error: HttpErrorResponse) => {
            if (error.status === 401 || error.status === 403) {
              const errorMessage = error.error.msg || 'Unauthorized';
              this.toast.error(errorMessage);
              console.log(error);
            }
          });
    }
    selectGroup(val: boolean) {
        this.isSelectGroup = val;
        if (!val) {
            this.getAllDocuments();
        }
        //this.getAllDocuments();
        console.log('isSelectGroup',this.isSelectGroup)
    }
    selectGroupItem(item: any, val: any) {
        //console.log("selected item" + JSON.stringify(item) + val);
        if (val) {
            item.isChecked = val;
            this.selectedGroupItems.push(item);
            //this.selectedGroupItems = this.selectedGroupItems.filter((el:any, i:any, a:any) => i === a.indexOf(el));

        } else {
            item.isChecked = val;
            let index = this.selectedGroupItems.findIndex((d: any) => d.id === item.id);
            //console.log(item.id);
            this.selectedGroupItems.splice(index, 1);
        }
        //console.log("selected " + JSON.stringify(this.selectedGroupItems));
    }
    removeGroup(item: any) {
        item.isChecked = false;
        let index = this.selectedGroupItems.findIndex((d: any) => d.id === item.id); //find index in your array
        this.selectedGroupItems.splice(index, 1);
        this.getAllDocuments();
    }
    addEvent(test: any, val: any) {
        //console.log("val" + val)
        this.editDoc.expiration_date = val;
    }
    get f() { return this.editDocform.controls; }

    editDocInfo(doc: any) {
        this.editDoc = JSON.parse(JSON.stringify(doc));
        //console.log("edit data " + JSON.stringify(this.editDoc));
    }
    onSubmit() {
        //console.log("date  " + this.bsValue);

        this.submitted = true;
        if (this.editDocform.invalid) {
            return;
        }
        this.editDocform.value.expiration_date = this.bsValue ? this.pipe.transform(this.bsValue, 'dd-MM-yyyy') : '';
        let item = this.editDocform.value;
        //console.log("date  " + JSON.stringify(item));
        this.httpservice.sendPutRequest(URLUtils.editDocuments(this.editDoc), item).subscribe((res: any) => {
            //console.log("res---edir" + JSON.stringify(res));
            if (res.error == false) {
                this.isDelete = false;
                this.modalService.open('custom-modal-1');
                this.getAllDocuments();
            }
        },
        (error: HttpErrorResponse) => {
            if (error.status === 401 || error.status === 403) {
              const errorMessage = error.error.msg || 'Unauthorized';
              this.toast.error(errorMessage);
              console.log(error);
            }
          }
        );
        this.reset();
    }

    contentLoaded() {
        //console.log('File loaded');
    }
    getAllDocuments() {
        this.documents = [];
        let selectedGroups: any = [];
        let clientId: any;
        this.selectedGroupItems?.forEach((item: any) => {
            selectedGroups.push(item.id)
        })
        if (this.clientDetails) {
            clientId = this.clientDetails?.id;
        }
        let obj = {
            "category": this.filterKey,
            "clients": clientId,
            "matters": this.matters?this.matters:'',
            "groups": selectedGroups,
            "showPdfDocs": false
        }
        let url = this.viewMode == 1 ? URLUtils.getFilteredDocuments : URLUtils.filterMergeDoc;
        if (clientId || selectedGroups.length > 0)
            this.httpservice.sendPutRequest(url, obj).subscribe((res: any) => {
                if (this.viewMode == 1)
                    this.documents = res?.data?.reverse();
                else
                    this.documents = res?.data?.items?.reverse();
                console.log("documents " + JSON.stringify(this.documents));
                this.documents.forEach((item: any) => {
                    item.expiration_date=item.expiration_date=='NA'?null:new Date(item.expiration_date);
                    
                    item.tags = Object.entries(item.tags);
                    item.isChecked = false;
                    if (this.viewItemsList && this.viewItemsList.length > 0) {
                        this.viewItemsList?.forEach((val: any) => {

                            if (item.name == val.name) {
                                item.isChecked = true;
                            }
                        })
                    }
                })
                this.errorMsg = this.documents.length == 0 ? true : false;
            },
            (error: HttpErrorResponse) => {
                if (error.status === 401 || error.status === 403) {
                  const errorMessage = error.error.msg || 'Unauthorized';
                  this.toast.error(errorMessage);
                  console.log(error);
                }
              });

    }
    selectEvent(item: any) {
        this.clientDetails = item;
        localStorage.setItem("clientData", JSON.stringify(item));
        this.httpservice.sendGetRequest(URLUtils.getMattersByClient(item)).subscribe((res: any) => {
            this.matterList = res?.matterList;
            // //console.log("matterList " + JSON.stringify(this.matterList));
        })
        //console.log("test   " + JSON.stringify(item));
        this.getAllDocuments();
    }

    onChangeSearch(val: string) {
        // fetch remote data from here
        // And reassign the 'data' which is binded to 'data' property.
    }

    onFocused(e: any) {
        // do something when input is focused
    }
    viewDocument(item: any) {
        this.httpservice.sendGetRequest(URLUtils.viewDocuments(item)).subscribe((res: any) => {
            this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(res.data.url);
            // this.pdfSrc = res.data.url;
            //console.log(" this.view    " + JSON.stringify(this.documents));
        });
        this.pdfSrc = item.filename;
    }
    viewDocumentAttachment(item: any, index: number) {
        this.httpservice.sendGetRequest(URLUtils.viewDocuments(item)).subscribe((res: any) => {
            this.selectedAttachments[index].path = res?.data?.url;
            if (index == this.selectedAttachments.length - 1) {
                localStorage.setItem("docs", JSON.stringify(this.selectedAttachments));
                this.router.navigate(['/emails']);
            }
        });
    }
    viewMergedDocument(item: any) {
        this.httpservice.sendGetRequest(URLUtils.viewMergedDocuments(item)).subscribe((res: any) => {
            this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(res.url);
            //console.log(" this.view    " + JSON.stringify(this.urlSafe));
            this.modalService.open('custom-modal-iframe');
            // //console.log(" this.view    " + JSON.stringify(this.documents));
        });
        this.pdfSrc = item.filename
    }
    openModal(id: string) {
        this.modalService.open(id);
    }

    closeModal(id: string) {
        this.modalService.close(id);
    }
    //<-----------------------------clent matters--------------->
    onChangeMatters(val: any) {
        //console.log("value " + JSON.stringify(val.value));
        this.matters = val.value;
        this.getAllDocuments();
    }
    //<-----------------------------dropdown upload or merged--------------->
    onChange(category: any) {
        //console.log(category.value);
        let filterItem = this.options.filter((item: any) => item.name == category.value);
        this.viewMode = filterItem[0]?.value;
        //console.log(this.viewMode);
        this.getAllDocuments();
    }
    //<----------merge document functions---------------->
    reMergeDocument(doc: any) {
        this.httpservice.sendGetRequest(URLUtils.editMergepdfFile(doc)).subscribe((res: any) => {
            // //console.log(" responce data" + JSON.stringify(res));      
            this.remergeDetails = res.data;
            Object.keys(this.remergeDetails.docnames).forEach(key => {
                this.convretRes.push({
                    'id': key,
                    'name': this.remergeDetails.docnames[key]
                });
            });
            this.remergeDetails.doclist = this.convretRes;
            // this.remergeDetails.clients=this.clientDetails;
            //console.log("responce edit data  " + JSON.stringify(this.remergeDetails));
            this.documentService.addDocModel(this.remergeDetails);
            this.router.navigate(['documents/pdfmergedoc/' + this.filterKey]);
        });


    }
    addWatermark(doc: any) {
        this.dataToService(doc);
        this.router.navigate(['documents/watermark']);
    }
    editDocMetadata(doc: any) {
        this.dataToService(doc);
        this.router.navigate(['documents/editmetadata']);

    }

    deletePdfDocument(doc: any) {
        this.httpservice.sendDeleteRequest(URLUtils.deleteMergedpdf(doc)).subscribe((res: any) => {
            //console.log("res" + res);
            this.modalService.open('custom-modal-1');
            this.isDelete = true;
            this.getAllDocuments();
        },
        (error: HttpErrorResponse) => {
            if (error.status === 401 || error.status === 403) {
              const errorMessage = error.error.msg || 'Unauthorized';
              this.toast.error(errorMessage);
              console.log(error);
            }
          });

    }
    addShortText(doc: any) {
        this.dataToService(doc);
        this.router.navigate(['documents/shorttext']);
    }
    deletePages(doc: any) {
        this.dataToService(doc);
        this.router.navigate(['documents/deletepages']);
    }
    addCustomPages(doc: any) {
        this.dataToService(doc);
        this.router.navigate(['documents/addpages']);
    }
    dataToService(doc: any) {
        this.documentService.addToService(doc);
    }
    downloadDoc(doc: any) {
        this.httpservice.sendGetRequest(URLUtils.downloadGeneralDocument(doc)).subscribe((res: any) => {
            if (res.error == false) {
                this.modalService.open('doc-download-success');
                //console.log("url " + JSON.stringify(res));
                window.open(res?.data?.url, "_blank");

            }
        });

    }

    downloadMergePDF(doc: any) {
        this.fileName = doc.name;
        this.httpservice.sendGetRequest(URLUtils.downloadMergepdfFile(doc)).subscribe((res: any) => {
            if (res.error == false) {
                this.modalService.open('doc-download-success');
                window.open(res.url, "_blank");
            }
        });
    }
    sortDocuments(val: any) {
        this.isReverse = !this.isReverse;
        if (this.isReverse) {
            this.documents = this.documents?.sort((p1: any, p2: any) => (p1[val] < p2[val]) ? 1 : (p1[val] > p2[val]) ? -1 : 0);
        } else {
            this.documents = this.documents?.sort((p1: any, p2: any) => (p1[val] > p2[val]) ? 1 : (p1[val] < p2[val]) ? -1 : 0);
        }
    }

    reset() {
        this.getAllDocuments();
    }
    ngOnDestroy() {
        if (this.relationshipSubscribe) {
            this.relationshipSubscribe.unsubscribe();
        }
    }
    selectDoc(doc: any, val: any) {
        if (val == true) {
            let obj = {
                "filename": doc.filename,
                "id": doc.id
            }
            this.selectedAttachments.push(obj);
        } else {
            this.selectedAttachments = this.selectedAttachments.filter((item: any) => item.id !== doc.id);
        }
    }
    saveAttachments() {
        this.selectedAttachments.forEach((item: any, index: number) => {
            this.viewDocumentAttachment(item, index);
        });
    }
    cancelAttachments() {
        this.router.navigate(['/emails']);
    }
    pageChanged(val: any) {
        this.fromCount = (val * 10) - 9;
        this.toCount = val * 10;
        //console.log("page change " + val);
    }
}
