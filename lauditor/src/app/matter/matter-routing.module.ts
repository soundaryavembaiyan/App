import { ViewGeneralmatterComponent } from './genaralmatter/viewgenaralmatter/viewgenaralmatter.component';
import { ViewDetailsComponent } from './legalmatter/viewdetails/viewdetails.component';
import { CreatelegalmatterComponent } from './legalmatter/createlegalmatter/createlegalmatter.component';
import { MatterComponent } from './matter.component';
import { ViewlegalmatterComponent } from './legalmatter/viewlegalmatter/viewlegalmatter.component';
import { ExternalmatterComponent } from './legalmatter/externalmatter/externalmatter.component';
import { InternalmatterComponent } from './legalmatter/internalmatter/internalmatter.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MatterClientsComponent } from './legalmatter/createlegalmatter/matter-clients/matter-clients.component';
import { MatterDocumentsComponent } from './legalmatter/createlegalmatter/matter-documents/matter-documents.component';
import { MatterGroupsComponent } from './legalmatter/createlegalmatter/matter-groups/matter-groups.component';
import { MatterTeamMembersComponent } from './legalmatter/createlegalmatter/matter-team-members/matter-team-members.component';
import { MatterInfoComponent } from './legalmatter/createlegalmatter/matter-info/matter-info.component';
import { CreategeneralmatterComponent } from './genaralmatter/creategeneralmatter/creategeneralmatter.component';
import { GeneralMatterInfoComponent } from './genaralmatter/creategeneralmatter/general-matter-info/general-matter-info.component';
import { GeneralViewDetailsComponent } from './genaralmatter/generalviewdetails/generalviewdetails.component';



const routes: Routes = [
    {
        path: '',
        component: MatterComponent,
        children: [
             {
                  path: '', redirectTo: 'legalmatter/view', pathMatch: 'full'
             },
            //{ path: 'legalmatter/view', component: ViewlegalmatterComponent },
            { path: 'matter/legalmatter/view', component: ViewlegalmatterComponent },
            { path: 'legalmatter/viewDetails', component: ViewDetailsComponent },
            { path: 'legalmatter/create', component: CreatelegalmatterComponent},
            { path: 'legalmatter/matterEdit', component: MatterInfoComponent},
            { path:'matterClients',component: MatterClientsComponent },
            { path:'MatterDocuments',component: MatterDocumentsComponent },
            { path:'MatterGroups',component: MatterGroupsComponent },
            { path: 'legalmatter/updateGroups', component: MatterGroupsComponent},
            { path:'MatterTeamMembers',component: MatterTeamMembersComponent },
            //{ path: 'generalmatter/view', component: ViewGeneralmatterComponent },
            { path: 'matter/generalmatter/view', component: ViewGeneralmatterComponent },
            { path: 'generalmatter/create', component: CreategeneralmatterComponent},
            { path: 'generalmatter/matterEdit', component: GeneralMatterInfoComponent},
            { path: 'generalmatter/updateGroups', component: MatterGroupsComponent},
            { path: 'generalmatter/viewDetails', component: GeneralViewDetailsComponent },
            { path: 'matter/legalmatter/view/external', component: ExternalmatterComponent },
            { path: 'matter/generalmatter/view/external', component: ExternalmatterComponent },
            { path: 'external', component: ExternalmatterComponent },
            { path: 'internal', component: InternalmatterComponent },

         
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MatterRoutingModule { }
