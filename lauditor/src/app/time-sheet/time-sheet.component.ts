import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-time-sheet',
  templateUrl: './time-sheet.component.html',
  styleUrls: ['./time-sheet.component.css']
})
export class TimeSheetComponent implements OnInit {

  viewMode:any="mytimeSheets";
  filterKey:any;
  authUser:boolean=false;
  isDisplay:boolean=false;
  constructor(private router:Router){
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.getButtonActive(window.location.pathname.split("/").splice(-1)[0]);
        this.filterKey = window.location.pathname.split("/").splice(-2)[1];
        //  this.viewMode=(this.filterKey=='non-submitted')?'mytimeSheets':'aggregated';
        //console.log("filter "+ this.viewMode+" = "+this.filterKey);
      }
  });

  }
  ngOnInit(): void {
    let role=localStorage.getItem('role')
    if(role=='SU' || role=='GH'){
    this.authUser=true;
    }
  }
  getButtonActive(buttonName:any){
      const categoryList=document.getElementsByClassName('button-class');
      for(let i=0;i<categoryList.length;i++){
        if(categoryList[i].classList.contains(buttonName)){
          categoryList[i].classList.add('active');
        }else{
          categoryList[i].classList.remove('active');
        }
      }
  }
  hideAndShow() {
    this.isDisplay = !this.isDisplay;
  }
}
