
import { Component, Inject, Injectable, ApplicationRef, Input, Output, OnInit, EventEmitter, ViewChild, ElementRef, Renderer2, AfterViewInit, Optional, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ModalService } from 'src/app/model/model.service';
import { HttpService } from 'src/app/services/http.service';
import { URLUtils } from 'src/app/urlUtils';
import { Pipe, PipeTransform } from '@angular/core';
import { DocumentService } from '../document/document.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { ChangeDetectorRef } from '@angular/core';
import { ConfirmationDialogService } from 'src/app/confirmation-dialog/confirmation-dialog.service';
import { LatexblockComponent } from './latexblock/latexblock.component';
import { RandomService } from '../services/random.service';

@Component({
  selector: 'app-doceditor',
  templateUrl: './doceditor.component.html',
  styleUrls: ['./doceditor.component.scss']
})

export class DoceditorComponent {

  @ViewChild('pdfContent') pdfContent!: ElementRef;
  @ViewChild(LatexblockComponent) childComp!: LatexblockComponent;

  product = environment.product;
  myForm: any;
  isDisabled: boolean = true;
  documents: any[] = [];

  documentname: any;
  title: string = 'New Document';
  author: string = 'Author';

  disabled = false;
  isPageBreak: boolean = false;
  pdfSrc: any;

  documentId: any;
  pageId: any;

  latexcode: any;
  docid: any;
  currentDocId: any;
  latexdoc = environment.lateXAPI;
  submitted = false;

  selectedValue: string = "create";
  isDisplay: boolean = true;
  successModel: boolean = false;
  selectedOption: any;

  currentDate = new Date();
  date = this.currentDate;

  isOpen: boolean = false;
  blocks: any[] = [];
  allLatex:any[] =[];

  childFormData: any[] = [];

  overviewToastShown = false;
  onSave = false;
  randomId: any;
  showPreviewDoc = false
  url:any;

  content:any;
  contentTitle:any;
  contentData:any;
  contentListItems:any;
  orderListItems:any;
  latexDialog: boolean = true;

  contentForm:any;
  contentDataControl:any
  contentTitleControl:any

  listData:any;
  getContent:any;

  selectedSection:boolean = false;
  selectedSectionIndex: number | null = null;

  constructor(private router: Router, private idGenerator: RandomService, private appRef: ApplicationRef, private fb: FormBuilder, private httpservice: HttpService,
    private toast: ToastrService, private documentService: DocumentService, private cdr: ChangeDetectorRef,
    private renderer: Renderer2, private modalService: ModalService, private confirmationDialogService: ConfirmationDialogService,
    public sanitizer: DomSanitizer, public dialog: MatDialog) {
      this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
  }

  ngOnInit() {
    this.myForm = this.fb.group({
      title: [this.title],
      author: [this.author],
      date: [this.date],
      contentListItems: this.fb.array([]),
    });
    this.getDocumentCall();
  }
  
  // handleFormData(data: any) {
  //   this.childFormData.push(data)
  //   console.log('Received childformData:', this.childFormData);
  // }

  addContent(type:any) {
    const randomId = this.idGenerator.generateId(10);
    return this.fb.group({
      randomId: [randomId],
      content: [type], // Assigning the 'type' parameter to 'content'
      contentData: ['', Validators.required],
      contentTitle: ['', Validators.required],
      orderListItems: this.fb.array([
         this.createNestedContentItem()
     ])});
  }

  // addBlock(type: any) {
  //   this.isOpen = true;
  //   const randomId = this.idGenerator.generateId(10);

  //   const overviewExists = this.blocks.some(block => block.content === 'OVERVIEW');
  //   // If 'OVERVIEW' exists, show an error message and return
  //   if (type === 'OVERVIEW' && overviewExists) {
  //     this.toast.error('Only one overview is allowed!');
  //     return;
  //   }
  //   // For 'SUB SECTION', check if 'SECTION' is selected
  //   if (type === 'SUB SECTION' && this.selectedSection === null) {
  //     this.toast.error('Please select a Section before adding a Sub Section.');
  //     return;
  //   }
  //   // For 'SUB SUB SECTION', check if 'SUB SECTION' is selected
  //   if (type === 'SUB SUB SECTION' && this.selectedSubSection === null) {
  //     this.toast.error('Please select a Sub Section before adding a Sub Sub Section.');
  //     return;
  //   }
  //   // For 'SECTION', update the selected section and add the new block
  //   if (type === 'SECTION') {
  //     this.selectedSection = type;
  //     this.selectedSubSection = null;
  //     this.blocks.push({ content: type, id: randomId });
  //   } else if (type === 'SUB SECTION') {
  //     this.selectedSubSection = type;
  //     this.blocks.push({ content: type, id: randomId });
  //   } else if (type === 'SUB SUB SECTION') {
  //     this.blocks.push({ content: type, id: randomId });
  //   } else {
  //     // For all content types!!
  //     //this.blocks.push({ content: type });
  //     this.blocks.push({ content: type, id: randomId});
  //   }
  //   console.log('..Blocks:', this.blocks);

