import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { idLocale } from 'ngx-bootstrap';
import { ModalService } from 'src/app/model/model.service';
import { HttpService } from 'src/app/services/http.service';
import { DocumentModel } from 'src/app/shared/config-model';
import { URLUtils } from 'src/app/urlUtils';
import { DocumentService } from '../document.service';
import { environment } from 'src/environments/environment';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'merge-pdf',
    templateUrl: 'merge-pdf.component.html',
    styleUrls: ['merge-pdf.component.scss']
})
export class MergePdfComponent implements OnInit {
    relationshipSubscribe: any;
    product = environment.product;
    data: any;
    documents: any;
    keyword = 'name';
    isChecked: boolean = false;
    remItem: boolean = true;
    selectedItem: any;
    selectedDoc: any = [];
    matterList: any;
    selectedClient = "";
    documentModel = new DocumentModel();
    selectedLevel: any;
    selectedMatterItem: any;
    filter: any = "client";
    term:any;
    clientId: any;
    isSelectGroup: boolean = false;
    selectedGroupItems: any = [];
    values: any = [];
    matters: any;
    groupViewItems: any;
    errorMsg: boolean = false;
    selectedGroups: any = [];
    selectedName: any;
    objectKeys = Object.keys;
    reldata:any[]=[];
    corpData:any[]=[];
    selectedmatterType='internal';
    matter_type: any[] = [{'title':'Internal Matter','value':'internal'},{'title':'External Matter','value':'external'}];
    corp_matter_list:any[] = [];
    
    public selectedValue: any;
    constructor(private httpservice: HttpService,
        private router: Router, private formBuilder: FormBuilder,
        private modalService: ModalService, private docService: DocumentService, private renderer: Renderer2, private spinnerService: NgxSpinnerService) {
        this.router.events.subscribe((val) => {
            if (val instanceof NavigationEnd) {
                this.filter = window.location.pathname.split("/").splice(-2)[1];
                localStorage.setItem('filter', this.filter);
                if (this.filter == 'client') {
                    localStorage.removeItem('groupIds')
                } else {
                    localStorage.getItem('clientDetail');
                    localStorage.removeItem('clientData');
                }
                this.documents = [];
            }

                this.selectedGroupItems = [];
                // removeing checked items while tab change
                this.groupViewItems?.forEach((item: any) => {
                    item.isChecked = false;
                })

                // if(this.selectedGroupItems.length > 0){
                //     this.get_all_matters(this.selectedmatterType)
                // }
        });

    }

