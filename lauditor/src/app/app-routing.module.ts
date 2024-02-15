import { TimeSheetComponent } from './time-sheet/time-sheet.component';
import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { GridComponent } from './grid/grid.component';
import { DocumentComponent } from './document/document.component';
import { RelationshipComponent } from './relationship/relationship.component';
// import { TimesheetComponent } from './timesheet/timesheet.component';

import { EmailComponent } from './email/email.component';
import { NotesComponent } from './notes/notes.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { ChatComponent } from './chat/chat.component';
import { RegisterComponent } from './register/register.component';
import { RouterModule, Routes } from '@angular/router';
// import { AuditComponent } from './audit/audit.component';
import { FirmProfileComponent } from './firm-profile/firm-profile.component';
import { PracticePartnerComponent } from './firm-profile/practice-partner/practice-partner.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { CreateinvoiceComponent } from './invoice/createinvoice/createinvoice.component';
import { PreviewComponent } from './invoice/preview/preview.component';
import { PaymentComponent } from './payment/payment.component';
import { DoceditorComponent, ViewDocComponent } from './doceditor/doceditor.component';


const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'grid', component: GridComponent },
  { path: 'timesheets', loadChildren: () => import(`./time-sheet/timesheet.module`).then(m => m.TimeSheetModule) },
  { path: 'matter', loadChildren: () => import(`./matter/matter.module`).then(m => m.MatterModule) },
  { path: 'groups', loadChildren: () => import(`./groups/groups.module`).then(m => m.GroupsModule) },
  { path: 'relationship', loadChildren: () => import(`./relationship/relationship.module`).then(m => m.RelationshipModule) },
  { path: 'documents', loadChildren: () => import(`./document/document.module`).then(m => m.DocumentModule) },
  { path: 'meetings', loadChildren: () => import(`./calender/calender.module`).then(m => m.CalenderModule) },
  { path: 'audit', loadChildren: () => import(`./audit-trails/audit-trails.module`).then(m => m.AuditTrailsModule) },
  
  // { path: 'timesheet', component: TimesheetComponent },
  { path: 'emails', loadChildren: () => import(`./email/email.module`).then(m => m.EmailModule) },
  { path: 'notes', component: NotesComponent },
  { path: 'notifications', component: NotificationsComponent },
  // { path: 'audit', component: AuditComponent },
  { path: 'chat', component: ChatComponent },
  { path: 'messages', loadChildren: () => import(`./messages/messages.module`).then(m => m.MessagesModule) },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: FirmProfileComponent },
  { path: 'partner', component: PracticePartnerComponent },
  //{ path: 'invoice', component: InvoiceComponent },
  { path: 'invoice', loadChildren: () => import(`./invoice/invoice-routing.module`).then(m => m.InvoiceRoutingModule) },
  { path: 'payment', loadChildren: () => import(`./payment/payment-routing.module`).then(m => m.PaymentRoutingModule) },
  { path: 'createinvoice', component: CreateinvoiceComponent },
  { path: 'preview/:id', component: PreviewComponent },
  { path: 'doceditor', component: DoceditorComponent},
  { path: 'viewdoc', component: ViewDocComponent}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
