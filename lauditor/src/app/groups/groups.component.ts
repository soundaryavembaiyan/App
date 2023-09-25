import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'groups',
    templateUrl: 'groups.component.html',
    styleUrls: ['groups.component.scss']
})
export class GroupsComponent implements OnInit{

  product = environment.product;
  categoryName: any = 'Dashboard';
  name: string = "";
  role: string = "";
  roleId: string = "";

    constructor(private router:Router){
      this.router.events.subscribe((val) => {
        if (val instanceof NavigationEnd) {
          this.getButtonActive(window.location.pathname.split("/").splice(-1)[0]);
        }
    });
    }

    ngOnInit() {
      var role = localStorage.getItem("role")
      if (role != null) { this.roleId = role }
      if (role == 'SU') { this.role = 'SuperUser' }
      if (role == 'AAM') { this.role = 'Admin' }
      if (role == 'TM') { this.role = 'Team Member' }
      if (role == 'GH') { this.role = 'Group Head' }
    }

    getButtonActive(buttonName:any){
        const categoryList=document.getElementsByClassName("button-class");
        for(let i=0;i<categoryList.length;i++){
          if(categoryList[i].classList.contains(buttonName)){
            categoryList[i].classList.add('active');
          }else{
            categoryList[i].classList.remove('active');
          }
        }
    }
}
