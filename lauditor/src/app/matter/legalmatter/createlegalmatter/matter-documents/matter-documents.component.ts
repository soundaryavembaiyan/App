import { ConfirmationDialogService } from './../../../../confirmation-dialog/confirmation-dialog.service';
import { URLUtils } from 'src/app/urlUtils';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({

    selector: 'matter-documents',
    templateUrl: 'matter-documents.component.html',
    styleUrls: ['matter-documents.component.scss']
})
export class MatterDocumentsComponent {

    @Output() selectedDocumentsEvent: EventEmitter<any> = new EventEmitter();
    @Input() data: any = {};
    @Input() groups: any[] = [];
    @Input() clients: any[] = [];
    files: File[] = [];
    currentTab: string = 'existingdoc';
    documentsList: any = [];
    matters: any;
    filter: any;
    uploadDocs: any = [];
    selectedDocuments: any = [];
    searchText: any = '';
    editMetaData: boolean = false;
    editMetaFlag: boolean = true;
    selectedIdx: any;
    editDoc: boolean = false;
    editMeta: any;
    downloadDisabled: boolean = true;
    values: any = [];
    metaData: any;
    submitted = false;
    documentDetail: any = FormGroup;
    @ViewChild('file') myInputVariable: ElementRef;
    filteredData:any;
    constructor(private httpservice: HttpService,
        private fb: FormBuilder,
        private confirmationDialogService: ConfirmationDialogService
    ) { }

    ngOnInit() {
        this.values.push({ tagtype: "", tag: "" });
        this.getDocuments();
        this.documentDetail = this.fb.group({
            name: ['', Validators.required],
            description: ['', Validators.required],
            date_of_filling: []
        })
    }
    get f() {
        return this.documentDetail.controls;
    }
    removevalue(i: any) {
        this.values.splice(i, 1);
    }

