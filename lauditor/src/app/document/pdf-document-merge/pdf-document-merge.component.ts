import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { ModalService } from 'src/app/model/model.service';
import { HttpService } from 'src/app/services/http.service';
import { DocumentModel } from 'src/app/shared/config-model';
import { URLUtils } from 'src/app/urlUtils';
import { DocumentService } from '../document.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
 

@Component({
    selector: 'pdf-document-merge',
    templateUrl: 'pdf-document-merge.component.html',
    styleUrls: ['pdf-document-merge.component.scss']
})
export class PdfDocumentMergeComponent implements OnInit, AfterViewInit, OnDestroy {
    query: any;
    product = environment.product;
    mergeDetail: any = FormGroup;
    docDetails: any = FormGroup;
    submitted = false;
    dcSubmitted: boolean = false;
    isAddpageNumber: boolean = false;
    bsValue = new Date();
    isShowBookMark: any = '0';
    iscustomPage: boolean = false;
    sub: any;
    docDetailsData: any;
    CollectedDocs: any = [];
    filter: any;
    doclist: any = new Array();
    selectedFont: string = "small";
    pagePosition: any;
    numberFormate: any;
    selectFontName: string = "small";
    clientDetails: any;
    remergeData: any;
    remergeTitle: string = "";
    remergeContent: string = "";
    docModelData: DocumentModel = new DocumentModel();
    responce: boolean = false;
    successMsg: any;
    groups: any;
    constructor(private fb: FormBuilder, private router: Router,private toast: ToastrService, private httpservice: HttpService, private documentService: DocumentService, private modalService: ModalService) {
        // this.router.events.subscribe((val) => {
        //     if (val instanceof NavigationEnd) {
        //         // this.filter = window.location.pathname.split("/").splice(-2)[1];
        //         // //console.log("filter " + this.filter);
        //     }
        // });
    }

    drop(event: CdkDragDrop<string[]>) {
        moveItemInArray(this.CollectedDocs, event.previousIndex, event.currentIndex);
        //console.log("re-order" + JSON.stringify(this.CollectedDocs));


    }
    ngOnInit(): void {
        this.filter = localStorage.getItem('filter');
        this.mergeDetail = this.fb.group({
            name: ['', Validators.required],
            title: [''],
            content: [''],
            search: ['']

        });
        this.docDetails = this.fb.group({
            header: ['', Validators.required],
            body: ['', Validators.required],
            bookmark: ['']
        })
        this.remergeData = this.documentService.getItems();
        this.docModelData = this.documentService.getDocModel()
        this.CollectedDocs = this.remergeData?.convretRes ? this.remergeData.convretRes : this.docModelData?.doclist;
        this.clientDetails = this.remergeData?.data ? this.remergeData.data.clients : this.docModelData?.clients;
        if (this.CollectedDocs && this.CollectedDocs.length > 0) {
            let result = Object.assign({}, this.CollectedDocs.map((a: any) => a.id)); // filter id's from array
           
        }
        let groupsList:any= localStorage.getItem("groupIds");
        this.groups =JSON.parse(groupsList);
    }
    get f() {
        return this.mergeDetail.controls;
    }
    get dc() {
        return this.docDetails.controls;
    }
    addDocument() {
        this.docModelData.name = this.mergeDetail.value.name;
        this.docModelData.title = this.mergeDetail.value.title;
        this.docModelData.content = this.mergeDetail.value.content;
        this.docModelData.body = '';
        this.docModelData.show_bookmark = this.isShowBookMark;
        this.docModelData.showpagenum = this.docModelData.showpagenum;
        this.docModelData.cutomepage = this.iscustomPage;
        this.docModelData.pagenumalign = this.pagePosition;
        this.docModelData.pagenumtemplate = "default";
        this.docModelData.pagenumfontsize = this.selectFontName;
        this.documentService.addDocModel(this.docModelData);
        this.router.navigate(['documents/mergepdf/'+this.filter]);
    }
    onSubmit() {
        this.submitted = true;
        if (this.mergeDetail.invalid) {
            return;
        }
        this.docModelData.show_bookmark = this.isShowBookMark;
        let newObj: any = {};
        //------------ start page format --------------------
        let pageTemp = {
            "pagenumtemplate": this.numberFormate,
            "pages": "1-",
            "pagenumrangestart": "1"
        }
        let pageFormate = {
            "0": pageTemp
        }
        //--------------- end  page format---------------------

        //-----------------start document list details----------------
        this.CollectedDocs.forEach((item: any) => {
            if (this.isShowBookMark) {
                item.bookmark = item.bookmark;
            }
            let doclist_details = {

                "header": item?.header ? item?.header : '',
                "bookmark": item?.bookmark ? item?.bookmark : '',
                "body": item?.body ? item?.body : ""
            }

            var output = JSON.parse(JSON.stringify(doclist_details)); // to remove undefine values in object
            // let obj = {
            //     [item.id]: doclist_details
            // }
            newObj[item.id] = doclist_details;

        })
        // let doclistDetails = Object.assign(newObj);
        //-----------------end document list details----------------


        // -----------------------start doclist --------------------
        this.doclist = [];
        this.CollectedDocs.forEach((item: any) => {
            this.doclist.push(item.id);
        })
        let result = Object.assign({}, this.doclist); // {0:"a", 1:"b", 2:"c"}
        // -----------------------end doclist -----------------------

        //-------------------------start client details--------------


        let clientInfo = new Array();
        this.clientDetails?.forEach((item: any) => {
            let clientData = {
                "id": item.id,
                "type": item.type
            }
            clientInfo.push(clientData);
        })
        //------------------------end client details -------------------
        this.docModelData.name = this.mergeDetail.value.name;
        this.docModelData.title = this.mergeDetail.value.title;
        this.docModelData.content = this.mergeDetail.value.content;
        this.docModelData.body = '';
        this.docModelData.doclist = result;
        this.docModelData.show_bookmark = this.isShowBookMark;
        this.docModelData.showpagenum = this.isAddpageNumber == true ? '1' : '0';
        this.docModelData.pagenumalign = this.pagePosition ? this.pagePosition : '';
        this.docModelData.pagenumtemplate = "default";
        this.docModelData.pagenumfontsize = this.selectFontName;
        this.docModelData.pagenumtemplate_info = this.numberFormate ? pageFormate : {};
        this.docModelData.cutomepage = this.iscustomPage;
        this.docModelData.user = localStorage.getItem('name');
        this.docModelData.doclist_details = newObj;
        this.docModelData.category = this.filter;
        if (this.filter == 'client') {
            this.docModelData.clients = clientInfo ? clientInfo : this.remergeData.clients;
            this.docModelData.matters = this.docModelData.matters;
        } else {
            let groupList:any=[];
            this.groups.forEach((item:any)=>{
                groupList.push(item.id)
            })
            this.docModelData.group_acls = groupList;
        }
        // let requestedPath = this.filter === 'client' ? URLUtils.MergePdfDocumentsClient : URLUtils.postDocumentsFirm;
        this.httpservice.sendPostRequest(URLUtils.MergePdfDocumentsClient, this.docModelData).subscribe((res: any) => {
            if (res.error == false || res.error == true) {
                this.successMsg = res;
                this.modalService.open('custom-modal-2');
                localStorage.removeItem('clientDetail');
                // if(this.product == 'corporate'){
                //     this.router.navigate(['documents/view/firm']);
                // }
            }

        }, 
        // (error: any) => {
        //     //console.log("error " + JSON.stringify(error));
        // });
        (error: HttpErrorResponse) => {
            if (error.status === 401 || error.status === 403) {
              const errorMessage = error.error.msg || 'Unauthorized';
              this.toast.error(errorMessage);
              console.log(error);
            }
      
          })
    }

