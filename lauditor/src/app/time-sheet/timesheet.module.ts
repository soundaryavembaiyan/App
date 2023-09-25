import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { RouterModule } from '@angular/router';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
// import { DatepickerModule, BsDatepickerModule, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { TimeSheetComponent } from './time-sheet.component';
import { TimesheetRoutingModule } from './timesheet-routing.module';
import { BsDatepickerModule, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { NonSubmittedComponent } from './non-submitted/non-submitted.component';
import { SubmittedComponent } from './submitted/submitted.component';
import { ModelModule } from '../model/model.module';
import { AggregateProjectsComponent } from './aggregate-projects/aggregate-projects.component';
import { AggregateTeamMembersComponent } from './aggregate-team-members/aggregate-team-members.component';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
    declarations: [
        TimeSheetComponent,
        NonSubmittedComponent,
        SubmittedComponent,
        AggregateProjectsComponent,
        AggregateTeamMembersComponent
    ],
    imports: [
        RouterModule,
        FormsModule,
        CommonModule,
        ReactiveFormsModule,
        MatAutocompleteModule,
        Ng2SearchPipeModule,
        TimesheetRoutingModule,
        BsDatepickerModule.forRoot(),
        ModelModule,
        ToastrModule.forRoot()
    ],
    providers: [BsDatepickerConfig]
})
export class TimeSheetModule { }
