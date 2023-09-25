import { NavigationEnd, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isDisplayDashboard: boolean = true;
  path: any;
  favIcon: any = document.querySelector('#appIcon');
  title: any;

  constructor(private router: Router,private titleservice: Title) {
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        if (window.location.pathname == '/login' || window.location.pathname == '/') {
          this.isDisplayDashboard = false;
          this.path = "login";
        } else if (window.location.pathname.indexOf('/forgotpassword') > -1) {
          this.isDisplayDashboard = false;
          this.path = "forgotpassword";
        } else if (window.location.pathname.indexOf('/resetpwd') > -1) {
          this.isDisplayDashboard = false;
          this.path = "resetpwd";
        }
        else {
          this.isDisplayDashboard = true;
          //console.log('Route change detected');
        }
      }
    });
  }
  ngOnInit() {
    let token=localStorage.getItem('TOKEN');
    if(!token){
      this.router.navigate(['/login']);
    }
    if (window.location.pathname == '/login' || window.location.pathname == '/') {
      this.isDisplayDashboard = false;
      this.path = "login";
    } else if (window.location.pathname.indexOf('/forgotpassword') > -1) {
      this.isDisplayDashboard = false;
      this.path = "forgotpassword";
    } else if (window.location.pathname.indexOf('/resetpwd') > -1) {
      this.isDisplayDashboard = false;
      this.path = "resetpwd";
    }
    else {
      this.isDisplayDashboard = true;
    }
    if (environment.product=="connect"){
      this.titleservice.setTitle("CofferConnect")
      this.favIcon.href = "/assets/site/images/cofferconnect-logo.png";
      // add the image to assests/img folder and change the patch here
    } else if(environment.product=="content"){
      this.titleservice.setTitle("ContentCoffer")
      this.favIcon.href = "/assets/site/images/contentcoffer-logo.png";
       // add the image to assests/img folder and change the patch here
    }
    else if(environment.product=="corporate"){
      this.titleservice.setTitle("Corporate")
      this.favIcon.href = "assets/img/logo.svg";
       // add the image to assests/img folder and change the patch here
    }
  }

}
