import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { URLUtils } from 'src/app/urlUtils';
import { MessageService } from '../message.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'teams',
    templateUrl: 'teams.component.html',
    styleUrls: ['teams.component.scss']
})
export class TeamsComponent implements OnInit {
    chatSubscribe: any;
    data: any;
    clientInfo: any;
    product = environment.product;
    
    constructor(private httpservice: HttpService, private messageService: MessageService) {

    }
    ngOnInit(): void {
        this.getTeams();
    }

    getTeams() {
        this.chatSubscribe = this.httpservice.getFeaturesdata(URLUtils.getChatUsers).subscribe((res: any) => {
            this.data = res?.groups;
            // //console.log("chat users " + JSON.stringify(this.data));
        });
    }
    getClientInfo(val: any) {
        this.clientInfo = val;
        this.messageService.changeMessage(val);
    }
    ngOnDestroy() {
        if (this.chatSubscribe) {
            this.chatSubscribe.unsubscribe();
        }
    }
    getId(val: any) {
        //console.log(val);
    }

}
