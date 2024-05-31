import { DashBoardChatrelModel, DashBoardChatteamModel, DashBoardEmailModel, DashBoardExternalMatterModel, DashBoardGroupsandtmsModel, DashBoardMatterModel, DashBoardNotificationModel, DashBoardStorageModel, DashBoardSubscriptionModel, DashBoardTimesheetModel } from './../shared/config-model';
import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit} from '@angular/core';
import { HttpService } from '../services/http.service';
import { DashBoardHiringModel, DashBoardHoursModel, DashBoardMeetingModel } from '../shared/config-model';
import { URLUtils } from '../urlUtils';
import { DatePipe } from '@angular/common';
import { Router } from "@angular/router";
import { AjaxService } from '../services/ajax.service';
import { NonNullableFormBuilder } from '@angular/forms';
import { environment } from 'src/environments/environment';
declare let Strophe: any;
declare let $msg: any;
declare let $pres: any;
declare let $iq: any;
declare let $: any;

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit {
  
  meetingModel: any = DashBoardMeetingModel;
  //meetingModelNot: any = DashBoardMeetingModel;
  chatrelModel: any = DashBoardChatrelModel;
  chatteamModel: any = DashBoardChatteamModel;
  emailModel: any = DashBoardEmailModel;
  hoursModel: any = DashBoardHoursModel;
  hiringModel: any = [{'type': '', 'count': ''}, {'type': '', 'count':''}];
  clientModel: any = [{'type': '', 'count': ''}, {'type': '', 'count':''}];
  externalModel: any = [{'type': '', 'count': ''}, {'type': '', 'count':''}];
  storageModel: any = DashBoardStorageModel;
  timesheetModel: any = DashBoardTimesheetModel;
  matterModel: any = DashBoardMatterModel;
  notifyModel: any = DashBoardNotificationModel;
  externalmatterModel: any = DashBoardExternalMatterModel;
  subscriptionModel: any = DashBoardSubscriptionModel;
  groupsandtmsModel: any = DashBoardGroupsandtmsModel;
  relationshipModel: any = {'accepted': '', 'pending': ''}

  pipe = new DatePipe('en-US');
  emailTime: any;
  corporateCount: number=0;
  ipCount: number=0;
  dateSet: any = new Date();
  userRole: string = "TM";

  month: any = ["Jan", "Feb", "March", "April", "May", "Jun", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
  day: any = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]
  dateMonth: any = this.month[this.dateSet.getMonth()];
  date: any = this.day[this.dateSet.getDate()];
  dateFullYear: any = this.dateSet.getFullYear();
  dateTime: any = this.dateSet.getHours();
  Time = (this.dateTime % 12) || 12;
  minute: any = this.dateSet.getMinutes();
  ampm: any = (this.dateTime >= 12) ? "PM" : "AM";
  cards:any;
  kpiCards: string[]=[];
  mydayCards: string[] = [];
  product = environment.product;

  layout: any = {"MYDAY": [], "KPI": []}
  meetingMessage: any;
  notifyMessage: any;
  timesheetModelMessage: any;
  timesheetModelsub: any;
  timesheetModelpen: any;
  flag_pending = false;
  flag_submitted = false;

  time = new Date();
  intervalId: any;
  isAdmin = true;
  firmName: any;
  firmJid = '';
  domain = environment.xmppDomain;
  endUser: any;
  messages: any;
  USERNAME = ''; //prof_ravitejachakkadigicoffercom@devchat.digicoffer.com
  PASSWORD: any;
  sendUser: any;
  URL = 'wss://' + this.domain + ':5443/ws';
  unreadcountteam = 0;
  unreadcountclient = 0;
  clientlistguid:any[]=[];
  teamlistguid:any[]=[];
 

  constructor(private httpservice: HttpService,
              private router: Router,
              private ajaxService: AjaxService) { 
                
              }

  ngOnInit(): void {
    this.getLayout()
    this.getMeetingdata();
    this.getChatrel();
    this.getChatteam()
    this.getEmail();
    this.getHours();
    this.getHiring();
    this.getStorage();
    this.getTimesheet();
    this.getMatter();
    this.getSubscription();
    this.getGroupsandtms();
    this.getClients();
    this.getExternal();
    this.getRelationships();
    this.getNotify();
    this.getChatlist();
    if(this.product=='corporate'){
      this.getExternalMatters();
    }
    
    
    var role = localStorage.getItem("role");
    if(role != null){
      this.userRole = role
    }

    this.intervalId = setInterval(() => {
      this.time = new Date();
    }, 1000);

    

  this.sendUser = localStorage.getItem('name');
  this.messages = [];
  // this.getTeams();
  // this.getRelationships();
  // this.getcorpRelationships();
  this.firmName = URLUtils.get_firmName();
  this.isAdmin =
    URLUtils.get_userid() == null || URLUtils.get_userid() == 'admin'
      ? true
      : false;
  this.PASSWORD = localStorage.getItem('TOKEN');
  this.USERNAME = URLUtils.get_jid() + '@' + this.domain;

  // this.xmppConnection()
  var connection = new Strophe.Connection(this.URL);
  connection.connect(this.USERNAME, this.PASSWORD, this.onConnect);
  Strophe.ui = this;
  Strophe.ui.conn = connection;
   

  }

  getLayout(){
    this.httpservice.getFeaturesdata(URLUtils.getLayout).subscribe((res: any) => {
      this.cards = res["cards"]
      this.cards[1]["options"].forEach((item: any, index: number) => {
        this.kpiCards.push(item.name);
      })
    });
  }

  getMeetingdata() {
    this.httpservice.getFeaturesdata(URLUtils.getMeeting).subscribe((res: any) => {

      if (res.error = "false") {
        this.meetingModel = res?.data;
        if (res.error = "true") {
          this.meetingMessage = res?.message;
        }
      }

    });
  }

  getChatrel() {
    this.httpservice.getFeaturesdata(URLUtils.getChatrel).subscribe((res: any) => {
      this.chatrelModel = res?.data;
    })
  }
  getChatteam() {
    this.httpservice.getFeaturesdata(URLUtils.getChatteam).subscribe((res: any) => {
      this.chatteamModel = res?.data;
      this.chatteamModel.client.timestamp = this.pipe.transform(new Date(+res.data.client.timestamp), 'EEE hh:mm a');
      this.chatteamModel.team.timestamp = this.pipe.transform(new Date(+res.data.team.timestamp), 'EEE hh:mm a');
    })
  }
  getEmail() {
    this.httpservice.getFeaturesdata(URLUtils.getEmail).subscribe((res: any) => {
      this.emailModel = res?.data;
      this.emailTime = +res.data.timestamp;
      this.emailModel.timestamp = this.pipe.transform(new Date(+res.data.timestamp), 'MMM d, y');
      this.emailModel['time'] = this.pipe.transform(new Date(this.emailTime), 'hh:mm a');
    })
  }
  getHours() {
    this.httpservice.getFeaturesdata(URLUtils.getHours).subscribe((res: any) => {
      this.hoursModel = res?.data;
    })
  }
  getNotify(){
    this.httpservice.getFeaturesdata(URLUtils.getnewNotification).subscribe((res: any) => {
      //this.notifyModel = res.data;
      //this.notifyModel.timestamp = res?.data.timestamp;
      //this.notifyModel.message = res?.data.message;

      if (res.error = "false") {
        this.notifyModel = res?.data;
        if (res.error = "true") {
          this.notifyMessage = res?.message;
        }
      }


    })
  }
  getHiring() {
    this.httpservice.getFeaturesdata(URLUtils.getHiring).subscribe((res: any) => {
      this.hiringModel = res?.data;
      //console.log('hireModel',this.hiringModel)
    })
  }
  getStorage() {
    this.httpservice.getFeaturesdata(URLUtils.getStorage).subscribe((res: any) => {
      this.storageModel = res?.data;
      // MB to GB convertion
      this.storageModel.currentStorage = res?.data?.currentStorage;
      this.storageModel.balanceStorage = res?.data?.balanceStorage;
    })
  }
  getTimesheet() {
    this.httpservice.getFeaturesdata(URLUtils.getTimesheet).subscribe((res: any) => {

      if (res.error == false) {
        this.timesheetModel = res?.data;
        this.timesheetModelsub = res?.data?.submittedDates;
        this.timesheetModelpen = res?.data?.pendingDates;

        if (Object.keys(res.data?.pendingDates).length === 0) {
          this.flag_pending = true
        }

        if (Object.keys(res.data?.submittedDates).length === 0) {
          this.flag_submitted = true
        }
      }

      else if(res.error == true) {
        this.flag_submitted = true
        this.flag_pending = true

      }

    })
  }
  getMatter() {
    this.httpservice.getFeaturesdata(URLUtils.getMatter).subscribe((res: any) => {
      this.matterModel = res?.data;
    })
  }
  getSubscription() {
    this.httpservice.getFeaturesdata(URLUtils.getSubscription).subscribe((res: any) => {
      this.subscriptionModel = res?.data;
      //console.log('subscrip',this.subscriptionModel)
      // this.subscriptionModel.month = this.pipe.transform(new Date(+res?.data.month), 'MMM y');
    })
  }
  getGroupsandtms() {
    this.httpservice.getFeaturesdata(URLUtils.getGroupsandtms).subscribe((res: any) => {
      this.groupsandtmsModel = res?.data;
    })
  }
  getClients(){
    this.httpservice.getFeaturesdata(URLUtils.getNewClients).subscribe((res: any) => {
      this.clientModel = res?.data;
      //console.log('clientMode',this.clientModel)
    })
  }
  getExternal(){
    this.httpservice.getFeaturesdata(URLUtils.getExternalCounsels).subscribe((res: any) => {
      this.externalModel = res?.data;
      //console.log('ExtclientMode',this.externalModel)
    })
  }
  getExternalMatters(){
    this.httpservice.getFeaturesdata(URLUtils.getExternalMatters).subscribe((res: any) => {
      this.externalmatterModel = res?.data;
      //console.log('ExtclientMode',this.externalModel)
    })

  }
  getRelationships(){
    this.httpservice.getFeaturesdata(URLUtils.getDashboardRelations).subscribe((res: any) => {
      this.relationshipModel = res?.data;
    })
  }
  categoryRoute(cat: any) {
    this.router.navigate([cat]);
  }

  onButtonClick(data:any){
    const link =  `${environment.paymentgatway}renew?useremail=${data.email}&users=${data.user_allowed}`;
    window.location.href = link;
  }

  onConnect(status: any) {
    if (status == Strophe.Status.CONNECTING) {
      console.log('Strophe is connecting.');
    } else if (status == Strophe.Status.CONNFAIL) {
      console.log('Strophe failed to connect.');
    } else if (status == Strophe.Status.DISCONNECTING) {
      console.log('Strophe is disconnecting.');
    } else if (status == Strophe.Status.DISCONNECTED) {
      console.log('Strophe is disconnected.');
    } else if (status == Strophe.Status.CONNECTED) {
      console.log('Strophe is connected.');
      let count = 0;
      var JID;
      // Strophe.ui.ajax.success_alert("Connection Established")
      Strophe.ui.conn.addHandler(Strophe.ui.stanzaHandler, null, 'message')
      // Strophe.ui.conn.addHandler(function(stanza :any) {
      //   console.log(stanza)
      //   const isArchived = stanza.querySelector('archived') !== null;
      //   if (!isArchived) {
      //     JID = stanza.getAttribute('from');
      //     count++;
          
      //   }

      // }, null, 'message');
      // if(count>0){
      //   this.unreadcount = count
      //   this.UpdateUnreadMsg(JID)
      // }

      // Strophe.ui.conn.addHandler(Strophe.ui.onOwnMessage, null, 'iq', 'set', null, null);
      // Strophe.ui.conn.addHandler(Strophe.ui.on_presence, null, 'presence', null, null, null);
      Strophe.ui.conn.send($pres().tree());
    }
  }
  stanzaHandler(msg:any) {
    // Strophe.ui.conn.addHandler(Strophe.ui.stanzaHandler, null, "message")
    Strophe.ui.xmlParser(msg)
    // Strophe.ui.conn.addHandler(Strophe.ui.stanzaHandler, null, "message");
    return true
  }
  async xmlParser(msg:any) {
   console.log(msg)
    const JID = msg.getAttribute('from');
    var id = JID.replace(/\.com.*/, ".com");
    this.increment_count(id)
    this.UpdateUnreadMsg(id);
  }
 
  UpdateUnreadMsg(fromjid:any){
    let data = {"count": 1,"fromjid": fromjid,"tojid":this.USERNAME}
    this.httpservice.sendPostChatRequest(URLUtils.updatemsgcount,data).subscribe((res:any)=>{
      console.log(res)
    })

  }
  increment_count(fromjid:any){
    if(this.teamlistguid.filter((email:any) => email === fromjid).length > 0){
      this.unreadcountteam++
    } else {
      this.unreadcountclient++
    } 
  }

  getChatlist(){
    this.httpservice.sendGetRequest(URLUtils.getChatList).subscribe((res:any)=>{
      this.teamlistguid = res.team?.map((email:any) => email + "@" + this.domain);
      this.clientlistguid = res.clients?.map((email:any) => email + "@" + this.domain);
      if(this.teamlistguid || this,this.clientlistguid){
        let data = { "fromjid":[...this.teamlistguid, ...this.clientlistguid],"tojid":this.USERNAME}
        this.httpservice.sendPostChatRequest(URLUtils.getunreadcountlist,data).subscribe((res:any)=>{
          if(res){
            res.forEach((item:any) => {
              this.increment_count(item.fromjid)
            });

          }
          
        })
      }
    })
  }
}
