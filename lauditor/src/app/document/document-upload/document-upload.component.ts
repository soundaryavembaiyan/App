import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ModalService } from 'src/app/model/model.service';
import { HttpService } from 'src/app/services/http.service';
import { URLUtils } from 'src/app/urlUtils';
import { environment } from 'src/environments/environment';
import { DocumentService } from '../document.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'document-upload',
    templateUrl: 'document-upload.component.html',
    styleUrls: ['document-upload.component.scss'],
})
export class DocumentUploadComponent implements OnInit {

    @ViewChild('file') myInputVariable!: ElementRef;
    reactiveForm: FormGroup;
    keyword = 'name';
    product = environment.product;
    documentDetail: any = FormGroup;
    addTags: any;
    desc: any;
    relationshipSubscribe: any;
    data: any;
    files: File[] = []; // Variable to store file to Upload
    selectedIdx: any;
    picker: Date = new Date();
    // uploadDocs: any = [{"name":"sbi","description":"sbi","type":"application/pdf","file":{},"groups":[],"client":[],"category":"client","downloadDisabled":false},{"name":"car title","description":"car title","type":"application/pdf","file":{},"groups":[],"client":[],"category":"client","downloadDisabled":false},{"name":"high_bugs (1)","description":"high_bugs (1)","type":"application/pdf","file":{},"groups":[],"client":[],"category":"client","downloadDisabled":false},{"name":"test1","description":"test1","type":"application/pdf","file":{},"groups":[],"client":[],"category":"client","downloadDisabled":false},{"name":"1TestDocwithoutBookMark","description":"1TestDocwithoutBookMark","type":"application/pdf","file":{},"groups":[],"client":[],"category":"client","downloadDisabled":false},{"name":"WM34","description":"WM34","type":"application/pdf","file":{},"groups":[],"client":[],"category":"client","downloadDisabled":false}];
    uploadDocs: any = [];
    editMeta: any;
    downloadDisabled: boolean = false;
    encryptDisabled = false;
    editMetaFlag: any = true;
    submitted = false;
    editDoc: boolean = false;
    message: any;
    clientId: any = [];
    filter: any = "client";
    groupViewItems: any;
    groupId: any = [];
    errorRes: boolean = false;
    editMetaData: boolean = false;
    isSelectGroup: boolean = false;
    selectedGroupItems: any = [];
    values: any = [];
    metaData: any;
    matterList: any;
    matters: any;
    categories:any;
    selectedValue: any;
    checker: any;
    successRes: any = [];
    selectedDate: any;
    allCheck: boolean = false;
    noOfDocs: number = 0;
    addTag: boolean = false;
    errorMessage: string = '';
    @ViewChild('file')
    reldata:any[]=[];
    corpData:any[]=[];
    selectedmatterType='internal';
    matter_type: any[] = [{'title':'Internal Matter','value':'internal'},{'title':'External Matter','value':'external'}];
    corp_matter_list:any[] = [];
    saveTag = false;
    grouplist:any=[];
    grpclientData:any;
    // myInputVariable!: ElementRef;

    isDisableDoc: boolean = true;
    constructor(private httpservice: HttpService,
        private fb: FormBuilder,
        private router: Router,
        private toastr: ToastrService, private modalService: ModalService, private documentService: DocumentService , private spinnerService: NgxSpinnerService) {
        this.filter = this.router.url.split("/").splice(-2)[1];
        this.router.events.subscribe((val) => {
            if (val instanceof NavigationEnd) {
                this.filter = window.location.pathname.split("/").splice(-2)[1];
                this.filter == 'client' ? localStorage.removeItem('groupIds') : localStorage.removeItem('clientData');
                //console.log("  this.filter" + this.filter);
                this.uploadDocs = [];
                this.selectedGroupItems = [];
                // removeing checked items while tab change
                this.groupViewItems.forEach((item: any) => {
                    item.isChecked = false;
                })
            }
        });
        this.reactiveForm = fb.group({
            name: [{ value: '', disabled: false }, Validators.required]
        });
        if (this.filter == 'client') {
            this.selectedGroupItems?.forEach((item: any) => {
                item.isChecked = false;
            });
        }
        if(this.selectedGroupItems.length > 0){
            this.get_all_matters(this.selectedmatterType)
        }
    }

