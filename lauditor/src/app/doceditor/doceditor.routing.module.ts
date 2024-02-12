
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DoceditorComponent, ViewDocComponent } from './doceditor.component';

const routes: Routes = [
    {
        path: '',
        component: DoceditorComponent,
        children: [
            { path: '', redirectTo: '/doceditor', pathMatch: 'full' },
            { path: '/doceditor', component: DoceditorComponent },
            { path: '/viewdoc', component: ViewDocComponent}
        ]
    },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DoceditorModule { }
