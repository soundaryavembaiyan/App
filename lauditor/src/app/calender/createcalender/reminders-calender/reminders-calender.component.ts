import { HttpService } from './../../../services/http.service';
import { ConfirmationDialogService } from './../../../confirmation-dialog/confirmation-dialog.service';
import { URLUtils } from 'src/app/urlUtils';
import { CalenderService } from './../../calender.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { EditCalenderDialogService } from './../../../edit-calender-options/edit-calender-dialog.service';
import { EditCalenderDialogComponent } from './../../../edit-calender-options/edit-calender-dialog.component';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reminders-calender',
  templateUrl: './reminders-calender.component.html',
  styleUrls: ['./reminders-calender.component.scss']
})
export class RemindersCalenderComponent implements OnInit {
  @Output() submitted = new EventEmitter();
  tasks: any = ["Business Development", "Personal", "Doctor Appointment", "Lunch/Dinner", "Misc"];
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
  FromTime: any;
  ToTime: any;
  notificationItems: any = [];
  tmsList: any = [];
  selectedHours: any;
  selectedMinutes: any;
  selectedTeammembers: any = [];
  clientsList: any = [];
  selectedClients: any = [];
  isSubmitted = false;
  entityList: any = [];
  increaseTodate: boolean = false;
  displayDuration: boolean = true;
  public hrs: any = [];
  public tohrs: any = [];
  public ToSelectedQuantity: any;
  public mins = ['00', '15', '30', '45'];
  public selectedQuantity: any;
  displayEndTime:any;
  display:boolean=false;
  minDate = new Date();
  product = environment.product;
  public editInfo: any = undefined;
  isValidNotification:boolean=false;
  showTime = true;
  selectedconsumer: any = [];
  conlist: any[]=[];

  constructor(
    private router: Router,
    private httpservice: HttpService,
    public fb: FormBuilder, private toast: ToastrService, 
    private confirmationDialogService: ConfirmationDialogService, private calenderService: CalenderService,
    private editCalenderDialogService: EditCalenderDialogService) { }

