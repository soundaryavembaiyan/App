import { ConfirmationDialogService } from './../../../../confirmation-dialog/confirmation-dialog.service';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/services/http.service';
import { MatterService } from './../../../matter.service';
import { URLUtils } from 'src/app/urlUtils';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { ModalService } from 'src/app/model/model.service';
import { MatDialog } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
declare var bootstrap: any;


@Component({
  selector: 'matter-groups',
  templateUrl: 'matter-groups.component.html',
  styleUrls: ['matter-groups.component.scss']
})
export class MatterGroupsComponent implements OnInit {

  @Output() selectedGroupsEvent: EventEmitter<any> = new EventEmitter();
  @Output() selectedClientsEvent: EventEmitter<any> = new EventEmitter();
  @Output() selectedTmsEvent: EventEmitter<any> = new EventEmitter();


  selectedClients: any = [];
  @Input() data: any = {};

  @Input() clients: any = {};
  @Input() groups: any[] = [];

  groupsList: any = [];
  selectedGroups: any = [];
  selectedtoupdateGroups: any = [];
  searchText: any = '';
  editGroupIds: any = [];
  isEdit: boolean = false;
  editMatter: any;
  pathName: string = "legalmatter";
  isSaveEnable: boolean = false;
  filteredData: any;
  cantDeleteItems: any;
  product = environment.product;

  grouplist: any = [];
  clientId: any = [];
  client: any;
  filter: any;
  matterList: any;
  selectedGroupItems: any = [];
  groupId: any = [];
  groupViewItems: any;
  groupsLists: any = [];
  editDoc: any;
  removegrpId: any;
  memData: any;
  initialSelectedGroups: any[] = [];
  delDoc = false;
  isSelectAllVisible = true;
  isCreate = false;
  

  constructor(private httpservice: HttpService,
    private matterService: MatterService,
    private router: Router, private toast: ToastrService,private modalService: ModalService,
    private confirmationDialogService: ConfirmationDialogService,private dialog: MatDialog) { }

