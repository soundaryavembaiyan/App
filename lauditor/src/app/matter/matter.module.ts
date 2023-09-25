import { CreatelegalmatterComponent } from './legalmatter/createlegalmatter/createlegalmatter.component';
import { ViewlegalmatterComponent } from './legalmatter/viewlegalmatter/viewlegalmatter.component';
import { MatterComponent } from './matter.component';
import { ExternalmatterComponent } from './legalmatter/externalmatter/externalmatter.component';
import { InternalmatterComponent } from './legalmatter/internalmatter/internalmatter.component';


import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatterRoutingModule } from './matter-routing.module';
import { CommonModule } from '@angular/common';
import { MatterTeamMembersComponent } from './legalmatter/createlegalmatter/matter-team-members/matter-team-members.component';
import { MatterGroupsComponent } from './legalmatter/createlegalmatter/matter-groups/matter-groups.component';
import { MatterDocumentsComponent } from './legalmatter/createlegalmatter/matter-documents/matter-documents.component';
import { MatterClientsComponent } from './legalmatter/createlegalmatter/matter-clients/matter-clients.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { MatterInfoComponent } from './legalmatter/createlegalmatter/matter-info/matter-info.component';
import { AddAdivicateComponent } from './legalmatter/createlegalmatter/matter-info/add-adivicate/add-adivicate.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';


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
// import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDividerModule} from '@angular/material/divider';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatIconModule} from '@angular/material/icon';
// import {MatInputModule} from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import { MatRippleModule} from '@angular/material/core';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
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
import { ViewDetailsComponent } from './legalmatter/viewdetails/viewdetails.component';
import { ViewGeneralmatterComponent } from './genaralmatter/viewgenaralmatter/viewgenaralmatter.component';
import { CreategeneralmatterComponent } from './genaralmatter/creategeneralmatter/creategeneralmatter.component';
import { GeneralMatterInfoComponent } from './genaralmatter/creategeneralmatter/general-matter-info/general-matter-info.component';
import { GeneralViewDetailsComponent } from './genaralmatter/generalviewdetails/generalviewdetails.component';
import { NgxFileDropModule } from 'ngx-file-drop';
import { ToastrModule } from 'ngx-toastr';
@NgModule({
  declarations: [
    MatterComponent,
    ViewlegalmatterComponent,
    ExternalmatterComponent,
    InternalmatterComponent,
    CreatelegalmatterComponent,
    MatterTeamMembersComponent,
    MatterGroupsComponent,
    MatterDocumentsComponent,
    MatterClientsComponent,
    MatterInfoComponent,
    AddAdivicateComponent,
    ViewDetailsComponent,
    ViewGeneralmatterComponent,
    CreategeneralmatterComponent,
    GeneralMatterInfoComponent,
    GeneralViewDetailsComponent
  ],
  imports: [
    RouterModule,
    FormsModule,
    MatterRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    Ng2SearchPipeModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
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
    MatDatepickerModule,
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
    NgxFileDropModule,
    ToastrModule.forRoot()
  ],
  providers: []
})
export class MatterModule { }
