import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InvoiceComponent } from './invoice.component';
import { CreateinvoiceComponent } from './createinvoice/createinvoice.component';
import { PreviewComponent } from './preview/preview.component';



const routes: Routes = [
    {
        path: '',
        component: InvoiceComponent,
        children: [
            { path: '', redirectTo: 'invoice', pathMatch: 'full' },
            { path: 'invoice', component: InvoiceComponent },
            { path: 'createinvoice', component: CreateinvoiceComponent },
            { path: 'preview', component: PreviewComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class InvoiceRoutingModule { }
