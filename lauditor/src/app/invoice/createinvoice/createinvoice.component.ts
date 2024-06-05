import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { URLUtils } from 'src/app/urlUtils';
import { HttpService } from 'src/app/services/http.service';
import { EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-createinvoice',
  templateUrl: './createinvoice.component.html',
  styleUrls: ['./createinvoice.component.scss']
})
export class CreateinvoiceComponent {

  selectedValue: string = "create";
  // @ViewChild('mtTab') mtTab: any;

  isDisplay: boolean = true;
  isCreate: boolean = true;  //false
  showTime = true;
  uploadDocs: any = [];
  files: any;
  fileName: File[] = [];
  descriptionForm: any;
  createinvoiceForm: any;
  invoiceForm: any;
  submitted = false;
  myForm: any;
  data: any;
  keyword = 'name';
  filter: any = "client";
  file:any;

  invoiceItems: any[] = [
    { description: '', quantity: '1', unitPrice: '0', amount: '0' }
  ];

  fileSizeExceeded: boolean = false;
  multipleFiles: boolean = false;

  invoice_items: any;
  calculationForm: any;
  items: any;
  matterList: any;
  groupId: any = [];
  clientId: any = [];
  relationshipSubscribe: any;
  billto: any;
  logoerr = false;
  disabled = false;

  namePattern = /^[a-zA-Z\s]*$/;
  defaultValue: any;

  uploadedFile: any;
  pipe = new DatePipe('en-US');

  @ViewChild('fileInput')
  imageUrl: any = "assets/img/logo.png";

  public sno: any;
  public description: any;
  public unitPrice: any;
  public quantity: any;
  public amount: any;
  public rows: Array<{ sno: number, description: any, unitPrice: number, quantity: number, amount: any }> = [];
  id: any;
  invoice_items_len: any;
  clients: any = [];

  @Input() min: any;
  @Input() max: any;

  today = new Date().toJSON().split('T')[0]
  yesterday = new Date();
  todayDate: Date = new Date();
  isReadOnly: boolean = true;
  imageToShow:any;
  imgDisplay: boolean = false;
  imgGet: boolean = true;
  ig: boolean = true;
  imageTo: any;
  myNumber: any;
  value: any;
  errorMessage: string = '';
  readonly NoWhitespaceRegExp: RegExp = new RegExp("\\S");
  // bsValue = new Date();
  bsValue:any;
  myDateValue:any;
  minDate:any;
  maxDate:any;
  shown = false;

  constructor(
    private router: Router, 
    private fb: FormBuilder, 
    private httpservice: HttpService,
    private toast: ToastrService, 
    private cd: ChangeDetectorRef
    ) { }

  ngOnInit() {

    this.getClients();
    this.getLogo();

    this.bsValue = new Date();
    //console.log('mydate',this.bsValue);
    // this.myDateValue = new Date();
    // console.log('mydate',this.myDateValue);
    //Date validation
    //this.yesterday.setDate(this.yesterday.getDate() - 0);

    this.createinvoiceForm = this.fb.group({
      name: ['', [Validators.required]],
      billto: ['', [Validators.required]],
      //Disabling the Duedate
      date: [new Date(), Validators.required],
      //duedate: [{ value: '', disabled: true }, Validators.required],
      duedate: ['', Validators.required],
      invoice_items: this.fb.array([
        this.createInvoiceItem()
      ], [Validators.required]),
      notes: [''],
      //tax: ['', [ Validators.maxLength(5), Validators.max(100), Validators.pattern(/^[0-9]+(\.[0-9]{1,2})?%?$/), Validators.min(0)]],
      tax: ['', [Validators.maxLength(5), Validators.max(100), Validators.min(0),Validators.pattern(/^[0-9]+(\.[0-9]{1,2})?%?$/)]],
      tax_type: ['Tax'],
      //discount: ['', [ Validators.maxLength(4), Validators.max(100), Validators.pattern(/^[0-9]+(\.[0-9]{1,2})?%?$/), Validators.min(0)]],
      discount: ['', [Validators.maxLength(5), Validators.max(100), Validators.pattern(/^[0-9]+(\.[0-9]{1,2})?%?$/), Validators.min(0)]],
      discount_type: ['Discount'], //Validators.required
    })

    // console.log('Form',this.createinvoiceForm)
    // console.log('inForm',this.createInvoiceItem())
    // console.log('inItem',this.invoice_items)

    //Invoice date validation
    this.createinvoiceForm.get('date').valueChanges.subscribe((value: any) => {
      this.updateDueDate(value);
    });
  }
  
