import { EditCalenderDialogService } from './../../../edit-calender-options/edit-calender-dialog.service';
import { EditCalenderDialogComponent } from './../../../edit-calender-options/edit-calender-dialog.component';
import { Router } from '@angular/router';
import { CalenderService } from './../../calender.service';
import { ConfirmationDialogService } from './../../../confirmation-dialog/confirmation-dialog.service';
import { URLUtils } from 'src/app/urlUtils';
import { HttpService } from './../../../services/http.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-legalmatter-calender',
  templateUrl: './legalmatter-calender.component.html',
  styleUrls: ['./legalmatter-calender.component.scss']
})
export class LegalMatterCalenderComponent implements OnInit {
  @Output() submitted = new EventEmitter();
  matterList: any = [];
  tasks: any = ["Case filling", "Creating legal briefs", "Consultation", "Meeting with client", "Hearing"];
  timeZones: any = [];
  repetition: any = [
    { name: "Daily", value: "daily" },
    { name: "Weekly", value: "weekly" },
    { name: "Bi-Weekly", value: "biweekly" },
    { name: "Monthly", value: "monthly" },
    { name: "Yearly", value: "yearly" },
  ];
  pipe = new DatePipe('en-US');
  bsValue = new Date();
  minDate = new Date();
  FromTime: any;
  ToTime: any;
  selectedHours: any;
  selectedMinutes: any;
  notificationItems: any = [];
  tmsList: any = [];
  selectedTeammembers: any = [];
  clientsList: any = [];
  selectedClients: any = [];
  selectedconsumer: any = [];
  docsList: any = [];
  selectedDocs: any = [];
  isSubmitted = false;
  entityList: any = [];
  entitycorpList: any = [];
  selectedMatterId: any;
  increaseTodate: boolean = false;
  displayDuration: boolean = true;
  product = environment.product;
  isValidNotification: boolean = false;
  displayEndTime:any;
  display:boolean=false;
  alternate:any;
  pm:any;
  hrs2:any=[];
  showTime = true;
  conlist: any[]=[];
  public hrs: any = [];
  public tohrs: any = [];
  public ToSelectedQuantity: any;
  public mins = ['00', '15', '30', '45'];
  public selectedQuantity: any;
  public editInfo: any = undefined;
  public editTitle: any;

  corpList: any = [];
  selectedCorp:any =[];
  
  constructor(private httpservice: HttpService,
    public fb: FormBuilder, private toast: ToastrService, 
    private confirmationDialogService: ConfirmationDialogService,
    private editCalenderDialogService: EditCalenderDialogService,
    private calenderService: CalenderService,
    private router: Router) { }

