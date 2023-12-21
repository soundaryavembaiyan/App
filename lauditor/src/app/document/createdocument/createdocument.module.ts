
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CreateDocumentComponent,OpendialogBoxComponent, DownloadBoxComponent, DialogBoxComponent, SectionBoxComponent, SubSection1BoxComponent, SubSection2BoxComponent, ParagraphBoxComponent, OrderedlistBoxComponent, UnorderedlistBoxComponent  } from './createdocument.component';

@NgModule({
    imports: [
        FormsModule,
        RouterModule,
        ReactiveFormsModule, 
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

    ],
    providers: [],
})
export class CreateDocumentModule{

}