  // }

    // addBlock(type: any) {
  //   this.isOpen = true;
  //   this.content = type
  //   console.log('Content', this.content);

  //   const contentListItems = this.myForm.get('contentListItems') as FormArray;
  //   contentListItems.push(this.addContent(type)); 
  //   //console.log('contentListItems', contentListItems.value);
  // }

  addBlock(type: string) {
    this.isOpen = true;
    this.content = type;
    console.log('Content', this.content);
    //console.log('selectedSection', this.selectedSection);

    const contentListItems = this.myForm.get('contentListItems') as FormArray;
    // Check if adding an overview when one already exists
    if (type === 'Overview' && contentListItems.controls.some(item => item.value.content === 'Overview')) {
        this.toast.error('Only one overview is allowed!');
        return;
    }

    // Check if adding a sub section or sub sub section without a section
    if ((type === 'Sub Section' || type === 'Sub Sub Section') &&
        !contentListItems.controls.some(item => item.value.content === 'Section')) {
        if (type === 'Sub Sub Section') {
            this.toast.error('Please select a Section before adding a Sub Sub Section.');
        } else if (type === 'Sub Section') {
            this.toast.error('Please select a Section before adding a Sub Section.');
        }
        return;
    }

    // Check if adding a sub sub section without a sub section
    if (type === 'Sub Sub Section' && 
        !contentListItems.controls.some(item => item.value.content === 'Sub Section')) {
        this.toast.error('Please select a Sub Section before adding a Sub Sub Section.');
        return;
    }

    contentListItems.push(this.addContent(type)); 
}
  
   createNestedContentItem(): FormGroup {
    return this.fb.group({
     contentData: ['', Validators.required]
     });
   }

  //  addContentItem() {
  //    const contentArray = this.myForm.get('contentListItems') as FormArray;
  //     contentArray.push(this.createContentItem());
  //   }

  //  createContentItem(): FormGroup {    
  //   return this.fb.group({      
  //     content: ['', Validators.required],      
  //     //contentTitle: ['', Validators.required],      
  //     orderListItems: this.fb.array([ this.createNestedContentItem() ])
  //   }); 
  //  }

  addNestedContentItem(contentIndex: number) {
    const contentArray = this.myForm.get('contentListItems') as FormArray;
    const nestedArray = contentArray.at(contentIndex).get('orderListItems') as FormArray;
    nestedArray.push(this.createNestedContentItem());
  }

  removeList(contentIndex: number, orderIndex: number) {
    const contentListItemsArray = this.myForm.get('contentListItems') as FormArray;
    const contentItem = contentListItemsArray.at(contentIndex);
    const orderListItemsArray = contentItem.get('orderListItems') as FormArray;
    orderListItemsArray.removeAt(orderIndex);
  }

  removeItem(i: number) {
    const contentListItems = this.myForm.get('contentListItems') as FormArray;
    contentListItems.removeAt(i);
    //console.log('contentRem', contentListItems);
  }

  //OpenDialog boxes for sections!!!
  opencontentDialog(item:any,itemIndex:any) {
    //console.log('i', item)
    this.latexDialog = true;
    const dialogRef = this.dialog.open(ContentDialogComponent, {
      width: '600px',
      height: '330px',
      data: {
        contentData: item.value.contentData,
        contentTitle: item.value.contentTitle,
      },
      hasBackdrop: true,
      panelClass: 'hello',
      autoFocus: true
    });
    //console.log('pass data to dialog', dialogRef)

    dialogRef.afterClosed().subscribe((result: { contentData: string, contentTitle: string }) => {
      if (result) {
        // this.contentData = result.contentData;
        // this.contentTitle = result.contentTitle;
        const contentTitleCont = (this.myForm.get('contentListItems') as FormArray).at(itemIndex).get('contentTitle');
        contentTitleCont?.setValue(result.contentTitle);

        const contentTitleDat = (this.myForm.get('contentListItems') as FormArray).at(itemIndex).get('contentData');
        contentTitleDat?.setValue(result.contentData);
      }
    });
  }

  //ORDERLSITS
  // addorderList(): void {
  //   const contentListItems = this.myForm.get('contentListItems') as FormArray;
  //   contentListItems.push(this.createorderItem()); 
  // }

