import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PaymentComponent } from './payment.component';



const routes: Routes = [
    {
        path: '',
        component: PaymentComponent,
        children: [
            { path: '', redirectTo: 'invoice', pathMatch: 'full' },
            { path: 'payment', component: PaymentComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PaymentRoutingModule { }
