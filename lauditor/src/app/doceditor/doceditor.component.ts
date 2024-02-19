import { Component, Inject, Injectable, ApplicationRef, Input, Output, OnInit, EventEmitter, ViewChild, ElementRef, Renderer2, AfterViewInit, Optional, ChangeDetectionStrategy, ViewChildren, QueryList } from '@angular/core';
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
import { __values } from 'tslib';
//import jsPDF from 'jspdf';


@Component({
  selector: 'app-doceditor',
  templateUrl: './doceditor.component.html',
  styleUrls: ['./doceditor.component.scss']
})

export class DoceditorComponent {

  @ViewChild('pdfContent') pdfContent!: ElementRef;
  @ViewChild('contento_', { static: false }) contento!: ElementRef;
  @ViewChildren('contento') contentoElements!: QueryList<ElementRef>;
  @ViewChild(LatexblockComponent) childComp!: LatexblockComponent;

  product = environment.product;
  myForm: any;
  isDisabled: boolean = true;
  documents: any[] = [];

  documentname: any;
  title: string = 'New Document';
  author: string = 'Author';

  disabled = false;
  //isPageBreak: boolean = false;
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
  allLatex: any[] = [];

  childFormData: any[] = [];

  overviewToastShown = false;
  onSave = false;
  randomId: any;
  showPreviewDoc = false
  url: any;

  content: any;
  contentTitle: any;
  contentData: any;
  contentListItems: any[] = [];
  orderListItems: any;
  latexDialog: boolean = true;

  contentForm: any;
  contentDataControl: any
  contentTitleControl: any

  listData: any;
  getContent: any;

  selectedSection: boolean = false;
  selectedSectionIndex: number | null = null;

  listView: boolean = false;
  paragraphContent: any
  paragraphTitle: any

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

  addContent(type: any, value?: any, valueTitle?: any) {
    const randomId = this.idGenerator.generateId(10);
    // console.log('value', value)
    // console.log('valueTitle', valueTitle)
    if (value) {
      return this.fb.group({
        randomId: [randomId],
        content: [type], // Assigning the 'type' parameter to 'content'
        contentData: [value, Validators.required],
        contentTitle: [valueTitle, Validators.required],
        orderListItems: this.fb.array([
          this.createNestedContentItem(value)
        ])
      });
    }

    return this.fb.group({
      randomId: [randomId],
      content: [type], // Assigning the 'type' parameter to 'content'
      contentData: ['', Validators.required],
      contentTitle: ['', Validators.required],
      orderListItems: this.fb.array([
        this.createNestedContentItem()
      ])
    });

  }

  addBlock(type: string, editBlock?: boolean, value?: any, valueTitle?: any) {
    this.isOpen = true;
    this.content = type;
    //console.log('addBlock content', this.content);

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


    if (type === 'Ordered List' || type === 'Unordered List') {
      this.listView = true;
    }

    if (type === 'Page Break') {
      this.insertPageBreak()
    }

    if (editBlock === true) {
      if (type === 'Overview' || type === 'Section' || type === 'Sub Section' || type === 'Sub Sub Section' || type === 'Paragraph') {
        contentListItems.push(this.addContent(type, value, valueTitle));
      }
      if ((type === 'Ordered List' || type === 'Unordered List') && value && value.length > 0) {
        this.listView = false;
        //contentListItems.push(this.addContent(type, value));
        contentListItems.push(this.addContent(type, value?.orderListItems?.contentData));
        //console.log('contentListItems', contentListItems.value);
        const newIndex = contentListItems.length - 1;
        if (value && Array.isArray(value) && value.length > 0) {
          for (let i = 0; i < value.length; i++) {
            this.addNestedContentItem(newIndex, value[i]);
          }
        }
      }
    }
    else {
      //this.listView = true;
      contentListItems.push(this.addContent(type));
    }

    // //openDoc() gets and assigns the value.
    // if(editBlock === true){
    //   contentListItems.push(this.addContent(type, value, valueTitle)); 
    // }
    // else{
    //   contentListItems.push(this.addContent(type)); 
    // }
  }

  createNestedContentItem(value?: any): FormGroup {
    //console.log('oovalue', value)
    if (value) {
      return this.fb.group({
        contentData: [value, Validators.required]
      });
    }
    return this.fb.group({
      contentData: ['', Validators.required]
    });
  }

