import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-calender',
  templateUrl: './calender.component.html',
  styleUrls: ['./calender.component.scss']
})
export class CalenderComponent implements OnInit {

  isDisplay:boolean=true;
  selectedValue: string = "view";
  
  constructor(private router: Router) { }

  ngOnInit() {
    if (window.location.pathname == '/meetings/create') {
      this.selectedValue = 'create';
    }
    if (window.location.pathname == '/meetings/view') {
      this.selectedValue = 'view';
    }
  }
  isActive(value: string) {
    this.selectedValue = value;
    this.selectedValue == 'create' ? this.router.navigate(['/meetings/create']) : this.router.navigate(['/meetings/view']);
    //console.log('selectedValue:', this.selectedValue);
  }



}