    ngOnInit(): void {
        this.get_all_matters(this.selectedmatterType)
        this.documentDetail = this.fb.group({
            name: ['', Validators.required],
            description: ['', Validators.required],
            expiration_date: ['']
        });
        
        //console.log('reactiveForm',this.reactiveForm)
        this.getClients();
        this.values.push({ tagtype: "", tag: "" });

        this.httpservice.sendGetRequest(URLUtils.getGroups).subscribe((res: any) => {
            this.groupViewItems = res?.data;
            this.groupViewItems.forEach((item: any) => {
                item.isChecked = false;
            })
        })
        // this.httpservice.sendGetRequest(URLUtils.getLegalMatter).subscribe((res: any) => {
        //     this.matterList = res?.matters;
        //     // //console.log("matterList " + JSON.stringify(this.matterList));
        // })
        // this.contents = undefined;
        // this.docEnable("disable");

        //console.log('values of ng', this.values)
    }

    get f() {
        return this.documentDetail.controls;
    }
    removevalue(i: any) {
        // console.log('i',i)
        // if( i === 0){
        //     this.saveTag = false; //Disable the SaveBtn
        // }
        this.values.splice(i, 1);
    }

    addvalue() {
        //this.saveTag = true; //Disable the SaveBtn
        this.values.push({ tagtype: "", tag: "" });
    }
    // cancel() {
    //     this.noOfDocs = 0
    //     this.editMetaFlag = true;
    //     this.addTag=false;
    //     let resultObj: any = {};
    //     this.values.forEach((item: any) => {
    //         resultObj[item.tagtype] = item.tag
    //     });
    //     this.metaData = resultObj;
    // }

    cancel() {
        this.noOfDocs = 0;
        this.editMetaFlag = true;
        this.addTag = false;
        this.values = []; // Resetting values array to an empty array
        let resultObj: any = {};
        this.metaData = resultObj;
        this.addvalue(); //adding empty input field
    }

    
    submit() {
        //Check each item in the values
        for (const item of this.values) {
            if (!item.tag.trim() || !item.tagtype.trim()) {
                this.toastr.error('Please fill all fields');
                return; 
            }
        }

        this.noOfDocs = 0
        this.editMetaFlag = true;
        console.log('valuesss', this.values)
        console.log(JSON.stringify(this.values));
        let resultObj: any = {};
        this.values.forEach((item: any) => {
            resultObj[item.tagtype] = item.tag
        });
        this.metaData = resultObj;
        console.log("tagsArray  " + JSON.stringify(resultObj));
        this.addTag=false;
    }

    onChange(val: any) {
        //console.log("value " + JSON.stringify(val.value));
        if(this.selectedmatterType=='external'){
            this.categories = val.value
            this.matters = ''

        } else {
            this.matters = val.value;
            this.categories = ''
        }
        console.log(this.categories)
        console.log(this.matters)
       
    }
    trySelectGroup(enable: boolean) {
        if (this.clientId.length > 0) {
          this.selectGroup(enable);
        }
    }
    
