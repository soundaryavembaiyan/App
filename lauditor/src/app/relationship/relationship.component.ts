import { Component, HostListener, OnInit } from '@angular/core';
import { NavigationEnd, Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AjaxService } from '../services/ajax.service';
import { HttpService } from '../services/http.service';
import { URLUtils } from '../urlUtils';

@Component({
  selector: 'app-relationship',
  templateUrl: './relationship.component.html',
  styleUrls: ['./relationship.component.scss']
})
export class RelationshipComponent implements OnInit {
  product = environment.product;
  constructor(private httpservice: HttpService,
              private router: Router,
              private aroute: ActivatedRoute) { 
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.getButtonActive(window.location.pathname.split("/").splice(-2)[0]);
      }
  });
  }

  ngOnInit(): void {
  }
  
  // relationActive(className:any){

  //   const categoryList = document.getElementsByClassName('relActive');
    
  //   for(let i=0;i<categoryList.length;i++){
  //      if(categoryList[i].classList.contains(className)){
  //       categoryList[i].classList.add('active');
  //      }else{
  //       categoryList[i].classList.remove('active');
  //      }
  //   }

  // }
  getButtonActive(buttonName:any){
    const categoryList=document.getElementsByClassName("relActive");
    for(let i=0;i<categoryList.length;i++){
      if(categoryList[i].classList.contains(buttonName)){
        categoryList[i].classList.add('active');
      }else{
        categoryList[i].classList.remove('active');
      }
    }
}



}
