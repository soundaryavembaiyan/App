import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { CalenderService } from '../calender.service';

@Component({
  selector: 'app-createcalender',
  templateUrl: './createcalender.component.html',
  styleUrls: ['./createcalender.component.scss']
})
export class CreateCalenderComponent implements OnInit {
  selectedValue: any;
  product = environment.product;
  roleId: string = "AAM";
  role: string = "AAM";
  showheader  = true;
  constructor(private router: Router, private calenderService: CalenderService) { }

  ngOnInit() {

    var role = localStorage.getItem("role")
      if (role != null) { this.roleId = role }
      if (role == 'SU') { this.role = 'SuperUser' }
      if (role == 'AAM') { this.role = 'Admin' }
      if (role == 'TM') { this.role = 'Team Member' }
      if (role == 'GH') { this.role = 'Group Head' }

    //this.selectedValue='legalMatter';
    this.selectedValue= 'overHead';

    if (window.location.pathname.indexOf("edit") > -1) {
      this.showheader = false
    this.calenderService.editCalenderObservable.subscribe((result: any) => {
      if (result) {
        if (result.event_type == 'general') {
          this.selectedValue = 'generalMatter';
          let checkbox = document.getElementById('generalMatter') as HTMLInputElement | null;
          if (checkbox != null)
            checkbox.checked = true;
        }
        else if (result.event_type == 'others') {
          this.selectedValue = 'Others';
          let checkbox = document.getElementById('Others') as HTMLInputElement | null;
          if (checkbox != null)
            checkbox.checked = true;
        }
        else if (result.event_type == 'overhead') {
          this.selectedValue = 'overHead';
          let checkbox = document.getElementById('overHead') as HTMLInputElement | null;
          if (checkbox != null)
            checkbox.checked = true;
        }
        else if (result.event_type == 'reminders') {
          this.selectedValue = 'Reminders';
          let checkbox = document.getElementById('Reminders') as HTMLInputElement | null;
          if (checkbox != null)
            checkbox.checked = true;
        }
        else {
          this.selectedValue = 'legalMatter';
          let checkbox = document.getElementById('legalMatter') as HTMLInputElement | null;
          if (checkbox != null)
            checkbox.checked = true;
        }
      }
    });
  }
  }
  onSubmit(val: any) {
    let yesBtn = document.getElementById('val') as HTMLInputElement | null;
    if (yesBtn != null)
    yesBtn.checked = true;
    this.selectedValue = val;
  }
  ngAfterViewInit() {
    let checkbox = document.getElementById(this.selectedValue) as HTMLInputElement | null;
    if (checkbox != null)
      checkbox.checked = true;
  }
   
}