  // createorderItem(): FormGroup {
  //   return this.fb.group({
  //     content: [this.content], 
  //     contentData: [''] // Initialize with an empty value
  //   });
  // }

  // removeList(i: number) {
  //   const orderListItemsArray = this.orderListItems as FormArray;
  //   orderListItemsArray.removeAt(i);
  // }

  // removeorderList(i: number) {
  //   const orderListItems = this.myForm.get('orderListItems') as FormArray;
  //   orderListItems.removeAt(i);
  //   this.blocks.splice(i, 1); // Remove the block from the blocks array
  // }

  getDocumentCall() {
    //Get all Document
    this.httpservice.sendGetLatexDoc(URLUtils.getDocument).subscribe(
      (res: any) => {
        //this.documents = res;
        this.documents = res[0].documentname;
        //console.log('this.documents', this.documents)
      }
    );
  }

  isActive(value: string) {
    this.selectedValue = value;
    this.selectedValue == 'create' ? this.router.navigate(['/doceditor']) : this.router.navigate(['/viewdoc']);
  }

  hideAndShow() {
    this.isDisplay = !this.isDisplay;
  }

  //Save As dialog box!!
  downloadDialog() {
    const dialogRef = this.dialog.open(DownloadBoxComponent, {
      width: '500px',
      height: '200px',
      data: {
        //documentname: this.documentname,
        documentId: this.documentId
      },
      hasBackdrop: true,
      panelClass: 'hello',
      autoFocus: true
    });

    dialogRef.afterClosed().subscribe((result: { docid: any, documentname: any }) => {
      if (result) {
        this.documentname = result.documentname;
        this.documentId = result.docid;
        //console.log('docname',this.documentname)
        this.httpservice.sendGetLatexDoc(URLUtils.savedDocid(this.documentId)).subscribe(
          (res: any) => {

          });
      }
    });
  }

  newDoc() {
    const preservedValues = {
      title: this.myForm.get('title').value,
      author: this.myForm.get('author').value,
      date: this.myForm.get('date').value,
    };
    //this.isOpen = false;
    this.myForm.reset(); //parent comp.
    this.myForm.patchValue(preservedValues); //values back into the form
    //window.location.reload();
    //this.router.navigate(['/doceditor']);
  }

  getDocument() {
    let req = { "documentname": this.myForm.value.title };
    //FIRST API
    this.httpservice.sendPostLatexRequest(URLUtils.savedoc, req).subscribe(
      (res: any) => {
        const documentId = res.id;
        this.documentId = documentId;
        //this.docidSave(documentId); //secondAPI methodcall
      });
  }

  saveDoc() {
    //this.onSave = true;
    console.log('saveForm:', this.myForm.value);
    // const result: { [key: string]: string } = {};
    // this.childFormData.forEach((item: any) => {
    //   const key = Object.keys(item)[0];
    //   if (key && item[key]) {
    //     result[key] = item[key];
    //     //console.log('reskey',result[key])
    //   }
    // });
    // console.log('res',result)
    // let combinedObject2 = { ...result, ...this.myForm.value };
    // console.log('combinedObject2:', combinedObject2);
   
    let latexDocument = `\\documentclass{article}\\usepackage{geometry}\\geometry{a4paper,total={170mm,257mm},left=20mm,top=20mm,}<ltk>\\title
    {${this.title}}<ltk>\\author{${this.author}}<ltk>\\date{${this.date}}<ltk>\\begin{document}<ltk>\\maketitle`;

    const contentListItems = this.myForm.get('contentListItems') as FormArray;
    for (let i = 0; i < contentListItems.length; i++) {
      const item = contentListItems.at(i);
      if (item) {
        const getContent = item.get('content')?.value;
        this.contentDataControl = item.get('contentData');
        this.contentTitleControl = item.get('contentTitle');

        const orderListItems = item.get('orderListItems') as FormArray; // orderListItems within each item

        this.listData = '';//prevent undefined!!!
        for (let j = 0; j < orderListItems.length; j++) {
          const itemo = orderListItems.at(j);
          if (itemo) {
            this.listData += `\\item ${itemo.get('contentData')?.value}`; //get all ordered & unordered lists
            //console.log('Order List Item:', this.listData);
          }
        }

        if (getContent === 'Overview') {
          latexDocument += `<ltk>\\abstract ${this.contentDataControl.value}`;
        }
        if (getContent === 'Section') {
          latexDocument += `<ltk>\\section{${this.contentTitleControl.value || ''}}${this.contentDataControl.value || ''}`;
        }
        if (getContent === 'Sub Section') {
          latexDocument += `<ltk>\\subsection{${this.contentTitleControl.value || ''}}${this.contentDataControl.value || ''}`;
        }
        if (getContent === 'Sub Sub Section') {
          latexDocument += `<ltk>\\subsubsection{${this.contentTitleControl.value || ''}}${this.contentDataControl.value || ''}`;
        }
        if (getContent === 'Paragraph') {
          latexDocument += `<ltk>\\paragraph{${this.contentTitleControl.value || ''}}${this.contentDataControl.value || ''}`;
        }
        if (getContent === 'Ordered List') {
          latexDocument += `<ltk>\\begin{itemize}${this.listData}\\end{itemize}`;
        }
        if (getContent === 'Unordered List') {
          latexDocument += `<ltk>\\begin{enumerate}${this.listData}\\end{enumerate}`;
        }
      }
    }

    console.log('lateX', latexDocument);

    let reqq = {
      "document": latexDocument,
      "page": 1
    };

    if (this.documentId == null) {
      //this.submitted = true;
      let req = { "documentname": this.title };
      //FIRST API
      this.httpservice.sendPostLatexRequest(URLUtils.savedoc, req).subscribe(
        (res: any) => {
          const documentId = res.id;
          this.documentId = documentId;
          //console.log('DocID to saveas:', this.documentId);
          //SECONDAPI 
          this.httpservice.sendPostLatexRequest(URLUtils.savedocID(this.documentId), reqq).subscribe(
            (ress: any) => {
              this.pageId = ress.id;
              this.toast.success(ress.message);
              //console.log('checkid1', this.documentId);
            }
          );
        });
    }
    else {
      //THIRDAPI - for update 
      //console.log('checkid2', this.documentId)
      this.httpservice.sendPatchLatexRequest(URLUtils.updateDoc(this.pageId), reqq).subscribe(
        (resp: any) => {
          this.toast.success(resp.message);
        });
    }
  }