  ngOnInit() {
    this.pathName = window.location.pathname.includes("legalmatter") ? "legalmatter" : "generalmatter";
    const path = window.location.pathname;

    if (path.indexOf("updateGroups") > -1) {
      if (path.includes("legal")) {
        this.isCreate = !this.isCreate;
        this.matterService.editLegalMatterObservable.subscribe((result: any) => {
          const clientIds = result.clients.map((client: any) => client);
          const corpIds = result.corporate.map((client: any) => client);
      
          if (result) {
            this.selectedGroups = result?.groups?.map((g: any) => g);
            if (result.clients.length > 0) {
              this.httpservice.sendPutRequest(URLUtils.getFilterTypeAttachements, { "attachment_type": "groups", "clients": clientIds }).subscribe(
                (res: any) => {
                  this.groupsList = res?.groups?.map((client: any) => client);
                  this.filterGroupsList();
                }
              );
            } else if (result.corporate.length > 0) {
              this.httpservice.sendPutRequest(URLUtils.getFilterTypeAttachements, { "attachment_type": "groups", "clients": corpIds }).subscribe(
                (res: any) => {
                  this.groupsList = res?.groups?.map((client: any) => client);
                  this.filterGroupsList();
                }
              );
            } 
            else if(clientIds && corpIds){
              this.httpservice.sendPutRequest(URLUtils.getFilterTypeAttachements, { "attachment_type": "groups", "clients": corpIds }).subscribe(
                (res: any) => {
                  this.groupsList = res?.groups?.map((client: any) => client);
                  this.filterGroupsList();
                }
              );
              this.httpservice.sendPutRequest(URLUtils.getFilterTypeAttachements, { "attachment_type": "groups", "clients": clientIds }).subscribe(
                (res: any) => {
                  this.groupsList = res?.groups?.map((client: any) => client);
                  this.filterGroupsList();
                }
              );
            }
            else{}   

            this.editMatter = result;
            this.editGroupIds = result.groups;
            this.isEdit = true;
            this.cantDeleteItems = this.editGroupIds.filter((item: any) => item.canDelete == false).map((obj: any) => obj.id);
          }
        });
      }
      else if (path.includes("general")) {
        this.isCreate = !this.isCreate;
        this.matterService.editGeneralMatterObservable.subscribe((result: any) => {
          const clientIds = result.clients.map((client: any) => client);
          const corpIds = result.corporate.map((client: any) => client);
      
          if (result) {
            this.selectedGroups = result?.groups?.map((g: any) => g);
            if (result.clients.length > 0) {
              this.httpservice.sendPutRequest(URLUtils.getFilterTypeAttachements, { "attachment_type": "groups", "clients": clientIds }).subscribe(
                (res: any) => {
                  this.groupsList = res?.groups?.map((client: any) => client);
                  this.filterGroupsList();
                }
              );
            } else if (result.corporate.length > 0) {
              this.httpservice.sendPutRequest(URLUtils.getFilterTypeAttachements, { "attachment_type": "groups", "clients": corpIds }).subscribe(
                (res: any) => {
                  this.groupsList = res?.groups?.map((client: any) => client);
                  this.filterGroupsList();
                }
              );
            } 
            else if(clientIds && corpIds){
              this.httpservice.sendPutRequest(URLUtils.getFilterTypeAttachements, { "attachment_type": "groups", "clients": corpIds }).subscribe(
                (res: any) => {
                  this.groupsList = res?.groups?.map((client: any) => client);
                  this.filterGroupsList();
                }
              );
              this.httpservice.sendPutRequest(URLUtils.getFilterTypeAttachements, { "attachment_type": "groups", "clients": clientIds }).subscribe(
                (res: any) => {
                  this.groupsList = res?.groups?.map((client: any) => client);
                  this.filterGroupsList();
                }
              );
            }
            else{}        
      
            this.editMatter = result;
            this.editGroupIds = result.groups;
            this.isEdit = true;
            this.cantDeleteItems = this.editGroupIds.filter((item: any) => item.canDelete == false).map((obj: any) => obj.id);
          }
        });
      }
    }
    // if (window.location.pathname.indexOf("updateGroups") > -1) {
    //   this.matterService.editLegalMatterObservable.subscribe((result: any) => {
    //     if (result) {
    //       this.editMatter = result;
    //       console.log('ngL-editMatter',this.editMatter)
    //       this.editGroupIds = result.groups;
    //       this.isEdit = true;
    //     this.cantDeleteItems=this.editGroupIds.filter((item: any) => item.canDelete==false).map((obj: any) => obj.id);
    //     }
    //   });
    //   this.matterService.editGeneralMatterObservable.subscribe((result: any) => {
    //     if (result) {
    //       this.editMatter = result;
    //       console.log('ngG-editMatter',this.editMatter)
    //       this.editGroupIds = result.groups;
    //       this.isEdit = true;
    //       this.cantDeleteItems=this.editGroupIds.filter((item: any) => item.canDelete==false).map((obj: any) => obj.id);
    //     }
    //   })
    // }

    //this.getGrouplists();
    if(this.product == 'corporate'){
      this.getGroups();
    }
    else{
      this.getGrouplists();
    }
    
  }

  filterGroupsList() {
    if (this.groupsList && this.selectedGroups && this.selectedGroups.length > 0) {
      this.groupsList = this.groupsList.filter((group: any) => {
        return !this.selectedGroups.find((selectedGroup: any) => {
          return selectedGroup.id === group.id;
        });
      });
    }
  
    if (this.selectedGroups.length === 0) {
      let checkbox = document.getElementById('selectAll') as HTMLInputElement | null;
      if (checkbox != null) {
        checkbox.checked = false;
      }
    }
  }

