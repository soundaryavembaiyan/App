import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'create-relationship',
    templateUrl: 'create-relationship.component.html',
    styleUrls: ['create-relationship.component.scss']
})
export class CreateRelationshipComponent {

    constructor(private fb:FormBuilder,
                private router:Router){
        this.router.events.subscribe((val) => {
            if(this.router.url.includes('individual')){
                this.activeTab = 'individual'
            }
            if(this.router.url.includes('entity')){
                this.activeTab = 'entity'
            }
            if(this.router.url.includes('corporate')){
                this.activeTab = 'corporate'
            }
        });
    }

    product = environment.product;
    createRelationform: any = FormGroup;
    submitted:boolean = false;
    searchForm = this.fb.group({email: ['']})
    activeTab: string = "individual";

    ngOnInit(){}
    
    get f() { return this.createRelationform.controls; }

    onSubmit(){
        this.submitted = true;
    }
    onReset() {
        this.submitted = false;
    }
        // Just reset the tab when clicked.
        tabReset(name: string){
            this.activeTab = name;
        }
}