  ngOnInit() {
    this.setTimes();
    if (window.location.pathname.indexOf("edit") > -1) {
      this.calenderService.editCalenderObservable.subscribe((result: any) => {
        if (result && result.event_type == 'reminders') {
          this.editInfo = result;
          this.CalenderForm.patchValue(result);
          this.notificationItems = this.editInfo.notifications.map((obj: any) => ({ time: obj.split("-")[0], type: obj.split("-")[1] }));
          this.CalenderForm.controls['from_ts'].setValue(this.editInfo.from_ts.split("T")[1].split(":")[0]+':'+this.editInfo.from_ts.split("T")[1].split(":")[1]);
          this.selectedQuantity = this.editInfo.from_ts.split("T")[1].split(":")[0]+':'+this.editInfo.from_ts.split("T")[1].split(":")[1];
          this.CalenderForm.controls['to_ts'].setValue(this.editInfo.to_ts.split("T")[1].split(":")[0]+':'+this.editInfo.to_ts.split("T")[1].split(":")[1]);
          this.ToSelectedQuantity = this.editInfo.to_ts.split("T")[1].split(":")[0]+':'+this.editInfo.to_ts.split("T")[1].split(":")[1];
          this.ToSelectedQuantity = this.editInfo.to_ts.split('T')[1];
          this.CalenderForm.controls['invitees_internal'].setValue('');
          this.CalenderForm.controls['invitees_consumer_external'].setValue('');
          this.CalenderForm.controls['invitees_external'].setValue('');
          this.selectedconsumer = this.editInfo.invitees_consumer_external.map((item: any) => ({ "id": item.entityId, "name": item.tmName, "type": "consumer" }))
          this.selectedTeammembers = this.editInfo.invitees_internal;
          this.selectedClients = this.editInfo.invitees_external;
          this.selectedClients = this.selectedClients.map((item: any) => ({ "id": item.tmId, "name": item.tmName, "entityid": item.entityId }));
          this.getTimeZones();
          // this.addNotification();
          this.getTms();
          this.getEntities();
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
      this.getTms();
      this.getEntities();
    }
  }
  CalenderForm = this.fb.group({
    date: [new Date(), Validators.required],
    from_ts: ['', Validators.required],
    to_ts: ['', Validators.required],
    description: ['', Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)],
    timezone_location: ['', Validators.required],
    timezone_offset: [0],
    allday: [''],
    repeat_interval: [''],
    event_type: ['reminders'],
    invitees_external: [''],
    invitees_consumer_external: [''],
    invitees_internal: [''],
    notifications: [''],
    title: ['reminders'],
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
    this.diff(this.selectedQuantity, this.ToSelectedQuantity)
  }
  getTimeZones() {
    var timezoneOffset = new Date().getTimezoneOffset();
    this.httpservice.sendGetRequest(URLUtils.getTimeZones).subscribe((res: any) => {
      this.timeZones = res?.timezones;
      for (let i = 0; i < this.timeZones.length; i++) {
        if (this.editInfo?(this.timeZones[i][1]==this.editInfo.timezone_location):((0 - Number(this.timeZones[i][0])) == timezoneOffset)) {
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
  getTms() {
    this.httpservice.sendGetRequest(URLUtils.getCalenderTms).subscribe((res: any) => {
      this.tmsList = [];
      this.tmsList = res?.users;
      if (this.selectedTeammembers.length > 0) {
        this.tmsList = this.tmsList.filter((el: any) => {
          return !this.selectedTeammembers.find((element: any) => {
            return element.id === el.id;
          });
        });
      }
    })
  }
  getEntities() {
    this.httpservice.getFeaturesdata(URLUtils.getRelationship).subscribe((res: any) => {
      this.entityList = [];
      this.entityList = res?.data?.relationships.filter((rel:any) => rel.type === 'entity');
      this.conlist = res?.data?.relationships.filter((rel:any) => rel.type === 'consumer');
      if (this.selectedconsumer.length > 0) {
        this.conlist = this.conlist.filter((el: any) => {
          return !this.selectedconsumer.find((element: any) => {
            return element.id === el.id;
          });
        });
      }
    })
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
      this.displayDuration = true;
    }
    let hourDiff = time2 / 100 - time1 / 100;
    if (time2 % 100 >= time1 % 100) hourDiff = hourDiff - 1;
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
        } else {
          let str = `${i}:${minute}`;
          this.tohrs.push(str);
        }
      });
    }
  }
  getTime(event: any) {
    this.selectedQuantity = event.target.value;
    this.ToSelectedQuantity = this.addMinutesToTime(this.selectedQuantity, 30);
    this.CalenderForm.controls['to_ts'].setValue(this.ToSelectedQuantity);
    //console.log(this.diff(this.selectedQuantity, this.ToSelectedQuantity));
    if(this.selectedQuantity){
      this.displayEndTime=this.tohrs.filter((x: number)=>{
        return x > this.selectedQuantity;
      });
      this.tohrs=this.displayEndTime;
     // console.log("aaaaaaaaa ",this.tohrs);
    }

    if( this.display==true){

          this.tohrs=this.hrs;
         // console.log("bbbbbbbbb ", this.tohrs);
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
    //console.log(this.diff(this.selectedQuantity, this.ToSelectedQuantity));
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
      if (Number(value) < 1 || Number(value) > 60) {
        this.isValidNotification=true;
        $('#' + index + "_notificationTime").text("Must be between 1 to 60 minutes")
      }

    }
    else if (type == 'hours') {
      if (Number(value) < 1 || Number(value) > 24) {
        this.isValidNotification=true;
        $('#' + index + "_notificationTime").text("Must be between 1 to 24 Hours")
      }

    }
    else if (type == 'days') {
      if (Number(value) < 1 || Number(value) > 31) {
        this.isValidNotification=true;
        $('#' + index + "_notificationTime").text("Must be between 1 to 31 Days")
      }

    }
    else if (type == 'weeks') {
      if (Number(value) < 1 || Number(value) > 4) {
        this.isValidNotification=true;
        $('#' + index + "_notificationTime").text("Must be between 1 to 4 Weeks")
      }
    }
  }
  addTeamMember() {
    let tm = this.tmsList.find((d: any) => d.name === this.CalenderForm.value.invitees_internal); //find index in your array
    this.selectedTeammembers.push(tm);
    let index = this.tmsList.findIndex((d: any) => d.id === tm.id); //find index in your array
    this.tmsList.splice(index, 1);
    this.CalenderForm.controls['invitees_internal'].setValue('');
  }
  removeTeamMember(teamMember: any) {
    let index = this.selectedTeammembers.findIndex((d: any) => d.id === teamMember.id); //find index in your array
    this.selectedTeammembers.splice(index, 1);
    this.tmsList.push(teamMember);
  }
  onChangeEntity(event: any) {
    //console.log(event.target.value);
    this.getClients(event.target.value)
  }
  addClient() {
    let client = this.clientsList.find((d: any) => d.name === this.CalenderForm.value.invitees_external); //find index in your array
    this.selectedClients.push(client);
    let index = this.clientsList.findIndex((d: any) => d.id === client.id); //find index in your array
    this.clientsList.splice(index, 1);
    this.CalenderForm.controls['invitees_external'].setValue('');
  }
  removeClient(client: any) {
    let index = this.selectedClients.findIndex((d: any) => d.id === client.id); //find index in your array
    this.selectedClients.splice(index, 1);
    this.clientsList.push(client);
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
  onSubmit() {
    this.isSubmitted = true;
    if(this.isValidNotification){
      return
    }
    if (!this.CalenderForm.valid) {
      //console.log('error');
    } else {
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
      this.CalenderForm.value.invitees_external = this.selectedClients.map((obj: any) => (obj.entityid + '_' + obj.id));
      this.CalenderForm.value.invitees_consumer_external = this.selectedconsumer.map((obj: any) => (obj.id));
      if(this.editInfo){    
        if (!this.CalenderForm.valid) {    
          return;    
        }    
        this.editCalenderDialogService.open(); 
        //console.log('editCalenderDialogService',this.editCalenderDialogService)   
        this.editCalenderDialogService.editCalObservable.subscribe((data:any)=>{    
          if(data){    
          this.CalenderForm.value.recurrent_edit_choice = data;    
          this.httpservice.sendPutRequest(URLUtils.updateEvent({'eventId':this.editInfo?.id,'offset':this.editInfo?.timezone_offset}), this.CalenderForm.value).subscribe((res: any) => {    
            if (!res.error) {    
              this.confirmationDialogService.confirm('Success', 'Congratulations! You have successfully modified the event', false, 'View Changes', 'Cancel', true).then((confirmed) => {    
                this.editCalenderDialogService.editCalSubmitted.next(null);
                //console.log('editCalenderDialogService',this.editCalenderDialogService) 
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
          return;    
        }    
        });         
      }    
      else{
      this.httpservice.sendPostRequest(URLUtils.createEvent, this.CalenderForm.value).subscribe((res: any) => {
        if (!res.error) {
          this.confirmationDialogService.confirm('Success', 'Congratulations! You have successfully the created event',false, 'View Changes', 'Cancel', true).then((confirmed) => {
            if (confirmed)
              this.router.navigate(['/meetings/view']);
            else
              window.location.reload();
          })
        } else {
          this.confirmationDialogService.confirm('Alert', res.msg,false, '', '', false, 'sm', false)
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
  }

  }

  onReset(){
    this.CalenderForm.reset();
    this.router.navigate(['/meetings/view'])
  }
}