  getGrouplists() {
    if (Array.isArray(this.clients)) {
      this.client = this.clients.map((client: any) => ({ id: client.id, type: client.type }));
      this.clientId.push(this.client.map((c: any) => c.id));

      let clientData = {
        "attachment_type": "groups",
        "clients": this.client
      };

      this.httpservice.sendPutRequest(URLUtils.getFilterTypeAttachements, clientData).subscribe(
        (res: any) => {
          //console.log('g-res', res)
          this.groupsList = res?.groups?.map((client: any) => client);
          //console.log('g-groupsList', this.groupsList)
          if (this.groups && this.groups.length > 0) {
            this.selectedGroups = [...this.groups];
            let res = this.groupsList.filter((el: any) => {
              return !this.selectedGroups.find((element: any) => {
                return element.id === el.id;
              });
            });
            this.groupsList = res
          }
          if (this.selectedGroups.length == 0) {
            let checkbox = document.getElementById('selectAll') as HTMLInputElement | null;
            if (checkbox != null)
              checkbox.checked = false;
          }

        })
    } else {
      //console.error('this.clients is not an array', this.clients);
    }
  }

  remGroups(){
    this.initialSelectedGroups = [...this.selectedGroups];
      this.selectedtoupdateGroups.forEach((group:any) => {
        this.groupsList.push(group);
      });
      this.selectedtoupdateGroups = [];
  }  
 getGroups() {
    this.httpservice.sendGetRequest(URLUtils.getGroups).subscribe((res: any) => {
      if (res && res['data'] && res['data']?.length > 0)
        this.groupsList = res['data'];
      if (this.editGroupIds && this.editGroupIds.length > 0) {
        this.groups = this.editGroupIds;
        // this.groups = this.groupsList.filter((item: any) => this.editGroupIds.indexOf(item.id) > -1);
      }
      if (this.groups && this.groups.length > 0) {
        this.selectedGroups = [...this.groups];
        let res = this.groupsList.filter((el: any) => {
          return !this.selectedGroups.find((element: any) => {
            return element.id === el.id;
          });
        });
        this.groupsList = res;
      }
      if (this.selectedGroups.length == 0) {
        let checkbox = document.getElementById('selectAll') as HTMLInputElement | null;
        if (checkbox != null)
          checkbox.checked = false;
      }
    })
  }

  selectAll(event: any) {
    this.isSaveEnable = true;
    if (event?.target?.checked) {
      if (this.groupsList?.length > 0) {
        if (this.filteredData?.length > 0) {
          this.selectedGroups = this.selectedGroups.concat(this.groupsList);
          this.groupsList = this.groupsList.filter((el: any) => {
            return !this.selectedGroups.find((element: any) => {
              return element.id === el.id;
            });
          });
        }
        else {
          this.selectedGroups = this.selectedGroups.concat(this.groupsList);
          this.groupsList = [];
        }
      }
    } else {
      if (this.isEdit) {
        let cantDeleteItems = this.selectedGroups.filter((item: any) => this.cantDeleteItems.indexOf(item.id) > -1)
        let canDeleteItems = this.selectedGroups.filter((item: any) => this.cantDeleteItems.indexOf(item.id) <= -1)
        this.groupsList = canDeleteItems.concat(this.groupsList);
        this.selectedGroups = cantDeleteItems;
      } else {
        this.groupsList = this.selectedGroups.concat(this.groupsList);
        this.selectedGroups = [];
      }
    }
    this.searchText = '';
  }
  selectGroup(group: any, value?: any) {
    this.isSaveEnable = true;
    this.selectedGroups.push(group);
    let index = this.groupsList.findIndex((d: any) => d.id === group.id); //find index in your array
    this.groupsList.splice(index, 1);
    if (this.groupsList.length == 0) {
      let checkbox = document.getElementById('selectAll') as HTMLInputElement | null;
      if (checkbox != null)
        checkbox.checked = true;
    }
    this.searchText = '';
  }
  selecttoUpdateGroup(group: any, value?: any) {
    this.isSaveEnable = true;
    this.selectedtoupdateGroups.push(group);
    let index = this.groupsList.findIndex((d: any) => d.id === group.id); //find index in your array
    this.groupsList.splice(index, 1);
    if (this.groupsList.length == 0) {
      let checkbox = document.getElementById('selectAll') as HTMLInputElement | null;
      if (checkbox != null)
        checkbox.checked = true;
    }
    this.searchText = '';
  }

