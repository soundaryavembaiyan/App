// Angular Imports
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgxPaginationModule } from 'ngx-pagination';
import { DocumentRoutingModule } from '../document/document.routing.module';
import { SharedModule } from '../shared/shared.module';
import { AuditRoutingModule } from './audit-routing.module';

// This Module's Components
import { AuditTrailsComponent } from './audit-trails.component';

@NgModule({
    imports: [
        FormsModule,
        RouterModule,
        CommonModule,
        ReactiveFormsModule,
        SharedModule,
        Ng2SearchPipeModule,
        MatAutocompleteModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatFormFieldModule,
        MatInputModule,
        AuditRoutingModule,
        NgxPaginationModule,
        MatPaginatorModule ,
        MatTableModule,
        BsDatepickerModule.forRoot(),

        ],
    declarations: [
        AuditTrailsComponent,
    ],
    exports: [
        AuditTrailsComponent,
    ]
})
export class AuditTrailsModule {

}
