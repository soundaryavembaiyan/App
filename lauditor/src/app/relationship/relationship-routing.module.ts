import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateRelationshipComponent } from './create-relationship/create-relationship.component';
import { EntityComponent } from './create-relationship/entity/entity.component';
import { ExternalPartnerComponent } from './create-relationship/external-partner/external-partner.component';
import { IndividualComponent } from './create-relationship/individual/individual.component';
import { RelationshipComponent } from './relationship.component';
import { RelationshipExchangeComponent } from './view-relationship/relationship-exchange/relationship-exchange.component';
import { ViewRelationshipComponent } from './view-relationship/view-relationship.component';



const routes: Routes = [
    {
        path: '',
        component: RelationshipComponent,
        children: [
            {
                path: 'add', component: CreateRelationshipComponent,
                children: [
                    { path: '', redirectTo: 'individual', pathMatch: 'full' },
                    { path: 'entity', component:EntityComponent },
                    //{ path: 'corporate', component:EntityComponent },
                    { path: 'individual', component:IndividualComponent },
                    { path: 'corporate', component:ExternalPartnerComponent }
                ]
            },
            {  path: '', redirectTo: 'view', pathMatch: 'full' },
            {  path: 'view', component: ViewRelationshipComponent },
            {  path: 'view/:filter', component: ViewRelationshipComponent },
            {  path: 'view/:filter/:highlight', component: ViewRelationshipComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RelationshipRoutingModule { }