  ngOnInit() {
    this.getLegalMatters();
    this.setTimes();
    if (window.location.pathname.indexOf("edit") > -1) {
      this.calenderService.editCalenderObservable.subscribe((result: any) => {
        if (result && result.event_type == 'legal') {
          this.editInfo = result;
          this.CalenderForm.patchValue(result);
          this.CalenderForm.controls["matter_id"].setValue(result.matter_id);
          this.selectedMatterId = result.matter_id;
          this.editTitle = this.editInfo.title.split(" - ")[1];
          this.CalenderForm.controls["title"].setValue(this.editTitle);
          this.notificationItems = this.editInfo.notifications.map((obj: any) => ({ time: obj.split("-")[0], type: obj.split("-")[1] }));
          this.CalenderForm.controls["date"].setValue(new Date(this.editInfo.from_ts.split('T')[0]));
          this.CalenderForm.controls['from_ts'].setValue(this.editInfo.from_ts.split("T")[1].split(":")[0] + ':' + this.editInfo.from_ts.split("T")[1].split(":")[1]);
          this.selectedQuantity = this.editInfo.from_ts.split("T")[1].split(":")[0] + ':' + this.editInfo.from_ts.split("T")[1].split(":")[1];
          this.CalenderForm.controls['to_ts'].setValue(this.editInfo.to_ts.split("T")[1].split(":")[0] + ':' + this.editInfo.to_ts.split("T")[1].split(":")[1]);
          this.ToSelectedQuantity = this.editInfo.to_ts.split("T")[1].split(":")[0] + ':' + this.editInfo.to_ts.split("T")[1].split(":")[1];
          this.CalenderForm.controls['invitees_internal'].setValue('');
          this.CalenderForm.controls['attachments'].setValue('');
          this.CalenderForm.controls['invitees_consumer_external'].setValue('');
          this.CalenderForm.controls['invitees_external'].setValue('');
          this.selectedTeammembers = this.editInfo.invitees_internal;
          this.selectedDocs = this.editInfo.attachments;
          this.selectedClients = this.editInfo.invitees_external;
          this.selectedClients = this.selectedClients.map((item: any) => ({ "id": item.tmId, "name": item.tmName, "entityid": item.entityId }));
          this.selectedconsumer = this.editInfo.invitees_consumer_external.map((item: any) => ({ "id": item.entityId, "name": item.tmName, "type": "consumer" }))
          this.getTimeZones();
          //this.addNotification();
          if (this.editInfo.allday) {
            this.allDay({target: {checked: true}});
          } else {
            this.diff(this.selectedQuantity, this.ToSelectedQuantity)
          }
          
        }
      });
    }
    else {
      this.getTimeZones();
      this.addNotification();
      // this.getTms();
      // this.getEntities();
    }
  }
  CalenderForm = this.fb.group({
    matter_id: ['', [Validators.required]],
    date: [new Date(), Validators.required],
    from_ts: ['', Validators.required],
    to_ts: ['', Validators.required],
    title: ['', Validators.required],
    timezone_location: ['', Validators.required],
    timezone_offset: [0],
    timesheets: this.fb.array([]),
    allday: [false],
    repeat_interval: ['none'],
    meeting_link: [''],
    location: [''],
    dialin: [''],
    description: [''],
    matter_type: ['legal'],
    event_type: ['legal'],
    invitees_external: [''],
    invitees_consumer_external: [''],
    invitees_internal: [''],
    attachments: [''],
    notifications: [''],
    addtimesheet: [true],
    recurrent_edit_choice: null

  })
  get f() {
    return this.CalenderForm.controls;
  }
  setTimes() {
    this.hrsData();
    var coeff = 1000 * 60 * 15;
    var date = new Date(); //or use any other date
    var rounded = new Date(Math.round(date.getTime() / coeff) * coeff);
    this.selectedQuantity = rounded.getHours() + ':' + rounded.getMinutes();
    this.selectedQuantity = this.addMinutesToTime(this.selectedQuantity, 0);
    this.CalenderForm.controls['from_ts'].setValue(this.selectedQuantity);
    this.ToSelectedQuantity = this.addMinutesToTime(this.selectedQuantity, 30);
    this.CalenderForm.controls['to_ts'].setValue(this.ToSelectedQuantity);
    this.diff(this.selectedQuantity, this.ToSelectedQuantity);
  }
  getLegalMatters() {
    this.httpservice.sendGetRequest(URLUtils.getLegalMatterEventList).subscribe((res: any) => {
      this.matterList = [];
      this.matterList = res?.matters;
      if (this.editInfo)
        this.onChangeMatter(null);
    });
  }
  getTimeZones() {
    var timezoneOffset = new Date().getTimezoneOffset();
    this.httpservice.sendGetRequest(URLUtils.getTimeZones).subscribe((res: any) => {
      this.timeZones = res?.timezones;
      for (let i = 0; i < this.timeZones?.length; i++) {
        if (this.editInfo ? (this.timeZones[i][1] == this.editInfo.timezone_location) : ((0 - Number(this.timeZones[i][0])) == timezoneOffset)) {
          let timeZoneArr = [];
          for (let j = 0; j < this.timeZones[i].length; j++) {
            timeZoneArr.push(this.timeZones[i][j]);
          }
          this.CalenderForm.controls['timezone_location'].setValue(timeZoneArr.toString());
          break;
        }
      }
    });
  }
  getTms(matterId: any) {

    let matter = this.matterList.filter((tm: any) => tm.id == matterId);
    // this.httpservice.sendGetRequest(URLUtils.getCalenderTms).subscribe((res: any) => {
    //   this.tmsList = [];
    if (matter?.length > 0) {
      this.tmsList = matter[0]?.members;
      //console.log("matters mem: ", this.tmsList);
      if (this.selectedTeammembers.length > 0) {
        this.tmsList = this.tmsList.filter((el: any) => {
          return !this.selectedTeammembers.find((element: any) => {
            return element.id === el.id;
          });
        });
      }
    }
    // })
  }
  getEntities(matterId: any) {
    let matter = this.matterList.filter((tm: any) => tm.id == matterId);
    // this.httpservice.sendGetRequest(URLUtils.getExternalEntities).subscribe((res: any) => {
    //   this.entityList = [];
    //   this.entityList = res?.entities;
    // })

    // if(this.product == 'corporate'){
    //   this.httpservice.getFeaturesdata(URLUtils.getCalenderExternal).subscribe(
    //       (res: any) => {
    //         this.entitycorpList = [];
    //         this.entitycorpList = res?.relationships;
    //       })
    // }
    if(this.product == 'lauditor'){
      this.httpservice.getFeaturesdata(URLUtils.getCalenderExternal).subscribe((res: any) => {
        //this.corpList = res?.corporate;
        this.corpList = [];
        this.corpList = res?.relationships;
        console.log('corpList',this.corpList)
    })
    }
    
    if (matter?.length > 0){
      this.entityList = matter[0]?.clients.filter((rel:any) => rel.type === 'entity');
      // console.log('Entitylist',this.entityList)
      // console.log('Matterlist',this.matterList)
      this.conlist = matter[0]?.clients.filter((rel:any) => rel.type === 'consumer');

    }
      if (this.selectedconsumer.length > 0) {
        this.conlist = this.conlist.filter((el: any) => {
          return !this.selectedconsumer.find((element: any) => {
            return element.id === el.id;
          });
        });
      }
  }
  getClients(id: any) {
    this.httpservice.sendGetRequest(URLUtils.getEntityTms(id)).subscribe((res: any) => {
      this.clientsList = [];
      this.clientsList = res?.users;
      this.clientsList.map((item: any) => item.entityid = id);
      if (this.selectedClients.length > 0) {
        this.clientsList = this.clientsList.filter((el: any) => {
          return !this.selectedClients.find((element: any) => {
            return element.id === el.id;
          });
        });
      }
    })
  }
  getDocuments(id: any) {
    let matter = this.matterList.filter((m: any) => m.id == id);
    //console.log("matters " + JSON.stringify(matter));
    // this.httpservice.sendGetRequest(URLUtils.legalHistoryDocuments(id)).subscribe(
    //   (res: any) => {
    //     if (res) {
    //       this.docsList = [];
    if (matter?.length > 0) {
      this.docsList = matter[0]?.documents;
      if (this.selectedDocs.length > 0) {
        this.docsList = this.docsList.filter((el: any) => {
          console.log('this.doc', this.docsList)
          return !this.selectedDocs.find((element: any) => {
            return element.docid === el.docid;
          });
        });
      }
    }
    //     }
    //   });
  }
  addEvent(type: string, event: any) {
    //console.log("Date --->");
  }
  onChangeMatter(event: any) {
    if (!this.editInfo){
      this.selectedMatterId = event.target.value;
      this.selectedDocs=[]
      this.selectedClients = []
      this.clientsList = []
      this.selectedTeammembers = []
      this.selectedconsumer = []
      this.displayDuration = true
      this.showTime = true
      //this.setTimes()
      this.notificationItems = []
      this.notificationItems.push({ time: "10", type: "minutes" });
      this.CalenderForm.patchValue({
      repeat_interval: 'none',
      meeting_link: '',
      dialin: '',
      date:  new Date(),
      description: '',
      location: '',
      title:'',
      allday:false
    });

    }
    this.getTms(this.selectedMatterId);
    this.getDocuments(this.selectedMatterId);
    this.getEntities(this.selectedMatterId);
    
  }
  addtoTimesheet(event: any) {
    //console.log(event.target.checked);
  }
  allDay(event: any) {
    //console.log(event.target.checked);
    if(event.target.checked){
      this.showTime = false
      this.displayDuration = false
    }  else {
      this.setTimes()
      this.displayDuration = true
      this.showTime = true
      
    }
    
  }
  selectDuration(date: any) {
    this.bsValue = date;
 
    
    //console.log(this.bsValue);
  }
  addNotification() {
    //console.log(this.notificationItems);
    // if (!this.editInfo)
      this.notificationItems.push({ time: "10", type: "minutes" });
  }
  removeNotification(i: number) {
    this.notificationItems.splice(i, 1);
  }
  onOptionsSelected(event: any, index: number) {
    var value = event.target.value
    this.notificationItems[index]['type'] = value
    if (this.notificationItems[index]['time'] == "") {
      $('#' + index + "_notificationTime").text("This field is required")
    }
    else {
      $('#' + index + "_notificationTime").text("")
      this.ChangeNotificationValidation(this.notificationItems[index]['time'], value, index)
    }
  }
  onKey(event: any, index: any, type: any) {
    let value = event.target.value
    this.notificationItems[index][type] = value
    if (value == "") {
      $('#' + index + "_notificationTime").text("This field is required")
    }
    else {
      $('#' + index + "_notificationTime").text("")
      this.ChangeNotificationValidation(value, this.notificationItems[index]['type'], index)
    }
  }
  ChangeNotificationValidation(value: any, type: any, index: any) {
    if (type == 'minutes') {
      this.isValidNotification = Number(value) < 1 || Number(value) > 60 ? true : false;
      if (Number(value) < 1 || Number(value) > 60) {

        $('#' + index + "_notificationTime").text("Must be between 1 to 60 minutes")
      }

    }
    else if (type == 'hours') {
      this.isValidNotification = Number(value) < 1 || Number(value) > 24 ? true : false;
      if (Number(value) < 1 || Number(value) > 24) {
        this.isValidNotification = true;
        $('#' + index + "_notificationTime").text("Must be between 1 to 24 Hours")
      }

    }
    else if (type == 'days') {
      this.isValidNotification = (Number(value) < 1 || Number(value) > 31) ? true : false;
      if (Number(value) < 1 || Number(value) > 31) {
        this.isValidNotification = true;
        $('#' + index + "_notificationTime").text("Must be between 1 to 31 Days")
      }

    }
    else if (type == 'weeks') {
      this.isValidNotification = (Number(value) < 1 || Number(value) > 4) ? true : false;
      if (Number(value) < 1 || Number(value) > 4) {
        this.isValidNotification = true;
        $('#' + index + "_notificationTime").text("Must be between 1 to 4 Weeks")
      }
    }
  }
  addTeamMember() {
    let tm = this.tmsList?.find((d: any) => d.name === this.CalenderForm.value.invitees_internal); //find index in your array
    if (tm) {
      this.selectedTeammembers.push(tm);
      let index = this.tmsList?.findIndex((d: any) => d.id === tm.id); //find index in your array
      if (index > -1) {
        this.tmsList?.splice(index, 1);
        this.CalenderForm.controls['invitees_internal'].setValue('');
      }
    }
  }
  removeTeamMember(teamMember: any) {
    let index = this.selectedTeammembers?.findIndex((d: any) => d.id === teamMember.id); //find index in your array
    if (index > -1) {
      this.selectedTeammembers?.splice(index, 1);
      this.tmsList?.push(teamMember);
    }
  }

