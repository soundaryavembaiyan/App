import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalService } from 'src/app/model/model.service';
import { HttpService } from 'src/app/services/http.service';
import { URLUtils } from 'src/app/urlUtils';
import { DocumentService } from '../document.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
 

@Component({
    selector: 'edit-metadata',
    templateUrl: 'edit-metadata.component.html',
    styleUrls: ['edit-metadata.component.scss']
})
export class EditMetadataComponent implements OnInit {
    imageUrl: any;
    values: any = [];
    tags = { 'tagtype': '', 'tag': '' };
    data: any;
    constructor(private router: Router, private httpservice: HttpService, private toast: ToastrService, private documentService: DocumentService, private modalService: ModalService) {

    }
    ngOnInit(): void {
        this.data = this.documentService.getItems();
        if (this.data == undefined || null || '') {
            this.router.navigate(['documents/view/client']);
        }
        //console.log("edit metadata    " + JSON.stringify(this.data));
    }

    removevalue(i: any) {
        this.values.splice(i, 1);
    }

    addvalue() {
        this.values.push({ tagtype: "", tag: "" });
    }
    submit() {

        //console.log(JSON.stringify(this.values));
    }
    conform(doc: any) {
        this.modalService.open(doc);
    }


    addTags() {

        let resultObj:any={};

        this.values.forEach((item: any) => {
            resultObj[item.tagtype] = item.tag
           
        });
        //console.log("tagsArray  " + resultObj);
        let obj = {
            name: this.data.name,
            tags:   resultObj 
        }
        //console.log("obj  " + JSON.stringify(obj));
        this.httpservice.sendPutRequest(URLUtils.updateMergedpdfTags(this.data), obj).subscribe((res: any) => {
            //console.log("res" + res);
            if (res.error == false) {
                this.modalService.open('doc-editmeta-success');
                
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
}
