import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatComponent } from '../chat/chat.component';
import { ClientsComponent } from './clients/clients.component';
import { MessagesComponent } from './messages.component';
import { TeamsComponent } from './teams/teams.component';



const routes: Routes = [
    {
        path: '',
        component: MessagesComponent,
        children: [
            {path: '', redirectTo: 'clients', pathMatch: 'full'},
            { path: 'clients', component: ClientsComponent },
            { path: 'clients', component: MessagesComponent },
            { path: 'teams', component: MessagesComponent },
            { path: 'teams', component: TeamsComponent },        
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MessagesRoutingModule { }