  getPreview() {
    //PREVIEW API
    if (this.documentId == '' || this.documentId == null) {
      // this.submitted = true;
      this.toast.error("Please save the document") //If user clicks the previewIcon directly.
    }
    else {
      this.showPreviewDoc = true;
      let url = this.latexdoc + URLUtils.getPreview(this.documentId)
      this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
  }

  //PAGE BREAK FUNCTION
  insertPageBreak() {
    // if (this.content && this.content.nativeElement) {
    //   const pageBreak = this.renderer.createElement('div');
    //   this.renderer.addClass(pageBreak, 'page-break');
    //   // visual representation of the page break
    //   this.renderer.setStyle(pageBreak, 'page-break-before', 'always');
    //   this.renderer.setStyle(pageBreak, 'border-top', '1px dashed #000');
    //   this.renderer.setStyle(pageBreak, 'margin-top', '20px'); // Adjust as needed
    //   this.renderer.appendChild(this.content.nativeElement, pageBreak);
    // }
  }

  //Open document Dialog box!
  openDocumentDialog() {
    const dialogRef = this.dialog.open(OpendialogBoxComponent, {
      width: '500px',
      height: '500px',
      data: {
        title: this.title
      },
      //backdropClass: 'backdropBackground'
      hasBackdrop: true,
      panelClass: 'hello',
      autoFocus: true
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      //console.log("result after docClose:", result)
      if (result.docid) {
        this.openFile(result.docid)
      }
      this.documentname = result.docname //Get docname on Layout
    });
  }

  openFile(docid: any) {
    //this.isOpen = true;

    //Doc id
    this.documentId = docid;
    // console.log("this.documentId:", this.documentId);
    // console.log("docidBefr:", docid);

    //OpenAPI 
    this.httpservice.sendGetLatexRequest(URLUtils.opendocID(docid)).subscribe(
      (req: any) => {
        if (req) {
          //console.log("apiDocid:", docid);
          this.latexcode = req[0];
          this.documentId = docid;
          this.pageId = req[0]?.pageid
          // console.log('pageId:', this.pageId)
          //console.log("req:", req);

          console.log("openLatexcode:", this.latexcode);
          this.extractionData();
          this.cdr.detectChanges(); 
        }
        
      },
      (error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403 || error.status === 500) {
          const errorMessage = error.error.msg || 'Unauthorized';
          this.toast.error(errorMessage);
        }
      }
    );
  }

  extractionData() {
    this.isOpen = true;

    // const formValues = this.childFormData;
    // let combinedObject2 = { ...formValues, ...this.myForm.value };
    // console.log('combinedObject2:', combinedObject2);
    // console.log('formValues:', formValues);

    // Extract Title
    const titleMatch = this.latexcode?.document.match(/\\title{([^}]*)}/);
    this.title = titleMatch && titleMatch.length > 1 ? titleMatch[1] : '';
    console.log('Extracted title:', this.title);

