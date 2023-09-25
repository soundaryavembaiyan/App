import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent implements OnInit {

  @Input() title: string="";
  @Input() message: any;
  @Input() isIframe: boolean=false;
  @Input() btnOkText: string="";
  @Input() btnCancelText: string="";
  @Input() isSuccess: boolean=false;
  @Input() isButtons: boolean=true;
  @Input() displayCancelButton:boolean=true;
  constructor(private activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  public decline() {
    this.activeModal.close(false);
  }

  public accept() {
    this.activeModal.close(true);
  }

  public dismiss() {
    this.activeModal.dismiss();
  }

}
