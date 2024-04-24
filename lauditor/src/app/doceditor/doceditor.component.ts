import { Component, Inject, Injectable, ApplicationRef, Input, Output, OnInit, EventEmitter, ViewChild, ElementRef, Renderer2, AfterViewInit, Optional, ChangeDetectionStrategy, ViewChildren, HostListener, QueryList } from '@angular/core';
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
import { debug } from 'strophe';
import { NgxSpinnerService } from 'ngx-spinner';
import { get } from 'jquery';
import { MatMenuTrigger } from '@angular/material/menu';
//import { DatePipe } from '@angular/common';
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

  //@ViewChild(SaveasBoxComponent) saveComp!: SaveasBoxComponent;

  product = environment.product;
  myForm: any;
  isDisabled: boolean = true;
  documents: any[] = [];

  documentname: any;
  title: string = '';
  author: string = '';
  // title: any;
  // author: any;

  disabled = false;
  //isPageBreak: boolean = false;
  pdfSrc: any;

  documentId: any;
  pageId: any;

  latexcode: any;
  latexBlock: any[] = [];

  docid: any;
  currentDocId: any;
  latexdoc = environment.lateXAPI;
  submitted = false;

  selectedValue: string = "create";
  isDisplay: boolean = true;
  selectedOption: any;

  //  currentDate = new Date();
  //  date = this.currentDate;
  date: any;

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

  selectedSection: boolean = true;
  selectedSectionIndex: number | null = null;

  listView: boolean = false;
  orderList: boolean = false;
  paragraphContent: any
  paragraphTitle: any;
  successModel: boolean = false;
  successGrpName: any;
  hasSection = false;
  hasSubSection = false;

  maxContent = 1;
  blockId: any;
  pgId: any[] = [];
  pageno: any;
  getPage: any;

  pno: any;
  pageNumber: any;
  pid: any;
  docSaved = false;
  openDoc = false;
  openId: any;
  sId: any;

  showSpinner = false;
  showSpin: any
  saveData = true;
  saveForm: any;
  editMeta: any;
  showErrorMessage: boolean = false;
  listName: any;
  @ViewChild('aForm') aForm!: ElementRef;

  isButtonClicked = false;
  EditDesc = false;
  AddDesc = false;
  isNotesElipses: boolean = false;
  itemContent: any;
  isFirefox: boolean = false;
  
  @ViewChild('menuTrigger1') menuTrigger1!: MatMenuTrigger;
  @ViewChild('menuTrigger2') menuTrigger2!: MatMenuTrigger;

  // Listen to mouse leave event on the document
  @HostListener('document:mouseleave', ['$event'])
  onMouseLeave(event: MouseEvent) {
    if (this.menuTrigger1.menuOpen) {
      this.menuTrigger1.closeMenu();
    }
    if (this.menuTrigger2.menuOpen) {
      this.menuTrigger2.closeMenu();
    }
  }
  // Listen to scroll event on the document
  @HostListener('document:scroll', ['$event'])
  onScroll(event: Event) {
    if (this.menuTrigger1.menuOpen) {
      this.menuTrigger1.closeMenu();
    }
    if (this.menuTrigger2.menuOpen) {
      this.menuTrigger2.closeMenu();
    }
  }

  constructor(private router: Router, private idGenerator: RandomService, private appRef: ApplicationRef, private fb: FormBuilder, private httpservice: HttpService,
    private toast: ToastrService, private documentService: DocumentService, private cdr: ChangeDetectorRef,
    private renderer: Renderer2, private modalService: ModalService, private spinnerService: NgxSpinnerService, private confirmationDialogService: ConfirmationDialogService,
    public sanitizer: DomSanitizer, public dialog: MatDialog) {
    // this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
  }

  ngOnInit() {
    this.myForm = this.fb.group({
      // title: [this.title],
      // author: [this.author],
      title: ['', Validators.required],
      author: ['', Validators.required],
      date: [''],
      //date: [this.date],
      //pagebreak:[this.pagebreak],
      contentListItems: this.fb.array([]),
    });

    this.saveForm = this.fb.group({
      documentname: ['', Validators.required],
    });

    this.getDocumentCall();
    this.isFirefox = this.detectFirefox(); //...firefox style
  }

  // addContent(type: any, value?: any, valueTitle?: any) {
  //   const randomId = this.idGenerator.generateId(10);
  //   console.log('contVal', value)

  //   if (value) {
  //     this.toast.info('addCon Inn')
  //     return this.fb.group({
  //       randomId: [randomId],
  //       content: [type], // Assigning the 'type' parameter to 'content'
  //       contentData: [value, Validators.required],
  //       contentTitle: [valueTitle, Validators.required],
  //       orderListItems: this.fb.array([
  //         this.createNestedContentItem(value)
  //       ])
  //     });
  //   }

  // return this.fb.group({
  //   randomId: [randomId],
  //   content: [type], // Assigning the 'type' parameter to 'content'
  //   contentData: ['', Validators.required],
  //   //pagebreak:[this.pagebreak],
  //   contentTitle: ['', Validators.required],
  //   orderListItems: this.fb.array([
  //     this.createNestedContentItem()
  //   ])
  // });
  // }

  detectFirefox(): boolean {
    const userAgent = window.navigator.userAgent;
    return userAgent.indexOf('Firefox') !== -1;
  }

  //restrict enter at first position
  // onEnterPress(event: KeyboardEvent) {
  //   if (event.key === 'Enter') {
  //     const textarea = event.target as HTMLTextAreaElement;
  //     if (textarea.selectionStart === 0 && textarea.selectionEnd === 0) {
  //       event.preventDefault();
  //     }
  //   }
  // }
  onEnterPress(event: KeyboardEvent) {
      if (event.key === 'Enter') {
        event.preventDefault();
    }
  }
  
  toggleEdit(item: FormGroup) {
    item.patchValue({
      editMode: !item.value.editMode
    });
  }

  saveItem(item: FormGroup) {
    // Save logic here - After saving, exit edit mode
    item.patchValue({
      editMode: false
    });
  }

  addItem(item: any) {
    //item.AddDesc=true;
    //item.EditDesc=true;

    const contentListItems = this.myForm.get('contentListItems') as FormArray;
    for (let i = 0; i < contentListItems.length; i++) {
      const item = contentListItems.at(i);
      if (item) {
        const getContent = item.get('content')?.value;
        this.contentDataControl = item.get('contentData');
        this.contentTitleControl = item.get('contentTitle');

        const data = this.contentDataControl.value;
        if (getContent == 'Overview' || getContent == 'Section' || getContent == 'Sub Section' || getContent == 'Sub Sub Section' || getContent == 'Paragraph') {
          if (data === '' || data === undefined || data === " " || data === null) {
            this.toast.error('Please check the Content data');
            return;
          }
        }

        const orderListItems = item.get('orderListItems') as FormArray; // orderListItems within each item
        for (let j = 0; j < orderListItems.length; j++) {
          const itemo = orderListItems.at(j);
          if (itemo) {
            this.listData += `\\item ${itemo.get('contentData')?.value}`; //get all ordered & unordered lists
            const data2 = itemo.value?.contentData;
            if (getContent == 'Ordered List' || getContent == 'Unordered List') {
              if (data2 === '' || data2 === undefined || data2 === " " || data2 === null) {
                this.toast.error('Please check the Content List data');
                return;
              }
            }
          }
        }
      }
    }
    item.AddDesc = true;

  }

  removedItem(item: any) {
    const contentListItems = this.myForm.get('contentListItems') as FormArray;
    contentListItems.removeAt(item);
  }

  toggleNotesEllipsis(item: any) {
    item.AddDesc = true
    item.isNotesElipses = !item.isNotesElipses;
  }

  toggleMore(item: any) {
    item.AddDesc = false;
  }

  addContent(type: any, value?: any, valueTitle?: any) {
    // if(value === null){
    //   this.toast.error('I null')
    // }
    const randomId = this.idGenerator.generateId(10);
    const group = this.fb.group({
      randomId: [randomId],
      content: [type],
      contentData: ['', Validators.required],
      contentTitle: ['', Validators.required],
      orderListItems: this.fb.array([this.createNestedContentItem()])
    });
    if (value || valueTitle) {
      group.get('contentData')?.setValue(value);
      group.get('contentTitle')?.setValue(valueTitle);
      const nestedContentItem = this.createNestedContentItem(value);
      (group.get('orderListItems') as FormArray).push(nestedContentItem);
    }
    return group;
  }

  addContentList(type: any, value?: any, valueTitle?: any) {
    const randomId = this.idGenerator.generateId(10);
    const group = this.fb.group({
      randomId: [randomId],
      content: [type],
      contentData: ['', Validators.required],
      contentTitle: ['', Validators.required],
      orderListItems: this.fb.array([])
    });
    if (value) {
      group.get('contentData')?.setValue(value);
      group.get('contentTitle')?.setValue(valueTitle);
      const nestedContentItem = this.createNestedContentItem(value);
      (group.get('orderListItems') as FormArray).push(nestedContentItem);
    }
    return group;
  }

  addBlock(type: string, editBlock?: boolean, value?: any, valueTitle?: any) {
    this.isOpen = true;
    this.content = type;

    const contentListItems = this.myForm.get('contentListItems') as FormArray;
    //console.log('contentListItems', contentListItems)

    for (let i = 0; i < contentListItems.length; i++) {
      const item = contentListItems.at(i);
      if (item) {
        //const getContent = item.get('content')?.value;
        this.getContent = item.get('content')?.value;
      }
    }

    // Set focus on the last added textarea
    setTimeout(() => {
      const textareas = document.querySelectorAll('.text-size.form-control.textareaDoc');
      const lastTextarea = textareas[textareas.length - 1] as HTMLTextAreaElement;
      if (lastTextarea && !editBlock === true) {
        lastTextarea.focus();
      }
    });

    // ***OVERVIEW CONDITIONS*** //
    // Overview - Check if adding an overview when one already exists
    if (type === 'Overview' && contentListItems.controls.some(item => item.value.content === 'Overview')) {
      this.toast.error('Only one overview is allowed');
      return;
    }

    // Overview - If trying to add Overview when other blocks already exist
    if(type === 'Overview' && contentListItems.controls.some(item => item.value.content !== 'Overview' && this.getContent != null)){
      this.toast.error('Overview can be added only at the beginning of the document.');
      return;
    }
    // ***OVERVIEW CONDITIONS*** //

    // ***SECTION CONDITIONS*** //
    // Section conditions - Check if adding a sub section or sub sub section without a section
    if ((type === 'Sub Section' || type === 'Sub Sub Section') &&
      !contentListItems.controls.some(item => item.value.content === 'Section') && !editBlock === true) {
      if (type === 'Sub Sub Section') {
        this.toast.error('Invalid Selection. Please add Section before adding Sub Section or Sub Sub Section.');
      } else if (type === 'Sub Section') {
        this.toast.error('Invalid Selection. Please add Section before adding Sub Section or Sub Sub Section.');
      }
      return;
    }
    // Section conditions - Check if adding a sub sub section without a sub section
    if (type === 'Sub Sub Section' &&
      !contentListItems.controls.some(item => item.value.content === 'Sub Section') && !editBlock === true) {
      this.toast.error('Invalid Selection. Please add Sub Section before adding Sub Sub Section.');
      return;
    }
    // Sub Section & Sub Sub Section conditions 
    if (type === 'Sub Section' && this.getContent === 'Paragraph' && !editBlock === true ||
      type === 'Sub Section' && this.getContent === 'Overview' && !editBlock === true ||
      type === 'Sub Section' && this.getContent === 'Page Break' && !editBlock === true ||
      type === 'Sub Section' && this.getContent === 'Unordered List' && !editBlock === true ||
      type === 'Sub Section' && this.getContent === 'Ordered List' && !editBlock === true) {
      this.toast.error('Invalid Selection. Please add Section before adding Sub Section or Sub Sub Section.');
      return
    }
    if (type === 'Sub Sub Section' && this.getContent === 'Paragraph' && !editBlock === true ||
      type === 'Sub Sub Section' && this.getContent === 'Overview' && !editBlock === true ||
      type === 'Sub Sub Section' && this.getContent === 'Page Break' && !editBlock === true ||
      type === 'Sub Sub Section' && this.getContent === 'Unordered List' && !editBlock === true ||
      type === 'Sub Sub Section' && this.getContent === 'Ordered List' && !editBlock === true ||
      type === 'Sub Sub Section' && this.getContent === 'Section' && !editBlock === true) {
      this.toast.error('Invalid Selection. Please add Sub Section before adding Sub Sub Section.');
      return
    }
    if (type === 'Sub Section' && this.getContent === 'Sub Sub Section' && !editBlock === true) {
      this.toast.error('Invalid Selection. Please add Section before adding Sub Section or Sub Sub Section.');
      return
    }
    if (type === 'Sub Sub Section' && this.getContent === 'Sub Sub Section' ||
      type === 'Sub Section' && this.getContent === 'Sub Section') {
      //this.toast.success('Allow');
    }
    // ***SECTION CONDITIONS*** //    

    // ***List focus Condition*** //
    if (type === 'Unordered List') {
      // Set focus on the input field of the new block
      setTimeout(() => {
        const newIndex = contentListItems.length - 1;
        const inputs = document.querySelectorAll(`.oderAlign:nth-child(${newIndex + 1}) .text-size.form-control.createDoc.unorderMain`);
        const lastInput = inputs[inputs.length - 1] as HTMLInputElement;
        if (lastInput && !editBlock === true) {
          lastInput.focus();
        }
      }, 100); // Adjust the delay as needed
    }
    if (type === 'Ordered List') {
      // Set focus on the input field of the new block
      setTimeout(() => {
        const newIndex = contentListItems.length - 1;
        const inputs = document.querySelectorAll(`.oderAlign:nth-child(${newIndex + 1}) .text-size.form-control.createDoc.orderMain`);
        const lastInput = inputs[inputs.length - 1] as HTMLInputElement;
        if (lastInput && !editBlock === true) {
          lastInput.focus();
        }
      }, 100); // Adjust the delay as needed
    }
    // ***List focus Condition*** //

    // ***Page Break Condition*** //
    if (type === 'Page Break' && contentListItems.length < 1) {
      this.toast.error('Please add text before the Page Break');
      //this.insertPageBreak()
      return;
    }
    if (type === 'Page Break' && this.getContent === 'Page Break') { //&& !editBlock === true
      this.toast.error('Please add text before the Page Break');
      return
    }
    // ***Page Break Condition*** //

    //when Extraction function called(Edit)
    if (editBlock === true) {
      if (type === 'Overview') {
        contentListItems.push(this.addContent(type, value));
      }
      if (type === 'Section' || type === 'Sub Section' || type === 'Sub Sub Section' || type === 'Paragraph') {
        contentListItems.push(this.addContent(type, value, valueTitle));
      }
      if (type === 'Ordered List' || type === 'Unordered List') {
        const List = this.addContentList(type);
        if (Array.isArray(value) && value.length > 0) {
          const orderListItems = (List.controls['orderListItems'] as FormArray);
          value.forEach(listItem => {
            orderListItems.push(this.createNestedContentItem(listItem));
          });
        }
        contentListItems.push(List);
      }
      if (type === 'Page Break') {
        contentListItems.push(this.addContent(type, value));
        this.insertPageBreak()
      }
    }
    else {
      contentListItems.push(this.addContent(type));
    }
  }

  createNestedContentItem(value?: any): FormGroup {
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
    // console.log('contentIndex',contentIndex)
    // console.log('content',this.content)
    //Disable to trigger the Add Btn if no val.
    for (let j = 0; j < nestedArray.length; j++) {
      const itemo = nestedArray.at(j) as FormGroup
      const listValue = itemo.value.contentData
      if (listValue === '') {
        this.toast.error('Please add text.')
        return
      }
    }
    nestedArray.push(this.createNestedContentItem(value));

    // Set focus on the last added input field
    setTimeout(() => {
      const inputs = document.querySelectorAll(`.oderAlign:nth-child(${contentIndex + 1}) .text-size.form-control.createDoc.unorderMain`);
      const lastInput = inputs[inputs.length - 1] as HTMLInputElement;
      if (lastInput) {
        lastInput.focus();
      }
    });
  }
  addNestedContentItem2(contentIndex: number, value?: any) {
    const contentArray = this.myForm.get('contentListItems') as FormArray;
    const nestedArray = contentArray.at(contentIndex).get('orderListItems') as FormArray;
    // console.log('contentIndex',contentIndex)
    // console.log('content',this.content)
    //Disable to trigger the Add Btn if no val.
    for (let j = 0; j < nestedArray.length; j++) {
      const itemo = nestedArray.at(j) as FormGroup
      const listValue = itemo.value.contentData
      if (listValue === '') {
        this.toast.error('Please add text.')
        return
      }
    }
    nestedArray.push(this.createNestedContentItem(value));

    // Set focus on the last added input field
    setTimeout(() => {
      const inputs = document.querySelectorAll(`.oderAlign:nth-child(${contentIndex + 1}) .text-size.form-control.createDoc.orderMain`);
      const lastInput = inputs[inputs.length - 1] as HTMLInputElement;
      if (lastInput) {
        lastInput.focus();
      }
    });
  }

  removeList(contentIndex: number, orderIndex: number, i?: any) {
    const contentListItemsArray = this.myForm.get('contentListItems') as FormArray;
    const contentItem = contentListItemsArray.at(contentIndex);
    const orderListItemsArray = contentItem.get('orderListItems') as FormArray;
    orderListItemsArray.removeAt(orderIndex);
  }

  removeItem(i: number) {
    const contentListItems = this.myForm.get('contentListItems') as FormArray;
    contentListItems.removeAt(i);
  }  
  
  //OpenDialog boxes for all sections!!!
  opencontentDialog(item: any, itemIndex: any) {
    this.latexDialog = true;
    const dialogRef = this.dialog.open(ContentDialogComponent, {
      width: '600px',
      height: '415px',
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

  //OpenDialog boxes for Overview section!!!
  openoverviewDialog(item: any, itemIndex: any) {
    //console.log('i', item)
    this.latexDialog = true;
    const dialogRef = this.dialog.open(OverviewExpandComponent, {
      width: '600px',
      height: '415px',
      data: {
        contentData: item.value.contentData,
        //contentTitle: item.value.contentTitle,
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

  newDoc() {
    //Without saving the document, cant able to select New.
    const contentListItems = this.myForm.get('contentListItems') as FormArray;

    if (contentListItems.length >= 0 && !this.documentId) {
      this.toast.error('Document changes not saved. Please try again.');
      return;
    }

    this.myForm.reset(); //reset form.
    this.documentname = ' '
    window.location.reload();

    const preservedValues = {
      // title: this.myForm.get('title').value,
      // author: this.myForm.get('author').value,
      // date: this.myForm.get('date').value,
      title: 'New Document',
      author: 'Author',
      //date: new Date()
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

  onKeyDown(event: KeyboardEvent): void {
    const textarea = event.target as HTMLTextAreaElement;
    const textareaValue: string = textarea.value;
    const cursorPosition: number = textarea.selectionStart;
    if (event.key === 'Enter' && cursorPosition !== 0 && cursorPosition !== textareaValue.length) {
      event.preventDefault(); // Prevent the default Enter key behavior
    }
  }

  //For author & title!!
  onKeyDown1(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent the default Enter key behavior
    }
  }

  //For input field of list.
  onKeyDownList(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent the default Enter key behavior
    }
  }

  //{ and } not allow 
  onKeyPress(event: any) {
    const restrictedCharacters = /[{}]/;
    const restrictedCharacters1 = /[\\]/;

    // Check if the pressed key is a Space 
    if (event.key === ' ' && (event.target as HTMLTextAreaElement).selectionStart === 0) {
      event.preventDefault();
      //this.toast.error('Space is not allowed at the beginning.');
      return;
    }

    if (restrictedCharacters.test(event.key)) {
      this.showErrorMessage = true;
      this.toast.error('Please avoid using { and } brackets.');
      event.preventDefault();
    }
    else if (restrictedCharacters1.test(event.key)) {
      this.showErrorMessage = true;
      this.toast.error('Please avoid using backslash.');
      event.preventDefault();
    }
    else {
      this.showErrorMessage = false;
    }

    // Check if the pressed key is a Enter 
    if (event.key === 'Enter') {
      const textarea = event.target as HTMLTextAreaElement;
      if (textarea.selectionStart === 0 && textarea.selectionEnd === 0) {
        event.preventDefault();
      }
    }
  }
  
  restrictNoFirst(event: any) {
    let inputValue: string = event.target.value;
    if (inputValue.length > 0 && inputValue.charAt(0) === '0' || inputValue.charAt(0) === '1' || inputValue.charAt(0) === '2' || inputValue.charAt(0) === '3' ||
      inputValue.charAt(0) === '4' || inputValue.charAt(0) === '5' || inputValue.charAt(0) === '6' ||
      inputValue.charAt(0) === '7' || inputValue.charAt(0) === '8' || inputValue.charAt(0) === '9') {
      inputValue = inputValue.substring(1);
      event.target.value = inputValue;
    }

  }

  restrictFirstPosition(event: any) {
    let inputValue: string = event.target.value;
    if (inputValue.length > 0 && inputValue.charAt(0) === '0' || inputValue.charAt(0) === '1' || inputValue.charAt(0) === '2' || inputValue.charAt(0) === '3' ||
      inputValue.charAt(0) === '4' || inputValue.charAt(0) === '5' || inputValue.charAt(0) === '6' ||
      inputValue.charAt(0) === '7' || inputValue.charAt(0) === '8' || inputValue.charAt(0) === '9') {
      inputValue = inputValue.substring(1);
      event.target.value = inputValue;
      this.toast.error('Numbers should not be first character')
      return;
    }

  }

  restrictSpaces(event: any) {
    let inputValue: string = event.target.value;
    // Replace multiple spaces with a single space
    inputValue = inputValue.replace(/\s{2,}/g, ' ');
    event.target.value = inputValue;
  }

  restricttextSpace(event: any) {
    let inputValue: string = event.target.value;
    inputValue = inputValue.replace(/^\s+/, '');
    inputValue = inputValue.replace(/\s{2,}/g, ' ');
    event.target.value = inputValue;
  }

  onKeyDownEntero(event: KeyboardEvent): void {
    const textarea = event.target as HTMLTextAreaElement;
    const cursorPosition: number = textarea.selectionStart;
    const textLength: number = textarea.value.length;
  
    // If Enter is pressed and cursor is not at the end of the text
    if (event.key === 'Enter' && cursorPosition !== textLength) {
      return; // Allow default behavior
    }
  
    // If Enter is pressed at the end of the text
    if (event.key === 'Enter' && cursorPosition === textLength) {
      textarea.setRangeText('\n', cursorPosition, cursorPosition, 'end');
      textarea.dispatchEvent(new Event('input')); // Trigger input event
      event.preventDefault(); // Prevent default behavior
    }
  }

  restrictFirstCharacter(event: any) {
    let inputValue: string = event.target.value;
    // Check if the first character is hyphen '-' or underscore '_'
    if (/^[-_]/.test(inputValue)) {
      // Remove the first character
      inputValue = inputValue.substring(1);
      // Update the input field value
      event.target.value = inputValue;
      // this.toast.error('Special characters should not take place at first position')
      this.toast.error('Hyphens (-) and underscore (_) should not be the first character')
      return;
    }
  }

  restrictSplCharacteratFirst(event: any) {
    let inputValue: string = event.target.value;
    if (/^[[]/.test(inputValue) || /^(])/.test(inputValue)) {  // Remove the first character
      inputValue = inputValue.substring(1); // Update the input field value
      event.target.value = inputValue;
      this.toast.error('[ and ] brackets should not be the first character');
      return;
    }
    if (/^[<]/.test(inputValue) || /^[>]/.test(inputValue)) {  // Remove the first character
      inputValue = inputValue.substring(1); // Update the input field value
      event.target.value = inputValue;
      this.toast.error('< and > tags should not be the first character');
      return;
    }
    if (/^[|]/.test(inputValue)) {  // Remove the first character
      inputValue = inputValue.substring(1); // Update the input field value
      event.target.value = inputValue;
      this.toast.error('| should not be the first character');
      return;
    }
    if (/^[\\]/.test(inputValue)) {  // Remove the first character
      inputValue = inputValue.substring(1); // Update the input field value
      event.target.value = inputValue;
      this.toast.error('\\ should not be the first character');
      return;
    }
  }

  saveDocument(i?:any) {
    this.submitted = false;
    //this.documentname = ' '
    const contentListItems = this.myForm.get('contentListItems') as FormArray;
    // console.log('form', this.myForm)
    // console.log('only cont',contentListItems)
    // console.log('len',contentListItems.value)
    // console.log('content', this.content)

    if (contentListItems.value.length === 0) {
      this.toast.error('Please add text to proceed.');
      return
    }
    let previousContentChecked = false;

    for (let i = 0; i < contentListItems.length; i++) {
      const item = contentListItems.at(i);
      if (item) {
        const getContent = item.get('content')?.value;

        const currentContent = contentListItems.at(i).get('content')?.value;
        const previousContent = contentListItems.at(i - 1).get('content')?.value;      
        // console.log('currentContent', currentContent)
        // console.log('previousContent', previousContent)

        //Editblock - empty content conditions!!!
        if (!previousContentChecked && previousContent === null) {
          this.toast.error('Please add text to proceed.');
          return;
        }
        previousContentChecked = true;

        if (currentContent === 'Page Break' && previousContent === 'Page Break') {
          this.toast.error('Please add text before the Page Break.');
          return;
        }
      }
    }

    // Set focus on the last added input field  text-size form-control createDoc savecreate
    setTimeout(() => {
      const textareas = document.querySelectorAll('.text-size.form-control.createDoc.savecreate');
      const lastTextarea = textareas[textareas.length - 1] as HTMLTextAreaElement;
      if (lastTextarea) {
        lastTextarea.focus();
      }
    });

    for (let i = 0; i < contentListItems.length; i++) {
      const item = contentListItems.at(i);
      // if (item) {
      //   const getContent = item.get('content')?.value;

      //   this.contentDataControl = item.get('contentData');
      //   this.contentTitleControl = item.get('contentTitle');

      //   const data = this.contentDataControl.value;
      //   if (getContent == 'Overview' || getContent == 'Section' || getContent == 'Sub Section' || getContent == 'Sub Sub Section' || getContent == 'Paragraph') {
      //     if (data === '' || data === undefined || data === " " || data === null) {
      //       this.toast.error('Please check the Content data');
      //       return;
      //     }
      //   }

      //   const orderListItems = item.get('orderListItems') as FormArray; // orderListItems within each item
      //   for (let j = 0; j < orderListItems.length; j++) {
      //     const itemo = orderListItems.at(j);
      //     if (itemo) {
      //       this.listData += `\\item ${itemo.get('contentData')?.value}`; //get all ordered & unordered lists
      //       const data2 = itemo.value?.contentData;
      //       if (getContent == 'Ordered List' || getContent == 'Unordered List') {
      //         if (data2 === '' || data2 === undefined || data2 === " "|| data2 === null) {
      //           this.toast.error('Please check the Content List data');
      //           return;
      //         }
      //       }
      //     }
      //   }
      // }
    }

    if (!this.documentId && contentListItems.length !== 0) {
      this.modalService.open('custom-modal-1');
      return
    }
    // else if (contentListItems.length === 1 && this.getContent === null) {
    //   this.toast.error('Please add atleast one content');
    //   return
    // }
    else {
      //this.toast.info('else work')
      this.saveDoc();
    }
  }

  saveFile() {
    const saveForm = this.saveForm.value.documentname;
    console.log('saveform', saveForm)
    // if (saveForm === '' || saveForm === " " || saveForm === null && !this.documentId) {
    //   this.submitted = true;
    //   this.toast.error('invalid....')
    //   return
    // }
    if (this.saveForm.invalid && saveForm === '' || saveForm === " " || saveForm === null) {
      this.submitted = true;
      //this.toast.error('invalid....')
      return
    }
  }

  saveDoc() {
    //this.submitted = true;
    //this.saveData = true;
    const saveForm = this.saveForm.value.documentname;
    const contentListItems = this.myForm.get('contentListItems') as FormArray;
    //console.log('save contentListItems',contentListItems)

    if (!this.documentId && saveForm === '' || saveForm === " " || saveForm === null) {
      this.submitted = true;
      //this.toast.error('invalid....')
      return
    }

    let latexDocument = `\\documentclass{article}\\usepackage{hyperref}
    \\usepackage{geometry}\\geometry{a4paper,total={170mm,257mm},left=20mm,top=20mm,}<ltk>\\title
    {${this.title}}<ltk>\\author{${this.author}}<ltk>\\date{}<ltk>\\begin{document}<ltk>\\maketitle`;

    // Check if the document needs to be saved
    if (!this.documentId) { // if the docId is empty  || contentListItems.length === 0
      let req = { "documentname": this.saveForm.value.documentname };
      // 1st API call to save the document
      this.httpservice.sendPostLatexRequest(URLUtils.savedoc, req).subscribe(
        (res: any) => {
          const documentId = res.id;
          this.documentId = documentId;
          this.processContentItems(contentListItems, latexDocument);  // Once the document is saved, process content items
        },
        (error: HttpErrorResponse) => {
          if (error.status === 400 || error.status === 403 || error.status === 500) {
            const errorMessage = error.error.message || 'Unauthorized';
            this.toast.error(errorMessage);
            this.modalService.open('custom-modal-1'); //if status 400 exists the same dialog open
            return;
          }
        });
      this.modalService.close('custom-modal-1');
      this.docSaved = true;
      this.documentname = req.documentname;//pass docname to layout
    } else {
      this.processContentItems(contentListItems, latexDocument); // If the document is already saved
    }
  }

  processContentItems(contentListItems: FormArray, latexDocument: string) {
    let currentPage = 1; // Track the current page number
    let pageContent = ''; // Track the content for the current page
    let blocksProcessed = 0;
    let maxBlocks = 35; //Max blocks condition
    this.submitted = false;

    // Loop through each content item
    for (let i = 0; i < contentListItems.length; i++) {
      const item = contentListItems.at(i);
      if (item) {
        let getContent = item.get('content')?.value;
        this.contentDataControl = item.get('contentData');
        this.contentTitleControl = item.get('contentTitle');

        //Track the lists contentData
        const orderListItems = item.get('orderListItems') as FormArray; // orderListItems within each item
        this.listData = '';//prevent undefined!!!
        for (let j = 0; j < orderListItems.length; j++) {
          const itemo = orderListItems.at(j);
          if (itemo) {
            this.listData += `\\item ${itemo.get('contentData')?.value}`; //get all ordered & unordered lists
          }
        }
        blocksProcessed++;

        // Append block content to the pageContent
        pageContent += `<ltk>${this.getBlockContent(getContent)}`;

        // Check if the block count exceeds the threshold or it's the last item
        if (blocksProcessed > maxBlocks || i === contentListItems.length - 1) {
          //this.toast.info('Following content will move to next page')

          // Prepare request object
          let reqq: any;
          if (currentPage === 1) {
            // For the first page, include both latexDocument and pageContent
            reqq = {
              "document": latexDocument + pageContent.replace(/\n/g, '<nln>'),
              "page": currentPage
            };
          } else {
            // For subsequent pages, include only pageContent if it's the last page
            reqq = {
              "document": pageContent.replace(/\n/g, '<nln>'),
              "page": currentPage
            };
          }

          //console.log('reqq as perPage:', reqq);
          this.pageno = reqq.page

          blocksProcessed = 0;
          //console.log('blocksProcessed 0:', blocksProcessed)

          // API call to save/update page content
          if (!this.pageNumber) {
            this.pageNumber = [];
          }

          if (!this.pageId) { // || this.documentId // API call to save the page content for the first page
            this.httpservice.sendPostLatexRequest(URLUtils.savedocID(this.documentId), reqq).subscribe(
              (ress: any) => {
                this.pageId = ress.id; // Getting Id from preview
                this.pno = reqq.page;

                // Set pageNumber array for the first page
                this.pageNumber.push({ "page": this.pno, "pageId": this.pageId });
                //console.log('const pageNo.', this.pageNumber);
                //this.toast.success(ress.message);
                this.toast.success('Document saved successfully');
                currentPage++; // Increment page number for the next page
                pageContent = ''; // Reset pageContent for the next page
              }
            );
          }
          else{
            this.httpservice.sendPatchLatexRequest(URLUtils.updateDoc(this.pageId), reqq).subscribe(
              (resp: any) => {
                // this.pid = this.pageId
                //this.openId = this.pageId
                //console.log('this.openId',this.pageId)
                this.toast.success('Document updated successfully');
              })
          }
          // else {
          //   // Check if the current page number exists in the pageNumber array
          //   // console.log('pageId', this.pageId)
          //   let currentPageIndex = this.pageNumber.findIndex((page: any) => page.page === reqq.page);
          //   //console.log('currentPageIndex',currentPageIndex)
          //   if (currentPageIndex !== -1) {
          //     let currentPageId = this.pageNumber[currentPageIndex].pageId;
          //     // console.log('curr pageId', currentPageId)
          //     // Make the PATCH request with the correct pageId
          //     this.httpservice.sendPatchLatexRequest(URLUtils.updateDoc(currentPageId), reqq).subscribe(
          //       (resp: any) => {
          //         //this.toast.success(resp.message);
          //         this.toast.success('Document updated successfully');
          //         currentPage++; // Increment page number for the next page
          //         pageContent = ''; // Reset pageContent for the next page
          //       }
          //     );
          //   }
          //   else{
          //     this.httpservice.sendPatchLatexRequest(URLUtils.updateDoc(this.pageId), reqq).subscribe(
          //       (resp: any) => {
          //         // this.pid = this.pageId
          //         //this.openId = this.pageId
          //         console.log('this.openId',this.pageId)
          //         this.toast.success('Document updated successfully');
          //       })
          //   }
          // }
          currentPage++; // Increment page number for the next page
          pageContent = ''; // Reset pageContent for the next page
        }
      }
    }
  }

  // Get Block Contents
  // getBlockContent(contentType: string) {
  //   console.log('contenType',contentType)
  //   switch (contentType) {
  //     case 'Overview':
  //       return `\\abstract ${this.contentDataControl.value}`;
  //     case 'Section':
  //       return `\\section{${this.contentTitleControl.value || ''}}${this.contentDataControl.value || ''}`;
  //     case 'Sub Section':
  //       return `\\subsection{${this.contentTitleControl.value || ''}}${this.contentDataControl.value || ''}`;
  //     case 'Sub Sub Section':
  //       return `\\subsubsection{${this.contentTitleControl.value || ''}}${this.contentDataControl.value || ''}`;
  //     case 'Paragraph':
  //       return `\\paragraph{${this.contentTitleControl.value || ''}}${this.contentDataControl.value || ''}`;
  //     case 'Ordered List':
  //       return `\\begin{enumerate}${this.listData}\\end{enumerate}`;
  //     case 'Unordered List':
  //       return `\\begin{itemize}${this.listData}\\end{itemize}`;
  //     case 'Page Break':
  //       return `\\newpage`;
  //     default:
  //       return ''; // Default case, handle appropriately
  //   }
  // }

  getBlockContent(contentType: string) {
    // Trim leading and trailing whitespace including '\n' from this.contentDataControl.value
    const contentData = this.contentDataControl.value ? this.contentDataControl.value.trim() : '';
    const contentTitle = this.contentTitleControl.value ? this.contentTitleControl.value.trim() : '';
  
    switch (contentType) {
      case 'Overview':
        return `\\abstract ${contentData || ''}`;
      case 'Section':
        return `\\section{${contentTitle || ''}}${contentData || ''}`;
      case 'Sub Section':
        return `\\subsection{${contentTitle || ''}}${contentData || ''}`;
      case 'Sub Sub Section':
        return `\\subsubsection{${contentTitle || ''}}${contentData || ''}`;
      case 'Paragraph':
        return `\\paragraph{${contentTitle || ''}}${contentData || ''}`;
      case 'Ordered List':
        return `\\begin{enumerate}${this.listData}\\end{enumerate}`;
      case 'Unordered List':
        return `\\begin{itemize}${this.listData}\\end{itemize}`;
      case 'Page Break':
        return `\\newpage`;
      default:
        return ''; // Default case, handle appropriately
    }
  }
  
  //Oldooo Save Function!!!
  // saveDocOldoo() {
  //   //this.onSave = true;
  //   //console.log('saveForm:', this.myForm.value);
  //   // const result: { [key: string]: string } = {};
  //   // this.childFormData.forEach((item: any) => {
  //   //   const key = Object.keys(item)[0];
  //   //   if (key && item[key]) {
  //   //     result[key] = item[key];
  //   //     //console.log('reskey',result[key])
  //   //   }
  //   // });
  //   // console.log('res',result)
  //   // let combinedObject2 = { ...result, ...this.myForm.value };
  //   // console.log('combinedObject2:', combinedObject2);

  //   let latexDocument = `\\documentclass{article}\\usepackage{geometry}\\geometry{a4paper,total={170mm,257mm},left=20mm,top=20mm,}<ltk>\\title
  //   {${this.title}}<ltk>\\author{${this.author}}<ltk>\\date{${this.date}}<ltk>\\begin{document}<ltk>\\maketitle`;

  //   const contentListItems = this.myForm.get('contentListItems') as FormArray;
  //   for (let i = 0; i < contentListItems.length; i++) {
  //     const item = contentListItems.at(i);
  //     if (item) {
  //       const getContent = item.get('content')?.value;
  //       this.contentDataControl = item.get('contentData');
  //       this.contentTitleControl = item.get('contentTitle');

  //       const orderListItems = item.get('orderListItems') as FormArray; // orderListItems within each item
  //       this.listData = '';//prevent undefined!!!
  //       for (let j = 0; j < orderListItems.length; j++) {
  //         const itemo = orderListItems.at(j);
  //         if (itemo) {
  //           this.listData += `\\item ${itemo.get('contentData')?.value}`; //get all ordered & unordered lists
  //           //console.log('Order List Item:', this.listData);
  //         }
  //       }

  //       if (getContent === 'Page Break') { latexDocument += `<ltk>\\newpage`; }
  //       if (getContent === 'Overview') { latexDocument += `<ltk>\\abstract ${this.contentDataControl.value}`; }
  //       if (getContent === 'Section') { latexDocument += `<ltk>\\section{${this.contentTitleControl.value || ''}}${this.contentDataControl.value || ''}`; }
  //       if (getContent === 'Sub Section') { latexDocument += `<ltk>\\subsection{${this.contentTitleControl.value || ''}}${this.contentDataControl.value || ''}`; }
  //       if (getContent === 'Sub Sub Section') { latexDocument += `<ltk>\\subsubsection{${this.contentTitleControl.value || ''}}${this.contentDataControl.value || ''}`; }
  //       if (getContent === 'Paragraph') { latexDocument += `<ltk>\\paragraph{${this.contentTitleControl.value || ''}}${this.contentDataControl.value || ''}`; }
  //       if (getContent === 'Ordered List') { latexDocument += `<ltk>\\begin{itemize}${this.listData}\\end{itemize}`; }
  //       if (getContent === 'Unordered List') { latexDocument += `<ltk>\\begin{enumerate}${this.listData}\\end{enumerate}`; }
  //     }
  //   }

  //   // if(this.myForm.value.contentListItems.length > 1){
  //   //   this.toast.info('Following content will move to next page');
  //   //   return;
  //   // }
  //   const maxPage = this.myForm.value.contentListItems.length > 1;
  //   if(maxPage){
  //     this.toast.info('Following content will move to next page');
  //     this.maxContent = this.maxContent + 1;
  //     console.log('this.maxContent', this.maxContent)
  //   }

  //   let reqq = {
  //     "document": latexDocument,
  //     "page": this.maxContent
  //   };

  //   console.log('lateX', latexDocument);
  //   // let reqq = {
  //   //   "document": latexDocument,
  //   //   "page": 1
  //   // };

  //   if (this.documentId == null) {
  //     //this.submitted = true;
  //     let req = { "documentname": this.title };
  //     //FIRST API
  //     this.httpservice.sendPostLatexRequest(URLUtils.savedoc, req).subscribe(
  //       (res: any) => {
  //         const documentId = res.id;
  //         this.documentId = documentId;
  //         //SECONDAPI 
  //         this.httpservice.sendPostLatexRequest(URLUtils.savedocID(this.documentId), reqq).subscribe(
  //           (ress: any) => {
  //             this.pageId = ress.id;
  //             this.toast.success(ress.message);
  //           }
  //         );
  //       });
  //   }
  //   else {
  //     //THIRDAPI - for update 
  //     this.httpservice.sendPatchLatexRequest(URLUtils.updateDoc(this.pageId), reqq).subscribe(
  //       (resp: any) => {
  //         this.toast.success(resp.message);
  //       });
  //   }
  // }


  //Wrap the Layout text
  truncateString(text: string): string {
    return text.slice(0, 250); //Get the first 42 characters
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
      width: '645px',
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
      this.sId = result.docid; //check open should update or not.
      //console.log('sid',this.sId)
      if (result.docid) {
        this.openFile(result.docid)
      }
      this.documentname = result.docname //Get docname on Layout
    });
  }

  openFile(docid: any, i?: any) {
    this.isOpen = true;
    this.submitted = false;
    this.docSaved = true;
    //Doc id
    this.documentId = docid;
    this.myForm.reset();

    //OpenAPI 
    this.httpservice.sendGetLatexRequest(URLUtils.opendocID(docid)).subscribe(
      (req: any) => {
        if (req) {
          // this.latexcode = req[0];
          // console.log("latexCode:", this.latexcode);
          req.sort((a: any, b: any) => a.page - b.page); //Aligned as per the page no.

          this.latexBlock = req;
          //console.log("latexBlock:", this.latexBlock);

          this.documentId = docid;
          this.pageId = req[0]?.pageid;
          // this.openId= req[0]?.pageid;
          // console.log('pid', this.openId)
          this.spinnerService.show()
          this.extractionData();
          this.getPreview();
          this.spinnerService.hide()
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
    this.submitted = false;

    const lateX = this.latexcode?.document
    const lateXArray = this.latexBlock.map(item => item.document); // Extracting document data into an array
    //console.log("lateXArray:", lateXArray);

    lateXArray.forEach(lateX => {
      // Extract Title
      this.title = lateXArray[0].match(/\\title\s*{([^}]*)}/);
      this.title = this.title && this.title.length > 1 ? this.title[1] : '';

      // Extract Author
      this.author = lateXArray[0].match(/\\author{([^}]*)}/);
      this.author = this.author && this.author.length > 1 ? this.author[1] : '';

      //Extract Date
      // const dateMatch = lateXArray[0].match(/\\date{([^}]*)}/);
      // this.date = dateMatch && dateMatch.length > 1 ? dateMatch[1] : '';

      let count = 0;
      let lastIndex = 0;

      //Extract Blocks data
      const extractionRules = [
        {
          regex: /\\newpage([^\\]*)/g,
          blockType: 'Page Break',
          handler: (args: string[]) => {
            count++;
            const position = lateX.indexOf(args[0] || '', lastIndex);
            lastIndex = position + args[0].length; // Update lastIndex to track the position of the next match
            return { type: 'Page Break', content: `Page ${count}`, position };
          }
        },
        {
          regex: /\\abstract([^\\]*)/g,
          blockType: 'Overview',
          handler: (args: string[]) => ({ type: 'Overview', content: args[1] || '', position: lateX.indexOf(args[0] || '') })
        },
        {
          regex: /\\section{([^}]*)}([^\\]*)/g,
          blockType: 'Section',
          handler: (args: string[]) => ({ type: 'Section', title: args[1] || '', content: args[2], position: lateX.indexOf(args[0] || '') })
        },
        {
          regex: /\\subsection{([^}]*)}([^\\]*)/g,
          blockType: 'Sub Section',
          handler: (args: string[]) => ({ type: 'Sub Section', title: args[1] || '', content: args[2] || '', position: lateX.indexOf(args[0] || '') })
        },
        {
          regex: /\\subsubsection{([^}]*)}([^\\]*)/g,
          blockType: 'Sub Sub Section',
          handler: (args: string[]) => ({ type: 'Sub Sub Section', title: args[1] || '', content: args[2] || '', position: lateX.indexOf(args[0] || '') })
        },
        {
          regex: /\\paragraph{([^}]*)}([^\\]*)/g,
          blockType: 'Paragraph',
          handler: (args: string[]) => ({ type: 'Paragraph', title: args[1] || '', content: args[2], position: lateX.indexOf(args[0] || '') })
        },
        {
          regex: /\\begin{enumerate}([^]*?)\\end{enumerate}/g,
          blockType: 'Ordered List',
          handler: (args: string[]) => ({ type: 'Ordered List', content: args[0] || '', position: lateX.indexOf(args[0] || '') })
        },
        {
          regex: /\\begin{itemize}([^]*?)\\end{itemize}/g,
          blockType: 'Unordered List',
          handler: (args: string[]) => ({ type: 'Unordered List', content: args[0] || '', position: lateX.indexOf(args[0] || '') })
        },
      ];

      const extractedBlocks: any[] = [];

      extractionRules.forEach(rule => {
        let match;
        while ((match = rule.regex.exec(lateX)) !== null) {
          const position = match.index; // Capture the position/index
          const block = rule.handler(match.slice(0).map(arg => arg.trim().replace(/<ltk>/g, ''))); // Pass the matched data to the handler
          if (block) {
            extractedBlocks.push({ ...block, position }); // Push an object with both block and position
          }
        }
      });

      // Sort extracted blocks by their positions in the document
      extractedBlocks.sort((a, b) => a.position - b.position);

      // Add blocks to the output in the sorted order
      extractedBlocks.forEach((block) => {
        var content = block.content.replace(/<nln>/g, '\n');
        //console.log('rev content', content)
        switch (block.type) {
          case 'Overview':
            this.addBlock('Overview', true, content);
            break;
          case 'Section':
            this.addBlock('Section', true, content, block.title);
            break;
          case 'Sub Section':
            this.addBlock('Sub Section', true, content, block.title);
            break;
          case 'Sub Sub Section':
            this.addBlock('Sub Sub Section', true, content, block.title);
            break;
          case 'Paragraph':
            this.addBlock('Paragraph', true, content, block.title);
            break;
          case 'Ordered List':
            const itemList = content.match(/\\item\s([^\\]*)/g);
            const items = itemList ? itemList.map((item: string) => item.replace(/\\item\s/, '').trim()) : [];
            this.addBlock('Ordered List', true, items);
            break;
          case 'Unordered List':
            const itemList1 = content.match(/\\item\s([^\\]*)/g);
            const items1 = itemList1 ? itemList1.map((item: string) => item.replace(/\\item\s/, '').trim()) : [];
            this.addBlock('Unordered List', true, items1);
            break;
          case 'Page Break':
            this.addBlock('Page Break', true, content);
            break;
          // Add cases for other types of blocks
        }
        //console.log('extractedBlocks',extractedBlocks)
      });
    });
  }

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

  //SaveAs dialog box!!
  downloadDialog() {
    //without saving/updating the document cannot select the SaveAs.
    if (!this.documentId || this.documentId === null) { //!this.documentId || this.documentId === null || this.sId && !this.openId
      this.toast.error('Please save changes before making a copy.')
      return;
    }

    // Set focus on the last added input field  text-size form-control createDoc savecreate
    setTimeout(() => {
      const textareas = document.querySelectorAll('.text-size.form-control.createDoc');
      const lastTextarea = textareas[textareas.length - 1] as HTMLTextAreaElement;
      if (lastTextarea) {
        lastTextarea.focus();
      }
    });

    const dialogRef = this.dialog.open(DownloadBoxComponent, {
      width: '500px',
      height: '230px',
      data: {
        //documentname: this.documentname,,
        documentId: this.documentId
      },
      hasBackdrop: true,
      panelClass: 'hello',
      autoFocus: true
    });
    dialogRef.afterClosed().subscribe((result: { docid: any, documentname: any }) => {
      if (result) {
        //this.documentname = result.documentname;
        //this.documentId = result.docid;
        //console.log('docnameId', this.documentId)
        // this.httpservice.sendGetLatexDoc(URLUtils.savedDocid(this.documentId)).subscribe(
        //   (res: any) => {
        //   });
      }
      this.docSaved = true;
    });
  }

  getPreview() {
    //PREVIEW API
    if (!this.documentId) {
      this.toast.error("Please save the document.");
      return;
    }
    this.showPreviewDoc = true;
    let url = this.latexdoc + URLUtils.getPreview(this.documentId);
    this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  // deleteDoc() {
  //   if (this.documentId == '' || this.documentId == null) {
  //     this.toast.error('Please select the document!');
  //   }
  //   if (this.documentId) {
  //     this.confirmationDialogService.confirm('Confirmation', 'Are you sure! you want to delete the ' + this.documentname + ' document?', true, 'Yes', 'No')
  //       .then((confirmed) => {
  //         if (confirmed) {
  //           this.httpservice.sendDeleteLatexRequest(URLUtils.deleteDocid(this.documentId)).subscribe((res: any) => {
  //             if (!res.error) {
  //               this.toast.success('Document deleted successfully');
  //               window.location.reload();
  //             }
  //           },
  //             (error: HttpErrorResponse) => {
  //               if (error.status === 400 || error.status === 401 || error.status === 403 || error.status === 500) {
  //                 const errorMessage = error.error.msg || 'Unauthorized';
  //                 this.toast.error(errorMessage);
  //               }
  //             });
  //         }
  //       });
  //   }
  // }
  deleteDocument() {
    if (this.documentId == '' || this.documentId == null) {
      this.toast.error('Please select the document.');
      return;
    }
    this.modalService.open('custom-modal-2');
  }

  deleteDoc() {
    if (this.documentId) {
      this.httpservice.sendDeleteLatexRequest(URLUtils.deleteDocid(this.documentId)).subscribe((res: any) => {
        if (!res.error) {
          this.toast.success('Document deleted successfully.');
          window.location.reload();
        }
      },
        (error: HttpErrorResponse) => {
          if (error.status === 400 || error.status === 401 || error.status === 403 || error.status === 500) {
            const errorMessage = error.error.msg || 'Unauthorized';
            this.toast.error(errorMessage);
          }
        });
    }
  }
  closeModal(id: string) {
    this.modalService.close(id);
  }

  closeDialog() {
    this.modalService.close('custom-modal-1');
    this.saveForm.reset();
    //this.dialogRef.close()
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
    return text.slice(0, 20); // Get the first 15 characters
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
//Saveas dialogComponent in Editor
export class DownloadBoxComponent {

  @Input() documentId: any;
  @Input() myForm: any;
  documentname: any;
  mydForm: any;
  submitted = false;
  successModel: boolean = false;
  saveasModal: boolean = false;
  successGrpName: any;
  @Input() docSaved = false;
  @Input() pageId: any;

  constructor(
    public dialogRef: MatDialogRef<DownloadBoxComponent>, @Inject(MAT_DIALOG_DATA) public data: { documentname: string, documentId: any },
    private httpservice: HttpService, private confirmationDialogService: ConfirmationDialogService, private toast: ToastrService, private router: Router, public sanitizer: DomSanitizer, private fb: FormBuilder) {
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
    //this.saveasModal = true;

    const form = this.mydForm.value.documentname
    //console.log('form', form)
    if (form == '' || form == undefined) {
      this.submitted = true;
      //this.toast.error('form invalid')
      return
    }
    this.submitted = false;


    if (this.mydForm.valid && this.documentId || this.documentId) {
      const reqq = { "documentname": this.mydForm.value.documentname };

      this.httpservice.sendPostLatexRequest(URLUtils.downloadDoc(this.documentId), reqq).subscribe(
        (res: any) => {
          //this.toast.info(res.message);
          // this.saveasModal = false;
          // this.successModel = true;
          this.successGrpName = this.mydForm.value.documentname;
          this.dialogRef.close({ "docid": res.id, "documentname": this.mydForm.value.documentname });
          //console.log('name:',this.documentname)
          if (!res.error) {
            this.confirmationDialogService.confirm('Saved', 'Congratulations! You have Successfully created a ' + this.successGrpName + ' Document', true, 'View Document', 'Go Back', true, undefined).then((confirmed) => {
              if (confirmed) {
                this.router.navigate(['/viewdoc']);
                this.docSaved = true;
              }
              else
                this.dialogRef.close()
              //window.location.reload();
            })
          }
          //else {
          //   this.confirmationDialogService.confirm('Alert', res.msg, false, '', '', false, 'sm', false)
          // }
        },

        (error: HttpErrorResponse) => {
          if (error.status === 400 || error.status === 401 || error.status === 403) {
            const errorMessage = error.error.message || 'Unauthorized';
            this.toast.error(errorMessage);
          }
        }
      );

      // this.saveasModal = false;
      // this.successModel = true;
      // this.successGrpName = this.mydForm.value.documentname;
    }
    else {
      //this.submitted = false;
      this.toast.error('Please save the document and provide a valid filename.');
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent the default Enter key behavior
    }
  }

  restrictFirstPosition(event: any) {
    let inputValue: string = event.target.value;
    if (inputValue.length > 0 && inputValue.charAt(0) === '0' || inputValue.charAt(0) === '1' || inputValue.charAt(0) === '2' || inputValue.charAt(0) === '3' ||
      inputValue.charAt(0) === '4' || inputValue.charAt(0) === '5' || inputValue.charAt(0) === '6' ||
      inputValue.charAt(0) === '7' || inputValue.charAt(0) === '8' || inputValue.charAt(0) === '9') {
      inputValue = inputValue.substring(1);
      event.target.value = inputValue;
    }
  }
  restrictSpaces(event: any) {
    let inputValue: string = event.target.value;
    // Replace multiple spaces with a single space
    inputValue = inputValue.replace(/\s{2,}/g, ' ');
    event.target.value = inputValue;
  }
  restrictFirstCharacter(event: any) {
    let inputValue: string = event.target.value;
    // Check if the first character is hyphen '-' or underscore '_'
    if (/^[-_]/.test(inputValue)) {
      // Remove the first character
      inputValue = inputValue.substring(1);
      // Update the input field value
      event.target.value = inputValue;
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
  @Input() documentname: any;
  latexdoc = environment.lateXAPI;
  pdfSrc!: SafeResourceUrl;
  docId: any;
  isReverse: boolean = false;
  sortKey: string = '';
  createdBy: any;
  errorMsg: boolean = false;
  editDoc:any;

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
        this.createdBy = localStorage.getItem('name'); //Get value from localStorage
        // console.log('token',this.createdBy)
        // this.documents = res[0].documentname;
        // console.log('this.documents', this.documents)
        // console.log('doc', res.documentname)

        //if not createdDocuments then throw an error msg.
        this.errorMsg = this.documents.length == 0 ? true : false;
        //console.log('errorMsg', this.errorMsg)
      }
    );
  }

  viewDocument(item: any) {
    if (this.documents && Array.isArray(this.documents)) {
      const document = this.documents.find(doc => doc.docid === item.docid);  //get documentId
      if (document) {
        let url = this.latexdoc + URLUtils.getPreview(document.docid);
        this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(url);
         console.log(this.pdfSrc);
      } else {
        this.toast.error('Document not found!');
      }
    }
  }

  //Open the delete dialog
  editDocInfo(item: any) {
    this.editDoc = JSON.parse(JSON.stringify(item));

  }
  openModal(id: string) {
    this.modalService.open(id);
  }

  deleteDocument(item?: any) {
    if (item && item.docid) {
      this.httpservice.sendDeleteLatexRequest(URLUtils.deleteDocid(item.docid)).subscribe((res: any) => {
        if (!res.error) {
          this.getDocumentCall();
          this.toast.success('Document deleted successfully.');
        }
      },
        (error: HttpErrorResponse) => {
          if (error.status === 400 || error.status === 401 || error.status === 403 || error.status === 500) {
            const errorMessage = error.error.msg || 'Unauthorized';
            this.toast.error(errorMessage);
          }
        });
    } else {
      this.toast.error('Document not found!');
    }
  }

  //Close modal
  closeModal(id: string) {
    this.modalService.close(id);
  }
  //serach func!!
  onKeydown(event: any) {
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

  //Save As dialog box!!
  saveasDialog(item: any) {
    const dialogRef = this.dialog.open(SaveasBoxComponent, {
      width: '500px',
      height: '252px',
      data: {
        documentname: item.documentname,
        //documentId: this.documentId
      },
      hasBackdrop: true,
      panelClass: 'hello',
      autoFocus: true
    });

    //console.log('data',dialogRef)
    dialogRef.afterClosed().subscribe((result: { docid: any, documentname: any }) => {
      if (result) {
        item.documentname = result.documentname;
        item.documentId = result.docid;
        //console.log('docname',this.documentname)
        // this.httpservice.sendGetLatexDoc(URLUtils.savedDocid(this.documentId)).subscribe(
        //   (res: any) => {
        //   });
      }
    });
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
  //contentData: any;

  contentForm: any;
  submitted = false;
  @Input() contentData: any;
  showErrorMessage: boolean = false;


  constructor(
    public dialogRef: MatDialogRef<ContentDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: { contentData: string, contentTitle: string },
    private fb: FormBuilder, private toast: ToastrService
  ) {
    this.contentData = data.contentData;
    this.contentTitle = data.contentTitle;
  }

  ngOnInit() {
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

  //For content title!!
  onKeyDown1(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent the default Enter key behavior
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    const textarea = event.target as HTMLTextAreaElement;
    const textareaValue: string = textarea.value;
    const cursorPosition: number = textarea.selectionStart;
    if (event.key === 'Enter' && cursorPosition !== 0 && cursorPosition !== textareaValue.length) {
      event.preventDefault(); // Prevent the default Enter key behavior
    }
  }

  //{ and } not allow 
  onKeyPress(event: any) {
    const restrictedCharacters = /[{}]/;
    const restrictedCharacters1 = /[\\]/;

    if (restrictedCharacters.test(event.key)) {
      this.showErrorMessage = true;
      this.toast.error('Please avoid using { and } brackets.');
      event.preventDefault();
    }
    else if (restrictedCharacters1.test(event.key)) {
      this.showErrorMessage = true;
      this.toast.error('Please avoid using backslash.');
      event.preventDefault();
    }
    else {
      this.showErrorMessage = false;
    }

    // Check if the pressed key is a Space 
    if (event.key === ' ' && (event.target as HTMLTextAreaElement).selectionStart === 0) {
      event.preventDefault();
      //this.toast.error('Space is not allowed at the beginning.');
      return;
    }

    // Check if the pressed key is a Enter 
    if (event.key === 'Enter') {
      const textarea = event.target as HTMLTextAreaElement;
      if (textarea.selectionStart === 0 && textarea.selectionEnd === 0) {
        event.preventDefault();
      }
    }
  }

  //{ and } not allow 
  onKeyPress1(event: any) {
    const restrictedCharacters = /[{}]/;
    const restrictedCharacters1 = /[\\]/;
    if (restrictedCharacters.test(event.key)) {
      this.showErrorMessage = true;
      this.toast.error('Please avoid using { and } brackets.');
      event.preventDefault();
    }
    else if(restrictedCharacters1.test(event.key)) {
      this.showErrorMessage = true;
      this.toast.error('Please avoid using backslash.');
      event.preventDefault();
    }
    else {
      this.showErrorMessage = false;
    }
  }
  
  restrictSplCharacteratFirst(event: any) {
    let inputValue: string = event.target.value;
    // Check if the first character is [ or ]
    if (/^[[]/.test(inputValue) || /^(])/.test(inputValue)) {  // Remove the first character
      inputValue = inputValue.substring(1); // Update the input field value
      event.target.value = inputValue;
      this.toast.error('[ and ] brackets should not be the first character');
      return;
    }
    if (/^[<]/.test(inputValue) || /^[>]/.test(inputValue)) {  // Remove the first character
      inputValue = inputValue.substring(1); // Update the input field value
      event.target.value = inputValue;
      this.toast.error('< and > tags should not be the first character');
      return;
    }
    if (/^[|]/.test(inputValue)) {  // Remove the first character
      inputValue = inputValue.substring(1); // Update the input field value
      event.target.value = inputValue;
      this.toast.error('| should not be the first character');
      return;
    }
    if (/^[\\]/.test(inputValue)) {  // Remove the first character
      inputValue = inputValue.substring(1); // Update the input field value
      event.target.value = inputValue;
      this.toast.error('\\ should not be the first character');
      return;
    }

  }

  restricttextSpace(event: any) {
    let inputValue: string = event.target.value;
    inputValue = inputValue.replace(/^\s+/, '');
    inputValue = inputValue.replace(/\s{2,}/g, ' ');
    event.target.value = inputValue;
  }

  prependHyphen(newTitle: string) {
    if (newTitle && !newTitle.startsWith(' ')) {
      this.contentTitle = '' + newTitle;
    }
  }
}

@Component({
  selector: 'app-overview-expand',
  templateUrl: './overview-expand.component.html',
  styleUrls: ['./doceditor.component.scss']
})

@Injectable()
export class OverviewExpandComponent {

  @Input() documentId: any;
  @Input() myForm: any;

  @Input() content: any;
  contentTitle: any;
  //contentData: any;

  contentForm: any;
  submitted = false;
  @Input() contentData: any;
  showErrorMessage: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ContentDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: { contentData: string, contentTitle: string },
    private fb: FormBuilder, private toast: ToastrService
  ) {
    this.contentData = data.contentData;
    this.contentTitle = data.contentTitle;
  }

  ngOnInit() {
    //console.log('dial content', this.contentData)
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

  restrictSplCharacteratFirst(event: any) {
    let inputValue: string = event.target.value;
    // Check if the first character is [ or ]
    if (/^[[]/.test(inputValue) || /^(])/.test(inputValue)) {  // Remove the first character
      inputValue = inputValue.substring(1); // Update the input field value
      event.target.value = inputValue;
      this.toast.error('[ and ] brackets should not be the first character');
      return;
    }
    if (/^[<]/.test(inputValue) || /^[>]/.test(inputValue)) {  // Remove the first character
      inputValue = inputValue.substring(1); // Update the input field value
      event.target.value = inputValue;
      this.toast.error('< and > tags should not be the first character');
      return;
    }
    if (/^[|]/.test(inputValue)) {  // Remove the first character
      inputValue = inputValue.substring(1); // Update the input field value
      event.target.value = inputValue;
      this.toast.error('| not be the first character');
      return;
    }
    if (/^[\\]/.test(inputValue)) {  // Remove the first character
      inputValue = inputValue.substring(1); // Update the input field value
      event.target.value = inputValue;
      this.toast.error('\\ should not be the first character');
      return;
    }
  }

  closeDialog() {
    this.dialogRef.close()
  }

  onInputChange(event: Event) {
    const target = event.target as HTMLTextAreaElement;
    this.content = target.value; // latex to parent textarea
  }
  onKeyDown(event: KeyboardEvent): void {
    const textarea = event.target as HTMLTextAreaElement;
    const textareaValue: string = textarea.value;
    const cursorPosition: number = textarea.selectionStart;
    if (event.key === 'Enter' && cursorPosition !== 0 && cursorPosition !== textareaValue.length) {
      event.preventDefault(); // Prevent the default Enter key behavior
    }
  }
  //{ and } not allow 
  onKeyPress(event: any) {
    // Check if the pressed key is a Space 
    if (event.key === ' ' && (event.target as HTMLTextAreaElement).selectionStart === 0) {
      event.preventDefault();
      //this.toast.error('Space is not allowed at the beginning.');
      return;
    }

    // Check if the pressed key is a Enter 
    if (event.key === 'Enter') {
      const textarea = event.target as HTMLTextAreaElement;
      if (textarea.selectionStart === 0 && textarea.selectionEnd === 0) {
        event.preventDefault();
      }
    }

    const restrictedCharacters = /[{}]/;
    const restrictedCharacters1 = /[\\]/;
    if (restrictedCharacters.test(event.key)) {
      this.showErrorMessage = true;
      this.toast.error('Please avoid using { and } brackets.');
      event.preventDefault();
    }
    else if (restrictedCharacters1.test(event.key)) {
      this.showErrorMessage = true;
      this.toast.error('Please avoid using backslash.');
      event.preventDefault();
    }
    else {
      this.showErrorMessage = false;
    }
  }

  restricttextSpace(event: any) {
    let inputValue: string = event.target.value;
    inputValue = inputValue.replace(/^\s+/, '');
    inputValue = inputValue.replace(/\s{2,}/g, ' ');
    event.target.value = inputValue;
  }
  prependHyphen(newTitle: string) {
    if (newTitle && !newTitle.startsWith(' ')) {
      this.contentTitle = '' + newTitle;
    }
  }
}

@Component({
  selector: 'app-saveas-box',
  templateUrl: './saveas-box.component.html',
  styleUrls: ['./doceditor.component.scss']
})

@Injectable()
//SaveDialog for Save Option
export class SaveasBoxComponent {

  //@Output() childEvent = new EventEmitter();
  @Output() childEvent: EventEmitter<any> = new EventEmitter<any>();

  @Input() documentId: any;
  @Input() myForm: any;
  @Input() documentname: any;
  mydForm: any;
  submitted = false;
  successModel: boolean = false;
  saveasModal: boolean = false;
  successGrpName: any;
  @Input() documents: any[] = [];
  doco: any;
  title: any;
  @Input() saveData = true;

  constructor(
    public dialogRef: MatDialogRef<SaveasBoxComponent>, @Inject(MAT_DIALOG_DATA) public data: { documentname: string, documentId: any },
    private httpservice: HttpService, private confirmationDialogService: ConfirmationDialogService, private toast: ToastrService, private router: Router, public sanitizer: DomSanitizer, private fb: FormBuilder) {
    this.documentname = data.documentname
    //this.documentId = data.documentId
  }

  ngOnInit() {
    this.mydForm = this.fb.group({
      documentname: ['', Validators.required],
    });
    //this.getDocumentCall();
  }

  getDocumentCall() {
    //Get all Document
    this.httpservice.sendGetLatexDoc(URLUtils.getDocument).subscribe(
      (res: any) => {
        this.documents = res;
        //this.documents = res[0].documentname;
      }
    );
  }

  downloadDoc() {
    this.submitted = true;
    this.saveasModal = true;

    //if (this.mydForm.valid && this.documentId) {
    const reqq = { "documentname": this.mydForm.value.documentname };
    this.httpservice.sendPostLatexRequest(URLUtils.downloadDoc(this.documentId), reqq).subscribe(
      (res: any) => {
        this.successGrpName = this.mydForm.value.documentname;
        this.dialogRef.close({ "docid": res.id, "documentname": this.mydForm.value.documentname });
        //console.log('name:',this.documentname)
        if (!res.error) {
          this.confirmationDialogService.confirm('Success', 'Congratulations! New version was created successfully', true, 'View Document', 'Create Document', true, undefined).then((confirmed) => {
            if (confirmed) {
              window.location.reload()
              //this.getDocumentCall();
              this.router.navigate(['/viewdoc']);
            }
            else
              window.location.reload();
          })
        }
      },
    );
  }

  closeDialog() {
    this.dialogRef.close()
  }
}
