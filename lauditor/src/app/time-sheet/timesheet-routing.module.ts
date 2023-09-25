import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AggregateProjectsComponent } from './aggregate-projects/aggregate-projects.component';
import { AggregateTeamMembersComponent } from './aggregate-team-members/aggregate-team-members.component';
import { NonSubmittedComponent } from './non-submitted/non-submitted.component';
import { SubmittedComponent } from './submitted/submitted.component';
import { TimeSheetComponent } from './time-sheet.component';




const routes: Routes = [
    {
        path: '',
        component: TimeSheetComponent,
        children: [        
            {  path: '', redirectTo: 'non-submitted', pathMatch: 'full' },
            {  path: 'submitted', component: SubmittedComponent },
            {  path: 'non-submitted', component: NonSubmittedComponent },
            {  path: 'aggregate-projects', component: AggregateProjectsComponent },
            {  path: 'aggregate-members', component: AggregateTeamMembersComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TimesheetRoutingModule { }