    // Extract Author
    const authorMatch = this.latexcode?.document.match(/\\author{([^}]*)}/);
    this.author = authorMatch && authorMatch.length > 1 ? authorMatch[1] : '';
    console.log('Extracted author:', this.author);

    //Extract Date
    const dateMatch = this.latexcode?.document.match(/\\date{([^}]*)}/);
    this.date = dateMatch && dateMatch.length > 1 ? dateMatch[1] : '';
    console.log('Extracted date:', this.date);

    // Extract Abstract Title and Content
    const abstractMatch = this.latexcode?.document.match(/\\abstract([^<]*)<ltk>/);
    abstractMatch.abstract = abstractMatch && abstractMatch.length > 1 ? abstractMatch[1] : '';
    abstractMatch.abstract = abstractMatch.abstract.trim();  // Trim any leading/trailing spaces
    console.log('Extracted Overview:', abstractMatch.abstract);

    // this.overview = this.latexcode?.document.match(/\\abstract\{([^}]*)\}/);
    // this.overview = this.overview && this.overview.length > 2 ? this.overview[1] : '';
    // this.overview = this.overview.replace(/<ltk>/g, '');
    // console.log('Extracted Overview:', this.overview);

    // Extract Section Title and Content
    // this.section = this.latexcode?.document.match(/\\section{([^}]*)}([^]*)\\subsection{/);
    // this.sectionTitle = this.section && this.section.length > 1 ? this.section[1] : '';
    // this.section = this.section && this.section.length > 2 ? this.section[2] : '';
    // this.section = this.section.replace(/<ltk>/g, '');
    // console.log("Extracted sectionTitle:", this.sectionTitle);
    // console.log("Extracted sectionContent:", this.section);

    // Extract subSection Title and Content
    // this.subsection = this.latexcode?.document.match(/\\subsection{([^}]*)}([^]*)\\subsubsection{/);
    // this.subsectionTitle = this.subsection && this.subsection.length > 1 ? this.subsection[1] : '';
    // this.subsection = this.subsection && this.subsection.length > 2 ? this.subsection[2] : '';
    // this.subsection = this.subsection.replace(/<ltk>/g, '');
    // console.log("Extracted subsectionTitle:", this.subsectionTitle);
    // console.log("Extracted subsectionContent:", this.subsection);

    // Extract subsubSection Title and Content
    // this.subsubsection = this.latexcode?.document.match(/\\subsubsection{([^}]*)}([^]*)\\paragraph{/);
    // this.subsubsectionTitle = this.subsubsection && this.subsubsection.length > 1 ? this.subsubsection[1] : '';
    // this.subsubsection = this.subsubsection && this.subsubsection.length > 2 ? this.subsubsection[2] : '';
    // this.subsubsection = this.subsubsection.replace(/<ltk>/g, '');
    // console.log("Extracted subsubsectionTitle:", this.subsubsectionTitle);
    // console.log("Extracted subsubsectionContent:", this.subsubsection);

    //Extract Paragraph Title and Content
    // this.paragraph = this.latexcode?.document.match(/\\paragraph\{([^}]*)\}/);
    // this.paragraphTitle = this.paragraph && this.paragraph.length > 1 ? this.paragraph[1] : '';
    // this.paragraph = this.paragraph && this.paragraph.length > 2 ? this.paragraph[2] : '';
    // this.paragraph = this.paragraph.replace(/<ltk>/g, '');
    // console.log("Extracted paragraphTitle:", this.paragraphTitle);
    // console.log("Extracted paragraphContent:", this.paragraph);

    // const itemizeMatches = this.latexcode?.document.match(/\\begin{itemize}([^]*?)\\end{itemize}/);
    // const itemizeContent = itemizeMatches && itemizeMatches.length > 0 ? itemizeMatches[1] : '';
    // const itemizeList = itemizeContent.match(/\\item\s([^\\]*)/g);
    // const itemizedItems = itemizeList ? itemizeList.map((match: string) => match.replace(/\\item\s/, '').trim()) : [];
    // console.log("Extracted OrderedList:", itemizedItems);
    //this.updateOrderListItemsForm(itemizedItems); // Update the orderlist extracted data

    // Extract UnOrdered List items
    // const enumerateMatches = this.latexcode?.document.match(/\\begin{enumerate}([^]*?)\\end{enumerate}/);
    // const enumerateContent = enumerateMatches && enumerateMatches.length > 0 ? enumerateMatches[1] : '';
    // const enumerateList = enumerateContent.match(/\\item\s([^\\]*)/g);
    // const enumeratedItems = enumerateList ? enumerateList.map((match: string) => match.replace(/\\item\s/, '').trim()) : [];
    //console.log("Extracted UnorderedList:", enumeratedItems);
    //this.updateUnOrderListItemsForm(enumeratedItems); // Update the unorderlist extracted data

  }

  deleteDoc() {
    if (this.documentId) {
      this.confirmationDialogService.confirm('Confirmation', 'Are you sure you want to delete this Document?', true, 'Yes', 'No')
        .then((confirmed) => {
          if (confirmed) {
            this.httpservice.sendDeleteLatexRequest(URLUtils.deleteDocid(this.documentId)).subscribe((res: any) => {
              if (!res.error) {
                this.documentname = '';
                this.toast.success('Document deleted successfully');
                // this.newDoc();
              }
            },
              (error: HttpErrorResponse) => {
                if (error.status === 401 || error.status === 403 || error.status === 500) {
                  const errorMessage = error.error.msg || 'Unauthorized';
                  this.toast.error(errorMessage);
                }
              });
          }
        });
    }
  }

}

