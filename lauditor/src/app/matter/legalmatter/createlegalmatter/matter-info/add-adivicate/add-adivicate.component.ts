import { AdvicateModel } from './../../../../../shared/config-model';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
@Component({
    selector: 'add-adivicate',
    templateUrl: 'add-adivicate.component.html',
    styleUrls: ['add-adivicate.component.scss']
})
export class AddAdivicateComponent implements OnInit {
    @Output() childButtonEvent = new EventEmitter();
    @Input() editAdvocatesList: any;
    advicate: any = [];
    memberDetail: any = FormGroup;
    submitted = false;
    enableAdvicate: boolean = false;
    name: any;
    email: any;
    phone: any;
    currentIndex: any;
    constructor(private fb: FormBuilder) {
    }
    get f() {
        return this.memberDetail.controls;
    }
    ngOnInit(): void {
        if (this.editAdvocatesList?.length > 0) {
            this.advicate = this.editAdvocatesList;
        }
        this.memberDetail = this.fb.group({
            name: ['', Validators.required],
            email: ['', Validators.required],
            phone: ['', Validators.required]
        })
    }
    valueExist() {
        let x = this.advicate.filter((x: any) => (x.name == this.memberDetail.value.name) || (x.email == this.memberDetail.value.email) ||
            (x.phone == this.memberDetail.value.phone));
        if (x.length > 0) {
            if (x[0].name == this.memberDetail.value.name) {
                this.memberDetail.controls.name.setErrors({ 'alreadyExist': true });
            }
            if (x[0].email == this.memberDetail.value.email) {
                this.memberDetail.controls.email.setErrors({ 'alreadyExist': true });
            }
            if (x[0].phone == this.memberDetail.value.phone) {
                this.memberDetail.controls.phone.setErrors({ 'alreadyExist': true });
            }
            return true;
        } else {
            return false;
        }
    }
    onSubmit() {
        this.submitted = true;
        this.currentIndex = null;
        if (this.memberDetail.invalid || this.valueExist()) {
            return;
        }
        if (this.enableAdvicate && this.advicate?.length > 0) {
            let index = this.advicate.findIndex((d: any) => (d.email === this.email) || (d.name === this.name) || (d.phone === this.phone)); //find index in your array
            if (index >= 0)
                this.advicate.splice(index, 1);
        }
        this.advicate.push(this.memberDetail.value);
        //console.log(JSON.stringify(this.advicate));
        this.childButtonEvent.emit(this.advicate);
        this.enableAdvicate = false;
        this.onReset();
    }
    addAdvicate() {
        this.enableAdvicate = true;
        this.childButtonEvent.emit(null);
    }
    removeOpponente(item: any) {
        let index = this.advicate.findIndex((d: any) => d.email === item.email); //find index in your array
        this.advicate.splice(index, 1);
    }
    editOpponente(item: any, i: number) {
        this.currentIndex = i;
        this.enableAdvicate = true;
        this.name = item.name;
        this.email = item.email;
        this.phone = item.phone;
    }
    onReset() {
        this.submitted = false;
        this.memberDetail.reset();
    }
}
