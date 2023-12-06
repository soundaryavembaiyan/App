import { Component, Inject, Injectable, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ModalService } from 'src/app/model/model.service';
import { HttpService } from 'src/app/services/http.service';
import { URLUtils } from 'src/app/urlUtils';
import { DocumentService } from '../document.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-createdocument',
  templateUrl: './createdocument.component.html',
  styleUrls: ['./createdocument.component.scss']
})

@Injectable()
export class CreateDocumentComponent {
  product = environment.product;
  myForm:any;

  overview:any;
  overviewTitle:any;
  isOverview: boolean = false;
  overviewDialog: boolean = true;

  section:any;
  sectionTitle:any;
  isSection:boolean = false;
  sectionDialog: boolean = true;

  subsection:any;
  subsectionTitle:any;
  issubSection:boolean = false;
  subsectionDialog: boolean = true;

  subsubsection:any;
  subsubsectionTitle:any;
  issubsubSection:boolean = false;
  subsubsectionDialog: boolean = true;

  paragraph:any;
  paragraphTitle:any;
  isParagraph:boolean = false;
  paragraphDialog: boolean = true;


  constructor(private router: Router,  private fb: FormBuilder, private httpservice: HttpService, private toast: ToastrService, private documentService: DocumentService,
    private modalService: ModalService, public sanitizer: DomSanitizer, public dialog: MatDialog) {

  }

  ngOnInit() {
   
  }

  overviewOn() {
    this.isOverview = true
  }

  sectionOn() {
    this.isSection = true
  }

  subsectionOn() {
    this.issubSection = true
  }

  subsubsectionOn() {
    this.issubsubSection = true
  }

  paragraphOn() {
    this.isParagraph = true
  }


  openOverviewDialog() {
    this.overviewDialog = true;
    const dialogRef = this.dialog.open(DialogBoxComponent, {
      width: '600px',
      height: '330px',
      data: {
        overview: this.overview,
        overviewTitle: this.overviewTitle
      }
    });

    dialogRef.afterClosed().subscribe((result: { overview: string, overviewTitle: string }) => {
      if (result) {
        this.overview = result.overview;
        this.overviewTitle = result.overviewTitle;
      }
    });
  }

  openSectionDialog() {
    this.sectionDialog = true;
    const dialogRef = this.dialog.open(SectionBoxComponent, {
      width: '600px',
      height: '330px',
      data: {
        section: this.section,
        sectionTitle: this.sectionTitle
      }
    });

    dialogRef.afterClosed().subscribe((result: { section: string, sectionTitle: string }) => {
      if (result) {
        this.section = result.section;
        this.sectionTitle = result.sectionTitle;
      }
    });
  }

  opensubSectionDialog() {
    this.subsectionDialog = true;
    const dialogRef = this.dialog.open(SubSection1BoxComponent, {
      width: '600px',
      height: '330px',
      data: {
        subsection: this.subsection,
        subsectionTitle: this.subsectionTitle
      }
    });

    dialogRef.afterClosed().subscribe((result: { subsection: string, subsectionTitle: string }) => {
      if (result) {
        this.subsection = result.subsection;
        this.subsectionTitle = result.subsectionTitle;
      }
    });
  }

  opensubsubSectionDialog() {
    this.subsubsectionDialog = true;
    const dialogRef = this.dialog.open(SubSection2BoxComponent, {
      width: '600px',
      height: '330px',
      data: {
        subsubsection: this.subsubsection,
        subsubsectionTitle: this.subsubsectionTitle
      }
    });

    dialogRef.afterClosed().subscribe((result: { subsubsection: string, subsubsectionTitle: string }) => {
      if (result) {
        this.subsubsection = result.subsubsection;
        this.subsubsectionTitle = result.subsubsectionTitle;
      }
    });
  }

  openParagraphDialog() {
    this.paragraphDialog = true;
    const dialogRef = this.dialog.open(ParagraphBoxComponent, {
      width: '600px',
      height: '330px',
      data: {
        paragraph: this.paragraph,
        paragraphTitle: this.paragraphTitle
      }
    });

    dialogRef.afterClosed().subscribe((result: { paragraph: string, paragraphTitle: string }) => {
      if (result) {
        this.paragraph = result.paragraph;
        this.paragraphTitle = result.paragraphTitle;
      }
    });
  }

  hypenUpdate(newTitle: string) {
    if (newTitle && !newTitle.startsWith(' ')) {
      this.overviewTitle = '' + newTitle; 
    } else {
      this.overviewTitle = newTitle;
    }
  }
  
}