@Component({
  selector: 'app-opendialog-box',
  templateUrl: './opendialog-box.component.html',
  styleUrls: ['./doceditor.component.scss']
})

@Injectable()
export class OpendialogBoxComponent {
  dialog: any;
  name: any;
  title: any;

  @Output() dataEvent: EventEmitter<any> = new EventEmitter<any>();
  //@Output() dataEvent: EventEmitter<{ title: string; author: string; }> = new EventEmitter<{ title: string; author: string; }>();

  @Input() documentname: string = '';
  documents: any = [];
  documentex: any = [];
  latexcode: any;
  pdfSrc: any;
  documentId: any;
  //document: any;
  selectedDocumentIndex = 0;
  searchText: any = '';
  targetDocId: any;
  sortKey: string = '';
  isReverse: boolean = false;

  constructor(
    @Optional() public dialogRef: MatDialogRef<OpendialogBoxComponent>, @Inject(MAT_DIALOG_DATA) public data: { title: string },
    private httpservice: HttpService, private toast: ToastrService, public sanitizer: DomSanitizer, private fb: FormBuilder) {

  }

  ngOnInit() {
    this.httpservice.sendGetLatexDoc(URLUtils.getDocument).subscribe(
      (res: any) => {
        this.documents = res;
      }
    );
  }

  //Function for truncate the texts
  truncateString(text: string): string {
    return text.slice(0, 18); // Get the first 15 characters
  }

