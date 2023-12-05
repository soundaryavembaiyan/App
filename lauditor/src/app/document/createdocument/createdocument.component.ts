import { Component, Inject, Injectable, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ModalService } from 'src/app/model/model.service';
import { HttpService } from 'src/app/services/http.service';
import { URLUtils } from 'src/app/urlUtils';
import { DocumentService } from '../document.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-createdocument',
  templateUrl: './createdocument.component.html',
  styleUrls: ['./createdocument.component.scss']
})

@Injectable()
export class CreateDocumentComponent {
  //filter: any = "client";
  isOverview: boolean = false;
  product = environment.product;
  myForm:any;
  @Input() overview:any;
  overviewTitle:any;

  constructor(private router: Router,  private fb: FormBuilder, private httpservice: HttpService, private toast: ToastrService, private documentService: DocumentService,
    private modalService: ModalService, public sanitizer: DomSanitizer, public dialog: MatDialog) {

  }

  ngOnInit() {
   
  }

  addOn() {
    this.isOverview = true
  }

  // openDialogAll() {
  //   const dialogRef = this.dialog.open(DialogBoxComponent, {
  //     width: '600px',
  //     height: '330px',
  //     data: [this.overview]
  //     //disableClose: true
  //   });
  //   console.log('overviewData',this.overview)
  // }

  openDialogAll() {
    const dialogRef = this.dialog.open(DialogBoxComponent, {
      width: '600px',
      height: '330px',
      data: {
        overview: this.overview,
        overviewTitle: this.overviewTitle
      }
    });

    dialogRef.afterClosed().subscribe((result: { overview: string, overviewTitle: string }) => {
      if (result) {
        this.overview = result.overview;
        this.overviewTitle = result.overviewTitle;
      }
    });
  }

  hypenUpdate(newTitle: string) {
    if (newTitle && !newTitle.startsWith(' ')) {
      this.overviewTitle = '' + newTitle; // Prepend hyphen if it's missing
    } else {
      this.overviewTitle = newTitle;
    }
  }
  
}



@Component({
  selector: 'app-dialog-box',
  templateUrl: './dialog-box.html',
  styleUrls: ['./createdocument.component.scss'],
  //standalone: true,
})

@Injectable()
export class DialogBoxComponent {
  dialog: any;
  name: any;
  overview:any;
  overviewTitle:any;
  isOverview: boolean = false;
  overviewForm:any;
  @Output() oversubmitted = new EventEmitter();

  constructor(
    public dialogRef: MatDialogRef<DialogBoxComponent>, @Inject(MAT_DIALOG_DATA) public data: { overview: string, overviewTitle: string }
  ) {
    //this.overview = data[0];
    this.overview = data.overview;
    this.overviewTitle = data.overviewTitle
  }

  ngOnInit() {
    if (this.overviewTitle && this.overviewTitle.startsWith('-')) {
      this.overviewTitle = this.overviewTitle.substring(2); // Remove the hyphen & space
    }

    // if (this.overviewTitle && this.overviewTitle.endsWith('...')) {
    //   this.overviewTitle = this.overviewTitle.substring(0, this.overviewTitle.length - 3); // Remove the ellipsis
    // }
    
  }

  save(){
    // this.data.push({ data: this.overview });
    // this.dialogRef.close({data:this.overview});
    // this.overview = this.overview
    // console.log('saveData',this.data)
    // console.log('saveData1',this.data[1])
    // console.log('overview',this.overview)

    //this.dialogRef.close(this.overview);

    //for Hypen-
    if (this.overviewTitle && !this.overviewTitle.startsWith('-')) {
      this.overviewTitle = '- ' + this.overviewTitle;
    }

    //for dots...
    // if (this.overviewTitle.length > 30) {
    //   this.overviewTitle = this.overviewTitle.substring(0, 30) + '...';
    // }

    const data = {
      overview: this.overview,
      overviewTitle: this.overviewTitle
    };
    this.dialogRef.close(data); 
  }

  closeDialog() {
    this.dialogRef.close()
  }

  onInputChange(event: Event) {
    const target = event.target as HTMLTextAreaElement;
    this.overview = target.value; // Overview to parent textarea
  }

  prependHyphen(newTitle: string) {
    if (newTitle && !newTitle.startsWith(' ')) {
      this.overviewTitle = '' + newTitle; // Prepend hyphen if it's missing
      //console.log('-hp',this.overviewTitle)
    }
  }

}
