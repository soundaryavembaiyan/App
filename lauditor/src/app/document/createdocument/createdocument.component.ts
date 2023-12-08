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
  isDisabled: boolean = true;

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

  orderlist:any;
  orderlistTitle:any;
  isOrderlist:boolean = false;
  orderlistDialog: boolean = true;

  unorderlist:any;
  unorderlistTitle:any;
  isunOrderlist:boolean = false;
  unorderlistDialog: boolean = true;

  //orderListItems: string[] = [''];
  orderListItems: any;
  unorderListItems: any;

  constructor(private router: Router,  private fb: FormBuilder, private httpservice: HttpService, private toast: ToastrService, private documentService: DocumentService,
    private modalService: ModalService, public sanitizer: DomSanitizer, public dialog: MatDialog) {

  }

  ngOnInit() {
    this.myForm = this.fb.group({
      overview: ['', Validators.required],
      overviewTitle: ['', Validators.required],
      section: ['', Validators.required],
      sectionTitle: ['', Validators.required],
      subsection: ['', Validators.required],
      subsectionTitle: ['', Validators.required],
      subsubsection: ['', Validators.required],
      subsubsectionTitle: ['', Validators.required],
      paragraph: ['', Validators.required],
      paragraphTitle: ['', Validators.required],

      orderlist: ['', Validators.required],
      orderlistTitle: ['', Validators.required],
      orderListItems: this.fb.array([this.createorderItem()]),

      unorderlist: ['', Validators.required],
      unorderlistTitle: ['', Validators.required],
      unorderListItems: this.fb.array([this.createunorderItem()]),

  });


  this.orderListItems = this.myForm.get('orderListItems') as FormArray;
  this.unorderListItems = this.myForm.get('unorderListItems') as FormArray;
  
  }


  //UNORDERED LIST ACTIONS
  addorderList(): void {
    this.orderListItems = this.myForm.get('orderListItems') as FormArray;
    this.orderListItems.push(this.createorderItem());
  }

  createorderItem(): FormGroup {
    return this.fb.group({
      orderlist: [''] 
    });
  }

  removeorderList(i: number) {
    const orderListItemsArray = this.orderListItems as FormArray;
    orderListItemsArray.removeAt(i);
  }

