import { FormBuilder, FormGroup, Validators,FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-edit-calender-dialog',
  templateUrl: './edit-calender-dialog.component.html',
  styleUrls: ['./edit-calender-dialog.component.scss']
})
export class EditCalenderDialogComponent implements OnInit {
  public form:FormGroup;
  @Output() emitService = new EventEmitter();

  
  constructor(private activeModal: NgbActiveModal,
    fb: FormBuilder) { 
      this.form = fb.group({
        editcalenderevent: ['', Validators.required]
      });
    }

  ngOnInit() {
  }

  public cancel() {
    this.activeModal.close('');
  }

  public submit() {
    this.emitService.next(this.form.value);
    this.activeModal.close('');
  }
}
