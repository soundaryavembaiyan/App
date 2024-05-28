import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

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
  constructor(private router:Router, private route: ActivatedRoute){
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.getButtonActive(window.location.pathname.split("/").splice(-1)[0]);
        this.filterKey = window.location.pathname.split("/").splice(-2)[1];
        //  this.viewMode=(this.filterKey=='non-submitted')?'mytimeSheets':'aggregated';
        //console.log("filter "+ this.viewMode+" = "+this.filterKey);
        this.setView();
      }
  });

  }
  ngOnInit(): void {
    let role=localStorage.getItem('role')
    if(role=='SU' || role=='GH'){
    this.authUser=true;
    }
   this.setView();
  }
  setView(){
    this.router.events.subscribe(() => {
      const currentUrl = this.router.url;
      if (currentUrl.includes('aggregate-members') || currentUrl.includes('aggregate-projects')) {
        this.viewMode = 'aggregated';
      } else if (currentUrl.includes('non-submitted') || currentUrl.includes('submitted')) {
        this.viewMode = 'mytimeSheets';
      }
    });    
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

  isActive(value: string) {
    this.viewMode = value;
    this.viewMode == 'mytimeSheets' ? this.router.navigate(['/timesheets/non-submitted']) : this.router.navigate(['/timesheets/aggregate-members']);
  }

}