//UNORDERED LIST ACTIONS
  addunorderList(): void {
    this.unorderListItems = this.myForm.get('unorderListItems') as FormArray;
    this.unorderListItems.push(this.createunorderItem());
  }

  createunorderItem(): FormGroup {
    return this.fb.group({
      unorderlist: [''] 
    });
  }

  removeunorderList(i: number) {
    const unorderListItemsArray = this.unorderListItems as FormArray;
    unorderListItemsArray.removeAt(i);
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

  orderlistOn(){
    this.isOrderlist = true
  }

  unorderlistOn(){
    this.isunOrderlist = true
  }

  //Dialog boxes!!!
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

  openOrderlistDialog() {
    this.orderlistDialog = true;
    const dialogRef = this.dialog.open(OrderedlistBoxComponent, {
      width: '700px',
      height: '500px',
      data: {
        orderlist: this.orderlist,
        orderlistTitle: this.orderlistTitle,
        orderListItems:this.orderListItems
      }
    });
    //console.log('orderListItems',this.orderListItems)

    // dialogRef.afterClosed().subscribe((result: { orderlist: string, orderlistTitle: string, orderListItems: any }) => {
    //   if (result) {
    //     this.orderlist = result.orderlist;
    //     this.orderlistTitle = result.orderlistTitle;
    //     //this.orderListItems = result.orderListItems;
    //     this.orderListItems = this.fb.array(result.orderListItems);
    //   }
    // });

    dialogRef.afterClosed().subscribe((result: { orderlist: string, orderlistTitle: string, orderListItems: any }) => {
      if (result) {
        this.orderlist = result.orderlist;
        this.orderlistTitle = result.orderlistTitle;
    
        const formArrayControls = result.orderListItems.map((item: any) => this.fb.group({ orderlist: item.orderlist }));
        
        if (this.orderListItems) {
          this.orderListItems.clear(); // Clear existing items before pushing new ones
          formArrayControls.forEach((control: any) => {
            this.orderListItems.push(control); // Push each control to the FormArray
          });
        } else {
          this.orderListItems = this.fb.array(formArrayControls); // Initialize FormArray 
        }
      }
    });
  }

  openunOrderlistDialog() {
    this.unorderlistDialog = true;
    const dialogRef = this.dialog.open(UnorderedlistBoxComponent, {
      width: '700px',
      height: '500px',
      data: {
        unorderlist: this.unorderlist,
        unorderlistTitle: this.unorderlistTitle,
        unorderListItems:this.unorderListItems
      }
    });

    dialogRef.afterClosed().subscribe((result: { unorderlist: string, unorderlistTitle: string, unorderListItems: any }) => {
      if (result) {
        this.unorderlist = result.unorderlist;
        this.unorderlistTitle = result.unorderlistTitle;
    
        const formArrayControls = result.unorderListItems.map((item: any) => this.fb.group({ unorderlist: item.unorderlist }));
        
        if (this.unorderListItems) {
          this.unorderListItems.clear(); // Clear existing items before pushing new ones
          formArrayControls.forEach((control: any) => {
            this.unorderListItems.push(control); // Push each control to the FormArray
          });
        } else {
          this.unorderListItems = this.fb.array(formArrayControls); // Initialize FormArray 
        }
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
  overviewForm:any;

  overview:any;
  overviewTitle:any;
  isOverview: boolean = false;
  overviewDialog: boolean = true;

  //@Output() oversubmitted = new EventEmitter();

  constructor(
    public dialogRef: MatDialogRef<DialogBoxComponent>, @Inject(MAT_DIALOG_DATA) public data: { overview: string, overviewTitle: string},
    private fb: FormBuilder ) {
    //this.overview = data[0];
    this.overview = data.overview;
    this.overviewTitle = data.overviewTitle
  }

  ngOnInit() {

    this.overviewForm = this.fb.group({
      overviewTitle: ['', Validators.required],
      overview: ['', Validators.required],
    });
  
    //console.log('this.overview',this.overviewForm)

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
    console.log('overview',this.overview)
    console.log('overviewTitle',this.overviewTitle)
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
  sectionForm:any

  section:any;
  sectionTitle:any;
  isSection:boolean = false;
  sectionDialog: boolean = true;

  //@Output() oversubmitted = new EventEmitter();

  constructor(
    public dialogRef: MatDialogRef<SectionBoxComponent>, @Inject(MAT_DIALOG_DATA) public data: { section: string, sectionTitle: string },
    private fb: FormBuilder 
  ) {
    //this.overview = data[0];
    this.section = data.section;
    this.sectionTitle = data.sectionTitle
  }

  ngOnInit() {

    this.sectionForm = this.fb.group({
      sectionTitle: ['', Validators.required],
      section: ['', Validators.required],
    });

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
  subsectionForm:any;

  subsection:any;
  subsectionTitle:any;
  issubSection:boolean = false;
  subsectionDialog: boolean = true;

  //@Output() oversubmitted = new EventEmitter();

  constructor(
    public dialogRef: MatDialogRef<SubSection1BoxComponent>, @Inject(MAT_DIALOG_DATA) public data: { subsection: string, subsectionTitle: string },
    private fb: FormBuilder 
  ) {
    //this.overview = data[0];
    this.subsection = data.subsection;
    this.subsectionTitle = data.subsectionTitle
  }

  ngOnInit() {
    this.subsectionForm = this.fb.group({
      subsectionTitle: ['', Validators.required],
      subsection: ['', Validators.required],
    });

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
  subsubsectionForm:any;

  subsubsection:any;
  subsubsectionTitle:any;
  issubsubSection:boolean = false;
  subsubsectionDialog: boolean = true;

  //@Output() oversubmitted = new EventEmitter();

  constructor(
    public dialogRef: MatDialogRef<SubSection2BoxComponent>, @Inject(MAT_DIALOG_DATA) public data: { subsubsection: string, subsubsectionTitle: string },
    private fb: FormBuilder 
  ) {
    //this.overview = data[0];
    this.subsubsection = data.subsubsection;
    this.subsubsectionTitle = data.subsubsectionTitle
  }

  ngOnInit() {
    this.subsubsectionForm = this.fb.group({
      subsubsectionTitle: ['', Validators.required],
      subsubsection: ['', Validators.required],
    });

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
  paragraphForm:any;

  paragraph:any;
  paragraphTitle:any;
  isParagraph:boolean = false;
  paragraphDialog: boolean = true;

  //@Output() oversubmitted = new EventEmitter();

  constructor(
    public dialogRef: MatDialogRef<ParagraphBoxComponent>, @Inject(MAT_DIALOG_DATA) public data: { paragraph: string, paragraphTitle: string },
    private fb: FormBuilder 
  ) {
    //this.overview = data[0];
    this.paragraph = data.paragraph;
    this.paragraphTitle = data.paragraphTitle
  }

  ngOnInit() {
    this.paragraphForm = this.fb.group({
      paragraphTitle: ['', Validators.required],
      paragraph: ['', Validators.required],
    });

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

@Component({
  selector: 'app-orderedlist-box',
  templateUrl: './orderedlist-box.component.html',
  styleUrls: ['./createdocument.component.scss'],
  //standalone: true,
})

@Injectable()
export class OrderedlistBoxComponent {
  dialog: any;
  name: any;
  orderlistForm:any;

  orderlist:any;
  orderlistTitle:any;
  isOrderlist:boolean = false;
  orderlistDialog: boolean = true;

  @Input() orderListItems: FormArray;
  //orderListItems: string[] = [];
  childOrderListItems: any;

  constructor(
    public dialogRef: MatDialogRef<OrderedlistBoxComponent>, @Inject(MAT_DIALOG_DATA) public data: { orderlist: string, orderlistTitle: string, orderListItems: FormArray },
    private fb: FormBuilder 
  ) {
    //this.overview = data[0];
    this.orderlist = data.orderlist;
    this.orderlistTitle = data.orderlistTitle;
   this.orderListItems = data.orderListItems;
  }


  ngOnInit() {
    this.orderlistForm = this.fb.group({
      orderlistTitle: ['', Validators.required],
      orderlist: ['', Validators.required],

      //orderListItems: this.fb.array([this.createItem()]),
      orderListItems: this.orderListItems

    });
  
    //this.orderListItems = this.orderlistForm.get('orderListItems') as FormArray;

    if (this.orderListItems) {
      this.orderListItems = this.fb.array([...this.orderListItems.controls]); // Make a copy of orderListItems
    } else {
      this.orderListItems = this.fb.array([]);
    }
    
    if (Array.isArray(this.data.orderListItems.controls)) {
      this.orderListItems = this.data.orderListItems as FormArray;
    } else {
      // If the data doesn't match the expected structure, create a new FormArray
      this.orderListItems = this.fb.array([]);
    }
    //console.log('OOOorderListItems',this.orderListItems)

    if (this.orderlistTitle && this.orderlistTitle.startsWith('-')) {
      this.orderlistTitle = this.orderlistTitle.substring(2); // Remove the hyphen & space
    }

  }


  addorderList(): void {
    this.orderListItems = this.orderlistForm.get('orderListItems') as FormArray;
    this.orderListItems.push(this.createunorderItem());
  }
  createunorderItem(): FormGroup {
    return this.fb.group({
      orderlist: [''] // Initialize with an empty value
    });
  }


  save(){
    //for Hypen
    if (this.orderlistTitle && !this.orderlistTitle.startsWith('-')) {
      this.orderlistTitle = '- ' + this.orderlistTitle;
    }
    
    const orderListItemsData = this.orderListItems.value;
    const data = {
      orderlist: this.orderlist,
      orderlistTitle: this.orderlistTitle,
      orderListItems: orderListItemsData
    };
    this.dialogRef.close(data); 
  }

  closeDialog() {
    this.dialogRef.close()
  }

  onInputChange(event: Event) {
    const target = event.target as HTMLTextAreaElement;
    this.orderlist = target.value; // Overview to parent textarea
  }

  prependHyphen(newTitle: string) {
    if (newTitle && !newTitle.startsWith(' ')) {
      this.orderlistTitle = '' + newTitle; 
    }
  }

}

@Component({
  selector: 'app-unorderedlist-box',
  templateUrl: './unorderedlist-box.component.html',
  styleUrls: ['./createdocument.component.scss'],
  //standalone: true,
})

@Injectable()
export class UnorderedlistBoxComponent {
  dialog: any;
  name: any;
  unorderlistForm:any;

  unorderlist:any;
  unorderlistTitle:any;
  isunOrderlist:boolean = false;
  unorderlistDialog: boolean = true;

  @Input() unorderListItems: FormArray;

  constructor(
    public dialogRef: MatDialogRef<UnorderedlistBoxComponent>, @Inject(MAT_DIALOG_DATA) public data: { unorderlist: string, unorderlistTitle: string, unorderListItems: FormArray },
    private fb: FormBuilder 
  ) {
    this.unorderlist = data.unorderlist;
    this.unorderlistTitle = data.unorderlistTitle;
   this.unorderListItems = data.unorderListItems;
  }


  ngOnInit() {
    this.unorderlistForm = this.fb.group({
      orderlistTitle: ['', Validators.required],
      orderlist: ['', Validators.required],

      //orderListItems: this.fb.array([this.createItem()]),
      unorderListItems: this.unorderListItems

    });
  
    //this.orderListItems = this.orderlistForm.get('orderListItems') as FormArray;

    if (this.unorderListItems) {
      this.unorderListItems = this.fb.array([...this.unorderListItems.controls]); // Make a copy of orderListItems
    } else {
      this.unorderListItems = this.fb.array([]);
    }
    
    if (Array.isArray(this.data.unorderListItems.controls)) {
      this.unorderListItems = this.data.unorderListItems as FormArray;
    } else {
      // If the data doesn't match the expected structure, create a new FormArray
      this.unorderListItems = this.fb.array([]);
    }
    //console.log('OOOorderListItems',this.orderListItems)

    if (this.unorderlistTitle && this.unorderlistTitle.startsWith('-')) {
      this.unorderlistTitle = this.unorderlistTitle.substring(2); // Remove the hyphen & space
    }

  }


  addunorderList(): void {
    this.unorderListItems = this.unorderlistForm.get('unorderListItems') as FormArray;
    this.unorderListItems.push(this.createunorderItem());
  }
  createunorderItem(): FormGroup {
    return this.fb.group({
      unorderlist: [''] // Initialize with an empty value
    });
  }


  save(){
    //for Hypen
    if (this.unorderlistTitle && !this.unorderlistTitle.startsWith('-')) {
      this.unorderlistTitle = '- ' + this.unorderlistTitle;
    }
    
    const unorderListItemsData = this.unorderListItems.value;
    const data = {
      unorderlist: this.unorderlist,
      unorderlistTitle: this.unorderlistTitle,
      unorderListItems: unorderListItemsData
    };
    this.dialogRef.close(data); 
  }

  closeDialog() {
    this.dialogRef.close()
  }

  onInputChange(event: Event) {
    const target = event.target as HTMLTextAreaElement;
    this.unorderlist = target.value; // Overview to parent textarea
  }

  prependHyphen(newTitle: string) {
    if (newTitle && !newTitle.startsWith(' ')) {
      this.unorderlistTitle = '' + newTitle; 
    }
  }

}
