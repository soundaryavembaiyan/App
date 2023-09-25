import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-matter',
  templateUrl: './matter.component.html',
  styleUrls: ['./matter.component.scss']
})
export class MatterComponent implements OnInit {
  selectedValue: string = "view";
  selectedMatter: string = "legalmatter";
  selectedMat: string ="internal"
  product = environment.product;
  
  isDisplay:boolean=true;
  constructor(private router:Router) { }

  ngOnInit(): void {
    if (window.location.pathname == '/matter/legalmatter/create') {
      this.selectedMatter='legalmatter';
      this.selectedValue = 'create';
    }


    else if(window.location.pathname == '/matter/generalmatter/create'){
      this.selectedMatter='generalmatter';
      this.selectedValue = 'create';
    }
    else if(window.location.pathname == '/matter/legalmatter/view'){
      this.selectedMatter='legalmatter';
      this.selectedValue = 'view';
    }
    else{
      this.selectedMatter='generalmatter';
      this.selectedValue = 'view';
    }
  }
  isActive(value: string) {
    this.selectedValue = value;
    this.selectedValue=='create'?this.router.navigate(['/matter/'+this.selectedMatter+'/create']):this.router.navigate(['/matter/'+this.selectedMatter+'/view']);

    //this.selectedValue=='create'?this.router.navigate(['/matter/'+this.selectedMatter+'/create'+this.selectedMat]):this.router.navigate(['/matter/'+this.selectedMatter+'/view'+this.selectedMat]);
  }
  isActived(value: string) {
    this.selectedMat = value;
    console.log(this.selectedMat)
    //this.selectedMat=='create'?this.router.navigate(['/matter/'+this.selectedMatter+'/create'+this.selectedMat]):this.router.navigate(['/matter/'+this.selectedMatter+'/view'+this.selectedMat]);

 }
  onClick(value: string) {
    this.selectedMatter = value;
    this.selectedMatter=='legalmatter'?this.router.navigate(['/matter/legalmatter/'+this.selectedValue]):this.router.navigate(['/matter/generalmatter/'+this.selectedValue]);
    
    //this.selectedMatter=='legalmatter'?this.router.navigate(['/matter/legalmatter/'+this.selectedValue+this.selectedMat]):this.router.navigate(['/matter/generalmatter/'+this.selectedValue+this.selectedMat]);
  }
  hideAndShow() {
    this.isDisplay = !this.isDisplay;
  }
}
