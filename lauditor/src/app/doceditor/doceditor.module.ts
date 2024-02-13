
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { DoceditorComponent} from './doceditor.component';
import { LatexblockComponent, LatexDialogComponent } from './latexblock/latexblock.component';
import { ViewDocComponent, OpendialogBoxComponent, DownloadBoxComponent, ContentDialogComponent } from './doceditor.component';

@NgModule({
    imports: [
        FormsModule,
        RouterModule,
        ReactiveFormsModule, 
        MatDialogModule
    ],
    declarations: [
        DoceditorComponent,
        LatexblockComponent,
        LatexDialogComponent,
        ViewDocComponent, 
        OpendialogBoxComponent, 
        DownloadBoxComponent,
        ContentDialogComponent
    ],
    exports: [
        DoceditorComponent,
    ],
    providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: { } }
    ]
})
export class DoceditorModule{

}

