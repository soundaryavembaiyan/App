import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationDialogService } from './../confirmation-dialog/confirmation-dialog.service';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { HttpService } from '../services/http.service';
import { URLUtils } from '../urlUtils';
import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ModalService } from '../model/model.service';
import { EmailService } from './email.service';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss']
})
export class EmailComponent implements OnInit,AfterViewInit{
  constructor(private httpservice: HttpService, private confirmationDialogService: ConfirmationDialogService,
    private spinnerService: NgxSpinnerService, private modalService: ModalService,
    private formBuilder: FormBuilder, private emailService: EmailService,
    private router: Router) { }
  messagesMap: Map<number, any> = new Map<number, any>();
  messages: any;
  product = environment.product;
  count: number = 0;
  nextToken: any;
  searchText: string = '';
  isFirstPage: boolean = true;
  pageNumber: number = 1;
  isDocument: boolean = false;
  data: any;
  relationshipSubscribe: any;
  keyword = 'name';
  clients: any = [];
  filter: string = "client";
  msgAndpartId: any;
  isSelectGroup: boolean = false;
  groupViewItems: any;
  selectedGroupItems: any = [];
  composeForm: any = FormGroup;
  controls:any;
  selectedAttachments:any=[];
  isAuthenticated:boolean=false;
  ngOnInit() {
    this.composeForm = this.formBuilder.group({
      toEmail: ['', [Validators.required, Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)]],
      subject: ['', Validators.required],
      body: [''],
      documents: [[], Validators.required]
    }); 
    let controls:any = localStorage.getItem('inputs');
   this.controls=JSON.parse(controls);
    if (this.controls) {
      this.composeForm.patchValue(this.controls);
      localStorage.removeItem("inputs");
    }
    let docs = localStorage.getItem('docs');
    if (docs && docs.length > 0) {
      this.selectedAttachments=JSON.parse(docs);
      this.selectedAttachments=this.selectedAttachments.map((obj: any) => ({ "filename": obj.filename, "path": obj.path }));
      this.composeForm.controls['documents'].setValue(this.selectedAttachments);
      localStorage.removeItem("docs");
    }
    this.getMessageCount();
    //this.emailAuthentication();
  }
  get f() { return this.composeForm.controls; }

  ngAfterViewInit() {
    if(this.controls)
    this.modalService.open('compose-email');
  }
  emailAuthentication() {
    if (!localStorage.getItem('validationDone')) {
      this.httpservice.sendGetEmailRequest(URLUtils.emailAuthentication({ "token": localStorage.getItem('TOKEN') })).subscribe(
        (res: any) => {
          if (!res.error && res.url) {
            localStorage.setItem('validationDone', 'true');
            if(!localStorage.getItem('popupOpened'))
            window.open(res.url, 'coffergoogleAuthWin', "height = 450px, width = 750px");
           localStorage.setItem('popupOpened','true');
            setTimeout(() => {
              location.reload()
            }, 10000)
          }
        });
    }
    else {
      this.getMessageCount();
    }
  }
  getMessageCount() {
    var globalVar = this;
    this.httpservice.sendGetEmailRequest(URLUtils.messagesCount({ "token": localStorage.getItem('TOKEN'), "labelid": 'INBOX' })).subscribe(
      (res: any) => {
        if(!res.error){
        this.count = res.data?.messagesTotal;
        this.getMessages();
        }
      },
      (error: any) => {
        //setInterval(function () {
        localStorage.removeItem('validationDone');
        this.isAuthenticated=false;
        globalVar.emailAuthentication();
        //}, 10000);
      });
  }
  getMessages() {
    var globalVar = this;
    this.httpservice.sendGetEmailRequest(URLUtils.emailMessages({ "token": localStorage.getItem('TOKEN'), "rows": 10 })).subscribe(
      (res: any) => {
        if(!res.error){
        this.isFirstPage = true;
        this.nextToken = res.nextPageToken;
        this.messages = res.messages;
        this.pageNumber=1;
        this.messagesMap.set(this.pageNumber, res);
        this.messages.forEach((element: any) => {
          element.fromName = element.from.split("<")[0];
        });
        this.isAuthenticated=true;
      }
      },
      (error: any) => {
        //setInterval(function () {
        localStorage.removeItem('validationDone');
        this.isAuthenticated=false;
        globalVar.emailAuthentication();
        //}, 10000);
      });
  }
  getNextPageMessages() {
    var globalVar = this;
    this.httpservice.sendGetEmailRequest(URLUtils.NextPageMessages({ "token": localStorage.getItem('TOKEN'), "rows": 10, "nextpagetoken": this.nextToken })).subscribe(
      (res: any) => {
        this.isFirstPage = false;
        this.nextToken = res.nextPageToken;
        this.messages = res.messages;
        this.pageNumber = this.pageNumber + 1;
        this.messagesMap.set(this.pageNumber, res);
        this.messages.forEach((element: any) => {
          element.fromName = element.from.split("<")[0];
        });
      },
      (error: any) => {
        // setInterval(function () {
        localStorage.removeItem('validationDone');
        this.isAuthenticated=false;
        globalVar.emailAuthentication();
        //}, 10000);
      })
  }
  onKeydown(event: any) {
    if (event.key === "Enter" || event.type === "click") {
      this.httpservice.sendGetEmailRequest(URLUtils.searchMessages({ "token": localStorage.getItem('TOKEN'), "rows": 10, "search": this.searchText })).subscribe(
        (res: any) => {
          this.messages = res.messages;
          this.nextToken = res.nextPageToken;
          this.messages.forEach((element: any) => {
            element.fromName = element.from.split("<")[0];
          });
        })
    }
  }
  onPrevious() {
    if (this.pageNumber > 1)
      this.pageNumber = this.pageNumber - 1;
    if (this.pageNumber == 1) {
      this.isFirstPage = true;
    };
    let data=this.messagesMap.get(this.pageNumber);
    this.nextToken=data?.nextPageToken;
    this.messages=data?.messages;
  }
  documentClick(msgid: any, partid: any) {
    this.msgAndpartId = {
      "msgId": msgid,
      "partId": partid
    }
    this.isDocument = true;
    this.filter = 'client'
    // if(this.product == 'corporate'){
    //   this.filter = 'firm'
    // }
    // else{
    // this.filter = 'client'
    // }
    this.getClients();
    this.getGroups();
  }
  getClients() {
    this.relationshipSubscribe = this.httpservice.getFeaturesdata(URLUtils.getAllRelationship).subscribe((res: any) => {
      this.data = res?.data?.relationships;
    });
  }
  getGroups() {
    this.httpservice.sendGetRequest(URLUtils.getGroups).subscribe((res: any) => {
      this.groupViewItems = res?.data;
      this.groupViewItems.forEach((item: any) => {
        item.isChecked = false;
      })
    })
  }
  selectEvent(item: any) {
    this.clients = [];
    if (this.filter === 'client') {
      this.clients.push(item);
    }
  }
  selectGroup(val: boolean) {
    this.isSelectGroup = val;
  }
  saveFiles() {
    this.spinnerService.show();
    this.filter == "client" ? this.selectedGroupItems = [] : this.clients = [];
    let obj =
    {
      "category": this.filter,
      "clientids": this.clients.map((obj: any) => ({ "id": obj.id, "type": obj.type })),
      "groupids": this.selectedGroupItems.map((obj: any) => obj.id),
      "enableDownload": true
    }
    this.httpservice.sendPostEmailRequest(URLUtils.MessageDocUpload({ "token": localStorage.getItem('TOKEN'), "msgid": this.msgAndpartId.msgId, "partid": this.msgAndpartId.partId }), obj).subscribe((res: any) => {
      if (res) {
        this.spinnerService.hide();
        this.confirmationDialogService.confirm('Success', res.msg, false, '', '', false, 'sm', false);
        this.isDocument = false;
      }
    }, (error: any) => {
      this.spinnerService.hide();
      this.confirmationDialogService.confirm('Alert', error.error.msg, false, '', '', false, 'sm', false);
      this.isDocument = false;
    });
  }
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
    let index = this.selectedGroupItems.findIndex((d: any) => d.id === item.id); //find index in your array
    this.selectedGroupItems.splice(index, 1);
  }
  onCompose() {
    this.modalService.open('compose-email');
  }
  close() {
    this.modalService.close('compose-email');
    this.composeForm.reset();
    this.selectedAttachments=[];
  }
  onAttach() {
    localStorage.setItem('inputs', JSON.stringify(this.composeForm.value));
    this.emailService.emailEvent(true);
    if (this.product == 'corporate') {
      this.router.navigate(['/documents/view/firm']);
    }
    else {
      this.router.navigate(['/documents/view/client']);
    }
  }
  onRemoveAttachment(attachment:any){
    this.selectedAttachments = this.selectedAttachments.filter((item: any) => item.filename !== attachment.filename);
  }
  onSubmit() {
    this.spinnerService.show();
    if (!this.composeForm.valid) {
        return;
    }
    this.httpservice.sendPostEmailRequest(URLUtils.sendMessage({ "token": localStorage.getItem('TOKEN')}), this.composeForm.value).subscribe((res: any) => {
      if (res) {
        this.spinnerService.hide();
        this.confirmationDialogService.confirm('Success', 'Mail sent successfully.', false, '', '', false, 'sm', false);
        this.isDocument=false;
        this.composeForm.reset();
        this.selectedAttachments=[];
        this.modalService.close('compose-email');
      }
    },(error)=>{
      this.spinnerService.hide();
      this.confirmationDialogService.confirm('Alert', 'Mail not sent successfully.', false, '', '', false, 'sm', false);
    });
  }
  ngOnDestroy() {
    if (this.relationshipSubscribe) {
      this.relationshipSubscribe.unsubscribe();
    }
  }
}
