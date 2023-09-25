import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ModalService } from 'src/app/model/model.service';
import { HttpService } from 'src/app/services/http.service';
import { URLUtils } from 'src/app/urlUtils';
import { DocumentService } from '../document.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
 

@Component({
  selector: 'add-short-text',
  templateUrl: 'add-short-text.component.html',
  styleUrls: ['add-short-text.component.scss']
})
export class AddShortTextComponent implements OnInit {
  imageUrl: any;
  shortTextData: any[] = []
  urlSafe: any;
  data: any;
  pages: any = [];
  myForm: FormGroup;
  submitted = false;
  position = [{ "name": "Bottom Left", "value": "left" }, { "name": "Bottom Right", "value": "right" }, { "name": "Bottom Center", "value": "center" },
  { "name": "Top Left", "value": "topleft" }, { "name": "Top Right", "value": "topright" }, { "name": "Top Center", "value": "topcenter" }];

  fontSize = [{ "name": "Small", "value": "small" }, { "name": "Medium", "value": "medium" },
  { "name": "Large", "value": "large" }, { "name": "XLarge", "value": "xlarge" }]

  constructor(private router: Router, private httpservice: HttpService, private toast: ToastrService, 
    private sanitizer: DomSanitizer, private documentService: DocumentService, 
    private modalService: ModalService, private formBuilder: FormBuilder) {
    this.myForm = this.formBuilder.group({
      smalltext_align: ['topcenter'],
      smalltext_fontsize: ['small'],
      smalltext_page: ['1'],
      smalltext_content: ['']
    })
  }
  ngOnInit(): void {
    let userAgent = navigator.userAgent;
    if (userAgent.match(/firefox|fxios/i)) {
        setTimeout(() => {
          this.gotoTop()
        }, 500);
    }
    this.addTemplate(false)
    this.data = this.documentService.getItems();
    if (this.data == undefined || null || '') {
      this.router.navigate(['documents/view/client']);
    }
    // //console.log("edit metadata    " + JSON.stringify(this.data));
    this.httpservice.sendGetRequest(URLUtils.viewMergedDocuments(this.data)).subscribe((res: any) => {
      this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(res.url);
    });
  }
  removeRow(index: any) {
    this.shortTextData.splice(index, 1)
  }

  addTemplate(isClose: boolean) {

    let data: any = { smalltext_content: "", smalltext_page: "", smalltext_align: "select", smalltext_fontsize: "select", isCloseIcon: isClose }
    this.shortTextData.push(data)

  }

  onKey(event: any, index: any, type: any) {
    //console.log(event.target.value + " ---- " + index + " ---- " + type)
    let value = event.target.value
    this.shortTextData[index][type] = value
    if (value == "")
      $('#' + index + "_" + type).text("This field is required")
    else
      $('#' + index + "_" + type).text("")

    if (type == "smalltext_content") {
      if (value.length == 0)
        $('#' + index + "_" + type + "_length").text("Max characters: 30")
      else {
        let length = (30 - value.length)
        $('#' + index + "_" + type + "_length").text(`Remaining characters: ${length}`)
      }
    }
  }

  onChangeSmallTextAllign(event: any, index: any) {
    let value = event.target.value
    this.shortTextData[index]['smalltext_align'] = value
    if (value == "select") {
      $('#' + index + "_" + 'smalltext_align').text("Select Text Position")
    }
    else {
      $('#' + index + "_" + 'smalltext_align').text("")
    }
  }

  onChangeSmallTextFontSize(event: any, index: any) {
    let value = event.target.value
    this.shortTextData[index]['smalltext_fontsize'] = value
    if (value == "select") {
      $('#' + index + "_" + 'smalltext_fontsize').text("Select Font Size")
    }
    else {
      $('#' + index + "_" + 'smalltext_fontsize').text("")
    }
  }

  validateUploadDocuments() {
    let isError = false
    this.shortTextData.forEach((value: any, index: any) => {
      if (value['smalltext_content'] == "") {
        $('#' + index + "_smalltext_content").text("This field is required")
        isError = true
      }

      if (value['smalltext_page'] == "") {
        $('#' + index + "_smalltext_page").text("This field is required")
        isError = true
      }
      else {
        let re = /^[0-9]*$/
        if (!re.test(value['smalltext_page'])) {
          $('#' + index + "_smalltext_page").text("Page should be numeric")
          isError = true
        }
      }

      if (value['smalltext_align'] == "select") {
        $('#' + index + "_smalltext_align").text("Select Text Position")
        isError = true
      }

      if (value['smalltext_fontsize'] == "select") {
        $('#' + index + "_smalltext_fontsize").text("Select Font Size")
        isError = true
      }
    })
    return isError
  }

  onSubmit() {
    this.submitted = true
    if (this.myForm.invalid) { return; }
    let msg = ""
    if (this.validateUploadDocuments()) {
      return
    } else {
      this.shortTextData.forEach((item: any) => {
        let list_item: any = {}
        let smalltext_content = item["smalltext_content"]
        let smalltext_page = item["smalltext_page"]
        let smalltext_align = item["smalltext_align"]
        let smalltext_fontsize = item["smalltext_fontsize"]
        list_item['text'] = smalltext_content
        list_item['page'] = String(smalltext_page == "0" ? 0 : Number(smalltext_page) - 1)
        list_item['textAlign'] = smalltext_align
        list_item['textSize'] = smalltext_fontsize
        this.pages.push(list_item);
      })


      //console.log('test  ' + JSON.stringify(this.pages));
      this.modalService.open('doc-shirt-text');
    }

  }



  conform(doc: any) {
    this.modalService.open(doc);
  }
  addText() {
    let obj = {
      "docid": this.data?.id,
      "pages": this.pages
    }
    // "docid": "6361fd7ba1db725da3a0f122",
    // "pagenumalign": "center",
    // "pagenumfontsize": "large",
    // "pagenumtemplate": "Page (#PAGENUM# of #TOTALPAGES#)",
    // "pagenumtemplate_info": {}
    //console.log("obj  " + JSON.stringify(obj));
    this.httpservice.sendPostRequest(URLUtils.addShortText, obj).subscribe((res: any) => {
      //console.log("res" + res);
      if (res.error == false) {
        this.httpservice.sendPutRequest(URLUtils.addShortTextqueue, res.data).subscribe((res: any) => {
          this.modalService.open('doc-del-success');
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
    })
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
  gAfterViewInit(){
    this.gotoTop();
  }
}


