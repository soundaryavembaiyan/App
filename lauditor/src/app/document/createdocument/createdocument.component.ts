import { Component, Inject, Injectable, Input, Output, OnInit, EventEmitter, ViewChild, ElementRef, Renderer2, AfterViewInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ModalService } from 'src/app/model/model.service';
import { HttpService } from 'src/app/services/http.service';
import { URLUtils } from 'src/app/urlUtils';
import { DocumentService } from '../document.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';


@Component({
  selector: 'app-createdocument',
  templateUrl: './createdocument.component.html',
  styleUrls: ['./createdocument.component.scss']
})

@Injectable()
export class CreateDocumentComponent {

  @ViewChild('content', { static: false })
  content!: ElementRef;
  @ViewChild('pdfContent') pdfContent!: ElementRef;

  product = environment.product;
  myForm: any;
  isDisabled: boolean = true;

  documentname: any;

  overview: any;
  overviewTitle: any;
  isOverview: boolean = false;
  overviewDialog: boolean = true;

  section: any;
  sectionTitle: any;
  isSection: boolean = false;
  sectionDialog: boolean = true;

  subsection: any;
  subsectionTitle: any;
  issubSection: boolean = false;
  subsectionDialog: boolean = true;

  subsubsection: any;
  subsubsectionTitle: any;
  issubsubSection: boolean = false;
  subsubsectionDialog: boolean = true;

  paragraph: any;
  paragraphTitle: any;
  isParagraph: boolean = false;
  paragraphDialog: boolean = true;

  orderlist: any;
  orderlistTitle: any;
  isOrderlist: boolean = false;
  orderlistDialog: boolean = true;

  unorderlist: any;
  unorderlistTitle: any;
  isunOrderlist: boolean = false;
  unorderlistDialog: boolean = true;

  //orderListItems: string[] = [''];
  orderListItems: any;
  unorderListItems: any;

  isPageBreak: boolean = false;
  pdfURL: any;
  pdfSrc: any;
  //title: any;
  documentId: any;
  documentIdx: any;

  constructor(private router: Router, private fb: FormBuilder, private httpservice: HttpService,
    private toast: ToastrService, private documentService: DocumentService,
    private renderer: Renderer2, private modalService: ModalService,
    public sanitizer: DomSanitizer, public dialog: MatDialog) {

  }