  addNestedContentItem(contentIndex: number, value?: any) {
    const contentArray = this.myForm.get('contentListItems') as FormArray;
    const nestedArray = contentArray.at(contentIndex).get('orderListItems') as FormArray;
    nestedArray.push(this.createNestedContentItem(value));
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
  opencontentDialog(item: any, itemIndex: any) {
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
    this.myForm.reset(); //reset form.
    this.documentname = ' '
    const preservedValues = {
      // title: this.myForm.get('title').value,
      // author: this.myForm.get('author').value,
      // date: this.myForm.get('date').value,
      title: 'New Document',
      author: 'Author',
      date: new Date()
    };
    this.myForm.patchValue(preservedValues); //values back into the form
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

        if (getContent === 'Page Break') {
          latexDocument += `<ltk>\\newpage`;
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
          //SECONDAPI 
          this.httpservice.sendPostLatexRequest(URLUtils.savedocID(this.documentId), reqq).subscribe(
            (ress: any) => {
              this.pageId = ress.id;
              this.toast.success(ress.message);
            }
          );
        });
    }
    else {
      //THIRDAPI - for update 
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
  isPageBreak(content: string): boolean {
    return content === 'Page Break';
  }

  insertPageBreak() {
    this.cdr.detectChanges(); //triggering immediately
    if (this.contentoElements && this.contentoElements.length > 0) {
      const contentoArray = this.contentoElements.toArray();
      contentoArray.forEach((contento: ElementRef) => {
        // Remove existing page break elements
        const existingPageBreaks = contento.nativeElement.querySelectorAll('.page-break');
        existingPageBreaks.forEach((pageBreak: HTMLElement) => {
          pageBreak.remove();
        });

        // Add new page break element
        const pageBreak = this.renderer.createElement('div');
        this.renderer.addClass(pageBreak, 'page-break');
        // visual representation of the page break
        this.renderer.setStyle(pageBreak, 'page-break-before', 'always');
        this.renderer.setStyle(pageBreak, 'border-top', '1px dashed #000');
        this.renderer.setStyle(pageBreak, 'margin-top', '20px'); // Adjust as needed
        this.renderer.appendChild(contento.nativeElement, pageBreak);
      });
    }
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
    this.isOpen = true;
    //Doc id
    this.documentId = docid;

    //OpenAPI 
    this.httpservice.sendGetLatexRequest(URLUtils.opendocID(docid)).subscribe(
      (req: any) => {
        if (req) {
          this.latexcode = req[0];
          this.documentId = docid;
          this.pageId = req[0]?.pageid
          //console.log("openLatexcode:", this.latexcode);
          this.extractionData();
          //this.cdr.detectChanges(); 
        }
      },
      (error: HttpErrorResponse) => {
        if (error.status === 400 || error.status === 401 || error.status === 403 || error.status === 500) {
          const errorMessage = error.error.msg || 'Unauthorized';
          this.toast.error(errorMessage);
        }
      }
    );
  }

  extractionData() {
    this.isOpen = true;
    console.log("openLateXXX: ", this.latexcode?.document);
    const lateX = this.latexcode?.document

    // Extract Title
    this.title = lateX.match(/\\title\s*{([^}]*)}/); ///\\abstract\s*([^]*)/;
    this.title = this.title && this.title.length > 1 ? this.title[1] : '';

    // Extract Author
    this.author = lateX.match(/\\author{([^}]*)}/);
    this.author = this.author && this.author.length > 1 ? this.author[1] : '';