  addconsumerinvites() {
     //console.log(this.CalenderForm.value.invitees_consumer_external)
     let con = this.conlist?.find((d: any) => d.name === this.CalenderForm.value.invitees_consumer_external)
     if (con){
      //console.log(con)
      this.selectedconsumer.push(con)
      let index = this.conlist?.findIndex((d:any) => d.id === con.id);
      if (index > -1) {
        this.conlist?.splice(index, 1);
        this.CalenderForm.controls['invitees_consumer_external'].setValue('');

      }

     }
  }
  removeconsumerinvite(con: any) {
    let index = this.selectedconsumer?.findIndex((d: any) => d.id === con.id); //find index in your array
    if (index > -1) {
      this.selectedconsumer?.splice(index, 1);
      this.conlist?.push(con);
    }
  }
  onChangeEntity(event: any) {
    //console.log(event.target.value);
    this.getClients(event.target.value)
  }
  addClient() {
    let client = this.clientsList?.find((d: any) => d.name === this.CalenderForm.value.invitees_external); //find index in your array
    if (client) {
      this.selectedClients?.push(client);
      let index = this.clientsList?.findIndex((d: any) => d.id === client.id); //find index in your array
      if (index > -1) {
        this.clientsList?.splice(index, 1);
        this.CalenderForm.controls['invitees_external']?.setValue('');
      }
    }
  }
  removeClient(client: any) {
    let index = this.selectedClients?.findIndex((d: any) => d.id === client.id); //find index in your array
    if (index > -1) {
      this.selectedClients?.splice(index, 1);
      this.clientsList?.push(client);
    }
  }
  addDoc() {
    let doc = this.docsList?.find((d: any) => d.name === this.CalenderForm.value.attachments); //find index in your array
    if (doc) {
      this.selectedDocs?.push(doc);

      let index = this.docsList?.findIndex((d: any) => d.docid === doc.docid); //find index in your array
      if (index > -1) {
        this.docsList?.splice(index, 1);
        this.CalenderForm.controls['attachments'].setValue('');
      }
    }
  }
  removeDoc(doc: any) {
    let index = this.selectedDocs?.findIndex((d: any) => d.docid === doc.docid); //find index in your array
    if (index > -1) {
      this.selectedDocs?.splice(index, 1);
      this.docsList?.push(doc);
    }
  }
  addMinutesToTime(time: any, minsAdd: any) {
    function z(n: any) {
      return (n < 10 ? '0' : '') + n;
    }
    var bits = time.split(':');
    var mins = bits[0] * 60 + +bits[1] + +minsAdd;
    return z(((mins % (24 * 60)) / 60) | 0) + ':' + z(mins % 60);
  }
  removeColon(s: any) {
    s = s.replace(':', '');
    return parseInt(s);
  }
  diff(s1: any, s2: any) {
    this.increaseTodate = false;
    this.displayDuration = true;
    let fromDate = new Date();
    let time1 = this.removeColon(s1);
    let time2 = this.removeColon(s2);
    if (time2 < time1) {
      this.increaseTodate = true;
      this.displayDuration = false;
    }
    let hourDiff = time2 / 100 - time1 / 100;
    if (time2 % 100 >= time1 % 100)
      hourDiff = hourDiff - 1;
    let minDiff = (time2 % 100) + (60 - (time1 % 100));
    if (minDiff >= 60) {
      hourDiff++;
      minDiff = minDiff - 60;
    }
    var res = hourDiff.toString().split('.')[0] + ':' + minDiff.toString();
    this.selectedHours = hourDiff.toString().split('.')[0];
    this.selectedMinutes = minDiff.toString();
    return res;
  }
  hrsData() {
    for (let i = 0; i <= 23; i++) {
      this.mins.forEach((minute) => {
        if (i <= 9) {
          let a = '0' + i;
          let str = `${a}:${minute}`;
         this.hrs.push(str);
        
        
        } else {
          let str = `${i}:${minute}`;
          this.hrs.push(str);
         
        }
      });
    
     
    }
    for (let i = 0; i <= 23; i++) {
      this.mins.forEach((minute) => {
        if (i <= 9) {
          let b = '0' + i;
          let str = `${b}:${minute}`;
          this.tohrs.push(str);
        }
         else {
          let str = `${i}:${minute}`;
           this.tohrs.push(str);
        }
      });
    }
//     console.log("set am ", this.hrs[49]);
//     console.log("set am ", this.hrs.length);

// for(let i=0;i<=96;i++){
//      if( this.hrs[i]>this.hrs[49]){
//       this.alternate="AM";
//       this.hrs2.push(this.alternate);
//      }else{
//       this.alternate="PM";
//       this.hrs2.push(this.alternate);
//      }
//   }
}
  getTime(event: any) {
    this.selectedQuantity = event.target.value;
    this.ToSelectedQuantity = this.addMinutesToTime(this.selectedQuantity, 30);
    this.CalenderForm.controls['to_ts'].setValue(this.ToSelectedQuantity);
    // console.log(this.diff(this.selectedQuantity, this.ToSelectedQuantity));
   // if(this.hrs[48])

    if(this.selectedQuantity){
      this.displayEndTime=this.tohrs.filter((x: number)=>{
        return x > this.selectedQuantity;
      });
      this.tohrs=this.displayEndTime;
     // console.log("aaaaaaaaa ",this.tohrs);
    }

    if( this.display==true){

          this.tohrs=this.hrs;
         // console.log("bbbbbbbbb ", this.tohrs[48]);
          if(this.selectedQuantity){
            this.displayEndTime=this.tohrs.filter((x: number)=>{
              return x > this.selectedQuantity;
            });
            this.tohrs=this.displayEndTime;
           // console.log("aaaaaaaaa ",this.tohrs);
          } 
    }
  }

