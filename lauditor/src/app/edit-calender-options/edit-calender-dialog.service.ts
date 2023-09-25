import { EditCalenderDialogComponent } from './edit-calender-dialog.component';
import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable()
export class EditCalenderDialogService {
  editCalSubmitted = new BehaviorSubject<any>(null);
  editCalObservable: Observable<any> = this.editCalSubmitted.asObservable();
  constructor(private modalService: NgbModal) { }

  public open(   
    dialogSize: 'sm'|'lg' = 'lg',
    ): Promise<boolean>
    {
    const modalRef = this.modalService.open(EditCalenderDialogComponent, { size: dialogSize });
   // modalRef.componentInstance.title = title;
   modalRef.componentInstance.emitService.subscribe((emmitedValue:any) => {
    this.editCalSubmitted.next(emmitedValue.editcalenderevent);
    // do sth with emmitedValue
});
    return modalRef.result;
  }

}