  ondocumentClick(docid: any, docname: any) {
    this.dialogRef.close({ "docid": docid, "docname": docname })
  }
  openFile(docid: any) {
    //DocAPI 
    this.httpservice.sendGetLatexDoc(URLUtils.getDocument).subscribe(
      (res: any) => {
        this.documents = res;
        //console.log('openDRes:', this.documents);

        //OpenAPI 
        this.httpservice.sendGetLatexRequest(URLUtils.opendocID(docid)).subscribe(
          (req: any) => {

            this.latexcode = req[0];
            // this.dataEvent.emit(this.latexcode);
            // console.log('latexcode',this.latexcode?.document)

            // this.documentex = req;
            // console.log("documentex:", this.documentex);
            // const match = this.latexcode?.document.match(/<ltk>\\title{([^}]*)}<ltk>/)
            // console.log('mat',match)

            // // Extract Title
            // const titleMatch = this.latexcode?.document.match(/\\title{([^}]*)}/);
            // const title = titleMatch && titleMatch.length > 1 ? titleMatch[1] : '';
            // console.log("Title:", title);

            // // Extract Author
            // const authorMatch = this.latexcode?.document.match(/\\author{([^}]*)}/);
            // const author = authorMatch && authorMatch.length > 1 ? authorMatch[1] : '';
            // console.log("Author:", author);

            // // Extract Date
            // const dateMatch = this.latexcode?.document.match(/\\date{([^}]*)}/);
            // const date = dateMatch && dateMatch.length > 1 ? dateMatch[1] : '';
            // console.log("Date:", date);

            // // Extract Abstract Title and Content
            // const abstractMatch = this.latexcode?.document.match(/\\abstract{([^}]*)}([^]*)\\section{/);
            // const abstractTitle = abstractMatch && abstractMatch.length > 1 ? abstractMatch[1] : '';
            // console.log("Abstract Title:", abstractTitle);

            // const abstractContent = abstractMatch && abstractMatch.length > 2 ? abstractMatch[2] : '';
            // console.log("Abstract Content:", abstractContent);

            // // Extract Section Title and Content
            // const sectionMatch = this.latexcode?.document.match(/\\section{([^}]*)}([^]*)\\subsection{/);
            // const sectionTitle = sectionMatch && sectionMatch.length > 1 ? sectionMatch[1] : '';
            // console.log("sectionTitle:", sectionTitle);

            // const sectionContent = sectionMatch && sectionMatch.length > 2 ? sectionMatch[2] : '';
            // console.log("section Content:", sectionContent);

            // // Extract subSection Title and Content
            // const subsectionMatch = this.latexcode?.document.match(/\\subsection{([^}]*)}([^]*)\\subsubsection{/);
            // const subsectionTitle = subsectionMatch && subsectionMatch.length > 1 ? subsectionMatch[1] : '';
            // console.log("subsectionTitle:", subsectionTitle);

            // const subsectionContent = subsectionMatch && subsectionMatch.length > 2 ? subsectionMatch[2] : '';
            // console.log("subsection Content:", sectionContent);

            // // Extract subsubSection Title and Content
            // const subsubsectionMatch = this.latexcode?.document.match(/\\subsubsection{([^}]*)}([^]*)\\paragraph{/);
            // const subsubsectionTitle = subsubsectionMatch && subsubsectionMatch.length > 1 ? subsubsectionMatch[1] : '';
            // console.log("subsubsectionTitle:", subsubsectionTitle);

            // const subsubsectionContent = subsubsectionMatch && subsubsectionMatch.length > 2 ? subsubsectionMatch[2] : '';
            // console.log("subsubsection Content:", subsubsectionContent);

            // // Extract Paragraph Title and Content
            // const paragraphMatch = this.latexcode?.document.match(/\\paragraph{([^}]*)}([^]*)\\begin{/);
            // const paragraphTitle = paragraphMatch && paragraphMatch.length > 1 ? paragraphMatch[1] : '';
            // console.log("paragraph Title:", paragraphTitle);

            // const paragraphContent = paragraphMatch && paragraphMatch.length > 2 ? paragraphMatch[2] : '';
            // console.log("paragraph Content:", paragraphContent);

            // // Extract Itemized List Content
            // const itemizeMatches = this.latexcode?.document.match(/\\begin{itemize}([^]*)\\end{itemize}/);
            // const itemizeContent = itemizeMatches && itemizeMatches.length > 0 ? itemizeMatches[1] : '';
            // const itemizeList = itemizeContent.match(/\\item\s([^\\]*)/g);
            // const itemizedItems = itemizeList ? itemizeList.map((match: { match: (arg0: RegExp) => any[]; }) => match.match(/\\item\s([^\\]*)/)[1]) : [];
            // console.log("Itemized List Content:", itemizedItems);

            // // Extract Enumerated List Content
            // const enumerateMatches = this.latexcode?.document.match(/\\begin{enumerate}([^]*)\\end{enumerate}/);
            // const enumerateContent = enumerateMatches && enumerateMatches.length > 0 ? enumerateMatches[1] : '';
            // const enumerateList = enumerateContent.match(/\\item\s([^\\]*)/g);
            // const enumeratedItems = enumerateList ? enumerateList.map((match: { match: (arg0: RegExp) => any[]; }) => match.match(/\\item\s([^\\]*)/)[1]) : [];
            // console.log("Enumerated List Content:", enumeratedItems);

            // //Pass data from child to parent
            // this.dataEvent.emit(title);
            // console.log('childData:', title)

            // this.dialogRef.afterClosed().subscribe((result: { title: any }) => {
            //   if (result) {
            //     this.title = result.title;
            //     console.log('titleafterClosed:', this.title);
            //   }
            // });
          }
        );
      }
    );
  }

  sortingFile(val: any) {
    this.isReverse = !this.isReverse;
    if (this.isReverse) {
      this.documents = this.documents?.sort((p1: any, p2: any) => (p1[val] < p2[val]) ? 1 : (p1[val] > p2[val]) ? -1 : 0);

    } else {
      this.documents = this.documents?.sort((p1: any, p2: any) => (p1[val] > p2[val]) ? 1 : (p1[val] < p2[val]) ? -1 : 0);
    }
  }

  sortingDateFile(val: string) {
    if (this.sortKey === val) {
      this.isReverse = !this.isReverse;
    } else {
      this.sortKey = val;
      this.isReverse = false;
    }
    this.documents = this.documents?.sort((p1: any, p2: any) => {
      const date1 = new Date(p1.updatedon?.$date);
      const date2 = new Date(p2.updatedon?.$date);
      return this.isReverse ? date2.getTime() - date1.getTime() : date1.getTime() - date2.getTime();
    });
  }