    selectGroup(val: boolean) {
        this.isSelectGroup = val;
        if(!val){
            this.get_all_matters(this.selectedmatterType)
        }
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
                    this.spinnerService.hide()
                } else {
                    this.spinnerService.hide()
                }
            },(err:any)=>{
                console.log(err)
                this.spinnerService.hide()
            })
        }
        if(type == 'external'){
            this.httpservice.sendPutRequest(URLUtils.getAllExternalMatters,payload).subscribe((res:any)=>{
                if(res){
                    this.corp_matter_list = res.matterList
                    this.spinnerService.hide()
                }
            },(err:any)=>{
                this.spinnerService.hide()
            })

        }
    }

    selectGroupItem(item: any, val: any) {
        //console.log("--selected item" + JSON.stringify(item) + val);
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
        localStorage.setItem("groupIds", JSON.stringify(this.selectedGroupItems));
        //console.log("selected " + JSON.stringify(this.selectedGroupItems));
    }

    removeGroup(item: any) {
        item.isChecked = false;
        let index = this.selectedGroupItems.findIndex((d: any) => d.id === item.id); //find index in your array
        this.selectedGroupItems.splice(index, 1);
        this.get_all_matters(this.selectedmatterType)
    }

    // getFileDetails(event: any) {
    //     for (var i = 0; i < event.files.length; i++) {
    //         let file: File = event.files[i]
    //         this.files.push(file);

    //         // let allowedTypes = ['.pdf'];
    //         // if (!allowedTypes.includes(file.type)) {
    //         //     this.toastr.error('Invalid format. Only PDF allowed')
    //         // }

    //         let object = {
    //             name: event.files[i].name.split('.')[0],
    //             description: event.files[i].name.split('.')[0],
    //             type: event.files[i].type,
    //             file: file,
    //             groups: this.groupId,
    //             client: this.clientId,
    //             matter: this.matters,
    //             subcategories: this.categories,
    //             category: this.filter,
    //             downloadDisabled: false,
    //             custom_encrypt:false 
    //         }
    //         this.uploadDocs.push(object);
    //     }
    //     this.uploadDocs.forEach((item: any, i: any) => {
    //         item.id = i;
    //         //console.log("ids " + item.id);
    //     })
    //     //console.log("upload doc  " + JSON.stringify(this.uploadDocs));
    // }

    getFileDetails(event: any) {
      for (var i = 0; i < event.files.length; i++) {
        let file: File = event.files[i];
    
        //allowed file types.
        const allowedTypes = ['image/png', 'image/heif', 'image/webp', 'image/ico', 'image/jpg', 'image/jpeg', 'image/arw', 'image/bmp', 'image/svg', 'image/tiff', 
        'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-powerpoint', 
        'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'application/vnd.ms-excel', 
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/rtf', 'text/csv', 'text/rtf', 'text/plain'];

        if (!allowedTypes.includes(file.type)) {
          this.toastr.error('Invalid file format!');
          continue;
        }
    
        //If the file type is allowed, proceed with handling the file
        this.files.push(file);
    
        let object = {
          name: event.files[i].name.split('.')[0],
          description: event.files[i].name.split('.')[0],
          type: event.files[i].type,
          file: file,
          groups: this.groupId,
          client: this.clientId,
          matter: this.matters,
          subcategories: this.categories,
          category: this.filter,
          downloadDisabled: false,
          custom_encrypt: false
        };
        this.uploadDocs.push(object);
      }
      this.uploadDocs.forEach((item: any, i: any) => {
        item.id = i;
      });
    }
    

    saveFiles() {
        let clientInfo = new Array();
        this.clientId?.forEach((item: any) => {
            let clientData = {
                "id": item.id,
                "type": item.type
            }
            clientInfo.push(clientData);
        })
        var vale = true

        for (var i = 0; i < this.uploadDocs.length; i++) {
            //console.log("test   " + JSON.stringify(this.uploadDocs));
            let fdata = new FormData();
            let matterList: any = [];
            matterList.push(this.matters)
            const ids = this.selectedGroupItems.map((obj: any) => obj.id);
            fdata.append('name', this.uploadDocs[i].name);
            fdata.append('description', this.uploadDocs[i].description);
            fdata.append('expiration_date', this.uploadDocs[i].expiration_date ? this.uploadDocs[i]?.expiration_date : '');
            fdata.append('filename', this.uploadDocs[i].name)
            fdata.append('content_type', this.uploadDocs[i].type)
            fdata.append('category', this.filter)
            if (ids.length > 0) {
                fdata.append('groups', JSON.stringify(ids))
            }
            if (this.matters) { fdata.append('matters', JSON.stringify(matterList)) }
            let subcategories = [this.categories]
            if(this.categories) { fdata.append('subcategories', JSON.stringify(subcategories))}
            fdata.append('file', this.files[i])
            fdata.append('clients', JSON.stringify(clientInfo))
            fdata.append('custom_encrypt', this.uploadDocs[i].custom_encrypt);
            fdata.append('downloadDisabled', this.uploadDocs[i].downloadDisabled);
            fdata.append('tags', this.uploadDocs[i].checked == true ? JSON.stringify(this.metaData) : '');
            this.upload(i, fdata)
        }
    }
    openModal(id: string) {
        this.modalService.open(id);
    }

    closeModal(id: string) {
        this.modalService.close(id);
    }
    upload(idx: any, file: any) {
        //console.log("test   " + JSON.stringify(file));
        this.myInputVariable.nativeElement.value = '';
        this.spinnerService.show()
        this.httpservice.sendPostRequest(URLUtils.postDocumentsClient, file).subscribe(
            (res: any) => {

                if (res.error == true) {
                    this.errorRes = false;
                    this.message = res.msg || res.msg.errors.clients || res.msg.errors.matters;
                    this.spinnerService.hide()
                    this.toastr.error(this.message)
                } else {
                    this.successRes.push(res);
                    this.spinnerService.hide()
                    this.modalService.open('custom-modal-2');
                    this.errorRes = true;
                    this.toastr.success('upload success');
                }
                // for displaying success msg in UI
            }, 
            // (err: any) => {
            //     this.toastr.error('Could not upload the file:');
            // }
            
            (error: HttpErrorResponse) => {
                this.spinnerService.hide()
                if (error.status === 401 || error.status === 403) {
                  const errorMessage = error.error.msg || 'Unauthorized';
                  this.toastr.error(errorMessage);
                  console.log(error);
                }}
          
                );
    }

    removeDocument(item: any) {
        this.editDoc = false; //close the editMeta tab
        let index = this.uploadDocs.findIndex((d: any) => d.name === item.name);
        // find index in your array
        // //console.log("index--->" + index);
        this.files.splice(index,1);
        this.uploadDocs.splice(index, 1);
    }
    filterDoc(data: any) {
        this.addTag = !this.addTag;
        this.noOfDocs = this.uploadDocs.filter((value: any) => value.checked).length;
        if (data == 'editMeta') {
            this.editMetaData = true;
        }
        this.editMetaFlag = data == "editMeta" ? true : false;

    }
    checkedItem(val: any, obj: any) {
        //console.log("val" + val);
        this.uploadDocs.forEach((item: any) => {

            if (item.name == obj.name) {
                if (val) {
                    item.checked = true;
                } else {
                    item.checked = false;
                    // this.isDisplayTags = false;
                }
            }
        });
        this.noOfDocs = this.uploadDocs.filter((value: any) => value.checked).length;
        let checkList: boolean = this.uploadDocs.every((v: any) => v.checked === true);
        this.allCheck = checkList;
    }
    docEnable(item: any) {
        this.downloadDisabled = item == "enable" ? true : false;
        this.uploadDocs.forEach((item: any) => {
            item.downloadDisabled = this.downloadDisabled;
        });

    }
    encryptEnable(item: any) {
        this.encryptDisabled = item == "enable" ? true : false;
        this.uploadDocs.forEach((item: any) => {
            item.custom_encrypt = this.encryptDisabled;
        });
       console.log(this.uploadDocs)
    }
    disableDoc(val: any, enableFlag: boolean) {
        this.isDisableDoc = enableFlag;
        this.uploadDocs.forEach((item: any) => {
            if (item.name == val.name) {
                item.downloadDisabled = !this.isDisableDoc;
            }
        });
        this.checker = this.uploadDocs.every((v: any) => v.downloadDisabled === true);
    }

    encrypttoggle(val: any, enableFlag: boolean) {
        this.uploadDocs.forEach((item: any) => {
            if (item.name == val.name) {
                item.custom_encrypt = !enableFlag;
            }
        });
        console.log(this.uploadDocs)
        
        // this.checker = this.uploadDocs.every((v: any) => v.custom_encrypt === true);
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
        this.noOfDocs = this.uploadDocs.filter((value: any) => value.checked).length;
        let checkList: boolean = this.uploadDocs.every((v: any) => v.checked === true);
        this.allCheck = checkList;
    }
    editDocument(item: any, i: any) {
        this.selectedIdx = i;
        this.editDoc = true;
        this.editMeta = JSON.parse(JSON.stringify(item));
    }
    onSubmit() {
        //console.log('documentDetail form',this.documentDetail)
        this.selectedIdx = null;
        this.submitted = true;
        if (this.documentDetail.invalid) {
            return;
        }

        this.editDoc = false;
        //console.log("this.documentDetail " + JSON.stringify(this.documentDetail.value));
        this.uploadDocs.forEach((val: any) => {
            if (val.id == this.editMeta.id) {
                val.name = this.documentDetail.value.name;
                val.description = this.documentDetail.value.description;
                val.expiration_date = this.documentDetail.value.expiration_date;
                //console.log("val     " + JSON.stringify(val));
            }
        })
    }

    // selectEvent(item: any) {
    //     //console.log("test   " + JSON.stringify(item));
    //     localStorage.setItem("clientData", JSON.stringify(item));
    //     if (this.filter === 'client') {
    //         this.clientId.push(item);
    //         this.httpservice.sendGetRequest(URLUtils.getMattersByClient(item)).subscribe((res: any) => {
    //             this.matterList = res?.matterList;
    //             //console.log("test   " + JSON.stringify(res));
    //         });

    //         let clientInfo = new Array();
    //         this.clientId?.forEach((item: any) => {
    //             let clientData = {
    //                 "id": item.id,
    //                 "type": item.type
    //             }
    //             clientInfo.push(clientData);
    //         })

    //         this.httpservice.sendPutRequest(URLUtils.getGrouplist,{"clients":clientInfo}).subscribe((res: any) => {
    //             if (res.error == false) {
    //                 this.grouplist = res?.data;
    //                 console.log('selectedGrps', this.grouplist)
    //             }
    //         })
    //     } else {
    //         this.groupId.push(item?.id)
    //     }
    // }

    selectEvent(item: any) {
        localStorage.setItem("clientData", JSON.stringify(item));
        if (this.filter === 'client') {
            this.clientId.push(item);
            this.httpservice.sendGetRequest(URLUtils.getMattersByClient(item)).subscribe((res: any) => {
                this.matterList = res?.matterList;
            });

            let clientInfo = new Array();
            this.clientId?.forEach((item: any) => {
                let clientData = {
                    "id": item.id,
                    "type": item.type
                };
                clientInfo.push(clientData);
            });

            this.httpservice.sendPutRequest(URLUtils.getGrouplist, { "clients": clientInfo }).subscribe((res: any) => {
                if (res.error == false) {
                    this.grouplist = res?.data;
                    //console.log('selectedGrps', this.grouplist);

                    //Filter and check groups based on the API res.
                    this.selectedGroupItems = this.groupViewItems.filter((groupItem: any) => {
                        groupItem.isChecked = this.grouplist.some((selectedGroup: any) => selectedGroup.id === groupItem.id);
                        return groupItem.isChecked;
                    });

                    //Update the checkboxes in groupViewItems
                    // this.groupViewItems.forEach((groupItem: any) => {
                    //     groupItem.isChecked = this.selectedGroupItems.some((selectedGroup: any) => selectedGroup.id === groupItem.id);
                    // });
                }
            });
        } else {
            this.groupId.push(item?.id);
        }
    }

    // cancelClient() {
    //     this.clientId = [];
    //     this.matterList = [];
    //     //console.log('concel client');
    // }

    onChangeSearch(val: any) {
        if (val == undefined) {
            this.clientId = [];
        }
        //console.log("onChangeSearch " + JSON.stringify(val));
        // fetch remote data from here
        // And reassign the 'data' which is binded to 'data' property.
    }

    onFocused(e: any) {
        //console.log("onFocused " + JSON.stringify(e));
        // do something when input is focused
    }
    onReset() {
        this.submitted = false;
        this.documentDetail.reset();
        this.editDoc = false;
        this.selectedIdx = null;
    }
    uploadMore() {
        this.uploadDocs = [];
        // window.location.reload();
        // this.router.navigate(['documents/upload/' + this.filter]);
        //  this.selectedGroupItems = [];
        // this.reactiveForm.reset();
    }
    cancelUpload() {
        this.uploadDocs = [];
        this.router.navigate(['documents/view/' + this.filter]);
    }
    viewChanges() {
        this.router.navigate(['documents/view/' + this.filter]);
        this.documentService.addToService(this.uploadDocs);
    }

    setNewDepartureDate() {
        let startDate = new Date(this.documentDetail.controls.dateArrival.value);
        //console.log(startDate);
    }
    ngOnDestroy() {
        if (this.relationshipSubscribe) {
            this.relationshipSubscribe.unsubscribe();
        }
    }
    getClients() {
        this.relationshipSubscribe = this.httpservice.getFeaturesdata(URLUtils.getAllRelationship).subscribe((res: any) => {
            
            this.reldata = res?.data?.relationships;
            this.httpservice.getFeaturesdata(URLUtils.getCalenderExternal).subscribe((res: any) => {
                this.corpData = res?.relationships.map((obj:any)=>({ "id": obj.id, "type": "corporate" ,"name":obj.name}))
                this.data = this.reldata.concat(this.corpData)
            });
            
        });
    }
    restrictSpaces(event: any) {
        let inputValue: string = event.target.value;
        // Replace multiple spaces with a single space
        inputValue = inputValue.replace(/\s{2,}/g, ' ');
        event.target.value = inputValue;
      }
    
      restrictFirstCharacter(event: any) {
        let inputValue: string = event.target.value;
        // Check if the first character is hyphen '-' or underscore '_'
        if (/^[-_]/.test(inputValue)) {
          inputValue = inputValue.substring(1);
          event.target.value = inputValue;
        }
      }
      restricttextSpace(event: any) {
        let inputValue: string = event.target.value;
        inputValue = inputValue.replace(/^\s+/, '');
        inputValue = inputValue.replace(/\s{2,}/g, ' ');
        event.target.value = inputValue;
      }
}
