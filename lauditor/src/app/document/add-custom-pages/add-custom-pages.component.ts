import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ModalService } from 'src/app/model/model.service';
import { HttpService } from 'src/app/services/http.service';
import { URLUtils } from 'src/app/urlUtils';
import { DocumentService } from '../document.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
 

@Component({
    selector: 'add-custom-pages',
    templateUrl: 'add-custom-pages.component.html',
    styleUrls: ['add-custom-pages.component.scss']
})
export class AddCustomPagesComponent implements OnInit {
    data: any;
    imageUrl: any;
    isOriginalDocument: boolean = false;
    newDocumentName: any;
    DocumentNumbers: any;
    urlSafe: any;
    values: any = [];
    customPage: any = FormGroup;
    shortNote = { 'startingPage': '', 'textposition': '', 'endingPage': '', 'startingnumber': '' };
    submitted: boolean = false;
    isShowPagination: boolean = true;
    isSubmitted = false;
    paginationData: any = [];
    // positions Names
    doclist: any = {};
    isCustomTemplate: boolean = true;
    isError:boolean=false;
    positions: any = [{ 'name': 'Bottom Left', 'value': 'left' }, { 'name': 'Bottom Right', 'value': 'right' }, { 'name': 'Bottom Center', 'value': 'center' },
    { 'name': 'Top Left', 'value': 'topleft' }, { 'name': 'Top Right', 'value': 'topright' }, { 'name': 'Top Center', 'value': 'topcenter' }];
    // fonts
    fonts: any = [{ 'name': 'Small', 'value': 'small' }, { 'name': 'Medium', 'value': 'medium' }, { 'name': 'Large', 'value': 'large' }, { 'name': 'XLarge', 'value': 'xlarge' }]

    constructor(private formBuilder: FormBuilder, private router: Router, private toast: ToastrService, private httpservice: HttpService, private sanitizer: DomSanitizer, private documentService: DocumentService, private modalService: ModalService) {
        this.customPage = this.formBuilder.group({
            pagenumalign: ['', Validators.required],
            pagenumfontsize: ['', Validators.required],
            // startPage: ['', Validators.required],
            // textposition: ['', Validators.required],
            // endingPage: ['', Validators.required],
            // startingnumber: ['', Validators.required],
        });
    }
    myForm = this.formBuilder.group({
        pagenumtemplate: ['select', Validators.required],
        standardPage: [],
        customPage: []
    })
    ngOnInit(): void {
        this.addTemplate();
        // this.values.push(this.shortNote);
     this.data = this.documentService.getItems();
        if (this.data == undefined || null || '') {
            this.router.navigate(['documents/view/client']);
        }
        // //console.log("edit metadata    " + JSON.stringify(this.data));
        this.httpservice.sendGetRequest(URLUtils.viewMergedDocuments(this.data)).subscribe((res: any) => {
            this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(res.url);;
            //console.log(JSON.stringify(this.urlSafe));
        });
    }

    delPages() {

    }
    get f() { return this.customPage.controls; }
    closeModal(id: any) {
        this.modalService.close(id);
    }
    openModel(id: any) {
        this.modalService.open(id);
    }

    changePagenumalign(e: any) {
        this.pagenumalign?.setValue(e.target.value, {
            onlySelf: true,
        });
        //console.log( this.pagenumalign);
    }
    // Access formcontrols getter
    get pagenumalign() {
        return this.customPage.get('pagenumalign');
    }
    changeFontSize(e: any) {
        this.pagenumfontsize?.setValue(e.target.value, {
            onlySelf: true,
        });
    }
    // Access formcontrols getter
    get pagenumfontsize() {
        return this.customPage.get('pagenumfontsize');
    }

