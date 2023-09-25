import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ModalService } from 'src/app/model/model.service';
import { HttpService } from 'src/app/services/http.service';
import { URLUtils } from 'src/app/urlUtils';
import { DocumentService } from '../document.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'delete-pages',
    templateUrl: 'delete-pages.component.html',
    styleUrls: ['delete-pages.component.scss']
})
export class DeletePagesComponent implements OnInit {

    data: any;
    imageUrl: any;
    isOriginalDocument: boolean = false;
    newDocumentName: any;
    DocumentNumbers: any;
    urlSafe: any;
    selectedStatus:any=true;
    constructor(private router: Router, private httpservice: HttpService,private toast: ToastrService, private sanitizer: DomSanitizer, private documentService: DocumentService, private modalService: ModalService) {

    }
    ngOnInit(): void {
        let userAgent = navigator.userAgent;
        if (userAgent.match(/firefox|fxios/i)) {
          window.scrollTo(0, 0);
          window.scrollBy({
            top: 0,
            left: 0,
            behavior: 'smooth'
          });
        }
        this.data = this.documentService.getItems();
        if (this.data == undefined || null || '') {
            this.router.navigate(['documents/view/client']);
        }
        this.newDocumentName=this.data.name;
        //console.log("edit metadata    " + JSON.stringify(this.data));
        this.httpservice.sendGetRequest(URLUtils.viewMergedDocuments(this.data)).subscribe((res: any) => {
            this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(res.url);;
            //console.log(JSON.stringify(this.urlSafe));
        });
    }
    isOriginalDoc(doc: any) {
        this.isOriginalDocument = doc;
        this.selectedStatus=doc;
    }
    conform(doc: any) {
        this.modalService.open(doc);
    }
    delPages() {
        let obj = {
            "docid": this.data?.id,
            "delete_page_numbers": this.DocumentNumbers,
            "replace_original": this.isOriginalDocument,
            "new_document_name": this.newDocumentName?this.newDocumentName: this.data.name,
        }
        //console.log("obj  " + JSON.stringify(obj));
        this.httpservice.sendPostRequest(URLUtils.deletePages, obj).subscribe((res: any) => {
            //console.log("res" + JSON.stringify(res));
            if (res.error == false) {
                this.httpservice.sendPutRequest(URLUtils.deletePagesQueue, res.data).subscribe((res: any) => {
                    if (res.error == false) {
                        this.modalService.open('doc-del-success');
                    }
                    //console.log("put call  " + JSON.stringify(res))
                },
                (error: HttpErrorResponse) => {
                    if (error.status === 401 || error.status === 403) {
                      const errorMessage = error.error.msg || 'Unauthorized';
                      this.toast.error(errorMessage);
                      console.log(error);
                    }
                  });
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

    closeModal(id: any) {
        this.modalService.close(id);
    }
    openModel(id: any) {
        this.modalService.open(id);
    }
    cancel() {
        let isMergeDoc: any = {
            isMerge: true
        };
        this.documentService.addToService(isMergeDoc);
        this.router.navigate(['documents/view/client']);
    }
    gotoTop(){
        $('html, body').animate({scrollTop:0}, 'slow');
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth'
        });
      }
      ngAfterViewInit(){
        this.gotoTop();
      }
}
