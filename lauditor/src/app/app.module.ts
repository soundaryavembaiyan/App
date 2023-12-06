import { EditCalenderDialogComponent } from './edit-calender-options/edit-calender-dialog.component';
import { MatterModule } from './matter/matter.module';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
 import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ForgotpwdComponent } from './login/forgotpwd/forgotpwd.component';
import { LoginComponent } from './login/login.component';
//import { NotesComponent } from './sideNavbar/notes/notes.component';
import { TimeSheetComponent } from './time-sheet/time-sheet.component';
import { GridComponent } from './grid/grid.component';
// import { DocumentComponent } from './document/document.component';
// import { RelationshipComponent } from './relationship/relationship.component';
// import { TimesheetComponent } from './timesheet/timesheet.component';
import { NotesComponent } from './notes/notes.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { RegisterComponent } from './register/register.component';
import { ToastrModule } from 'ngx-toastr';
import { BlockUIModule } from 'ng-block-ui';
import * as $ from 'jquery';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RelationshipModule } from './relationship/relationship.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import {A11yModule} from '@angular/cdk/a11y';
import {CdkAccordionModule} from '@angular/cdk/accordion';
import {ClipboardModule} from '@angular/cdk/clipboard';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {PortalModule} from '@angular/cdk/portal';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {CdkStepperModule} from '@angular/cdk/stepper';
import {CdkTableModule} from '@angular/cdk/table';
import {CdkTreeModule} from '@angular/cdk/tree';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatBadgeModule} from '@angular/material/badge';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatButtonModule} from '@angular/material/button';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatChipsModule} from '@angular/material/chips';
import {MatStepperModule} from '@angular/material/stepper';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDividerModule} from '@angular/material/divider';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {MatNativeDateModule, MatRippleModule} from '@angular/material/core';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { NgxSpinnerModule } from 'ngx-spinner';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSliderModule} from '@angular/material/slider';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {MatTabsModule} from '@angular/material/tabs';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatTreeModule} from '@angular/material/tree';
import {OverlayModule} from '@angular/cdk/overlay';
import {CdkMenuModule} from '@angular/cdk/menu';
import {DialogModule} from '@angular/cdk/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';

import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
// import { MessagesComponent } from './messages/messages.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogService } from './confirmation-dialog/confirmation-dialog.service';
import {  EditCalenderDialogService} from './edit-calender-options/edit-calender-dialog.service';
import { DocumentModule } from './document/document.module';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
// import { NgxDocViewerModule } from 'ngx-doc-viewer/document-viewer.module';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { BsDatepickerModule, BsDatepickerConfig, } from 'ngx-bootstrap/datepicker';
import { ModelModule } from './model/model.module';
import { GroupsModule } from './groups/groups.module';
import { SharedModule } from './shared/shared.module';
// import { AuditComponent } from './audit/audit.component';
import { CalenderModule } from './calender/calender.module';
import { FirmnameLoginComponent } from './login/firmname-login/firmname-login.component';
import { ResetpwdComponent } from './login/resetpwd/resetpwd.component';
import { MessagesModule } from './messages/messages.module';
import { EmailModule } from './email/email.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { AuditTrailsModule } from './audit-trails/audit-trails.module';
import { FirmProfileComponent } from './firm-profile/firm-profile.component';
import { PracticePartnerComponent } from './firm-profile/practice-partner/practice-partner.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { CreateinvoiceComponent } from './invoice/createinvoice/createinvoice.component';
import { PreviewComponent } from './invoice/preview/preview.component';
import { DatepickerModule } from 'ngx-bootstrap/datepicker';
import { PaymentComponent } from './payment/payment.component';
import { CreateDocumentComponent, DialogBoxComponent, ParagraphBoxComponent, SectionBoxComponent, SubSection1BoxComponent, SubSection2BoxComponent } from './document/createdocument/createdocument.component';


@NgModule({
  declarations: [		
    AppComponent,
      DashboardComponent,
      LoginComponent,
      ForgotpwdComponent,
      GridComponent,
      // DocumentComponent,
      // RelationshipComponent,
      NotesComponent,
      NotificationsComponent,
      RegisterComponent,
      // MessagesComponent,
      ResetpwdComponent,
      ConfirmationDialogComponent,
      EditCalenderDialogComponent,
      // AuditComponent,
      FirmnameLoginComponent,
      FirmProfileComponent,
      PracticePartnerComponent,
      InvoiceComponent,
      CreateinvoiceComponent,
      PreviewComponent,
      PaymentComponent,
      //CreateDocumentComponent,
      //DialogBoxComponent,
      SectionBoxComponent,
      //SubSection1BoxComponent, 
      //SubSection2BoxComponent, 
      //ParagraphBoxComponent
      
       
   ],
  imports: [
    BrowserModule,
    ModelModule,
    AppRoutingModule,
    RouterModule,
    FormsModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
     BrowserAnimationsModule,
    BlockUIModule.forRoot(),
    BsDatepickerModule.forRoot(),
    DatepickerModule.forRoot() ,
    HttpClientModule,
    MatterModule,
    GroupsModule,
    RelationshipModule,
    DocumentModule,
    CommonModule,
    Ng2SearchPipeModule,
    A11yModule,
    CdkAccordionModule,
    ClipboardModule,
    CdkMenuModule,
    CdkStepperModule,
    CdkTableModule,
    CdkTreeModule,
    DragDropModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    OverlayModule,
    PortalModule,
    ScrollingModule,
    DialogModule,
    MatDatepickerModule,
    MatFormFieldModule,
    AutocompleteLibModule,
    NgxDocViewerModule,
    BsDatepickerModule.forRoot(),
    SharedModule,
    CalenderModule,
    MessagesModule,
    EmailModule,
    NgxPaginationModule,
    AuditTrailsModule
  ],
  providers: [HttpClient,ConfirmationDialogService,BsDatepickerConfig,EditCalenderDialogService, 
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: false } }
  ],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
  ],
  
})
export class AppModule { }
