import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../services/http.service';
import { URLUtils } from '../urlUtils';
import { ConfirmationDialogService } from '../confirmation-dialog/confirmation-dialog.service';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent {

  @Output() event = new EventEmitter<string>();
  selectedValue: string = "view";
  //selectedMatter: string = "legalmatter";
  isDisplay: boolean = true;
  searchText: any = '';
  searchValue:string = '';
  invoicelist: any[] = [];
  is_invoice: boolean = false;
  invid: any;
  errorMsg: boolean = false;
  successModel: boolean = false;
  invoice_id: any;
  invoice: any;
  profile: any;
  message: string = '';
  docsSharedwithus: any;
  @Input() docsSharedbyus: any = [];
  sharedandUnsharedData: any = { 'add': [], 'remove': [], 'message': "" };
  @Input() reldata: any = {};
  profileInfo: any;
  invoice_data: any;
  isChecked: any;
  isReverse:boolean=false;
  sortKey: string = '';
  


  constructor(private router: Router, private toast: ToastrService, private route: ActivatedRoute, private httpservice: HttpService, private confirmationDialogService: ConfirmationDialogService) { }

  ngOnInit() {

    this.getInvoiceList()
    //this.getPreview();
    this.getProfile();
    //console.log('Invoice', this.invid)

  }

  sendInvoice() {
   

    //share API
    let data = {
        "add": [
            {
                "docid": this.invoice_data.docid,
                "doctype": "general"
            }
        ],
        "message": "",
        "remove": []

    }
    this.invoice_data.client_id
    //console.log('Invoice_data', this.invoice_data)

    this.httpservice.sendPutRequest(URLUtils.shareInvoiceDocuments(this.invoice_data.rel_id), data).subscribe((res: any) => {
      if (!res.error) {
        //this.toast.success(res.msg)

        this.toast.success("Invoice Shared Successfully!!")
        this.successModel = false
        this.confirmationDialogService.confirm('Success',
          'Congratulations!! You have successfully shared Invoice ' + this.invoice.name, false, '', '', false, "sm", false)
          .then(() => { })
        this.event.emit('exchange-close')
      } else {
        alert(res.msg);
      }
    },
    (error: HttpErrorResponse) => {
      if (error.status === 401 || error.status === 403) {
        const errorMessage = error.error.msg || 'Unauthorized';
        this.toast.error(errorMessage);
        console.log(error);
      }
    });
}

  getProfile() {
    this.httpservice.sendGetRequest(URLUtils.profile).subscribe(
      (res: any) => {
        if (res.error == false) {
          this.profile = res.data?.details;
        }
      })
  }

  getPreview() {
    this.httpservice.sendGetRequest(URLUtils.InvoiceWithId(this.invid)).subscribe(
      (res: any) => {
        if (res.error == false) {
          this.invoice = res?.invoice;
        }
        //console.log('Inid', this.invoice)
      }
    )
  }

  getInvoiceList() {
    this.httpservice.sendGetRequest(URLUtils.Invoice).subscribe((res: any) => {
      this.invoicelist = res?.data
      //console.log('invoicelist', this.invoicelist)
      //this.errorMsg = this.invoicelist.length == 0 ? true : false;
    })
  }

  isActive(value: string) {
    this.selectedValue = value;
    this.selectedValue == 'create' ? this.router.navigate(['/createinvoice']) : this.router.navigate(['/invoice']);
  }
  viewdetails(item: any) {
    this.invid = item.id
    this.router.navigate(['/preview', this.invid])
    //console.log('Indet', this.invid)
  }

  delete(invid: any) {
    this.confirmationDialogService.confirm('Confirmation', 'Are you sure do you want to delete this Invoice?', true, 'Yes', 'No')
      .then((confirmed) => {
        if (confirmed) {
          this.httpservice.sendDeleteRequest(URLUtils.InvoiceWithId(invid)).subscribe((res: any) => {
            //this.getInvoiceList()
            if (!res.error) {
              this.getInvoiceList()
              this.confirmationDialogService.confirm('Success', 'Congratulations! You have successfully deleted the Invoice', false, 'View Invoice List', 'Cancel', true)
                .then((confirmed) => {
                  if (confirmed) {
                    this.getInvoiceList()
                  }
                })
            }
          },
          (error: HttpErrorResponse) => {
            if (error.status === 401 || error.status === 403) {
              const errorMessage = error.error.msg || 'Unauthorized';
              this.toast.error(errorMessage);
            }
      
          });
        }
      })
  }

  hideAndShow() {
    this.isDisplay = !this.isDisplay;
  }

  onSub(item: any) {
    this.successModel = true
    this.invid = item.id
    this.invoice_data = item
    //console.log('success',item)
    //console.log('Dialog', this.invoice_data.client_id)
  }

  btnclose() {
    this.successModel = false
  }

//serach func!!
onKeydown(event: any) {
}

//sorting func!!
sortingFile(val: any) {
  this.isReverse = !this.isReverse;
  if (this.isReverse) {
    this.invoicelist = this.invoicelist?.sort((p1: any, p2: any) => (p1[val] < p2[val]) ? 1 : (p1[val] > p2[val]) ? -1 : 0);
    
  } else {
    this.invoicelist = this.invoicelist?.sort((p1: any, p2: any) => (p1[val] > p2[val]) ? 1 : (p1[val] < p2[val]) ? -1 : 0);
    
  }
}

sortingDateFile(val: string) {
    if (this.sortKey === val) {
      this.isReverse = !this.isReverse;
    } else {
      this.sortKey = val;
      this.isReverse = false;
    }
    
    this.invoicelist = this.invoicelist?.sort((p1: any, p2: any) => {
      const date1 = new Date(p1[val]);
      const date2 = new Date(p2[val]);
      return this.isReverse ? date2.getTime() - date1.getTime() : date1.getTime() - date2.getTime();
    });
  }


}








