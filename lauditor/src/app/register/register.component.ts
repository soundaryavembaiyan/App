import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from "@angular/router";


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  submitted = false;

  myForm = this.formBuilder.group({
    fullname :['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    contact_person :['', [Validators.required]],
    contact_phone :['', [Validators.required]],
  })
  constructor(private formBuilder: FormBuilder,
              private router: Router,
              ) { }

  ngOnInit() {
  }

  get f() { return this.myForm.controls; }

  onSubmit() {
    this.submitted = true
    // $("#id_alert").removeClass("alert alert-danger").text("")
    // $("#id_alert").removeClass("alert alert-success").text("")
    // if (this.myForm.invalid) { return; }
    // var payload = JSON.stringify(this.myForm.value)
    // this.ajax.post(URLUtils.register, payload).subscribe(
    //   (resp) => {
    //     if (!resp['error']) {
    //       var msg = "Thank you very much for your request. One of our representatives will contact you soon."
    //       $("#id_alert").addClass("alert alert-success").text(msg)
    //       this.ajax.success_alert(msg)
    //       this.myForm.reset()
    //     }
    //     else {
    //       if(typeof resp['msg'] == 'object')
    //       {
    //         for (var key in resp['msg']) {
    //           $('#error-' + key).text(resp['msg'][key])
    //         }
    //       }
    //       else
    //         $("#id_alert").addClass("alert alert-danger").text(resp['msg'])
    //     }
    //   }
    // )
  }

}
