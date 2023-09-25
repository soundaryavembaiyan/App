// Angular Imports
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MessagesComponent } from './messages.component';
import { RouterModule } from '@angular/router';
import { MessagesRoutingModule } from './messages-routing.module';
import { ClientsComponent } from './clients/clients.component';
import { ChatComponent } from './chat/chat.component';
import { TeamsComponent } from './teams/teams.component';
import { ToastrModule } from 'ngx-toastr';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { SearchPipe } from '../shared/filter.pipe';
import { SharedModule } from '../shared/shared.module';

@NgModule({
    imports: [
        RouterModule,
        FormsModule,
        CommonModule,
        ReactiveFormsModule,
        MessagesRoutingModule,
        ToastrModule.forRoot(),
        Ng2SearchPipeModule,
        SharedModule
    ],
    declarations: [
        MessagesComponent,
        ClientsComponent,
        ChatComponent,
        TeamsComponent,
        
       
    ],
    exports: [
        
    ]
})
export class MessagesModule {
    

}