    onSubmit(): void {
        //console.log("values   " + JSON.stringify(this.values));
        if (!this.customPage.valid) {
            false;
        }
        // this.values.forEach((item: any) => {

        //     let obj = {
        //         "pagenumtemplate": item.textposition,
        //         "pages": item.startPage - item.endingPage,
        //         "pagenumrangestart": item.startingnumber
        //     }
        //     pageTemplate.push(obj)
        // })
        // let result = Object.assign({}, pageTemplate);
        // this.isSubmitted = true;
        // if (!this.customPage.valid) {
        //     false;
        // } else {
        //     let obj = {
        //         "pagenumalign": this.customPage.values,
        //         "pagenumfontsize": this.customPage.values,
        //         "pagenumtemplate": 'custom',
        //         "standardPage": false,
        //         "customPage": true,
        //         "pagenumtemplate_info": result,
        //         'docid': this.data.id
        //     }
        //     //console.log("obj  " + JSON.stringify(obj));
        //     this.httpservice.sendPostRequest(URLUtils.addPagination, obj).subscribe((res: any) => {
        //         //console.log("res" + res);
        //         if (res.status == 'false') {
        //             this.modalService.open('custom-modal-1');
        //         }


        //     });
        //     //console.log(JSON.stringify(this.customPage.value));
        // }
    }
    cancel() {
        let isMergeDoc: any = {
            isMerge: true
        };
        this.documentService.addToService(isMergeDoc);
        this.router.navigate(['documents/view/client']);
    }
    addTemplate() {
        var data = { page_range_starts: "", page_range_ends: "", page_template: "select", page_starts_from: "" }
        this.paginationData.push(data)
    }

    onKey(event: any, index: any, type: any) {
        // //console.log(event.target.value + " ---- " + index + " ---- " + type)
        var value = event.target.value
        this.paginationData[index][type] = value

        if (value == "")
            $('#' + index + "_" + type).text("this field is required")
        else
            $('#' + index + "_" + type).text("")

    }

    onChangeTemplate(event: any, index: any) {
        var value = event.target.value
        this.paginationData[index]['page_template'] = value
        if (value == "select") {
            $('#' + index + "_" + 'page_template').text("This field is required")
            $('#' + index + "_format_name").text("")
        }
        else {
            $('#' + index + "_" + 'page_template').text("")
            $('#' + index + "_format_name").text(value.replace("#PAGENUM#", ""))
        }

        if (value == "#PAGENUM#")
            $('#' + index + "_format_name").text("1, 2, 3")
        else if (value == "Page (#PAGENUM#)")
            $('#' + index + "_format_name").text("Page")
    }

    removeRow(index: any) {
        this.paginationData.splice(index, 1)
    }

    validateUploadDocuments() {
        this.isError = false
        this.paginationData.forEach((value: any, index: any) => {
            if (value['page_range_starts'] == "") {
                $('#' + index + "_page_range_starts").text("This field is required")
                this.isError = true
            }
            if (value['page_range_ends'] == "") {
                $('#' + index + "_page_range_ends").text("This field is required")
                this.isError = true
            }

            if (value['page_starts_from'] == "") {
                $('#' + index + "_page_starts_from").text("This field is required")
                this.isError = true
            }

            if (value['page_template'] == "select") {
                $('#' + index + "_page_template").text("Select Numbering Format")
                this.isError = true
            }
        })
        return this.isError
    }

    onPagesSubmit() {
        if (this.myForm.invalid) {
            return;
        }
        this.submitted = true;
        this.isSubmitted = true;

        if (this.isCustomTemplate) {
            if (this.validateUploadDocuments()) {
                //console.log("test" + (this.validateUploadDocuments() && !this.customPage.valid))
                return
            }
            else {
                if (!this.customPage.valid) {
                    return
                }
                else {
                    var index = 0
                    for (var item of this.paginationData) {
                        let list_item: any = {}
                        var page_template = item.page_template
                        var page_range_start = item.page_range_starts
                        var page_range_ends = item.page_range_ends
                        var starting_page_num = item.page_starts_from
                        list_item['pagenumtemplate'] = page_template
                        list_item['pages'] = page_range_start + "-" + page_range_ends
                        list_item['pagenumrangestart'] = starting_page_num
                        this.doclist[index] = list_item;
                        index++
                    }
                   
                    this.modalService.open("doc-del-pages");
                // this.postAddPages(obj);
                }
            }
        }
    }

    postAddPages(){
        let obj = {
            "docid": this.data.id,
            "pagenumalign": this.customPage.value.pagenumalign.substring(3),
            "pagenumfontsize": this.customPage.value.pagenumfontsize,
            "pagenumtemplate": "Page (#PAGENUM# of #TOTALPAGES#)",
            "pagenumtemplate_info": this.doclist
        }
        this.httpservice.sendPostRequest(URLUtils.addPagination, obj).subscribe((res: any) => {
            //console.log("res" + res);
            if (res.error == false) {
                this.httpservice.sendPutRequest(URLUtils.addPaginationQueue, res.data).subscribe((res: any) => {
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
          });
    }

}

