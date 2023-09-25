import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from '../services/http.service';
import { URLUtils } from '../urlUtils';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit {
  isChecked: boolean = false;
  notificationsList: any;
  selectedNotes: any = [];
  postObject: any = [];
  constructor(
    private httpService: HttpService,
    private router: Router,
    public toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getNotificationList();
  }

  isCheckBox(val: any, note: any) {
    this.isChecked = val;
    if (val) {
      note.isChecked = true;
      this.selectedNotes.push(note);
    } else {
      note.isChecked = false;
      let index = this.selectedNotes.findIndex((d: any) => d.id === note.id); //find index in your array
      //console.log('index--->' + index);
      this.selectedNotes.splice(index, 1);
    }
    //console.log('index--->' + JSON.stringify(this.selectedNotes));
  }

  getNotificationList() {
    this.httpService
      .sendGetRequest(URLUtils.getNotifications)
      .subscribe((res: any) => {
        this.notificationsList = res.data.notifications;
      });
    this.notificationsList?.forEach((item: any) => {
      item.isChecked = false;
    });
  }
  readNotification() {
    this.collectedIds();
    if (this.postObject.length == 0) {
      this.toastr.error('Select atleast 1 item');
      return;
    }
    this.httpService
      .sendDeleteRequestwithObj(URLUtils.readNotifications, this.postObject)
      .subscribe((res: any) => {
        this.toastr.success(res.msg);
        this.getNotificationList();
        this.selectedNotes = [];
      });
  }
  deleteNotification() {
    this.collectedIds();
    if (this.postObject.length == 0) {
      this.toastr.error('Select atleast 1 item');
      return;
    }
    this.httpService
      .sendDeleteRequestwithObj(URLUtils.deleteNotifications, this.postObject)
      .subscribe((res: any) => {
        this.toastr.success(res.msg);
        this.getNotificationList();
      });
    this.selectedNotes = [];
  }
  collectedIds() {
    this.selectedNotes.forEach((item: any) => {
      this.postObject.push(item.id);
    });
  }
}
