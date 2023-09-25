import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FirmProfileComponent } from './firm-profile.component';
import { PracticePartnerComponent } from './practice-partner/practice-partner.component';



const routes: Routes = [
    {
        path: '',
        component: FirmProfileComponent,
        children: [
            { path: '', redirectTo: 'profile', pathMatch: 'full' },
            { path: 'profile', component: FirmProfileComponent },
            { path: 'partner', component: PracticePartnerComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FirmProfileRoutingModule { }
