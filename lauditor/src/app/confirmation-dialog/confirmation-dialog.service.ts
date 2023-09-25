import { ConfirmationDialogComponent } from './confirmation-dialog.component';
import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Injectable()
export class ConfirmationDialogService {

  constructor(private modalService: NgbModal) { }

  public confirm(

    title: string,
    message: any,
    displayCancelButton:boolean,
    btnOkText: string = 'OK',
    btnCancelText: string = 'Cancel',
    isSuccess:boolean=false,
    dialogSize: 'sm'|'lg' = 'sm',
    isButtons:boolean=true,
    ): Promise<boolean>
    {
    const modalRef = this.modalService.open(ConfirmationDialogComponent, { size: dialogSize });
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.message = message;
    modalRef.componentInstance.btnOkText = btnOkText;
    modalRef.componentInstance.btnCancelText = btnCancelText;
    modalRef.componentInstance.isSuccess = isSuccess;
    modalRef.componentInstance.isButtons = isButtons;
    modalRef.componentInstance.displayCancelButton = displayCancelButton;

    return modalRef.result;
  }

}