  getLogo(){
    this.httpservice.sendGetRequest(URLUtils.GetLogo).subscribe(
      (res: any) => {
        if (res.error == false) {
          this.imageToShow = res?.data?.url;
          //console.log('img',this.imageToShow)
        } 
      }
    )
  }

  noZeroStart(control: AbstractControl): { [key: string]: boolean } | null {
    const value = control.value;
    if (value && value.length > 0 && value[0] === '0') {
      return { 'noZeroStart': true };
    }
    return null;
  }

  createInvoiceItem(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      unitPrice: ['', [Validators.required, this.noZeroStart, Validators.pattern('^[0-9]*$'), Validators.minLength(1), Validators.maxLength(10)]],
      //unitPrice: ['', [Validators.required, this.noZeroStart, Validators.pattern('^[0-9]+$'), Validators.maxLength(10)]],
      quantity: ['', [Validators.required, this.noZeroStart, Validators.pattern('^[0-9]*$'), Validators.minLength(1), Validators.maxLength(10)]],
      //quantity: ['', [Validators.required, Validators.min(0), Validators.max(10000000000), Validators.pattern(/^[1-9][0-9]{0,9}$/)]],
      //unitPrice: ['', [Validators.required, Validators.min(0), Validators.max(10000000000), Validators.pattern(/^[1-9][0-9]{0,9}$/)]] //Validators.max(10), Validators.min(1), Validators.pattern(/[0-9]+(\.[0-9]{1,2})?$/)
    });
  }

  setValue(controlName: string, value: any) {
    //console.log(value)
    this.createinvoiceForm.get(controlName)?.setValue(value);
  }

  onSelectFile(event: any) {
    // this.imgDisplay = false;
    // this.imgGet = true;
    
    this.shown = true;
    this.imageUrl = ''

    const allowedTypes = ['image/jpeg', 'image/png','image/bmp'];
    const maxSize = 1 * 1024 * 1024; // 1MB in bytes
    const file = event.target.files[0];
    if (!allowedTypes.includes(file.type)) {
      // Invalid file type
      this.imageUrl = "assets/img/logo.png";
      this.imageToShow = this.imageUrl;
      this.imgDisplay = true
      this.imgGet = false
      this.errorMessage = 'Invalid image format. Only JPEG, JPG, PNG allowed';
      return;
    }
  
    if (file.size > maxSize) {
      // File size exceeds 1MB
      this.imageUrl = "assets/img/logo.png";
      this.imageToShow = this.imageUrl;
      // this.imgDisplay = true
      // this.imgGet = false
      this.errorMessage = 'Max file size should be less than 1 MB';
      return;
    }

    this.files = event.target.files[0];
    // console.log('File upload!',this.files)
    // console.log('File!',this.file)
    this.errorMessage = ''
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);// read file as data url
      reader.onload = (event) => {// called once readAsDataURL is completed
        this.imageToShow = event.target?.result;
        //console.log(this.imageToShow)
      }
    }
  }

//Disabling the  DueDate function!!
  updateDueDate(date: Date) {
    if (date) {
      const duedate = new Date(date);
      //duedate.setDate(duedate.getDate());
      this.createinvoiceForm.get('duedate').setValue();
      this.createinvoiceForm.get('duedate').enable();
    } else {
      this.createinvoiceForm.get('duedate').reset(); // Clear and disable duedate if no invoice date is selected
      this.createinvoiceForm.get('duedate').disable();
    }
  }