  removeGroup(group: any) {
    this.memData = group;
    console.log('group', group);

    if (this.product != 'corporate' && this.groupsList.length === 0 && window.location.pathname.indexOf("updateGroups") > -1) {
      this.openDialog();
      return;
    }

    // if (this.isEdit && (group.canDelete === false || group.canDelete === undefined)) {

    if (this.product == 'corporate'&& group.canDelete == false) {
        this.confirmationDialogService.confirm('Alert', 'External Counsels are associated with this Department. So you cannot delete this department', false, 'OK', 'Cancel', true)
    }

    if (this.product != 'corporate' && group.canDelete === false) {
      this.editDoc = JSON.parse(JSON.stringify(group));
      this.selectedtoupdateGroups = [];
      this.httpservice.sendGetRequest(URLUtils.updateMatterAccess(this.editMatter.id, group.id)).subscribe((res: any) => {
        this.removegrpId = res.counts;
      });

      setTimeout(() => {
        // Trigger the modal
        let modalElement = document.getElementById('editInfoModal1') as HTMLElement;
        if (modalElement) {
          const modalInstance = new bootstrap.Modal(modalElement);
          modalInstance.show();
        }
      }, 0);
    }
    else if ((group.canDelete === undefined && this.isCreate)) {
      this.editDoc = JSON.parse(JSON.stringify(group));
      this.selectedtoupdateGroups = [];
      this.httpservice.sendGetRequest(URLUtils.updateMatterAccess(this.editMatter.id, group.id)).subscribe((res: any) => {
        this.removegrpId = res.counts;
      });

      setTimeout(() => {
        // Trigger the modal
        let modalElement = document.getElementById('editInfoModal1') as HTMLElement;
        if (modalElement) {
          const modalInstance = new bootstrap.Modal(modalElement);
          modalInstance.show();
        }
      }, 0);
    }
    else if (group.canDelete === true || group.canDelete === undefined) {
      this.isSaveEnable = true;
      let index = this.selectedGroups.findIndex((d: any) => d.id === group.id); // find index in your array
      // Check if the group is found in the selectedGroups array
      if (index !== -1) {
        this.selectedGroups.splice(index, 1);
        this.groupsList.push(group);

        if (this.selectedGroups.length === 0 || this.groupsList.length === 1) {
          let checkbox = document.getElementById('selectAll') as HTMLInputElement | null;
          if (checkbox != null) {
            checkbox.checked = false;
          }
        }
      } else {
        console.error('Group not found!', group);
      }
    } else { }
  }

  // removeGroup(group: any) {
  //   this.memData = group;
  //   //console.log('group',group)

  //   if(this.groupsList.length === 0){
  //     this.openDialog();
  //     return;
  //   }

  //   if (this.isEdit && group.canDelete === false || group.canDelete == undefined) {
  //     this.editDoc = JSON.parse(JSON.stringify(group));
  //     this.selectedtoupdateGroups = [];
  //     this.httpservice.sendGetRequest(URLUtils.updateMatterAccess(this.editMatter.id, group.id)).subscribe((res: any) => {
  //       this.removegrpId = res.counts;
  //     })

  //     setTimeout(() => {
  //       // Trigger the modal
  //       let modalElement = document.getElementById('editInfoModal1') as HTMLElement;
  //       if (modalElement) {
  //         const modalInstance = new bootstrap.Modal(modalElement);
  //         modalInstance.show();
  //       }
  //     }, 0);
  //   } 
  //   else if ((this.isEdit && (group.canDelete == true)) || (!this.isEdit)) {
  //     this.isSaveEnable = true;
  //     let index = this.selectedGroups.findIndex((d: any) => d.id === group.id); //find index in your array
  //     // Check if the group is found in the selectedGroups array
  //     if (index !== -1) {
  //     this.selectedGroups.splice(index, 1);
  //     this.groupsList.push(group);
  //     if (this.selectedGroups.length == 0 || this.groupsList.length == 1) {
  //       let checkbox = document.getElementById('selectAll') as HTMLInputElement | null;
  //       if (checkbox != null)
  //         checkbox.checked = false;
  //     }
  //   }
  // }
  //   else{}
  // }

