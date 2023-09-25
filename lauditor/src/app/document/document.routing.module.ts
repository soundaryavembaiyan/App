import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddCustomPagesComponent } from './add-custom-pages/add-custom-pages.component';
import { AddShortTextComponent } from './add-short-text/add-short-text.component';
import { DeletePagesComponent } from './delete-pages/delete-pages.component';
import { DocumentUploadComponent } from './document-upload/document-upload.component';
import { DocumentViewComponent } from './document-view/document-view.component';
import { DocumentComponent } from './document.component';
import { EditMetadataComponent } from './edit-metadata/edit-metadata.component';
import { MergePdfComponent } from './merge-pdf/merge-pdf.component';
import { PdfDocumentMergeComponent } from './pdf-document-merge/pdf-document-merge.component';
import { WaterMarkComponent } from './water-mark/water-mark.component';




const routes: Routes = [
    {
        path: '',
        component: DocumentComponent,
        children: [
            { path: '', redirectTo: 'upload/client', pathMatch: 'full' },
            // {  path: 'view', component: DocumentViewComponent },
            // {  path: 'upload', component: DocumentUploadComponent },
            { path: 'mergepdf/:filter', component: MergePdfComponent },
            { path: 'upload/:filter', component: DocumentUploadComponent },
            { path: 'view/:filter', component: DocumentViewComponent },
            { path: 'pdfmergedoc/:filter', component: PdfDocumentMergeComponent },
            { path: 'watermark', component: WaterMarkComponent },
            { path: 'editmetadata', component: EditMetadataComponent },
            { path: 'deletepages', component: DeletePagesComponent },
            { path: 'shorttext', component: AddShortTextComponent },
            { path: 'addpages', component: AddCustomPagesComponent },
            
        ]
    },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DocumentRoutingModule { }