    addvalue() {
        this.values.push({ tagtype: "", tag: "" });
    }
    submit() {
        this.editMetaFlag = true;
        //console.log(JSON.stringify(this.values));
        let resultObj: any = {};

        this.values.forEach((item: any) => {
            resultObj[item.tagtype] = item.tag

        });
        this.metaData = resultObj;
        //console.log("tagsArray  " + JSON.stringify(resultObj));
    }
    getDocuments() {
        let grps = this.groups.map((obj: any) => obj.id);
        this.httpservice.sendPutRequest(URLUtils.getFilterTypeAttachements,
            { 'group_acls': grps, 'attachment_type': 'documents' }).subscribe(
                (res: any) => {
                    if (!res['error'] && res['documents']?.length > 0) {
                        this.documentsList = res['documents'];
                    }
                })
    }
    selectDocument(document: any) {
        this.selectedDocuments.push(document);
        let index = this.documentsList.findIndex((d: any) => d.docid === document.docid); //find index in your array
        this.documentsList.splice(index, 1);
        if (this.documentsList.length==0) {
            let checkbox = document.getElementById('selectAll') as HTMLInputElement | null;
            if (checkbox != null)
              checkbox.checked = true;
          }
    }
    removeDocument(doc: any) {
        let index = this.selectedDocuments.findIndex((d: any) => d.docid === doc.docid); //find index in your array
        this.selectedDocuments.splice(index, 1);
        this.documentsList.push(doc);
        if (this.selectedDocuments.length == 0 || this.documentsList.length==1) {
            let checkbox = document.getElementById('selectAll') as HTMLInputElement | null;
            if (checkbox != null)
                checkbox.checked = false;
        }
    }
    getFileDetails(event: any) {
        for (var i = 0; i < event.files.length; i++) {
            let file: File = event.files[i]
            this.files.push(file);
                let object = {
                    name: event.files[i].name.split('.')[0],
                    description: event.files[i].name.split('.')[0],
                    type: event.files[i].type,
                    file: file,
                    groups: this.groups.map((obj: any) => obj.id),
                    client: this.clients,
                    matter: this.matters,
                    category: this.filter,
                }
            this.uploadDocs.push(object);
        this.myInputVariable.nativeElement.value = '';
        }
    }
    selectAll(event: any) {
        if (event?.target?.checked) {
            if (this.documentsList?.length > 0) {
                if(this.filteredData?.length>0){
                    this.selectedDocuments = this.selectedDocuments.concat(this.filteredData);
                    this.documentsList = this.documentsList.filter((el: any) => {
                      return !this.selectedDocuments.find((element: any) => {
                        return element.docid === el.docid;
                      });
                    });
                  }else{
                this.selectedDocuments = this.selectedDocuments.concat(this.documentsList);
                this.documentsList = [];
                  }
            }
        } else {
            this.documentsList = this.selectedDocuments.concat(this.documentsList);
            this.selectedDocuments = [];
        }
    }
    saveDocuments() {
        if (this.currentTab == 'existingdoc' || this.uploadDocs.length==0) {
            this.selectedDocumentsEvent.emit(this.selectedDocuments);
        }
        else {
            this.confirmationDialogService.confirm('Confirmation', 'Are you sure you want to attach documents to ' + this.data.Title + ' ?',true, 'Yes', 'No')
                .then((confirmed) => {
                    if (confirmed) {
                        for (var i = 0; i < this.uploadDocs.length; i++) {
                            //console.log("test   " + JSON.stringify(this.uploadDocs));
                            let fdata = new FormData();
                            let matterList: any = [];
                            let sb:any=[]
                            matterList.push(this.matters)
                            const ids = this.groups.map((obj: any) => obj.id);
                            fdata.append('name', this.uploadDocs[i].name);
                            fdata.append('description', this.uploadDocs[i].description);
                            fdata.append('filename', this.uploadDocs[i].name)
                            fdata.append('content_type', this.uploadDocs[i].type)
                            fdata.append('category', 'client')
                            if (ids.length > 0) {
                                fdata.append('groups', JSON.stringify(ids))
                            }
                            // if (this.matters) { fdata.append('matters', JSON.stringify(matterList)) }

                            fdata.append('file', this.files[i])
                            fdata.append('clients', JSON.stringify(this.clients))
                            // fdata.append('subcategories',sb.push(this.data?.Title))
                            fdata.append('downloadDisabled', this.downloadDisabled == true ? "Yes" : "No");
                            fdata.append('metadata', this.uploadDocs[i].checked == true ? JSON.stringify(this.metaData) : '');
                            this.upload(i, fdata)
                        }
                    }
                }
                )
        }
    }
    upload(idx: any, file: any) {
        //console.log("test   " + JSON.stringify(file));
        this.myInputVariable.nativeElement.value = '';
        this.httpservice.sendPostRequest(URLUtils.postDocumentsClient, file).subscribe(
            (res: any) => {
                if (!res.error) {
                    this.uploadDocs =[];
                    this.files =[];
                    let obj = {
                        "docid": res.docid,
                        "doctype": 'general',
                        "user_id": localStorage.getItem('user_id'),
                        "name":file.get('name')
                    }
                    this.selectedDocuments.push(obj);
                    if (idx == this.uploadDocs.length - 1)
                        this.selectedDocumentsEvent.emit(this.selectedDocuments);
                } else {
                    this.confirmationDialogService.confirm('Alert', res.msg,false, '', '', false,'sm', false);
                }
            }, (err: any) => {
                this.confirmationDialogService.confirm('Alert', err.msg,false, '', '', false,'sm', false);
            });
    }
    filterDoc(data: any) {
        if (data == 'editMeta') {
            this.editMetaData = true;
        }
        this.editMetaFlag = data == "editMeta" ? true : false;

    }
    editDocument(item: any, i: any) {
        this.selectedIdx = i;
        this.editDoc = true;
       // this.editMeta = item;
        if(item.description)
    this.documentDetail.controls["description"].setValue(item.description);
    this.documentDetail.controls["date_of_filling"].setValue(item.date_of_filling);
    this.documentDetail.controls["name"].setValue(item.name);
        //console.log(" this.editMeta  " + JSON.stringify(this.editMeta))
    }
    docEnable(item: any) {
        this.downloadDisabled = item == "enable" ? true : false;

    }
    checkedItem(val: any) {
        this.uploadDocs.forEach((item: any) => {
            if (item.name == val.name) {
                item.checked = true;
            }
        })
    }
    removeNewDocument(item: any,i:number) {
        if( this.selectedIdx==i){
            this.editDoc = false;
            this.selectedIdx=null;
        }
        if( this.uploadDocs.length==1){
            this.editMetaData=false;
        }
        // let index = this.uploadDocs.findIndex((d: any) => d.id === item.id);
        this.uploadDocs.splice(i, 1);
        this.files.splice(i,1);
    }
    checkAllItem(event: any) {
        if (event) {
            for (let i = 0; i < this.uploadDocs.length; i++) {
                this.uploadDocs[i].checked = true;
            }
        } else {
            for (let i = 0; i < this.uploadDocs.length; i++) {
                this.uploadDocs[i].checked = false;
            }
        }
    }
    onResetTags() {
        this.editMetaFlag = true;
        this.values = [];
    }
    onReset() {
        this.submitted = false;
        // this.documentDetail.reset();
        this.editDoc = false;
        this.selectedIdx = null;
        //console.log(this.selectedIdx)
    }
    onSubmit() {
        if (this.documentDetail.invalid) {
            return;
          }
        this.uploadDocs[this.selectedIdx]=this.documentDetail.value;
        this.selectedIdx = null;
        this.submitted = true;
        this.editDoc = false;
        this.uploadDocs.forEach((val: any) => {
            //console.log("val     " + JSON.stringify(val));
        })
    }
    OnCancel() {
        this.documentsList = this.documentsList.concat(this.selectedDocuments);
        this.selectedDocuments = [];
    }
    keyup(){
        if(this.searchText == ' ')
        this.searchText=this.searchText.replace(/\s/g, "");
        this.filteredData = this.documentsList.filter((item:any) =>item.name.toLocaleLowerCase().includes(this.searchText));
        let checkbox = document.getElementById('selectAll') as HTMLInputElement | null;
        if (checkbox != null)
          checkbox.checked = false;
      }
}
