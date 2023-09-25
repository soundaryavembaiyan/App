import { Component, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { URLUtils } from 'src/app/urlUtils';
import { HttpService } from 'src/app/services/http.service';
import { EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
//import { ToastrService } from 'ngx-toastr/toastr/toastr.service';

@Component({
  selector: 'app-firm-profile',
  templateUrl: './firm-profile.component.html',
  styleUrls: ['./firm-profile.component.scss']
})
export class FirmProfileComponent {

  profile_details:any;
  basic_profile:any;
  mailing_address:any;
  reg_address:any;
  firm:any;
  basicProfile: any;

  currencyList = [
      { value: 'USDollar(USD)', name: 'USDollar(USD)'},
      { value: 'Euro(EUR)', name: 'Euro(EUR)'},
      { value: 'JapaneseYen(JPY)', name: 'JapaneseYen(JPY)'},
      { value: 'Pound(GBP)', name: 'Pound(GBP)'},
      { value: 'AustralianDollar(AUD)', name: 'AustralianDollar(AUD)'},
      { value: 'CanadianDollar(CAD)', name: 'CanadianDollar(CAD)'},
      { value: 'SwissFranc(CHF)', name: 'SwissFranc(CHF)'},
      { value: 'KuwaitiDinar(KWD)', name: 'KuwaitiDinar(KWD)'},
      { value: 'BahrainiDinar(BHD)', name: 'BahrainiDinar(BHD)'},
      { value: 'IndianRupee(INR)',  name:'IndianRupee(INR)'}
  ]

  data:any;

  selectedValue: string = "view";
  selectedMatter: string = "basicprofile";
  selectedValueButton: string = "yes";

  selectedValue_: string = "edit";
  selectedMatter_: string = "basicprofile";
  selectedValueButton_: string = "yes";


  isDisplay:boolean=true;
  isDisabled: any;
  disable = false;
  myForm: any;

  searchValue:string = '';
  mailing_addresses: any;
  regi_address: any;
  mail_ad: any;
  basicProfileDetails: any;
  basicMailingProfile: any;
  submitted = false;
  selectedUser: any;
  activeTab = '';

  registeredAddress = {
    house_flat_no: '',
    street: '',
    city_town: '',
    state: '',
    country: '',
    zipcode: '',
   
  };

  mailingAddress = {
    house_flat_no: '',
    street: '',
    city_town: '',
    state: '',
    country: '',
    zipcode: '',
  };
  country: any;
  countries: any;
  countryName = 'Select Country';
  minLength:any;
  maxLength:any;
  fullnamePattern = /^[a-zA-Z\s]*$/;
  contact_personPattern = /^[A-Z][A-z\s]*$/;  // /^[a-zA-Z\s]*$/;
  emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  zipcode5Pattern = /^[0-9]{5}$/;
  zipcode6Pattern = /^[0-9]{6}$/;
  isEdit: boolean = false;
  isView: boolean = false;

  constructor(private fb: FormBuilder,
    private httpservice: HttpService, 
    private router: Router,
    private toast: ToastrService) { }

  ngOnInit() {

    this.httpservice.sendGetRequest(URLUtils.profile).subscribe(
      (res: any) => {
        if (res.error == false) {
          this.basic_profile = res.data?.details;
          this.reg_address = res.data?.details?.address;  
          this.mailing_address = res.data?.details?.correspondence_address;
        }
      }
    )
    
    this.basicProfileDetails = this.fb.group({
      fullname:['', [Validators.required]],
      country:['', Validators.required],
      contact_person:['', [Validators.required]],
      //contact_phone:['', Validators.required],
      contact_phone: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(10), Validators.maxLength(10)]],
      //"contact_phone": new FormControl(null,[Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
      //email:['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
      house_flat_no:['', Validators.required],
      street:[''],
      city_town:['', Validators.required],
      state:['', Validators.required],
      zipcode: ['', [Validators.required, Validators.pattern(`${this.zipcode5Pattern.source}|${this.zipcode6Pattern.source}`)]],
      website:[''],
      billing_currency:['', Validators.required]
    })

    this.basicMailingProfile= this.fb.group({
      house_flat_no:['', Validators.required],
      street:[''],
      city_town:['', Validators.required],
      state:['', Validators.required],
      country:['', Validators.required],
      zipcode: ['', [Validators.required, Validators.pattern(`${this.zipcode5Pattern.source}|${this.zipcode6Pattern.source}`)]]
    })
    
    //Get Profile API
    this.httpservice.sendGetRequest(URLUtils.profile).subscribe(
      (res: any) => {
        if (res.error == false) {
          this.basic_profile = res.data?.details;
          this.registeredAddress = res.data?.details?.address;
          this.mailingAddress = res.data?.details?.correspondence_address;
        }
      }
    ) 
    //Get Country API
    this.httpservice.sendGetRequest(URLUtils.country).subscribe(
      (res: any) => {
        this.countries = res.data.countries;
        this.countries.shift();
      }
    )
  }



  sameAddress() {
    this.mailingAddress.house_flat_no = this.registeredAddress.house_flat_no;
    this.mailingAddress.street = this.registeredAddress.street;
    this.mailingAddress.city_town = this.registeredAddress.city_town;
    this.mailingAddress.state = this.registeredAddress.state;
    this.mailingAddress.country = this.registeredAddress.country;
    this.mailingAddress.zipcode = this.registeredAddress.zipcode;
  }

  editProfile() {
 
    this.submitted = true;
    this.isEdit = true;

    if (this.basicProfileDetails.invalid && this.basicMailingProfile.invalid) {
      return;
    }

    var basic_profile =  this.basicProfileDetails.value
    var basic_profile1 =  this.basicProfileDetails.value

    let payload = {
      "fullname": basic_profile.fullname,
      "country": basic_profile.country,
      "contact_person": basic_profile.contact_person,
      "contact_phone": basic_profile.contact_phone,
      "website": basic_profile.website,
      "billing_currency": basic_profile.billing_currency,
      "email": basic_profile.email,

      "address": {
        "country": basic_profile1.country,
        "house_flat_no": basic_profile1.house_flat_no,
        "street": basic_profile1.street,
        "city_town": basic_profile1.city_town,
        "state": basic_profile1.state,
        "zipcode": basic_profile1.zipcode,
      },

      "correspondence_address": this.basicMailingProfile.value,
    }
    
    if (this.basicProfileDetails.valid && this.basicMailingProfile.valid) {
      this.httpservice.sendPatchRequest(URLUtils.profile, payload).subscribe((res: any) => {
        if (res.error == false) {
          this.toast.success("Details Updated Successfully");
          this.backToInfo();
          this.getData();
        }
        else if (res.error == true) {
          this.toast.error(res.msg);
        }

      })
    }
  }

  /*
  onClick(value: string) {
    this.selectedMatter = value;
  }
  isActive(value: string) {
    this.selectedValue = value;
    //this.selectedValueButton = value;
  }
  */


  getData(){
        //Get Profile API
        this.httpservice.sendGetRequest(URLUtils.profile).subscribe(
          (res: any) => {
            if (res.error == false) {
              this.basic_profile = res.data?.details;
              this.registeredAddress = res.data?.details?.address;
              this.mailingAddress = res.data?.details?.correspondence_address;
              this.reg_address = res.data?.details?.address;  
              this.mailing_address = res.data?.details?.correspondence_address;
            }
          }
        ) 
  }
  isActived(value: string) {
    //this.selectedValue = value;
    this.selectedValueButton = value;
  }

  resetForm(){  
  this.basicMailingProfile.reset();
  }

  onClick(value: string) {
    this.selectedMatter = value;
    this.selectedMatter_=value
  }
  isActive(value: string) {
    this.selectedValue = value;
    this.selectedValueButton = value;
    this.selectedValue_ = value;
    this.selectedValueButton_ = value;
  }
  hideAndShow() {
    this.isDisplay = !this.isDisplay;
  }
  editMember() {
    this.isEdit = true;
    this.getData();
  }

  viewMember(){
    this.isEdit = false;
  }
  onReset() {
    this.submitted = false;
    this.basicProfileDetails.reset();
    this.basicMailingProfile.reset();
    this.isEdit = false;
    this.getData();
  }

  
  backToInfo(){
    this.isEdit = false
    //window.location.reload()
 }

}