    ngOnInit(): void {
        this.get_all_matters(this.selectedmatterType)
        this.relationshipSubscribe = this.httpservice.getFeaturesdata(URLUtils.getAllRelationship).subscribe((res: any) => {
            this.reldata = res?.data?.relationships;
            this.httpservice.getFeaturesdata(URLUtils.getCalenderExternal).subscribe((res: any) => {
                this.corpData = res?.relationships.map((obj:any)=>({ "id": obj.id, "type": "corporate","name":obj.name}))
                this.data = this.reldata.concat(this.corpData)
            });

        });
        this.httpservice.sendGetRequest(URLUtils.getGroups).subscribe((res: any) => {
            this.groupViewItems = res?.data;
            this.groupViewItems?.forEach((item: any) => {
                item.isChecked = false;
            })
        })
        //this.getAllDocuments();
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
    
    getAllDocuments() {
        let clientData: any = localStorage.getItem('clientDetail');
        let client = JSON.parse(clientData);

        //console.log(" this.selectedName " + this.selectedName)
        this.documentModel.clients = client;
        if (client) {
            this.selectedName = client[0]?.name;
            this.clientId = client[0]?.id;
        }
        this.selectedGroupItems.forEach((item: any) => {
            this.selectedGroups.push(item.id)
        })
        //console.log("this.clientId " + this.clientId);
        let obj = {
            "category": this.filter,
            "clients": this.clientId,
            "matters": this.selectedLevel,
            "groups": this.selectedGroups,
            "showPdfDocs": true
        }
        //console.log("obj " + JSON.stringify(obj));
        if (this.clientId || this.selectedGroups.length > 0) {
            this.errorMsg = true;
            this.httpservice.sendPutRequest(URLUtils.getFilteredDocuments, obj).subscribe((res: any) => {
                //console.log(JSON.stringify(res));
                this.documents = res?.data;
                //console.log('filter doc',this.documents)
                this.documents.forEach((e: any) => {
                    e.isChecked = false;
                });
                let selectedDocs = this.docService.getDocModel();
                //console.log(" slected docs    " + JSON.stringify(selectedDocs));
                if (selectedDocs?.doclist && selectedDocs?.doclist.length > 0) {
                    this.documentModel.title = selectedDocs.title;
                    this.documentModel.content = selectedDocs.content;
                    this.documentModel.name = selectedDocs.name;
                    this.documentModel.show_bookmark = selectedDocs.show_bookmark;
                    this.documents.forEach((item: any) => {
                        selectedDocs?.doclist.forEach((element: any) => {
                            if (item.id == element.id) {
                                item.isChecked = true;
                                this.selectedDoc.push(item);
                            }
                        });

                    })
                    let clientDtails = selectedDocs.clients;
                    this.data.forEach((item: any) => {
                        if (item.id == clientDtails[0]?.id) {
                            this.selectedClient = item;
                            this.httpservice.sendGetRequest(URLUtils.getMattersByClient(item)).subscribe((res: any) => {
                                this.matterList = res?.matterList;
                                //console.log('matter doc',this.matterList)
                                this.matterList.forEach((item: any) => {
                                    if (item.id == selectedDocs.matters[0]) {
                                        this.selectedMatterItem = item.id
                                    }
                                })
                                //console.log("this.selectedMatterItem   " + JSON.stringify(this.selectedMatterItem));

                            })
                        }

                    })
                } 
                 else {
                // this.errorMsg = this.documents.length == 0 ? true : false;  // selectedGroupItems.length==0
                // this.errorMsg = false
                }
                //this.errorMsg = false
            })
        } else {
            this.errorMsg = false
        }

    }
    checkItem(event: any, doc: any) {
        if (event) {
            doc.isChecked = true;
            this.selectedDoc.push(doc);
            //console.log("push   this.selectedDoc  " + JSON.stringify(this.selectedDoc));
        } else {
            doc.isChecked = false;
            let index = this.selectedDoc.findIndex((d: any) => d.id === doc.id); //find index in your array
            //console.log("index--->" + index);
            this.selectedDoc.splice(index, 1);
            //console.log(" splice    this.selectedDoc  " + JSON.stringify(this.selectedDoc));
        }
        // let selectedDocs = this.docService.getDocModel();
        // if (selectedDocs?.doclist) {
        //     selectedDocs?.doclist.forEach((item: any) => {
        //         this.selectedDoc.forEach((val:any)=>{
        //         if (item.isChecked )  {
        //             if(!val.id==item.id){
        //             this.selectedDoc.push(item)
        //             }
        //         }
        //     })
        //     })
        // }
    }
    // selectedMatter() {
    //     //console.log("selectedLevel " + this.selectedLevel);
    //     this.documentModel.matters.push(this.selectedLevel);
    //     //console.log()
    //     this.getAllDocuments();
    // }
    selectEvent(item: any) {
        //console.log("test   " + JSON.stringify(item));
        this.selectedDoc = [];
        if (item) {
            this.clientId = item.id;
            this.getMatterList(item)
            let clients = new Array();
            clients.push(item)
            this.documentModel.clients = clients;
            localStorage.setItem("clientDetail", JSON.stringify(clients));
            localStorage.setItem("clientData", JSON.stringify(item));
            this.getAllDocuments();
            // if (this.filter === 'client') {
            //     this.clientId.push(item.id);
            //     this.httpservice.sendGetRequest(URLUtils.getClientMatter(item)).subscribe((res: any) => {
            //    //console.log("test   "+res);
            //     },
            //         (err: any) => {
            //         });

            // } else {
            //     this.groupId.push(item.id)
            // }
        }
    }
    getMatterList(item: any) {
        this.httpservice.sendGetRequest(URLUtils.getMattersByClient(item)).subscribe((res: any) => {
            this.matterList = res?.matterList;
            //console.log("matterList " + JSON.stringify(this.matterList));
        })
    }
    onChangeSearch(val: string) {
        // fetch remote data from here
        // And reassign the 'data' which is binded to 'data' property.
    }

    onFocused(e: any) {
        // do something when input is focused
    }
    mergeDoc() {
        this.documentModel.doclist = this.selectedDoc;
        localStorage.setItem("selectedDocs", JSON.stringify(this.selectedDoc));
        // this.docService.addToService(this.documentModel);
        this.docService.addDocModel(this.documentModel);
        // //console.log("postModel " + JSON.stringify(this.documentModel));
        // //console.log("clients " + JSON.stringify(this.documentModel.clients));
        //console.log('docModel',this.documentModel)
        this.router.navigate(['documents/pdfmergedoc/' + this.filter]);
    }
    // mergeCancel(doc?:any){
    //     //this.isChecked = false;
    // }
    mergeCancel() {
        this.selectedDoc.forEach((doc: any) => {
          doc.isChecked = false;
        });
        this.selectedDoc = []; // Clear the selected documents array
      }
      
    onChange(val: any) {
        //console.log("value " + JSON.stringify(val.value));
        this.selectedLevel = val.value;
        this.matters = val.value;
        this.documentModel.matters.push(this.matters);
        if(this.matters){
            this.getAllDocuments(); //get the client matter documents
        }
        //this.getAllDocuments();
    }
    selectGroup(val: boolean) {
        this.isSelectGroup = val;
        this.getAllDocuments();
    }

    // selectGroupItem(item: any, val: any) {
    //     //console.log("selected item" + JSON.stringify(item) + val);
    //     if (val) {
    //         this.selectedGroupItems.push(item);            
    //        this.selectedGroupItems = this.selectedGroupItems.filter((el:any, i:any, a:any) => i === a.indexOf(el));
    //     } else {
    //         let index = this.selectedGroupItems.findIndex((d: any) => d.id === item.id);
    //         this.selectedGroupItems.splice(index, 1);
    //     }

    //     localStorage.setItem("groupIds", JSON.stringify(this.selectedGroupItems));
    //     //console.log("selected " + JSON.stringify(this.selectedGroupItems));
    // }
    // removeGroup(item: any) {
    //     let index = this.selectedGroupItems.findIndex((d: any) => d.id === item.id); //find index in your array
    //     this.selectedGroupItems.splice(index, 1);
    // }
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
        localStorage.setItem("groupIds", JSON.stringify(this.selectedGroupItems));
        //console.log("selected " + JSON.stringify(this.selectedGroupItems));
    }
    removeGroup(item: any) {
        item.isChecked = false;
        //this.remItem = false;
        let index = this.selectedGroupItems.findIndex((d: any) => d.id === item.id); //find index in your array
        this.selectedGroupItems.splice(index, 1);
        this.getAllDocuments();

    }
    ngOnDestroy() {
        if (this.relationshipSubscribe) {
            this.relationshipSubscribe.unsubscribe();
        }
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