    onDcSubmit() {
        this.dcSubmitted = true;
        if (this.docDetails.valid) {
            this.modalService.close('custom-modal-1');
        }
     
        if (this.docDetails.invalid) {
            return;
        }

        this.CollectedDocs.forEach((item: any) => {
            if (item.id == this.docDetailsData.id) {
                item.header = this.docDetails.value.header;
                item.body = this.docDetails.value.body;
                item.bookmark=this.docDetails.value.bookmark;
            }
        })
    }
    addPageNumber(bool: boolean) {
        this.isAddpageNumber = bool ? true : false;
    }
    showBookmark(bool: boolean) {
        this.isShowBookMark = bool ? '1' : '0';

    }
    customPage(bool: boolean) {
        this.iscustomPage = bool ? true : false;
    }
    addDocDetails(doc: any) {
        this.docDetailsData = doc;
        //console.log("data additional doc   " + JSON.stringify(this.docDetailsData));
    }
    removeDocument(doc: any) {
        let index = this.CollectedDocs.findIndex((d: any) => d.id === doc.id); //find index in your array
        this.CollectedDocs.splice(index, 1);
    }
    numberFormat(value: any) {
        this.numberFormate = value.value;
    }
    numberPositionChange(value: any) {
        this.pagePosition = value.value;

    }
    selectFont(data: any) {
        this.selectFontName = data;

    }
    openModal(id: string) {
        this.modalService.open(id);
    }

    closeModal(id: string) {
        this.modalService.close(id);
        if(this.product == 'corporate'){
            this.router.navigate(['documents/view/firm']);
        }
    }
    onReset() {
        this.submitted = false;
        this.docDetails.reset();
    }
    cancel() {
        let isMergeDoc: any = {
            isMerge: true
        };
        this.documentService.addToService(isMergeDoc);
        if(this.product == 'corporate'){
        this.router.navigate(['documents/view/firm']);
        }
        else{
        this.router.navigate(['documents/view/client']);
        }
        localStorage.removeItem('clientDetail')
    }

    ngAfterViewInit(): void {
        localStorage.removeItem('selectedDocs');
        // localStorage.removeItem('clientDetail');
    }
    clearTest(){
        this.docDetails.controls['header'].setValue('');
        this.docDetails.controls['body'].setValue('');
    }
    ngOnDestroy() {

    }
}