  togetTime(event: any) {
    this.display=true;
    this.ToSelectedQuantity = event.target.value;
    this.diff(this.selectedQuantity, this.ToSelectedQuantity);
  }
  onSubmit() {
    this.isSubmitted = true;
    if (this.isValidNotification) {
      return
    }
    if (!this.CalenderForm.valid) {
      //console.error('error');
      return
    } else {
      let matter = this.matterList.find((item: any) => item.id === this.selectedMatterId);
      let tstitle = this.CalenderForm.value.title;
      this.CalenderForm.value.title = matter.title + ' - ' + this.CalenderForm.value.title;
      if (this.CalenderForm.value.addtimesheet) {
        if(this.CalenderForm.value.allday){
          let duration = { hours: 24, minutes: 0 }
          let timesheets = [{
            'date': this.pipe.transform(this.CalenderForm.value.date, 'yyyy-MM-dd'),
            'duration':  `${duration['hours']} : ${duration['minutes']}`,
            'eventtitle': tstitle,
            'addedby': localStorage.getItem('name'),
            'user_id': localStorage.getItem('user_id')
          }];
          this.CalenderForm.value.timesheets = timesheets;
        }
        else{
          let duration = this.diff(this.CalenderForm.value.from_ts, this.CalenderForm.value.to_ts);
          let timesheets = [{
            'date': this.pipe.transform(this.CalenderForm.value.date, 'yyyy-MM-dd'),
            'duration': duration,
            'eventtitle': tstitle,
            'addedby': localStorage.getItem('name'),
            'user_id': localStorage.getItem('user_id')
          }];
          this.CalenderForm.value.timesheets = timesheets;
        }
        
        
      }
      this.diff(this.CalenderForm?.value?.from_ts, this.CalenderForm?.value?.to_ts);
      let given_date = new Date();
      let new_date = given_date.setDate(given_date.getDate() + 1);

      if(this.CalenderForm.value.allday){
        this.CalenderForm.value.from_ts = this.pipe.transform(this.CalenderForm.value.date, 'yyyy-MM-dd') + "T00:00:00";
        this.CalenderForm.value.to_ts = this.pipe.transform(this.CalenderForm.value.date, 'yyyy-MM-dd') + "T23:59:59";       
      } else {
        this.CalenderForm.value.from_ts = this.pipe.transform(this.CalenderForm?.value?.date, 'yyyy-MM-dd') + 'T' + this.CalenderForm?.value?.from_ts + ':00';
        this.CalenderForm.value.to_ts = this.increaseTodate ? this.pipe.transform(new_date, 'yyyy-MM-dd') + 'T' + this.CalenderForm?.value?.to_ts + ':00' : this.pipe.transform(this.CalenderForm?.value?.date, 'yyyy-MM-dd') + 'T' + this.CalenderForm?.value?.to_ts + ':00';
      }
        
      this.CalenderForm.value.timezone_offset = 0 - Number(this.CalenderForm?.value?.timezone_location?.split(',')[0]);
      this.CalenderForm.value.timezone_location = this.CalenderForm?.value?.timezone_location?.split(',')[1];
      this.CalenderForm.value.notifications = this.notificationItems.map((obj: any) => (obj.time + '-' + obj.type));
      this.CalenderForm.value.invitees_internal = this.selectedTeammembers.map((obj: any) => (obj.id));
      this.CalenderForm.value.attachments = this.selectedDocs.map((obj: any) => ({
        "docid": obj.docid,
        "doctype": obj.doctype
      }));
      this.CalenderForm.value.invitees_external = this.selectedClients.map((obj: any) => (obj.entityid + '_' + obj.id));
      this.CalenderForm.value.invitees_consumer_external = this.selectedconsumer.map((obj: any) => (obj.id))
      if (this.editInfo) {
        if (!this.CalenderForm.valid) {
          return;
        }
        this.editCalenderDialogService.open();
        this.editCalenderDialogService.editCalObservable.subscribe((data: any) => {
          if (data) {
            this.CalenderForm.value.recurrent_edit_choice = data;
            this.httpservice.sendPutRequest(URLUtils.updateEvent({ 'eventId': this.editInfo?.id, 'offset': this.editInfo?.timezone_offset }), this.CalenderForm.value).subscribe((res: any) => {
              if (!res.error) {
                this.confirmationDialogService.confirm('Success', 'Congratulations! You have successfully modified the event', false, 'View Changes', 'Cancel', true).then((confirmed) => {
                  this.editCalenderDialogService.editCalSubmitted.next(null);
                  if (confirmed)
                    this.router.navigate(['/meetings/view']);
                  else
                    window.location.reload();
                })
              } else {
                this.confirmationDialogService.confirm('Alert', res.msg, false, '', '', false, 'sm', false)
              }
            },
            (error: HttpErrorResponse) => {
              if (error.status === 401 || error.status === 403) {
                const errorMessage = error.error.msg || 'Unauthorized';
                this.toast.error(errorMessage);
                console.log(error);
              } 
            }
            );
            return;
          }
        });
      }
      else {
        this.httpservice.sendPostRequest(URLUtils.createEvent, this.CalenderForm.value).subscribe((res: any) => {
          if (!res.error) {
            this.confirmationDialogService.confirm('Success', 'Congratulations! You have successfully the created event', false, 'View Changes', 'Cancel', true).then((confirmed) => {
              if (confirmed)
                this.router.navigate(['/meetings/view']);
              else
                window.location.reload();
            })
          } else {
            this.confirmationDialogService.confirm('Alert', res.msg, false, '', '', false, 'sm', false)
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
  }

  onReset(){
    this.CalenderForm.reset();
    this.router.navigate(['/meetings/view'])
  }
}