// Date functions!!!
  selectDuration() {
    const date = this.date.value;
    const duedate = this.duedate.value;

    if (date && date && duedate <= date) {
      this.date.setErrors({ 'invalidDuration': true });
    } 
    else if (date && date && duedate == date) {
      this.date.setErrors({ 'invalidEqual': true });
    } 
    else {
      this.date.setErrors(null);
    }
    //this.bsValue = date;
    this.cd.detectChanges();
    //console.log(this.bsValue);
    //console.log('todayDate',this.today);
  }

  selectDurationIn() {
    const date = this.date.value;
    const duedate = this.duedate.value;

    if (duedate && duedate && date >= duedate) {
      this.duedate.setErrors({ 'invalidDurationof': true });
    }
    else if (duedate && duedate && date == duedate) {
      this.duedate.setErrors({ 'invalidEqual': true });
    }
    else {
      this.duedate.setErrors(null);
    }
    //this.bsValue = date;
    this.cd.detectChanges();
    //console.log(this.bsValue);
  }

  selectClearIn() {
    const date = this.date.value;
    const duedate = this.duedate.value;

    if (date && date && duedate >= date) {
      this.duedate.setErrors({ 'invalidDurationof': true });
    } 
    else {
      this.duedate.setErrors(null);
    }
  }

  selectClearDue() {
    const date = this.date.value;
    const duedate = this.duedate.value;

    if (date && date && duedate <= date) {
      this.date.setErrors({ 'invalidDurationof': true });
    } else {
      this.date.setErrors(null);
    }
  }

  selectDur(date: any) {
    //this.bsValue = date;
    this.cd.detectChanges();
  }

  clearDueDateError() {
    this.createinvoiceForm.get('duedate').setErrors(null);
  }

  clearInDateError() {
    this.createinvoiceForm.get('date').setErrors(null);
  }

  get date() {
    return this.createinvoiceForm.get('date');
  }

  get duedate() {
    return this.createinvoiceForm.get('duedate');
  }

  isActive(value: string) {
    this.selectedValue = value;
    this.selectedValue == 'create' ? this.router.navigate(['/createinvoice']) : this.router.navigate(['/invoice']);
  }

  hideAndShow() {
    this.isDisplay = !this.isDisplay;
  }

  isInvoiceItemsInvalid(): boolean {
    const invoiceItems = this.createinvoiceForm.get('invoice_items') as FormArray;

    for (let i = 0; i < invoiceItems.length; i++) {
      const item = invoiceItems.at(i) as FormGroup;
      const name = item.get('name')?.value;
      const quantity = item.get('quantity')?.value;
      const unitPrice = item.get('unitPrice')?.value;

      if (!name || !quantity || !unitPrice || unitPrice.startsWith('0') || quantity.startsWith('0')) {
        return true;
      }
    }
    return false;
  }

  onSubmit() {

    this.submitted = true;
    //console.log('ErrorMsg',this.errorMessage)
    if (!this.createinvoiceForm.value.date){
      //console.log('date', this.date)
      return
    }

    if (!this.createinvoiceForm.value.duedate){
      //console.log('date', this.date)
      return
    }

    if (this.createinvoiceForm.value.tax == '') {
      this.setValue("tax", 0)
    }

    if (this.createinvoiceForm.value.discount == '') {
      this.setValue("discount", 0)
    }

     //console.log(this.createinvoiceForm)
    // console.log(this.duedate)

    if (this.createinvoiceForm.valid && !this.errorMessage && this.clients.length != 0) {
      this.disabled = true
      
      const payload = {
        name: this.createinvoiceForm.value.name,
        billto: this.createinvoiceForm.value.billto,
        notes: this.createinvoiceForm.value.notes,
        info: {
          //date: this.createinvoiceForm.value.date,
          //duedate: this.createinvoiceForm.value.duedate,
          date: this.pipe.transform(this.createinvoiceForm.value.date, 'yyyy-MM-dd'),
          duedate: this.pipe.transform(this.createinvoiceForm.value.duedate, 'yyyy-MM-dd'),
        },
        invoice_items: this.createinvoiceForm.value.invoice_items,
        tax_items: [{
          tax_type: this.createinvoiceForm.value.tax_type,
          amount: this.calculateTotalAmount(),
          tax: this.createinvoiceForm.value.tax
        }],
        discount: [{
          discount_type: this.createinvoiceForm.value.discount_type,
          amount: this.calculateTotalAmount(),
          discount: this.createinvoiceForm.value.discount
        }],
        client: this.clients
      };
      //console.log('payload', payload);
      //console.log('inForm',this.createInvoiceItem())
      //console.log('inItem',this.invoice_items)
      //console.log('this.createinvoiceForm.value.invoice_items', this.createinvoiceForm.value.invoice_items)

      //For save button without giving any items!!!
      // if(this.createinvoiceForm.value.invoice_items.length == 0){
      //   this.toast.error("Check Data")
      // }

      let fdata = new FormData();
      fdata.append('file', this.files)
      //console.log('file', this.files)
      //if(this.files.length != 0) {
      if (this.files) {
        this.httpservice.sendPostRequest(URLUtils.UploadLogo, fdata).subscribe((res: any) => {
          if (res.error == false) {
            //this.toast.success(res.msg)
            this.httpservice.sendPostRequest(URLUtils.Invoice, payload).subscribe((res: any) => {
              if (res.error == false) {
                this.toast.success(res.msg)
                this.id = res?.invid;
                this.router.navigate(['/invoice'])
              }
              else if (res.error == true) {
                this.toast.error(res.msg)
              }
            },
            (error: HttpErrorResponse) => {
              if (error.status === 401 || error.status === 403) {
                const errorMessage = error.error.msg || 'Unauthorized';
                this.toast.error(errorMessage);
                //console.log(error);
              }
            })
          }
        },
        (error: HttpErrorResponse) => {
          if (error.status === 401 || error.status === 403) {
            const errorMessage = error.error.msg || 'Unauthorized';
            this.toast.error(errorMessage);
            //console.log(error);
          }
        })
      }
      else {
        this.httpservice.sendPostRequest(URLUtils.Invoice, payload).subscribe((res: any) => {
          if (res.error == false) {
            this.toast.success(res.msg)
            this.id = res?.invid;
            this.router.navigate(['/invoice'])
          }
          else if (res.error == true) {
            this.toast.error(res.msg)
          }
        },
        (error: HttpErrorResponse) => {
          if (error.status === 401 || error.status === 403) {
            const errorMessage = error.error.msg || 'Unauthorized';
            this.toast.error(errorMessage);
            //console.log(error);
          }
        })
        // this.toast.error("File not Uploaded")
      } 
    }
  }

  calculateAmount(item: FormGroup): number {
    const quantity = item.get('quantity')?.value;
    const unitPrice = item.get('unitPrice')?.value;
    const totalAmount = quantity * unitPrice;
  
    // Round off to two decimal places
    const roundedAmount = Number(totalAmount.toFixed(2));
    return roundedAmount;
  }
  
  calculateTotalAmount(): number {
    const invoiceItems = this.createinvoiceForm.get('invoice_items') as FormArray;
    let totalAmount = 0;
  
    for (let i = 0; i < invoiceItems.length; i++) {
      const item = invoiceItems.at(i) as FormGroup;
      totalAmount += this.calculateAmount(item);
    }
  
    // Round off to two decimal places
    const roundedAmount = Number(totalAmount.toFixed(2));
    return roundedAmount;
  }
  
  calculateTotalAmountWithOthers(): number {
    const invoiceItems = this.createinvoiceForm.get('invoice_items') as FormArray;
    let totalAmount = 0;
    const taxPercentage = this.createinvoiceForm.get('tax').value;
    const discountPercentage = this.createinvoiceForm.get('discount').value;
  
    for (let i = 0; i < invoiceItems.length; i++) {
      const item = invoiceItems.at(i) as FormGroup;
      totalAmount += this.calculateAmount(item);
    }
  
    let amountAfterDiscount = totalAmount;
    if (discountPercentage) {
      const discountAmount = (totalAmount * discountPercentage) / 100;
      amountAfterDiscount -= discountAmount;
    }
  
    const taxAmount = (amountAfterDiscount * taxPercentage) / 100;
    const amountAfterTax = amountAfterDiscount + taxAmount;
  
    // Round off to two decimal places
    const roundedAmount = Number(amountAfterTax.toFixed(2));
    return roundedAmount;
  }

  addItem() {
    const invoiceItems = this.createinvoiceForm.get('invoice_items') as FormArray;
    invoiceItems.push(this.createInvoiceItem());
  }

  removeItem(index: number) {
    const invoiceItems = this.createinvoiceForm.get('invoice_items') as FormArray;
    invoiceItems.removeAt(index);
    //console.log('invoiceItems',invoiceItems)
    // if(invoiceItems.length == 0){
    //  this.toast.error('Add atleast add one Item!!')
    // }
  }

  selectEvent(item: any) {
    this.billto = item.address
    this.clients = []
    this.clients.push({ "id": item.id, "type": item.type })
    this.createinvoiceForm.get("name")?.setValue(item?.name);
     //console.log(this.clients)
    // console.log(this.billto)
     //console.log('iname',item?.name)
  }

  onChangeSearch(val: any) {
    if (val == undefined) {
      this.clients = [];
    }
  }

  onFocused(e: any) {
  }

  getClients() {
    this.relationshipSubscribe = this.httpservice.getFeaturesdata(URLUtils.getAllRelationship).subscribe((res: any) => {
      this.data = res?.data?.relationships;
      //console.log(this.data)
    });
  }

  get f() { return this.createinvoiceForm.controls; }

  removeImg() {
    // this.imageUrl = null; 
    this.shown = false;
    this.imageUrl = "assets/img/logo.png";
    this.errorMessage = ''
    this.files = ''
    //this.imageToShow = this.imageUrl;
    // this.imgDisplay = true
    // this.imgGet = false
    //this.errorMessage = this.imageToShow
    //this.files = ''

    // console.log('imgtoshow',this.imageToShow)
    // console.log('imgdisp',this.imgDisplay)
    // console.log('imgget',this.imgGet)
    // console.log('error',this.errorMessage)

  }
  
  onInput(event: Event) {
    // const inputElement = event.target as HTMLInputElement;
    // if (!inputElement.value.match(/^(?!0$)\d+(\.\d{0,2})?$/)) {
    //   inputElement.value = '';
    // }
   const inputwholeElement = event.target as HTMLInputElement;
   if (!inputwholeElement.value.match(/^[1-9][0-9]{0,9}$/)) {
    inputwholeElement.value = '';
    }

    //Hide the placeholder text in Firefox
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.value) {
      inputElement.classList.add('has-value');
    } else {
      inputElement.classList.remove('has-value');
    }

  }

  totalVal(event: Event){
    const inputElement = event.target as HTMLInputElement;
    if (!inputElement.value.match(/^(?!0$)\d+(\.\d{0,2})?$/))  //Accept 0=/^\d+(\.\d{0,2})?$/
    {
      inputElement.value = '';
    }
  }

  validateInput(event: any) {
    const input = event.key;
    if (input === ' ') {
      event.preventDefault();
    }
  }

  public noWhitespaceValidator(control: FormControl) {
    //console.log(this.createinvoiceForm)
    return (control.value || '').trim().length? null : { 'whitespace': true };       
}
onKeydown(event: any) {
}

restrictSpaces(event: any) {
  let inputValue: string = event.target.value;
  // Replace multiple spaces with a single space
  inputValue = inputValue.replace(/\s{2,}/g, ' ');
  event.target.value = inputValue;
  return
}

restrictFirstPosition(event: any): void {
  const input = event.target.value;
  if (input && input[0] === '0') {
    event.target.value = input.substring(1);
  }
}
}