    //Extract Date
    const dateMatch = lateX.match(/\\date{([^}]*)}/);
    this.date = dateMatch && dateMatch.length > 1 ? dateMatch[1] : '';

    //Extract Blocks data
    const extractionRules = [
      {
        regex: /\\newpage([^\\]*)/g,
        blockType: 'Page Break',
        handler: (args: string[]) => ({ type: 'Page Break', content: args[0] || '', position: lateX.indexOf(args[0] || '') })
      },
      {
        regex: /\\abstract([^\\]*)/g,
        blockType: 'Overview',
        handler: (args: string[]) => ({ type: 'Overview', content: args[0] || '', position: lateX.indexOf(args[0] || '') })
      },
      {
        regex: /\\section{([^}]*)}([^\\]*)/g,
        blockType: 'Section',
        handler: (args: string[]) => ({ type: 'Section', title: args[0] || '', content: args[1] || '', position: lateX.indexOf(args[0] || '') })
      },
      {
        regex: /\\subsection{([^}]*)}([^\\]*)/g,
        blockType: 'Sub Section',
        handler: (args: string[]) => ({ type: 'Sub Section', title: args[0] || '', content: args[1] || '', position: lateX.indexOf(args[0] || '') })
      },
      {
        regex: /\\subsubsection{([^}]*)}([^\\]*)/g,
        blockType: 'Sub Sub Section',
        handler: (args: string[]) => ({ type: 'Sub Sub Section', title: args[0] || '', content: args[1] || '', position: lateX.indexOf(args[0] || '') })
      },
      {
        regex: /\\paragraph{([^}]*)}([^\\]*)/g,
        blockType: 'Paragraph',
        handler: (args: string[]) => ({ type: 'Paragraph', title: args[0] || '', content: args[1] || '', position: lateX.indexOf(args[0] || '') })
      },
      {
        regex: /\\begin{itemize}([^]*?)\\end{itemize}/g,
        blockType: 'Ordered List',
        handler: (args: string[]) => ({ type: 'Ordered List', content: args[0] || '', position: lateX.indexOf(args[0] || '') })
      },
      {
        regex: /\\begin{enumerate}([^]*?)\\end{enumerate}/g,
        blockType: 'Unordered List',
        handler: (args: string[]) => ({ type: 'Unordered List', content: args[0] || '', position: lateX.indexOf(args[0] || '') })
      },
    ];

    const extractedBlocks: any[] = [];

    extractionRules.forEach(rule => {
      let match;
      while ((match = rule.regex.exec(lateX)) !== null) {
        const block = rule.handler(match.slice(1).map(arg => arg.trim().replace(/<ltk>/g, '')));
        if (block) {
          extractedBlocks.push(block);
        }
      }
    });

    // Sort extracted blocks by their positions in the document
    extractedBlocks.sort((a, b) => a.position - b.position);

    // Add blocks to the output in the sorted order
    extractedBlocks.forEach(block => {
      switch (block.type) {
        case 'Overview':
          this.addBlock('Overview', true, block.content);
          break;
        case 'Section':
          this.addBlock('Section', true, block.content, block.title);
          break;
        case 'Sub Section':
          this.addBlock('Sub Section', true, block.content, block.title);
          break;
        case 'Sub Sub Section':
          this.addBlock('Sub Sub Section', true, block.content, block.title);
          break;
        case 'Paragraph':
          this.addBlock('Paragraph', true, block.content, block.title);
          break;
        case 'Ordered List':
          const itemList = block.content.match(/\\item\s([^\\]*)/g);
          const items = itemList ? itemList.map((item: string) => item.replace(/\\item\s/, '').trim()) : [];
          this.addBlock('Ordered List', true, items);
          break;
        case 'Unordered List':
          const itemList1 = block.content.match(/\\item\s([^\\]*)/g);
          const items1 = itemList1 ? itemList1.map((item: string) => item.replace(/\\item\s/, '').trim()) : [];
          this.addBlock('Unordered List', true, items1);
          break;
        // Add cases for other types of blocks
      }
    });
  }

  //ORDERLIST EXTRACTION
  updateOrderListItemsForm(itemizedItems: string[]): void {
    // Clear existing items
    while (this.orderListItems.length !== 0) {
      this.orderListItems.removeAt(0);
    }
    // Add extracted items to the form array
    itemizedItems.forEach(item => {
      this.orderListItems.push(this.createorderItemWithValues(item));
    });
  }

  createorderItemWithValues(value: string): FormGroup {
    return this.fb.group({
      contentData: [value] // Initialize with extracted value
    });
  }

  deleteDoc() {
    if (this.documentId == '' || this.documentId == null) {
      this.toast.info('Please select the document!');
    }
    if (this.documentId) {
      this.confirmationDialogService.confirm('Confirmation', 'Are you sure you want to delete this Document?', true, 'Yes', 'No')
        .then((confirmed) => {
          if (confirmed) {
            this.httpservice.sendDeleteLatexRequest(URLUtils.deleteDocid(this.documentId)).subscribe((res: any) => {
              if (!res.error) {
                this.newDoc();
                this.toast.success('Document deleted successfully');
              }
            },
              (error: HttpErrorResponse) => {
                if (error.status === 400 || error.status === 401 || error.status === 403 || error.status === 500) {
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
          if (error.status === 400 || error.status === 401 || error.status === 403) {
            const errorMessage = error.error.msg || 'Unauthorized';
            this.toast.error(errorMessage);
          }
        }
      );
    }
    else {
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
  searchText: any = '';

  @Input() documentId: any;
  latexdoc = environment.lateXAPI;
  pdfSrc!: SafeResourceUrl;
  docId: any;
  isReverse: boolean = false;
  sortKey: string = '';

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
        // console.log('this.documents', this.documents)
        // console.log('doc', res.documentname)
      }
    );
  }

  viewDocument(item: any) {
    if (this.documents && Array.isArray(this.documents)) {
      const document = this.documents.find(doc => doc.docid === item.docid);  //get documentId
      if (document) {
        let url = this.latexdoc + URLUtils.getPreview(document.docid);
        this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        //console.log(this.pdfSrc);
      } else {
        this.toast.error('Document not found!!!');
      }
    }
  }

  deleteDocument(item: any) {
    if (item && item.docid) {
      this.confirmationDialogService.confirm('Confirmation', ' Are you sure! Do you want to delete this ' + item?.documentname + ' Document?!', true, 'Yes', 'No')
        .then((confirmed) => {
          if (confirmed) {
            this.httpservice.sendDeleteLatexRequest(URLUtils.deleteDocid(item.docid)).subscribe((res: any) => {
              if (!res.error) {
                this.getDocumentCall();
                this.toast.success('Document deleted successfully');
              }
            },
              (error: HttpErrorResponse) => {
                if (error.status === 400 || error.status === 401 || error.status === 403 || error.status === 500) {
                  const errorMessage = error.error.msg || 'Unauthorized';
                  this.toast.error(errorMessage);
                }
              });
          }
        });
    } else {
      //console.error('Document ID is undefined or item is invalid:', item);
    }
  }
  //serach func!!
  onKeydown(event: any) {
  }
  openModal(id: string) {
    this.modalService.open(id);
  }

  //sorting func!!
  sortingFile(val: any) {
    this.isReverse = !this.isReverse;
    if (this.isReverse) {
      this.documents = this.documents?.sort((p1: any, p2: any) => (p1[val] < p2[val]) ? 1 : (p1[val] > p2[val]) ? -1 : 0);

    } else {
      this.documents = this.documents?.sort((p1: any, p2: any) => (p1[val] > p2[val]) ? 1 : (p1[val] < p2[val]) ? -1 : 0);

    }
  }
  // sortingDateFile(val: string) {
  //   if (this.sortKey === val) {
  //     this.isReverse = !this.isReverse;
  //   } else {
  //     this.sortKey = val;
  //     this.isReverse = false;
  //   }

  //   this.documents = this.documents?.sort((p1: any, p2: any) => {
  //     const date1 = new Date(p1[val]);
  //     const date2 = new Date(p2[val]);
  //     return this.isReverse ? date2.getTime() - date1.getTime() : date1.getTime() - date2.getTime();
  //   });
  // }

  sortingDateFile(val: string) {
    if (this.sortKey === val) {
      this.isReverse = !this.isReverse;
    } else {
      this.sortKey = val;
      this.isReverse = false;
    }

    //sortedDocuments
    const sortedDocuments = JSON.parse(JSON.stringify(this.documents));
    sortedDocuments.sort((a: any, b: any) => {
      const dateA = a[val]?.["$date"] ? new Date(a[val].$date) : null;
      const dateB = b[val]?.["$date"] ? new Date(b[val].$date) : null;

      if (dateA && dateB) {
        return dateA.getTime() - dateB.getTime(); // Ascending order
      } else if (!dateA && !dateB) {
        return 0;
      } else if (!dateA) {
        return 1;
      } else {
        return -1;
      }
    });

    //isReverse is true
    if (this.isReverse) {
      sortedDocuments.reverse();
    }
    this.documents = sortedDocuments;
  }

  closeModal(id: string) {
    this.modalService.close(id);
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
  contentTitle: any;
  contentData: any;

  contentForm: any;
  submitted = false;

  constructor(
    public dialogRef: MatDialogRef<ContentDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: { contentData: string, contentTitle: string },
    private fb: FormBuilder
  ) {
    this.contentData = data.contentData;
    this.contentTitle = data.contentTitle;
  }

  ngOnInit() {
    //console.log('dial content',this.content)
    this.contentForm = this.fb.group({
      contentData: [''],
      contentTitle: ['']
    });
  }

  save() {
    const data = {
      contentData: this.contentData,
      contentTitle: this.contentTitle
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