  closeDialog() {
    this.dialogRef.close()
  }
}

@Component({
  selector: 'app-download-box',
  templateUrl: './download-box.component.html',
  styleUrls: ['./doceditor.component.scss']
})

@Injectable()
export class DownloadBoxComponent {

  @Input() documentId: any;
  @Input() myForm: any;
  documentname: any;
  mydForm: any;
  submitted = false;

  constructor(
    public dialogRef: MatDialogRef<DownloadBoxComponent>, @Inject(MAT_DIALOG_DATA) public data: { documentname: string, documentId: any },
    private httpservice: HttpService, private toast: ToastrService, public sanitizer: DomSanitizer, private fb: FormBuilder) {
    this.documentname = data.documentname
    this.documentId = data.documentId

  }

  ngOnInit() {
    this.mydForm = this.fb.group({
      documentname: ['', Validators.required],
    });
  }

  downloadDoc() {
    this.submitted = true;

    if (this.mydForm.valid && this.documentId) {
      const reqq = { "documentname": this.mydForm.value.documentname };

      this.httpservice.sendPostLatexRequest(URLUtils.downloadDoc(this.documentId), reqq).subscribe(
        (res: any) => {
          this.toast.success(res.message);
          this.dialogRef.close({ "docid": res.id, "documentname": this.mydForm.value.documentname });
          //console.log('name:',this.documentname)
        },
        (error: HttpErrorResponse) => {
          if (error.status === 401 || error.status === 403) {
            const errorMessage = error.error.msg || 'Unauthorized';
            this.toast.error(errorMessage);
          }
        }
      );
    }
    else{
      //this.submitted = false;
      this.toast.error('Please save the document and provide a valid filename.');
    }
  }

  closeDialog() {
    this.dialogRef.close()
  }
}


@Component({
  selector: 'app-viewdoc',
  templateUrl: './viewdoc.component.html',
  styleUrls: ['./doceditor.component.scss']
})

@Injectable()
export class ViewDocComponent {

  selectedValue: string = "view";
  isDisplay: boolean = true;
  successModel: boolean = false;
  selectedOption: any;
  documents: any[] = [];
  searchText: any;

  constructor(private router: Router, private fb: FormBuilder, private httpservice: HttpService,
    private toast: ToastrService, private documentService: DocumentService, private cdr: ChangeDetectorRef,
    private renderer: Renderer2, private modalService: ModalService, private confirmationDialogService: ConfirmationDialogService,
    public sanitizer: DomSanitizer, public dialog: MatDialog) {
  }

  ngOnInit() {

    this.getDocumentCall();
  }

  getDocumentCall() {
    this.httpservice.sendGetLatexDoc(URLUtils.getDocument).subscribe(
      (res: any) => {
        this.documents = res;
        //this.documents = res[0].documentname;
        console.log('this.documents', this.documents)
      }
    );
  }

  isActive(value: string) {
    this.selectedValue = value;
    this.selectedValue == 'create' ? this.router.navigate(['/doceditor']) : this.router.navigate(['/viewdoc']);
  }

  hideAndShow() {
    this.isDisplay = !this.isDisplay;
  }


}

@Component({
  selector: 'app-content-dialog',
  templateUrl: './content-dialog.component.html',
  styleUrls: ['./doceditor.component.scss']
})

@Injectable()
export class ContentDialogComponent {

  @Input() documentId: any;
  @Input() myForm: any;

  @Input() content: any;
  contentTitle:any;
  contentData:any;

  contentForm: any;
  submitted = false;

  constructor(
    public dialogRef: MatDialogRef<ContentDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: {contentData:string, contentTitle:string},
    private fb: FormBuilder
  ) {
    this.contentData = data.contentData;
    this.contentTitle = data.contentTitle;
  }

  ngOnInit() {
    //console.log('dial content',this.content)
    this.contentForm = this.fb.group({
      contentData: [''],
      contentTitle:['']
    });
  }

  save() {
    const data = {
      contentData: this.contentData,
      contentTitle:this.contentTitle
    };
    this.dialogRef.close(data);
    //console.log('closeData from dialog', data)
  }

  closeDialog() {
    this.dialogRef.close()
  }

  onInputChange(event: Event) {
    const target = event.target as HTMLTextAreaElement;
    this.content = target.value; // latex to parent textarea
  }

  prependHyphen(newTitle: string) {
    if (newTitle && !newTitle.startsWith(' ')) {
      this.contentTitle = '' + newTitle;
    }
  }

}