@Component({
  selector: 'app-dialog-box',
  templateUrl: './dialog-box.component.html',
  styleUrls: ['./createdocument.component.scss'],
  //standalone: true,
})

@Injectable()
export class DialogBoxComponent {
  dialog: any;
  name: any;

  overview:any;
  overviewTitle:any;
  isOverview: boolean = false;
  overviewDialog: boolean = true;

  //@Output() oversubmitted = new EventEmitter();

  constructor(
    public dialogRef: MatDialogRef<DialogBoxComponent>, @Inject(MAT_DIALOG_DATA) public data: { overview: string, overviewTitle: string}
  ) {
    //this.overview = data[0];
    this.overview = data.overview;
    this.overviewTitle = data.overviewTitle
  }

  ngOnInit() {
    if (this.overviewTitle && this.overviewTitle.startsWith('-')) {
      this.overviewTitle = this.overviewTitle.substring(2); // Remove the hyphen & space
    }

  }

  save(){
    // this.data.push({ data: this.overview });
    // this.dialogRef.close({data:this.overview});
    // this.overview = this.overview
    // console.log('saveData',this.data)
    // console.log('saveData1',this.data[1])
    // console.log('overview',this.overview)
    //this.dialogRef.close(this.overview);

    //for Hypen
    if (this.overviewTitle && !this.overviewTitle.startsWith('-')) {
      this.overviewTitle = '- ' + this.overviewTitle;
    }
    const data = {
      overview: this.overview,
      overviewTitle: this.overviewTitle
    };
    this.dialogRef.close(data); 
  }

  closeDialog() {
    this.dialogRef.close()
  }

  onInputChange(event: Event) {
    const target = event.target as HTMLTextAreaElement;
    this.overview = target.value; // Overview to parent textarea
  }

  prependHyphen(newTitle: string) {
    if (newTitle && !newTitle.startsWith(' ')) {
      this.overviewTitle = '' + newTitle; 
    }
  }

}


@Component({
  selector: 'app-section-box',
  templateUrl: './section-box.component.html',
  styleUrls: ['./createdocument.component.scss'],
  //standalone: true,
})

@Injectable()
export class SectionBoxComponent {
  dialog: any;
  name: any;

  section:any;
  sectionTitle:any;
  isSection:boolean = false;
  sectionDialog: boolean = true;

  //@Output() oversubmitted = new EventEmitter();

  constructor(
    public dialogRef: MatDialogRef<SectionBoxComponent>, @Inject(MAT_DIALOG_DATA) public data: { section: string, sectionTitle: string }
  ) {
    //this.overview = data[0];
    this.section = data.section;
    this.sectionTitle = data.sectionTitle
  }

  ngOnInit() {
    if (this.sectionTitle && this.sectionTitle.startsWith('-')) {
      this.sectionTitle = this.sectionTitle.substring(2); // Remove the hyphen & space
    }

  }

  save(){
    //for Hypen
    if (this.sectionTitle && !this.sectionTitle.startsWith('-')) {
      this.sectionTitle = '- ' + this.sectionTitle;
    }
    const data = {
      section: this.section,
      sectionTitle: this.sectionTitle
    };
    this.dialogRef.close(data); 
  }

  closeDialog() {
    this.dialogRef.close()
  }

  onInputChange(event: Event) {
    const target = event.target as HTMLTextAreaElement;
    this.section = target.value; // Overview to parent textarea
  }

  prependHyphen(newTitle: string) {
    if (newTitle && !newTitle.startsWith(' ')) {
      this.sectionTitle = '' + newTitle; 
    }
  }

}

@Component({
  selector: 'app-subsection1-box',
  templateUrl: './subsection1-box.component.html',
  styleUrls: ['./createdocument.component.scss'],
  //standalone: true,
})

@Injectable()
export class SubSection1BoxComponent {
  dialog: any;
  name: any;

  subsection:any;
  subsectionTitle:any;
  issubSection:boolean = false;
  subsectionDialog: boolean = true;

  //@Output() oversubmitted = new EventEmitter();

  constructor(
    public dialogRef: MatDialogRef<SubSection1BoxComponent>, @Inject(MAT_DIALOG_DATA) public data: { subsection: string, subsectionTitle: string }
  ) {
    //this.overview = data[0];
    this.subsection = data.subsection;
    this.subsectionTitle = data.subsectionTitle
  }

