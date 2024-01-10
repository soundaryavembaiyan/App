
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { CreateDocumentComponent,OpendialogBoxComponent, DownloadBoxComponent, DialogBoxComponent, SectionBoxComponent, SubSection1BoxComponent, SubSection2BoxComponent, ParagraphBoxComponent, OrderedlistBoxComponent, UnorderedlistBoxComponent  } from './createdocument.component';

@NgModule({
    imports: [
        FormsModule,
        RouterModule,
        ReactiveFormsModule, 
        MatDialogModule
    ],
    declarations: [
        CreateDocumentComponent,
        DialogBoxComponent,
        SectionBoxComponent,
        SubSection1BoxComponent, 
        SubSection2BoxComponent, 
        ParagraphBoxComponent,
        OrderedlistBoxComponent,
        UnorderedlistBoxComponent,
        OpendialogBoxComponent,
        DownloadBoxComponent
    ],
    exports: [
        CreateDocumentComponent,
    ],
    providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: { } }
    ]
})
export class CreateDocumentModule{

}
