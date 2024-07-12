import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EmailComponent } from './email.component';
import { EmailRoutingModule } from './email-routing.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ModelModule } from '../model/model.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { ConfirmationDialogComponent } from './email.component';
import {MatRadioModule} from '@angular/material/radio';

@NgModule({
  declarations: [
    EmailComponent,
    ConfirmationDialogComponent
  ],
  imports: [
    RouterModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    EmailRoutingModule,
    Ng2SearchPipeModule,
    AutocompleteLibModule,
    NgxSpinnerModule,
    ModelModule,
    MatDialogModule,
    MatFormFieldModule,
    MatButtonModule,
    MatRadioModule
    

],
providers: []
})
export class EmailModule { }
