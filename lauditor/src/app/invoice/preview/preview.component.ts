import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { URLUtils } from 'src/app/urlUtils';
import { HttpService } from 'src/app/services/http.service';
import { EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { ModalService } from 'src/app/model/model.service';


@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})

export class PreviewComponent {

  @Input() invid:any;
  @Input() id:any;

  selectedValue: string = "view";
  isDisplay: boolean = true;
  isCreate: boolean = true;  //false
  bsValue = new Date();
  showTime = true;
  uploadDocs: any = [];
  files: File[] = [];
  fileName: File[] = [];
  descriptionForm: any;
  createinvoiceForm: any;
  invoiceForm: any;
  submitted = false;
  myForm: any;
  data: any;
  keyword = 'name';
  filter: any = "client";

  invoiceItems: any[] = [
    { description: '', no_of_units: '1', unit_price: '0', amount: '0' }
  ];


  invoice_items: any;
  calculationForm: any;
  items: any;
  matterList: any;
  groupId: any = [];
  clientId: any = [];
  relationshipSubscribe: any;
  //args:any;

  namePattern = /^[a-zA-Z\s]*$/;
  invoice: any;
  inTax: any;
  inItems: any =[];
  successModel: boolean = false;


  @ViewChild('fileInput')
  imageUrl: any = "assets/img/logo.png";
  inDis: any;
  logo: any;
  imageToShow:any;
  invoice_id:any;
  profile: any;
  dialogClosed: any;
  invoicelist: any;
  defaultDis = 'DISCOUNT';
  defaultTax = 'TAX';

  constructor(private router: Router, private modalService: ModalService, private fb: FormBuilder, private httpservice: HttpService,
    private toast: ToastrService, private cd: ChangeDetectorRef,private route: ActivatedRoute) { }


  ngOnInit() {
    this.route.params.subscribe( params => this.invoice_id = params['id'] );
    this.createinvoiceForm = this.fb.group({
      name: [''],
      billto: [''],
      date: [''],
      duedate: [''],
      invoice_items: this.fb.array([
        this.createInvoiceItem()
      ]),
      notes:[''],
      tax: [''],
      tax_type: [''],
      discount: [''],
      discount_type: [''],
      
    })  

    this.getLogo();
    this.getPreview();
    this.getProfile();

      }

  getProfile(){
    this.httpservice.sendGetRequest(URLUtils.profile).subscribe(
      (res: any) => {
        if (res.error == false) {
          this.profile = res.data?.details;
        }
      })
  }

  getPreview() {
    this.httpservice.sendGetRequest(URLUtils.InvoiceWithId(this.invoice_id)).subscribe(
      (res: any) => {
        if (res.error == false) {
          this.invoice = res?.invoice;
          this.inItems = res?.invoice?.items;
          this.inTax = res?.invoice?.tax_items[0];
          this.inDis = res?.invoice?.discounts[0];
        }
        //console.log('Inid',this.invoice.docid)  
       // console.log('Inid',this.invoice)  
      }
    )
  }

  getLogo(){
    this.httpservice.sendGetRequest(URLUtils.GetLogo).subscribe(
      (res: any) => {
        if (res.error == false) {
          this.imageToShow = res?.data?.url;
        } 
      }
    )
  }

  createInvoiceItem(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      no_of_units: ['', Validators.required],
      unit_price: ['', Validators.required]
    });
  }

  uploadFile(event: any) {
    let reader = new FileReader();
    let file = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      reader.readAsDataURL(file);

      // When file uploads set it to file formcontrol
      reader.onload = () => {
        this.imageUrl = reader.result;
        this.descriptionForm.patchValue({
          file: reader.result
        });
      }
      // ChangeDetectorRef since file is loading outside the zone
      this.cd.markForCheck();
    }
  }

  selectDuration(date: any) {
    this.bsValue = date;
    //console.log(this.bsValue);
  }

  isActive(value: string) {
    this.selectedValue = value;
    this.selectedValue == 'create' ? this.router.navigate(['/createinvoice']) : this.router.navigate(['/invoice']);
  }

  hideAndShow() {
    this.isDisplay = !this.isDisplay;
  }
  
  calculateAmount(item: any): number {
    const no_of_units = item.no_of_units;
    const unit_price = item.unit_price;
    return no_of_units * unit_price;
  }
  
  calculateTotalAmount(): number {
    let totalAmount = 0;
    for (let i = 0; i < this.inItems.length; i++) {
      totalAmount += this.calculateAmount(this.inItems[i]);
    }
    return totalAmount;
  }
  
  calculateTotalAmountWithOthers(): number {
    let totalAmount = 0;
    const taxPercentage = this.inTax?.tax || 0;
    const discountPercentage = this.inDis?.discount || 0;
  
    for (let i = 0; i < this.inItems.length; i++) {
      totalAmount += this.calculateAmount(this.inItems[i]);
    }
  
    let amountAfterDiscount = totalAmount;
    if (discountPercentage > 0) {
      const discountAmount = (totalAmount * discountPercentage) / 100;
      amountAfterDiscount -= discountAmount;
    }
  
    const taxAmount = (amountAfterDiscount * taxPercentage) / 100;
    const amountAfterTax = amountAfterDiscount + taxAmount;
  
    return amountAfterTax;
  }
  

  onSub(){
    this.successModel = true
    //console.log('success',this.successModel)
  }

  btnclose(){
    this.successModel = false
  }

  downloadDoc(doc: any) {
    //console.log('Docid', this.invoice.docid)
    //console.log('Doc', doc)
    //debugger
    this.httpservice.sendGetRequest(URLUtils.downloadInvoiceDocument(doc)).subscribe((res: any) => {
      if (res.error == false) {
        this.modalService.open('doc-download-success');
        //console.log("url " + JSON.stringify(res));
        window.open(res?.data?.url, "_blank");
      }
      else if(res.error == true){
        this.toast.error(res.msg)
      }
    });
  }
  closeModal(id: string) {
    this.modalService.close(id);
}
}