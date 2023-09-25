// Angular Imports
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatAutocompleteModule} from '@angular/material/autocomplete';
import { ModelModule } from '../model/model.module';
import { FirmProfileComponent } from './firm-profile.component';
import { PracticePartnerComponent } from './practice-partner/practice-partner.component';
import { URLUtils } from '../urlUtils';
import { FirmProfileRoutingModule } from './firm-profile-routing.module';
import { data } from 'jquery';

@NgModule({
    imports: [
        RouterModule,
        FormsModule,
        CommonModule,
        ReactiveFormsModule,
        FirmProfileModule,
        MatAutocompleteModule,
        Ng2SearchPipeModule,
        ModelModule,
        FirmProfileRoutingModule
        ],
    declarations: [
        FirmProfileComponent,
        PracticePartnerComponent,

    ],
    exports: [
       
    ]
})
export class FirmProfileModule {


}
