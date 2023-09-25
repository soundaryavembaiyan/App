import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GroupsComponent } from './groups.component';
import { CreateMembersComponent } from './create-members/create-members.component';
import { CreateGroupComponent } from './create-group/create-group.component';
import { ViewMembersComponent } from './view-members/view-members.component';
import { ViewGroupComponent } from './view-group/view-group.component';


const routes: Routes = [
    {
        path: '',
        component: GroupsComponent,
        children: [
            {path: '', redirectTo: 'view-group', pathMatch: 'full'},
            { path: 'create-member', component: CreateMembersComponent },
            { path: 'create-group', component: CreateGroupComponent },
            { path: 'view-member', component:  ViewMembersComponent},
            { path: 'view-group', component: ViewGroupComponent },
            { path: 'view-group/:highlight', component: ViewGroupComponent },
        
        
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class GroupsRoutingModule { }