  openDialog() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { delDoc: this.delDoc,  product: environment.product  },
      width: '500px',
      height: '290px',
      hasBackdrop: true,
      panelClass: 'hello',
      disableClose: true
    });
}

  //Remove grps from the dialog
  removeDialogGroup(group: any) {
    if ((this.isEdit && (group.canDelete == undefined || group.canDelete == true)) || (!this.isEdit)) {
      this.isSaveEnable = true;
      let index = this.selectedtoupdateGroups.findIndex((d: any) => d.id === group.id); //find index in your array
      this.selectedtoupdateGroups.splice(index, 1);
      this.groupsList.push(group); 
      if (this.selectedtoupdateGroups.length == 0 || this.groupsList.length == 1) {
        let checkbox = document.getElementById('selectAll') as HTMLInputElement | null;
        if (checkbox != null)
          checkbox.checked = false;
      }
    }
  }

  deleteGroup() {
    const idsArray = this.selectedtoupdateGroups.map((group: any) => group.id);
    const payload = { "new_groups": idsArray };

    this.httpservice.sendPatchRequest(URLUtils.updateMatterAccess(this.editMatter.id, this.memData.id), payload)
      .subscribe((res: any) => {
        if (this.product !== 'corporate') {
          this.toast.success("Successfully reassigned to another active Groups")
        }
        else if (this.product === 'corporate') {
          this.toast.success("Successfully reassigned to another active Department")
        }
        else {
          this.toast.success(res.msg)
        }

        // Remove the selected group from selectedGroups array
        const indexToRemove = this.selectedGroups.findIndex((g: any) => g.id === this.memData.id);
        if (indexToRemove !== -1) {
          this.selectedGroups.splice(indexToRemove, 1);
        }
        // Update selectedGroups based on API response
        this.selectedtoupdateGroups.forEach((group: any) => {
          const index = this.selectedGroups.findIndex((g: any) => g.id === group.id);
          if (index === -1) {
            this.selectedGroups.push(group); // Add reassigned groups to selectedGroups if not already present
          }
        });

        this.groupsList.push(this.memData); // Update groupsList based on API response, if needed
        this.selectedtoupdateGroups = [];
      });
  }

  saveGroups() {
    if (this.isEdit) {
      let url = this.pathName == 'legalmatter' ? URLUtils.updateLegalAcls(this.editMatter.id) : URLUtils.updateGeneralAcls(this.editMatter.id);
      let data = { "group_acls": this.selectedGroups.map((obj: any) => obj.id) };
      //console.log('data',data)
      if (this.product != 'corporate') {
        this.confirmationDialogService.confirm('Confirmation', 'Are you sure do you want to update Group(s) for ' + this.editMatter.title + ' matter ?', true, 'Yes', 'No')
          .then((confirmed) => {
            if (confirmed) {
              this.httpservice.sendPutRequest(url, data).subscribe((res: any) => {
                if (!res.error) {
                  this.confirmationDialogService.confirm('Success', 'Congratulations! You have successfully updated Group(s) for ' + this.editMatter.title, false, 'View Matter List', 'Cancel', true)
                    .then((confirmed) => {
                      if (confirmed) {
                        this.router.navigate(['/matter/' + this.pathName + '/view']);
                      }
                    })
                }
              },
                (error: HttpErrorResponse) => {
                  if (error.status === 401 || error.status === 403) {
                    const errorMessage = error.error.msg || 'Unauthorized';
                    this.toast.error(errorMessage);
                    //console.log(error);
                  }
                }
              );
            }
          })
      }
      if (this.product == 'corporate') {
        this.confirmationDialogService.confirm('Confirmation', 'Are you sure do you want to update Department(s) for ' + this.editMatter.title + ' matter ?', true, 'Yes', 'No')
          .then((confirmed) => {
            if (confirmed) {
              this.httpservice.sendPutRequest(url, data).subscribe((res: any) => {
                if (!res.error) {
                  this.confirmationDialogService.confirm('Success', 'Congratulations! You have successfully updated Department(s) for ' + this.editMatter.title, false, 'View Matter List', 'Cancel', true)
                    .then((confirmed) => {
                      if (confirmed) {
                        this.router.navigate(['/matter/' + this.pathName + '/view']);
                      }
                    })
                }
              },
                (error: HttpErrorResponse) => {
                  if (error.status === 401 || error.status === 403) {
                    const errorMessage = error.error.msg || 'Unauthorized';
                    this.toast.error(errorMessage);
                    //console.log(error);
                  }
                }
              );
            }
          })
      }

    } else {
      this.selectedGroupsEvent.emit(this.selectedGroups);
    }
  }
  OnCancel() {
    if (this.isEdit) {
      this.router.navigate(['/matter/' + this.pathName + '/view']);
    }
    else {
      this.groupsList = this.groupsList.concat(this.selectedGroups);
      this.selectedGroups = [];
    }
    const checkbox = document.getElementById('selectAll') as HTMLInputElement | null;
    if (checkbox) {
        checkbox.checked = false;
    }
  }
  // keyup() {
  //   if (this.searchText == ' '){
  //     this.searchText = this.searchText.replace(/\s/g, "");
  //   }
  //   this.filteredData = this.groupsList.filter((item: any) => item.name.toLocaleLowerCase().includes(this.searchText));
  //   let checkbox = document.getElementById('selectAll') as HTMLInputElement | null;
  //   if (checkbox != null)
  //     checkbox.checked = false;
  // }

  keyup() {
    if (this.searchText == ' ') {
      this.isEdit = false; 
      this.searchText = this.searchText.replace(/\s/g, '');
    }
    this.filteredData = this.groupsList.filter((item: any) => item.name.toLocaleLowerCase().includes(this.searchText));
    // Update visibility based on the filtered data
    this.isSelectAllVisible = this.filteredData.length > 0;

    let checkbox = document.getElementById('selectAll') as HTMLInputElement | null;
    if (checkbox != null) {
      checkbox.checked = false;
    }
  }

  editDocInfo(doc: any, tabsel?: any) {
    //console.log('form', this.editDocform)
    this.editDoc = JSON.parse(JSON.stringify(doc));
  }
  closeModal(id: any) {
    this.modalService.close(id);
}
truncateString(text: string): string {
  if (text.length > 25) {
    return text.slice(0, 25) + '...';
  }
  return text;
}  
}

@Component({
  selector: 'app-confirmation-dialog',
  template: `
  <div mat-dialog-content>
  <div class="closeDialog">
        <i class="fa fa-times closeBtn" (click)="closeDialog()" aria-hidden="true"></i>
    </div>

   <h1 mat-dialog-title class="mailoption">Alert</h1>
      <div>
      <p *ngIf="data.product !== 'corporate'" class="alertxt">To update matter groups, the client should be linked to more than one group.<br> Please assign the client to more groups. </p>
      </div>
      <div mat-dialog-actions class="overviewSave savefilenameBtn">
           <button type="submit" class="btn btn-default savefile" (click)="continue()">OK</button>
      </div>
  </div>
`,
  styleUrls: ['matter-groups.component.scss']
})
export class ConfirmationDialogComponent {
  editDoc: any;
  product = environment.product;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>
  ) { }

  ngOnInit() {
  
  }

  continue() {
    this.dialogRef.close('continue');
  }
  closeDialog() {
    this.dialogRef.close()
  }  
}