  ngOnInit() {
    if (this.subsectionTitle && this.subsectionTitle.startsWith('-')) {
      this.subsectionTitle = this.subsectionTitle.substring(2); // Remove the hyphen & space
    }

  }

  save(){
    //for Hypen
    if (this.subsectionTitle && !this.subsectionTitle.startsWith('-')) {
      this.subsectionTitle = '- ' + this.subsectionTitle;
    }
    const data = {
      subsection: this.subsection,
      subsectionTitle: this.subsectionTitle
    };
    this.dialogRef.close(data); 
  }

  closeDialog() {
    this.dialogRef.close()
  }

  onInputChange(event: Event) {
    const target = event.target as HTMLTextAreaElement;
    this.subsection = target.value; // Overview to parent textarea
  }

  prependHyphen(newTitle: string) {
    if (newTitle && !newTitle.startsWith(' ')) {
      this.subsectionTitle = '' + newTitle; 
    }
  }

}

@Component({
  selector: 'app-subsection2-box',
  templateUrl: './subsection2-box.component.html',
  styleUrls: ['./createdocument.component.scss'],
  //standalone: true,
})

@Injectable()
export class SubSection2BoxComponent {
  dialog: any;
  name: any;

  subsubsection:any;
  subsubsectionTitle:any;
  issubsubSection:boolean = false;
  subsubsectionDialog: boolean = true;

  //@Output() oversubmitted = new EventEmitter();

  constructor(
    public dialogRef: MatDialogRef<SubSection2BoxComponent>, @Inject(MAT_DIALOG_DATA) public data: { subsubsection: string, subsubsectionTitle: string }
  ) {
    //this.overview = data[0];
    this.subsubsection = data.subsubsection;
    this.subsubsectionTitle = data.subsubsectionTitle
  }

  ngOnInit() {
    if (this.subsubsectionTitle && this.subsubsectionTitle.startsWith('-')) {
      this.subsubsectionTitle = this.subsubsectionTitle.substring(2); // Remove the hyphen & space
    }

  }

  save(){
    //for Hypen
    if (this.subsubsectionTitle && !this.subsubsectionTitle.startsWith('-')) {
      this.subsubsectionTitle = '- ' + this.subsubsectionTitle;
    }
    const data = {
      subsubsection: this.subsubsection,
      subsubsectionTitle: this.subsubsectionTitle
    };
    this.dialogRef.close(data); 
  }

  closeDialog() {
    this.dialogRef.close()
  }

  onInputChange(event: Event) {
    const target = event.target as HTMLTextAreaElement;
    this.subsubsection = target.value; // Overview to parent textarea
  }

  prependHyphen(newTitle: string) {
    if (newTitle && !newTitle.startsWith(' ')) {
      this.subsubsectionTitle = '' + newTitle; 
    }
  }

}


@Component({
  selector: 'app-paragraph-box',
  templateUrl: './paragraph-box.component.html',
  styleUrls: ['./createdocument.component.scss'],
  //standalone: true,
})

@Injectable()
export class ParagraphBoxComponent {
  dialog: any;
  name: any;

  paragraph:any;
  paragraphTitle:any;
  isParagraph:boolean = false;
  paragraphDialog: boolean = true;

  //@Output() oversubmitted = new EventEmitter();

  constructor(
    public dialogRef: MatDialogRef<ParagraphBoxComponent>, @Inject(MAT_DIALOG_DATA) public data: { paragraph: string, paragraphTitle: string }
  ) {
    //this.overview = data[0];
    this.paragraph = data.paragraph;
    this.paragraphTitle = data.paragraphTitle
  }

  ngOnInit() {
    if (this.paragraphTitle && this.paragraphTitle.startsWith('-')) {
      this.paragraphTitle = this.paragraphTitle.substring(2); // Remove the hyphen & space
    }

  }

  save(){
    //for Hypen
    if (this.paragraphTitle && !this.paragraphTitle.startsWith('-')) {
      this.paragraphTitle = '- ' + this.paragraphTitle;
    }
    const data = {
      paragraph: this.paragraph,
      paragraphTitle: this.paragraphTitle
    };
    this.dialogRef.close(data); 
  }

  closeDialog() {
    this.dialogRef.close()
  }

  onInputChange(event: Event) {
    const target = event.target as HTMLTextAreaElement;
    this.paragraph = target.value; // Overview to parent textarea
  }

  prependHyphen(newTitle: string) {
    if (newTitle && !newTitle.startsWith(' ')) {
      this.paragraphTitle = '' + newTitle; 
    }
  }

}
