import { CreateCalenderComponent } from './createcalender/createcalender.component';
import { ViewCalenderComponent } from './viewcalender/viewcalender.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CalenderComponent } from './calender.component';
import { ViewEventComponent } from './viewevent/viewevent.component';

const routes: Routes = [
    {
        path: '',
        component: CalenderComponent,
        children: [
            {
                 path: '', redirectTo: 'view', pathMatch: 'full'
            },
           { path: 'meetings/view', component: ViewCalenderComponent },
           //{ path: 'view', component: ViewCalenderComponent },
           { path: 'create', component: CreateCalenderComponent },
           { path: 'edit', component: CreateCalenderComponent }
        ]
    },
    { path: 'view/event', component: ViewEventComponent }

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CalenderRoutingModule { }
