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
  selector: 'water-mark',
  templateUrl: 'water-mark.component.html',
  styleUrls: ['water-mark.component.scss']
})
export class WaterMarkComponent implements OnInit {
  fileToUpload: any;
  imageUrl: any;
  data: any;
  viewer = 'google';
  doc: any;
  fileName = '';
  uploadFile: any;
  constructor(private router: Router, private httpservice: HttpService, private toast: ToastrService, private documentService: DocumentService, 
    private modalService: ModalService,public sanitizer: DomSanitizer) {
  }
  ngOnInit(): void {
    this.data = this.documentService.getItems();
    if (this.data == undefined || null || '') {
      this.router.navigate(['documents/view/client']);
    }

  }

  // change(file: FileList) {
  //   this.fileToUpload = file.item(0);

  //   //Show image preview
  //   let reader = new FileReader();
  //   reader.onload = (event: any) => {
  //     this.doc = event.target.result;
  //   }
  //   reader.readAsDataURL(this.fileToUpload);
  // }
  uploadFiles() {

  }
  onFileSelected(event: any) {
    let file: File = event.target.files[0];

    this.uploadFile = new FormData();
    this.uploadFile.append('docid', this.data.id)
    this.uploadFile.append('file', file)
    this.uploadFile.append('watermark', 'true')
  }
  onSelectFile(event: any) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event) => { // called once readAsDataURL is completed
      
         let unsafeUrl:any= event?.target?.result;
         this.imageUrl = this.sanitizer.bypassSecurityTrustResourceUrl(unsafeUrl);
      }
    }
  }

  conform(doc: any) {
    this.modalService.open(doc);
  }
  postWatermark() {

    this.httpservice.sendPostRequest(URLUtils.addWatermaek, this.uploadFile).subscribe((res: any) => {
      if (res.error == false) {
        let obj:any=
          {
            "new_docid":res?.new_docid,
            "old_docid": res?.old_docid
          }
          
        
        this.httpservice.sendPutRequest(URLUtils.addWatermarkQueue,obj).subscribe((res: any) => {
          this.modalService.open('doc-watermark-success');
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
  save() {
    this.modalService.open('add-watermark');
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
