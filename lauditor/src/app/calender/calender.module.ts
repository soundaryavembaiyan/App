import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CalenderComponent } from './calender.component';
import { CalenderRoutingModule } from './calender-routing.module';
import { LegalMatterCalenderComponent } from './createcalender/legalmatter-calender/legalmatter-calender.component';
import { GeneralMatterCalenderComponent } from './createcalender/generalmatter-calender/generalmatter-calender.component';
import { CreateCalenderComponent } from './createcalender/createcalender.component';
import { OthersCalenderComponent } from './createcalender/others-calender/others-calender.component';
import { RemindersCalenderComponent } from './createcalender/reminders-calender/reminders-calender.component';
import { OverheadCalenderComponent } from './createcalender/overhead-calender/overhead-calender.component';
import { BsDatepickerConfig, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ViewCalenderComponent } from './viewcalender/viewcalender.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { ViewEventComponent } from './viewevent/viewevent.component';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [
    CalenderComponent,
    CreateCalenderComponent,
    LegalMatterCalenderComponent,
    GeneralMatterCalenderComponent,
    OthersCalenderComponent,
    OverheadCalenderComponent,
    RemindersCalenderComponent,
    ViewCalenderComponent,
    ViewEventComponent
  ],
  imports: [
    RouterModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    CalenderRoutingModule,
    BsDatepickerModule.forRoot(),
    ToastrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    })
],
providers: [BsDatepickerConfig]
})
export class CalenderModule { }
