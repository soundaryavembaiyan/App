import { ConfirmationDialogService } from './../../confirmation-dialog/confirmation-dialog.service';
import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/services/http.service';
import { URLUtils } from 'src/app/urlUtils';
import { CalenderService } from '../calender.service';
import { ToastrService } from 'ngx-toastr';
import { Pipe } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ModalService } from 'src/app/model/model.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-viewevent',
  templateUrl: './viewevent.component.html',
  styleUrls: ['./viewevent.component.scss']
})
export class ViewEventComponent implements OnInit {
  data: any;
  pipe = new DatePipe('en-US');
  eventInfo: any;
  firstNotification: any = [];
  remainingNotications: any = [];
  scheduledDate: any;
  teamMembers: any = [];
  clients: any = [];
  OrganizerFirstLetter: any;
  selectedValue: string = 'Yes';
  viewDoc = true;
  //events = ['overhead','others','reminders'];
  events = ['legal', 'general'];
  expanded: boolean = false;
  product = environment.product;
  pdfSrc: any;
  docapi = environment.doc2pdf;

  toggleContent(): void {
    this.expanded = !this.expanded;
  }

  constructor(private httpservice: HttpService, private router: Router, private toaster: ToastrService,
    private calenderService: CalenderService, public sanitizer: DomSanitizer, private modalService: ModalService, private confirmationDialogService: ConfirmationDialogService) {
    this.data = this.router.getCurrentNavigation()?.extras.state;
  }
  ngOnInit() {
    if (this.data)
      this.getEventData();
    //console.log('evInfo', this.eventInfo)
    //console.log('this.selectedValue',this.selectedValue)
  }
  getEventData() {
    this.httpservice.sendGetRequest(URLUtils.eventViewDetails(this.data)).subscribe(
      (res: any) => {
        if (res) {
          this.eventInfo = res.event;
          //console.log('evInfo', this.eventInfo)

          for (let i = 0; i < this.events.length; i++) {
            if (i == this.eventInfo.matter_type) {
              this.viewDoc = false;
              break;
            }
            //console.log('viewDoc',this.viewDoc)
            //console.log('event_type',this.eventInfo.event_type)
          }

          if (this.eventInfo?.notifications && this.eventInfo?.notifications?.length > 0) {
            this.firstNotification = this.eventInfo?.notifications[0];
            this.remainingNotications = this.eventInfo?.notifications.slice(1, this.eventInfo?.notifications.length);
          }
          this.OrganizerFirstLetter = this.eventInfo.owner_name.charAt(0)?.toUpperCase();
          this.scheduledDate = this.eventInfo.allday ? new Date(this.eventInfo?.from_ts).toDateString() + ' : All Day' : new Date(this.eventInfo?.from_ts).toDateString() + ' : ' + this.pipe.transform(this.eventInfo?.from_ts, 'h:mm a') + ' - ' + this.pipe.transform(this.eventInfo?.to_ts, 'h:mm a');
          let teamMembersList = this.eventInfo.invitees_internal.map((person: any) => ({ "name": person.name, "rsvp": person.rsvp }));
          this.teamMembers = [];
          //console.log('teamMembers',this.teamMembers)
          if (teamMembersList && teamMembersList.length > 0) {
            for (let i = 0; i < teamMembersList.length; i++) {
              let teamMem = {
                firstChar: (teamMembersList[i].name.charAt(0))?.toUpperCase(),
                name: teamMembersList[i].name,
                rsvp: teamMembersList[i].rsvp
              };
              this.teamMembers.push(teamMem);
            }
          }
          let external = this.eventInfo.invitees_external.concat(this.eventInfo.invitees_consumer_external, this.eventInfo.invitees_corporate)
          let clientsList = external.map((person: any) => ({ "entName": person.entityName, "tmName": person.tmName, "rsvp": person.rsvp, "tmId": person.tmId }));
          this.clients = [];
          //console.log('clients',this.clients)
          if (clientsList && clientsList.length > 0) {
            for (let i = 0; i < clientsList.length; i++) {
              let x = this.clients.filter((val: any) => val.entName === clientsList[i].entName)
              let clientMem = {
                firstChar: (clientsList[i].tmName?.charAt(0))?.toUpperCase(),
                name: clientsList[i].tmName,
                rsvp: clientsList[i].rsvp,
                tmId: clientsList[i].tmId,
                entName: x.length > 0 ? '' : clientsList[i].entName,
                firstCharEntity: x.length > 0 ? '' : clientsList[i].entName?.charAt(0)?.toUpperCase(),
              };
              this.clients.push(clientMem);
            }
          }
          //console.log(this.clients)
        }
      });
  }

  onEdit() {
    this.calenderService.editEvent(this.eventInfo); //get the edit datas
    //console.log('EvInfo',this.eventInfo)
    this.router.navigate(['/meetings/edit'])
  }

  onDelete() {
    this.confirmationDialogService.confirm('Confirmation', 'Are you sure do you want to delete ' + this.eventInfo.title, true, 'Yes')
      .then((confirmed) => {
        if (confirmed) {
          this.httpservice.sendDeleteRequestwithObj(URLUtils.deleteEvent({ eventId: this.eventInfo.id }), { choice: "this" }).subscribe((res: any) => {
            //console.log("res" + res);
            this.router.navigate(['/meetings/view'])
          },
            (error: HttpErrorResponse) => {
              if (error.status === 401 || error.status === 403) {
                const errorMessage = error.error.msg || 'Unauthorized';
                this.toaster.error(errorMessage);
                //console.log(error);
              }
            }
          );
        }
      })
  }

  onClickAttending(val: string) {
    this.selectedValue = val;
    //console.log('this.selectedValue', this.selectedValue)
    this.httpservice.sendPutRequest(URLUtils.updateRSVP({ event_id: this.eventInfo.id }), { rsvp_response: this.selectedValue }).subscribe((res: any) => {
      if (res.error == false) {
        this.toaster.success(res.msg);
      }
    },
      (error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403) {
          const errorMessage = error.error.msg || 'Unauthorized';
          this.toaster.error(errorMessage);
          //console.log(error);
        }
      }
    );
  }


  openModal(id: string) {
    this.modalService.open(id);
  }

  closeModal(id: string) {
    this.modalService.close(id);
  }
}
