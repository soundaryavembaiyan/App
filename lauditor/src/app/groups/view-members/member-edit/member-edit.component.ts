import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { URLUtils } from 'src/app/urlUtils';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.scss']
})
export class MemberEditComponent implements OnInit {

  @Output() event = new EventEmitter<string>();
  @Input() memData: any;

  submitted: boolean = false;
  createMemberForm: any = FormGroup;
  currencyList = ["USDollar(USD)",
                  "Euro(EUR)",
                  "JapaneseYen(JPY)",
                  "Pound(GBP)",
                  "AustralianDollar(AUD)",
                  "CanadianDollar(CAD)",
                  "SwissFranc(CHF)",
                  "KuwaitiDinar(KWD)",
                  "BahrainiDinar(BHD)"],
                  "IndianRupee(INR)"]
  

  constructor(private formBuilder: FormBuilder, private toast: ToastrService,
              private httpService: HttpService) {
   this.createMemberForm = this.formBuilder.group({
            name: ['', Validators.required],
            designation: ['', Validators.required],
            email:['',[Validators.required, Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)]],
            emailConfirm:['',[Validators.required, Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)]],
            currency:['',Validators.required],
            defaultRate:['',Validators.required]
    });
  }

  ngOnInit(){
    var fields = ['name', 'email', 'designation', 'currency','defaultRate']
    fields.forEach((item: any, index: number) => {
      this.createMemberForm.controls[item].setValue(this.memData[item])
    })
    this.createMemberForm.controls['emailConfirm'].setValue(this.memData['email'])
  }
  
  get f() { return this.createMemberForm.controls; }
  
  resetEmailConf(){
    this.createMemberForm.controls['emailConfirm'].setErrors(null)
  }
  
  onSubmit() {
    this.submitted = true;
    let form = this.createMemberForm;
    if(form.value['email'] != form.value['emailConfirm']){
      form.controls['emailConfirm'].setErrors({'mismatch': true})
    }
    if (this.createMemberForm.invalid) { return; }
    var payload = this.createMemberForm.value;
    this.httpService.sendPatchRequest(URLUtils.updateMember(this.memData),
        payload).subscribe((res: any) => {
          this.event.emit("edit-member-done")
      },(error) => {
      if(error.status == 400){
        form.controls['email'].setErrors({'duplicate': true})
      }
      if (error.status === 401 || error.status === 403) {
        const errorMessage = error.error.msg || 'Unauthorized';
        this.toast.error(errorMessage);
        console.log(error);
      }
        
    })
  }
  cancel(){
    this.event.emit('edit-member-close')
  }

}
