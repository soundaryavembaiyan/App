import { map } from 'rxjs/operators';
import { ConfirmationDialogService } from './../../confirmation-dialog/confirmation-dialog.service';
import { EmailService } from './../../email/email.service';
import { DatePipe } from '@angular/common';
import { Component, OnInit, Output } from '@angular/core';
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
import { NgxSpinnerService } from 'ngx-spinner';
import { MatIconModule } from '@angular/material/icon';
 
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
    editmetadata = false;
    isEncypted = false;
    isDecrypted = false;
    docapi = environment.doc2pdf;
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
    selectedGroupItems: any[] = [];
    groupViewItems: any[] = [];
    matters ='';
    errorMsg: boolean = false;
    isReverse: boolean = false;
    selectedValue: any;
    isFromEmail: boolean = false;
    selectedAttachments: any = [];
    fromCount : any;
    toCount : any;
    tabsel:any;
    selected_doc : any;
    reldata:any[]=[];
    corpData:any[]=[];
    selectedmatterType='internal';
    matter_type: any[] = [{'title':'Internal Matter','value':'internal'},{'title':'External Matter','value':'external'}];
    corp_matter_list:any[] = [];
    categories='';
    allowedFileTypes = ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','application/rtf','text/csv','text/rtf'];
    
    constructor(private httpservice: HttpService, private toast: ToastrService,
        private router: Router, private formBuilder: FormBuilder, private modalService: ModalService, public sanitizer: DomSanitizer,
        private documentService: DocumentService, private emailService: EmailService,
        private confirmationDialogService: ConfirmationDialogService,private spinnerService: NgxSpinnerService) {
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
                this.groupViewItems?.forEach((item: any) => {
                    item.isChecked = false;
                })
            }
        })

    }
    ngOnInit(): void {
        this.get_all_matters(this.selectedmatterType)
        this.emailService.emailObservable.subscribe((result: any) => {
            if (result) {
                this.isFromEmail = result;
            }
        });
        let client: any = localStorage.getItem('clientData');
        this.clientDetails = JSON.parse(client);
        let groupids: any = localStorage.getItem('groupIds');
        if (groupids) {
            this.selectedGroupItems = JSON.parse(groupids);
        }
        // this.selectedGroupItems = JSON.parse(groupids);
        //console.log("client data " + this.clientDetails);
        this.relationshipSubscribe = this.httpservice.getFeaturesdata(URLUtils.getAllRelationship).subscribe((res: any) => {
            this.reldata = res?.data?.relationships;
            this.httpservice.getFeaturesdata(URLUtils.getCalenderExternal).subscribe((res: any) => {
                this.corpData = res?.relationships.map((obj:any)=>({ "id": obj.id, "type": "corporate","name":obj.name}))
                this.data = this.reldata.concat(this.corpData)
                this.data.forEach((item: any) => {
                    if (item.name == this.clientDetails?.name) {
                        this.selectedValue = item;
                    }
                })
            });
            
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
        if(this.selectedGroupItems){
            this.get_all_matters(this.selectedmatterType)
        }
        // this.getAllDocuments();
        this.httpservice.sendGetRequest(URLUtils.getGroups).subscribe((res: any) => {
            this.groupViewItems = res?.data;
            this.groupViewItems.forEach((item: any) => {
                item.isChecked = false;
            })
        })
        //console.log("checked item " + JSON.stringify(this.groupViewItems));    
        // this.term = '';
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
            this.editmetadata = false;
            this.isDecrypted = false;
            this.isEncypted = false;
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
            this.get_all_matters(this.selectedmatterType)
            this.getAllDocuments();
            
        }
        //this.getAllDocuments();
        //console.log('isSelectGroup',this.isSelectGroup)
    }
    // selectGroupItem(item: any, val: any) {
    //     //console.log("selected item" + JSON.stringify(item) + val);
    //     if (val) {
    //         item.isChecked = val;
    //         this.selectedGroupItems.push(item);
    //         //this.selectedGroupItems = this.selectedGroupItems.filter((el:any, i:any, a:any) => i === a.indexOf(el));

    //     } else {
    //         item.isChecked = val;
    //         let index = this.selectedGroupItems.findIndex((d: any) => d.id === item.id);
    //         //console.log(item.id);
    //         this.selectedGroupItems.splice(index, 1);
    //     }
    //     //console.log("selected " + JSON.stringify(this.selectedGroupItems));
    // }

    selectGroupItem(item: any, val: any) {
        //console.log("selected item" + JSON.stringify(item) + val);
        if (!this.selectedGroupItems) {
            this.selectedGroupItems = []; // Empty array - null
        }
    
        if (val) {
            item.isChecked = val;
            this.selectedGroupItems?.push(item);
        } else {
            item.isChecked = val;
            let index = this.selectedGroupItems.findIndex((d: any) => d.id === item.id);
            if (index !== -1) {
                this.selectedGroupItems.splice(index, 1);
            }
            //console.log("selected " + JSON.stringify(this.selectedGroupItems));
        }
    }

    removeGroup(item: any) {
        item.isChecked = false;
        let index = this.selectedGroupItems?.findIndex((d: any) => d.id === item.id); //find index in your array
        this.selectedGroupItems?.splice(index, 1);
        this.get_all_matters(this.selectedmatterType)
        this.getAllDocuments();
    }
    addEvent(test: any, val: any) {
        //console.log("val" + val)
        this.editDoc.expiration_date = val;
    }
    get f() { return this.editDocform.controls; }

    editDocInfo(doc: any,tabsel?:any) {
        
        //console.log('form', this.editDocform)
        this.editDoc = JSON.parse(JSON.stringify(doc));

        //console.log('this.editDoc',this.editDoc)

        if(tabsel=='encrypt'){
            this.tabsel = 'encrypt'
        } else if(tabsel=='decrypt'){
            this.tabsel = 'decrypt'
        }
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
                this.isDecrypted = false;
                this.isEncypted = false;
                this.editmetadata = true;
                this.modalService.open('custom-modal-1');
                this.getAllDocuments();
            }
        },
        (error: HttpErrorResponse) => {
            if (error.status === 401 || error.status === 403) {
              const errorMessage = error.error.msg || 'Unauthorized';
              this.toast.error(errorMessage);
              //console.log(error);
            }
          }
        );
        this.reset();
    }
    get_all_matters(type:any,event?:any){
        this.spinnerService.show()
        let selectedGroups: any = [];
        this.selectedGroupItems?.forEach((item: any) => {
            selectedGroups.push(item.id)
        })
        let payload = {"grp_acls":selectedGroups}
        if(type=='internal'){
            this.httpservice.sendPutRequest(URLUtils.getAllMatters,payload).subscribe((res:any)=>{
                if(res.error == false){
                    this.corp_matter_list = res.matterList
                    this.onChangeMatters("")
                    this.spinnerService.hide()
                } else {
                    this.spinnerService.hide()
                }
            },(err:any)=>{
                //console.log(err)
                this.spinnerService.hide()
            })
        }
        if(type == 'external'){
            this.httpservice.sendPutRequest(URLUtils.getAllExternalMatters,payload).subscribe((res:any)=>{
                if(res){
                    this.corp_matter_list = res.matterList
                    this.onChangeMatters("")
                    this.spinnerService.hide()
                }
            },(err:any)=>{
                this.spinnerService.hide()
            })

        }
    }
    contentLoaded() {
        //console.log('File loaded');
    }
    getAllDocuments() {
        //console.log('get.documents',this.documents)
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
            "matters": this.matters,
            "subcategories":this.categories,
            "groups": selectedGroups,
            "showPdfDocs": false
        }
        let url = this.viewMode == 1 ? URLUtils.getFilteredDocuments : URLUtils.filterMergeDoc;
        //console.log('url',url)
        if (clientId || selectedGroups.length > 0 )
            this.httpservice.sendPutRequest(url, obj).subscribe((res: any) => {
                if (this.viewMode == 1)
                    this.documents = res?.data?.reverse();
                else
                    this.documents = res?.data?.items?.reverse()
                //console.log("documents " + JSON.stringify(this.documents));
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
                  //console.log(error);
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
        this.pdfSrc = ''
        if(item.added_encryption){
           
            var body = new FormData();
            body.append('docid', item.id)
            let url = environment.apiUrl + URLUtils.decryptFile
            this.spinnerService.show()
            this.httpservice.sendPostDecryptRequest(url,body).subscribe((res:any)=>{
                const blob = new Blob([res], { type: item.content_type });
                const url = URL.createObjectURL(blob);
                if(this.allowedFileTypes.includes(item.content_type)){
                    let fdata = new FormData();
                    fdata.append('file', blob);
                    this.httpservice.sendPostDecryptRequest(environment.DOC2FILE,fdata).subscribe((ans:any)=>{
                        const ansBlob = new Blob([ans], { type: 'application/pdf' });
                        const ansUrl = URL.createObjectURL(ansBlob);
                        this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(ansUrl)
                        this.spinnerService.hide()
                    })

                } else{
                    this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(url)
                    this.spinnerService.hide()
                }   
                
              
                console.log(this.pdfSrc)
            })
            this.spinnerService.hide()
        } 
        if(item.added_encryption==false)  {
            this.httpservice.sendGetRequest(URLUtils.viewDocuments(item)).subscribe((res: any) => {
                if(this.allowedFileTypes.includes(item.content_type)){
                    this.spinnerService.show()
                    this.httpservice.sendPostDocRequest(this.docapi,{'url':res.data.url}).subscribe((ans:any)=>{
                        const blob = new Blob([ans], { type: 'application/pdf' });
                        // Create a URL for the Blob
                        const url = URL.createObjectURL(blob);
                        this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(url)
                        this.spinnerService.hide()
                    })
                    
    
                } else {
                    this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(res.data.url);
                }
                
                //console.log(" this.view    " + JSON.stringify(this.documents));
            });
            this.pdfSrc = item.filename;

        }
    
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
            // console.log(" this.view    " + JSON.stringify(this.urlSafe));
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
        if(this.selectedmatterType=='external'){
            this.categories = val.value
            this.matters = ''
            this.getAllDocuments();
        } else {
            this.matters = val.value;
            this.categories = ''
            this.getAllDocuments();
        }
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
        //console.log('doc',doc)
        this.router.navigate(['documents/editmetadata']);
    }

    encryptdoc(doc:any){
        this.httpservice.sendPostRequest(URLUtils.encryptDoc(doc.id),'').subscribe((res:any)=>{
            this.spinnerService.show()
            if(res.error==false){
                this.isEncypted = true
                this.isDecrypted = false;
                this.isDelete = false;
                this.editmetadata = false;
                this.modalService.open('custom-modal-1');
                this.getAllDocuments()
                this.spinnerService.hide()

            }
            this.spinnerService.hide()
        })
    }
    
    decryptdoc(doc:any){
        this.httpservice.sendPostRequest(URLUtils.decryptDoc(doc.id),{'get_file':false}).subscribe((res:any)=>{
            if(res.error==false){
                this.spinnerService.show()
                this.isDecrypted = true
                this.isDelete = false;
                this.editmetadata = false;
                this.isEncypted = false;
                this.modalService.open('custom-modal-1');
                this.getAllDocuments()

            }
            this.spinnerService.hide()
            

        })
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
        if(doc.added_encryption){
        this.spinnerService.show()
        var body = new FormData();
        body.append('docid', doc.id)
        let url = environment.apiUrl + URLUtils.decryptFile
        //console.log(url)
        this.httpservice.sendPostDecryptRequest(url,body).subscribe((res:any)=>{
            const blob = new Blob([res], { type: doc.content_type });
            const url = URL.createObjectURL(blob);
            var anchor = document.createElement("a");
            anchor.download = doc?.filename;
            anchor.href = url;
            this.editDoc = doc;
            this.modalService.open('doc-download-success');
            anchor.click();
            // window.open(url, "_blank");
          })
          this.spinnerService.hide()
        } else{
            this.httpservice.sendGetRequest(URLUtils.downloadGeneralDocument(doc)).subscribe((res: any) => {
                if (res.error == false) {
                    this.spinnerService.show();
                    this.editDoc = doc;
                    this.modalService.open('doc-download-success');
                    //console.log("url " + JSON.stringify(res));
                    //window.open(res?.data?.url, "_blank");
                    this.spinnerService.hide()
                }
            });
        }
    }

    downloadMergePDF(doc: any) {
        this.fileName = doc.name;
        // console.log('fileName',this.fileName)
        // console.log('doc',doc)
        this.httpservice.sendGetRequest(URLUtils.downloadMergepdfFile(doc)).subscribe((res: any) => {
            if (res.error == false) {
                this.editDoc = doc;
                this.modalService.open('doc-download-success');
                window.open(res.url, "_blank");
            }else {
                this.toast.error(res.msg);
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
    restrictSpaces(event: any) {
        let inputValue: string = event.target.value;
        // Replace multiple spaces with a single space
        inputValue = inputValue.replace(/\s{2,}/g, ' ');
        event.target.value = inputValue;
    }
    restricttextSpace(event: any) {
        let inputValue: string = event.target.value;
        inputValue = inputValue.replace(/^\s+/, '');
        inputValue = inputValue.replace(/\s{2,}/g, ' ');
        event.target.value = inputValue;
        return;
    }
}
