// Angular Imports
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { CommonModule } from '@angular/common';
import { RelationshipComponent } from './relationship.component';
import { CreateRelationshipComponent } from './create-relationship/create-relationship.component';
import { ViewRelationshipComponent } from './view-relationship/view-relationship.component';
import { RelationshipRoutingModule } from './relationship-routing.module';
// import { BrowserModule } from '@angular/platform-browser';
import { EntityComponent } from './create-relationship/entity/entity.component';
import { ExternalPartnerComponent } from './create-relationship/external-partner/external-partner.component';
import { IndividualComponent } from './create-relationship/individual/individual.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatAutocompleteModule} from '@angular/material/autocomplete';
import { RelationshipGroupAccessComponent } from './view-relationship/relationship-group-access/relationship-group-access.component';
import { RelationshipExchangeComponent } from './view-relationship/relationship-exchange/relationship-exchange.component';
import { ModelModule } from '../model/model.module';

@NgModule({
    imports: [
        RouterModule,
        FormsModule,
        CommonModule,
        ReactiveFormsModule,
        RelationshipRoutingModule,
        MatAutocompleteModule,
        Ng2SearchPipeModule,
        ModelModule,
        ],
    declarations: [
        RelationshipComponent,
        CreateRelationshipComponent,
        ViewRelationshipComponent,
        EntityComponent,
        ExternalPartnerComponent,
        IndividualComponent,
        RelationshipGroupAccessComponent,
        RelationshipExchangeComponent
    ],
    exports: [
        
    ]
})
export class RelationshipModule {

}
