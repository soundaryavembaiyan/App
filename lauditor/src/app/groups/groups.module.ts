// Angular Imports
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { CreateGroupComponent } from './create-group/create-group.component';
import { CreateMembersComponent } from './create-members/create-members.component';
import { GroupsRoutingModule } from './groups-routing.module';
import { ModelModule } from '../model/model.module';

// This Module's Components
import { GroupsComponent } from './groups.component';
import { ViewGroupComponent } from './view-group/view-group.component';
import { ViewMembersComponent } from './view-members/view-members.component';
import { CommonModule } from '@angular/common';
import { EditMembersComponent } from './view-group/edit-members/edit-members.component';
import { EditGroupHeadComponent } from './view-group/edit-group-head/edit-group-head.component';
import { DeleteGroupComponent } from './view-group/delete-group/delete-group.component';
import { GroupAccessComponent } from './view-members/group-access/group-access.component';
import { MemberEditComponent } from './view-members/member-edit/member-edit.component';
import { GroupActivityLogComponent } from './view-group/group-activity-log/group-activity-log.component';
import { DialogComponent } from './dialog/dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SharedModule } from '../shared/shared.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

@NgModule({
    imports: [
        RouterModule,
        FormsModule,
        GroupsRoutingModule,
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule ,
        MatInputModule ,
        SharedModule,
        MatDatepickerModule,
        ModelModule,
        Ng2SearchPipeModule,
        ],
    declarations: [
        GroupsComponent,        
        CreateGroupComponent,
        CreateMembersComponent,
        ViewMembersComponent,
        ViewGroupComponent,
        EditMembersComponent,
        EditGroupHeadComponent,
        DeleteGroupComponent,
        GroupAccessComponent,
        MemberEditComponent,
        DialogComponent,
        GroupActivityLogComponent
    ],
    exports: [
        GroupsComponent,
    ]
})
export class GroupsModule {
    

}
