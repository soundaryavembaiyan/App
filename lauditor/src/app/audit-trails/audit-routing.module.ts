import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuditTrailsComponent } from './audit-trails.component';
const routes: Routes = [
    {
        path: '',
        component: AuditTrailsComponent
    }

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuditRoutingModule { }
