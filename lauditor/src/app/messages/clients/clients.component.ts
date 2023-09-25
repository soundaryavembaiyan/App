import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { URLUtils } from 'src/app/urlUtils';
import { environment } from 'src/environments/environment';
import { MessageService } from '../message.service';

@Component({
    selector: 'clients',
    templateUrl: 'clients.component.html',
    styleUrls: ['clients.component.scss']
})
export class ClientsComponent implements OnInit {
    data: any;
    relationshipSubscribe: any;
    clientInfo: any;
    product = environment.product;

    constructor(private httpservice: HttpService,private messageService:MessageService) {

    }
    ngOnInit(): void {
        
        if (this.product == 'corporate') {
            this.getcorpRelationships();
        }
        else {
            this.getRelationships();
            this.getcorpRelationships();
        }

    }
    getClientInfo(val: any) {
        this.clientInfo = val;
      this.messageService.changeMessage(val);
    }
  
    getRelationships() {
        this.relationshipSubscribe = this.httpservice.getFeaturesdata(URLUtils.getChatRelationship).subscribe((res: any) => {
            this.data = res?.data?.relationships;
             //console.log("relationship " + JSON.stringify(this.data));
        });
    }
    getcorpRelationships() {
        this.relationshipSubscribe = this.httpservice.getFeaturesdata(URLUtils.getcorporateRelationship).subscribe((res: any) => {
            this.data = res?.relationships;
             console.log("relationship " + JSON.stringify(this.data));
        });
    }
    ngOnDestroy() {
        if (this.relationshipSubscribe) {
            this.relationshipSubscribe.unsubscribe();
        }
    }
}