  ngOnInit() {
    this.myForm = this.fb.group({

      title: ['', Validators.required],
      author: ['', Validators.required],

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
    // this.httpservice.sendGetLatexDoc(URLUtils.getDocument).subscribe(
    //   (res: any) => {
       
    //     console.log('openRes:', res);
    //   }
    // );

  }

  // updateTitle(newTitle: string) {
  //   this.taskTitle = newTitle;
  //   console.log('taskTitle', this.taskTitle)
  // }

  newDoc() {
    this.myForm.reset();
    this.isOverview = false;
    this.isSection = false;
    this.issubSection = false;
    this.issubsubSection = false;
    this.isParagraph = false;
    this.isOrderlist = false;
    this.isunOrderlist = false;
    this.isPageBreak = true;
    this.router.navigate(['/documents/create/client']);
  }

  onSubmit() {
    console.log('Form controls', this.myForm.value);
  }

  // saveDoc() {
  //   const formValues = this.myForm.value;
  //   console.log('Form values:', formValues);

  //   //Form data controls
  //   const payload = {
  //   title : this.myForm.value.title,
  //   author : this.myForm.value.author,

  //   overview: this.myForm.value.overview,
  //   overviewTitle: this.myForm.value.overviewTitle,

  //   section: this.myForm.value.section,
  //   sectionTitle: this.myForm.value.sectionTitle,

  //   subsection: this.myForm.value.subsection,
  //   subsectionTitle: this.myForm.value.subsectionTitle,

  //   subsubsection: this.myForm.value.subsubsection,
  //   subsubsectionTitle: this.myForm.value.subsubsectionTitle,

  //   paragraph: this.myForm.value.paragraph,
  //   paragraphTitle: this.myForm.value.paragraphTitle,

  //   // orderlist: this.myForm.value.orderlist,
  //   // orderlistTitle: this.myForm.value.orderlistTitle,
  //   orderListItems: this.myForm.value.orderListItems,

  //   // unorderlist: this.myForm.value.unorderlist,
  //   // unorderlistTitle: this.myForm.value.unorderlistTitle,
  //   unorderListItems: this.myForm.value.unorderListItems,
  //   }
  //   console.log('PayloadForm Values:', payload);

  //   //FIRST API
  //   let req = { "documentname": this.myForm.value.title };
  //   this.httpservice.sendPostLatexRequest(URLUtils.savedoc, req).subscribe(
  //     (res: any) => {
  //       //console.log('firstAPI call:', res);
  //       const documentId = res.id;
  //       console.log('DocID:', documentId);
  //    //SECOND API
  //    let reqq = { "document": "document", "page": 1 };
  //    this.httpservice.sendPostLatexRequest(URLUtils.savedocID(documentId), reqq).subscribe(
  //         (ress: any) => {
  //           //console.log('secondAPI call:', ress);
  //         },
  //         (error: any) => {
  //           //console.error('If Error 1:', error);
  //         }
  //       );
  //     }
  //   );
  // }

  saveDoc() {
    const formValues = this.myForm.value;
    console.log('Form values:', formValues);

    //Form data controls
    const payload = {
      title: this.myForm.value.title,
      author: this.myForm.value.author,

      overview: this.myForm.value.overview,
      overviewTitle: this.myForm.value.overviewTitle,

      section: this.myForm.value.section,
      sectionTitle: this.myForm.value.sectionTitle,

      subsection: this.myForm.value.subsection,
      subsectionTitle: this.myForm.value.subsectionTitle,

      subsubsection: this.myForm.value.subsubsection,
      subsubsectionTitle: this.myForm.value.subsubsectionTitle,

      paragraph: this.myForm.value.paragraph,
      paragraphTitle: this.myForm.value.paragraphTitle,

      orderListItems: this.myForm.value.orderListItems,
      unorderListItems: this.myForm.value.unorderListItems,
    }
    console.log('PayloadForm Values:', payload);

    if (this.documentId == null) {
      let req = { "documentname": this.myForm.value.title };
      //FIRST API
      this.httpservice.sendPostLatexRequest(URLUtils.savedoc, req).subscribe(
        (res: any) => {
          const documentId = res.id;
          //console.log('DocID:', documentId);
          this.documentId = documentId;
          this.docidSave(documentId); //secondAPI methodcall
        },
        (error: any) => {
          // console.error('If Error 1:', error);
        }
      );
     }
     else {
      let title = this.myForm.value.title;
      let author = this.myForm.value.author;
      let currentDate = new Date().toDateString();
      let overview = this.myForm.value.overview || '';
      let overviewTitle = this.myForm.value.overviewTitle || '';
      let section = this.myForm.value.section || '';
      let sectionTitle = this.myForm.value.sectionTitle || '';
      let subsection = this.myForm.value.subsection || '';
      let subsectionTitle = this.myForm.value.subsectionTitle || '';
      let subsubsection = this.myForm.value.subsubsection || '';
      let subsubsectionTitle = this.myForm.value.subsubsectionTitle || '';
      let paragraph = this.myForm.value.paragraph || '';
      let paragraphTitle = this.myForm.value.paragraphTitle || '';
      let orderListItems = this.myForm.value.orderListItems;
      let unorderListItems = this.myForm.value.unorderListItems;
      let orderedList = orderListItems.map((item: any) => `\\item ${item.orderlist}`) || '';
      let unorderedList = unorderListItems.map((item: any) => `\\item ${item.unorderlist}`).join('\n');

      let latexDocument = `
    \\documentclass{article}
    \\usepackage{geometry}
    \\geometry{a4paper,total={170mm,257mm},left=20mm,top=20mm}
    
    \\title{${title}}
    \\author{${author}}
    \\date{${currentDate}}
    
    \\begin{document}
    \\maketitle
  
    \\begin{abstract}
    \\end{abstract}
    
    \\section*{${overviewTitle}}${overview}
    \\section*{${sectionTitle}}${section}
    \\subsection*{${subsectionTitle}}${subsection}
    \\subsubsection*{${subsubsectionTitle}}${subsubsection}
    \\paragraph*{${paragraphTitle}}${paragraph}
    
    \\begin{enumerate}
        ${orderedList} 
    \\end{enumerate}
  
    \\begin{itemize}
        ${unorderedList}
    \\end{itemize}
    
    \\end{document}`;
      let reqq = {
        "document": latexDocument,
        "page": 1
      };

      this.httpservice.sendPostLatexRequest(URLUtils.savedocID(this.documentId), reqq).subscribe(
        (res: any) => {
          const documentId = res.id;
          //this.documentIdx = documentId;
          this.docidUpdate(documentId); //thirdAPI methodcall
        }
      );
    }
  }

  //ID FROM DOCUMENT CREATION 
  docidSave(documentId: string) {
    let title = this.myForm.value.title;
    let author = this.myForm.value.author;
    let currentDate = new Date().toDateString();
    let overview = this.myForm.value.overview || '';
    let overviewTitle = this.myForm.value.overviewTitle || '';
    let section = this.myForm.value.section || '';
    let sectionTitle = this.myForm.value.sectionTitle || '';
    let subsection = this.myForm.value.subsection || '';
    let subsectionTitle = this.myForm.value.subsectionTitle || '';
    let subsubsection = this.myForm.value.subsubsection || '';
    let subsubsectionTitle = this.myForm.value.subsubsectionTitle || '';
    let paragraph = this.myForm.value.paragraph || '';
    let paragraphTitle = this.myForm.value.paragraphTitle || '';
    let orderListItems = this.myForm.value.orderListItems;
    let unorderListItems = this.myForm.value.unorderListItems;

    let orderedList = orderListItems.map((item: any) => `\\item ${item.orderlist}`) || '';
    let unorderedList = unorderListItems.map((item: any) => `\\item ${item.unorderlist}`).join('\n');
    // console.log('orderListItems:', orderListItems);
    // console.log('unorderListItems:', unorderListItems);

    let latexDocument = `
  \\documentclass{article}
  \\usepackage{geometry}
  \\geometry{a4paper,total={170mm,257mm},left=20mm,top=20mm}
  
  \\title{${title}}
  \\author{${author}}
  \\date{${currentDate}}
  
  \\begin{document}
  \\maketitle

  \\begin{abstract}
  \\end{abstract}
  
  \\section*{${overviewTitle}}${overview}
  \\section*{${sectionTitle}}${section}
  \\subsection*{${subsectionTitle}}${subsection}
  \\subsubsection*{${subsubsectionTitle}}${subsubsection}
  \\paragraph*{${paragraphTitle}}${paragraph}
  
  \\begin{enumerate}
      ${orderedList} 
  \\end{enumerate}

  \\begin{itemize}
      ${unorderedList}
  \\end{itemize}
  
  \\end{document}`;

    let reqq = {
      "document": latexDocument,
      "page": 1
    };

    //SECONDAPI 
    this.httpservice.sendPostLatexRequest(URLUtils.savedocID(documentId), reqq).subscribe(
      (ress: any) => {
        this.toast.success(ress.message)
        //this.toast.success("Document created successfully!")
      },
      (error: any) => {
      }
    );
  }

  //ID FROM ADDED DOCUMENT
  docidUpdate(documentId: string) {
    let title = this.myForm.value.title;
    let author = this.myForm.value.author;
    let currentDate = new Date().toDateString();
    let overview = this.myForm.value.overview || '';
    let overviewTitle = this.myForm.value.overviewTitle || '';
    let section = this.myForm.value.section || '';
    let sectionTitle = this.myForm.value.sectionTitle || '';
    let subsection = this.myForm.value.subsection || '';
    let subsectionTitle = this.myForm.value.subsectionTitle || '';
    let subsubsection = this.myForm.value.subsubsection || '';
    let subsubsectionTitle = this.myForm.value.subsubsectionTitle || '';
    let paragraph = this.myForm.value.paragraph || '';
    let paragraphTitle = this.myForm.value.paragraphTitle || '';
    let orderListItems = this.myForm.value.orderListItems;
    let unorderListItems = this.myForm.value.unorderListItems;

    let orderedList = orderListItems.map((item: any) => `\\item ${item.orderlist}`) || '';
    let unorderedList = unorderListItems.map((item: any) => `\\item ${item.unorderlist}`).join('\n');

    let latexDocument = `
  \\documentclass{article}
  \\usepackage{geometry}
  \\geometry{a4paper,total={170mm,257mm},left=20mm,top=20mm}
  
  \\title{${title}}
  \\author{${author}}
  \\date{${currentDate}}
  
  \\begin{document}
  \\maketitle

  \\begin{abstract}
  \\end{abstract}
  
  \\section*{${overviewTitle}}${overview}
  \\section*{${sectionTitle}}${section}
  \\subsection*{${subsectionTitle}}${subsection}
  \\subsubsection*{${subsubsectionTitle}}${subsubsection}
  \\paragraph*{${paragraphTitle}}${paragraph}
  
  \\begin{enumerate}
      ${orderedList} 
  \\end{enumerate}

  \\begin{itemize}
      ${unorderedList}
  \\end{itemize}
  
  \\end{document}`;

    let reqq = {
      "document": latexDocument,
      "page": 1
    };

    //THIRDAPI
    this.httpservice.sendPatchLatexRequest(URLUtils.updateDoc(documentId), reqq).subscribe(
      (ress: any) => {
        console.log('ressof3:',ress);
        this.toast.success(ress.message)
        //this.toast.success("Document updated successfully!")
      },
      (error: any) => {
      }
    );
  }

  getPreview() {
    //PREVIEW API
    console.log('pre',this.documentId)
    if (this.documentId == '' || this.documentId == null) {
      this.toast.error("Please create & save the document") //If user clicks the previewIcon directly.
    }
    else {
      this.httpservice.sendGetLatexPDFRequest(URLUtils.getPreview(this.documentId)).subscribe(
        (ress: any) => {
          const blob = new Blob([ress], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob); //Create a URL for the Blob
          this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        },
        (error: any) => {
          console.error('PreviewError:', error);
        }
      );
    }
  }

  uploadDoc() {

  }
  // downloadDoc() {
  //   let reqq ={ "documentname" : this.documentname }
  //   this.httpservice.sendPostLatexRequest(URLUtils.downloadDoc(this.documentId), reqq).subscribe(
  //     (res: any) => {
  //       const documentId = res.id;
  //       //this.documentIdx = documentId;
  //       this.docidSave(documentId); //thirdAPI methodcall
  //     }
  //   );
  // }

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

  //PAGE BREAK FUNCTION
  insertPageBreak() {
    if (this.content && this.content.nativeElement) {
      const pageBreak = this.renderer.createElement('div');
      this.renderer.addClass(pageBreak, 'page-break');

      // visual representation of the page break
      this.renderer.setStyle(pageBreak, 'page-break-before', 'always');
      this.renderer.setStyle(pageBreak, 'border-top', '1px dashed #000');
      this.renderer.setStyle(pageBreak, 'margin-top', '20px'); // Adjust as needed

      this.renderer.appendChild(this.content.nativeElement, pageBreak);
    }
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

  orderlistOn() {
    this.isOrderlist = true
  }

  unorderlistOn() {
    this.isunOrderlist = true
  }

  //Dialog boxes!!!
  openDocumentDialog() {
    const dialogRef = this.dialog.open(OpendialogBoxComponent, {
      width: '600px',
      height: '330px',
      data: {
        // overview: this.overview,
        // overviewTitle: this.overviewTitle
      }
    });

    dialogRef.afterClosed().subscribe((result: { overview: string, overviewTitle: string }) => {
      if (result) {
        // this.overview = result.overview;
        // this.overviewTitle = result.overviewTitle;
      }
    });
  }

  downloadDialog() {
    const dialogRef = this.dialog.open(DownloadBoxComponent, {
      width: '500px',
      height: '200px',
      data: {
        // overview: this.overview,
        // overviewTitle: this.overviewTitle
      }
    });

    dialogRef.afterClosed().subscribe((result: {  }) => {
      if (result) {
        // this.overview = result.overview;
        // this.overviewTitle = result.overviewTitle;
      }
    });
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

  openOrderlistDialog() {
    this.orderlistDialog = true;
    const dialogRef = this.dialog.open(OrderedlistBoxComponent, {
      width: '700px',
      height: '500px',
      data: {
        orderlist: this.orderlist,
        orderlistTitle: this.orderlistTitle,
        orderListItems: this.orderListItems
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
        unorderListItems: this.unorderListItems
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

  // hypenUpdate(newTitle: string) {
  //   if (newTitle && !newTitle.startsWith(' ')) {
  //     this.overviewTitle = '' + newTitle;
  //     this.sectionTitle = '' + newTitle;
  //   } else {
  //     this.overviewTitle = newTitle;
  //   }
  // }

}



@Component({
  selector: 'app-dialog-box',
  templateUrl: './dialog-box.component.html',
  styleUrls: ['./createdocument.component.scss'],
})

@Injectable()
export class DialogBoxComponent {
  dialog: any;
  name: any;
  overviewForm: any;

  overview: any;
  overviewTitle: any;
  isOverview: boolean = false;
  overviewDialog: boolean = true;

  //@Output() oversubmitted = new EventEmitter();

  constructor(
    public dialogRef: MatDialogRef<DialogBoxComponent>, @Inject(MAT_DIALOG_DATA) public data: { overview: string, overviewTitle: string },
    private fb: FormBuilder) {
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

  save() {
    // this.data.push({ data: this.overview });
    // this.dialogRef.close({data:this.overview});
    // this.overview = this.overview
    // console.log('saveData',this.data)
    // console.log('saveData1',this.data[1])
    // console.log('overview',this.overview)
    //this.dialogRef.close(this.overview);

    //for Hypen
    // if (this.overviewTitle && !this.overviewTitle.startsWith('-')) {
    //   this.overviewTitle = '- ' + this.overviewTitle;
    // }
    const data = {
      overview: this.overview,
      overviewTitle: this.overviewTitle
    };
    console.log('overview', this.overview)
    console.log('overviewTitle', this.overviewTitle)
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
})

@Injectable()
export class SectionBoxComponent {
  dialog: any;
  name: any;
  sectionForm: any

  section: any;
  sectionTitle: any;
  isSection: boolean = false;
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

  save() {
    //for Hypen
    // if (this.sectionTitle && !this.sectionTitle.startsWith('-')) {
    //   this.sectionTitle = '- ' + this.sectionTitle;
    // }
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
})

@Injectable()
export class SubSection1BoxComponent {
  dialog: any;
  name: any;
  subsectionForm: any;

  subsection: any;
  subsectionTitle: any;
  issubSection: boolean = false;
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

  save() {
    //for Hypen
    // if (this.subsectionTitle && !this.subsectionTitle.startsWith('-')) {
    //   this.subsectionTitle = '- ' + this.subsectionTitle;
    // }
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
})

@Injectable()
export class SubSection2BoxComponent {
  dialog: any;
  name: any;
  subsubsectionForm: any;

  subsubsection: any;
  subsubsectionTitle: any;
  issubsubSection: boolean = false;
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

  save() {
    //for Hypen
    // if (this.subsubsectionTitle && !this.subsubsectionTitle.startsWith('-')) {
    //   this.subsubsectionTitle = '- ' + this.subsubsectionTitle;
    // }
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
})

@Injectable()
export class ParagraphBoxComponent {
  dialog: any;
  name: any;
  paragraphForm: any;

  paragraph: any;
  paragraphTitle: any;
  isParagraph: boolean = false;
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

  save() {
    //for Hypen
    // if (this.paragraphTitle && !this.paragraphTitle.startsWith('-')) {
    //   this.paragraphTitle = '- ' + this.paragraphTitle;
    // }
    const data = {
      paragraph: this.paragraph,
      paragraphTitle: this.paragraphTitle
    };
    this.dialogRef.close(data);
    console.log('paraData',data)
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
})

@Injectable()
export class OrderedlistBoxComponent {
  dialog: any;
  name: any;
  orderlistForm: any;

  orderlist: any;
  orderlistTitle: any;
  isOrderlist: boolean = false;
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


  save() {
    //for Hypen
    // if (this.orderlistTitle && !this.orderlistTitle.startsWith('-')) {
    //   this.orderlistTitle = '- ' + this.orderlistTitle;
    // }

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
})

@Injectable()
export class UnorderedlistBoxComponent {
  dialog: any;
  name: any;
  unorderlistForm: any;

  unorderlist: any;
  unorderlistTitle: any;
  isunOrderlist: boolean = false;
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


  save() {
    //for Hypen
    // if (this.unorderlistTitle && !this.unorderlistTitle.startsWith('-')) {
    //   this.unorderlistTitle = '- ' + this.unorderlistTitle;
    // }

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


@Component({
  selector: 'app-opendialog-box',
  templateUrl: './opendialog-box.component.html',
  styleUrls: ['./createdocument.component.scss'],
})

@Injectable()
export class OpendialogBoxComponent {
  dialog: any;
  name: any;

  documents: any []=[];
  pdfSrc:any;
  documentId: any;
  documento: any;

  constructor(
    public dialogRef: MatDialogRef<OpendialogBoxComponent>, @Inject(MAT_DIALOG_DATA) public data: { overview: string, overviewTitle: string },
    private httpservice: HttpService, private toast: ToastrService, public sanitizer: DomSanitizer, private fb: FormBuilder) {
    // //this.overview = data[0];
    // this.overview = data.overview;
    // this.overviewTitle = data.overviewTitle
  }

  ngOnInit() {

    this.httpservice.sendGetLatexDoc(URLUtils.getDocument).subscribe(
      (res: any) => {
       this.documents = res;
       console.log('openDRes:', res);
      },
      (error: any) => {
        console.error('PreviewError:', error);
      }
    );

  }

  openFile() {
    //Get OpenAPI 
    this.httpservice.sendGetLatexDoc(URLUtils.getDocument).subscribe(
      (res: any) => {
        this.documents = res;
        console.log('openDRes:', res);
        console.log('documentId:', res.docid);

        const documentId = res.docid;
        console.log('openDocID:', documentId);
        this.documentId = documentId;
        this.docidSave(documentId);
      },
      (error: any) => {
        console.error('PreviewError:', error);
      }
    );
  }

  //ID FROM OPEN DOCUMENT
  docidSave(documentId: string) {
    //Get OpenFileAPI 
    this.httpservice.sendGetLatexRequest(URLUtils.opendocID(documentId)).subscribe(
      (ress: any) => {
        console.log('resssss:', ress);
        //this.toast.success("Document created successfully!")
      },
      (error: any) => {
        console.error('If Error 1:', error);
      }
    );
  }

  closeDialog() {
    this.dialogRef.close()
  }
}

@Component({
  selector: 'app-download-box',
  templateUrl: './download-box.component.html',
  styleUrls: ['./createdocument.component.scss'],
})

@Injectable()
export class DownloadBoxComponent {

  documentId: any;
  documentname: any;
  myForm:any;

  constructor(
    public dialogRef: MatDialogRef<DownloadBoxComponent>, @Inject(MAT_DIALOG_DATA) public data: { },
    private httpservice: HttpService, private toast: ToastrService, public sanitizer: DomSanitizer, private fb: FormBuilder) {

  }

  ngOnInit() {
    // this.httpservice.sendGetLatexDoc(URLUtils.getDocument).subscribe(
    //   (res: any) => {
    //    this.documents = res;
    //    console.log('openDRes:', res);
    //   },
    //   (error: any) => {
    //     console.error('PreviewError:', error);
    //   }
    // );
  }

  downloadDoc() {
    let req = { "documentname": "documentname" };
    //FIRST API
    this.httpservice.sendPostLatexRequest(URLUtils.savedoc, req).subscribe(
      (res: any) => {
        const documentId = res.id;
        console.log('DocID:', documentId);
        this.documentId = documentId;
        //Download docAPI
        let reqq ={ "documentname" : this.myForm.value.documentname }
        console.log('reqq:', reqq);
        this.httpservice.sendPostLatexRequest(URLUtils.downloadDoc(this.documentId), reqq).subscribe(
          (res: any) => {
            console.log('Dres:', res);
            this.toast.success(res.message)
          }
        );
      }
    );
  }

  closeDialog() {
    this.dialogRef.close()
  }
}
