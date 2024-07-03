import { ConfirmationDialogService } from './../../../../confirmation-dialog/confirmation-dialog.service';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/services/http.service';
import { MatterService } from './../../../matter.service';
import { URLUtils } from 'src/app/urlUtils';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
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

  constructor(private httpservice: HttpService,
    private matterService: MatterService,
    private router: Router, private toast: ToastrService,
    private confirmationDialogService: ConfirmationDialogService) { }

  ngOnInit() {
    this.pathName = window.location.pathname.includes("legalmatter") ? "legalmatter" : "generalmatter";
    const path = window.location.pathname;
    //console.log('path',path)
    if (path.indexOf("updateGroups") > -1) {
      if (path.includes("legal")) {
        this.matterService.editLegalMatterObservable.subscribe((result: any) => {
          if (result) {
            this.editMatter = result;
            this.editGroupIds = result.groups;
            this.isEdit = true;
            this.cantDeleteItems = this.editGroupIds.filter((item: any) => item.canDelete == false).map((obj: any) => obj.id);
          }
        });
      }
      else if (path.includes("general")) {
        this.matterService.editGeneralMatterObservable.subscribe((result: any) => {
          if (result) {
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

    this.getGrouplists();
    this.getGroups();

    //this.client = this.clients.map((client:any) => client.id);
    //console.log('clients of grp',this.client); 
  }

  // getGrouplists01() {
  //   // Assuming clients in client objects
  //   this.client = this.clients.map((client: any) => ({ id: client.id, type: client.type }));
  //   this.clientId.push(this.client.map((c: any) => c.id));

  //   let clientData = {
  //     "attachment_type": "groups",
  //     "clients": this.client
  //   };

  //   this.httpservice.sendPutRequest(URLUtils.getGrouplist, clientData).subscribe((res: any) => {
  //     if (res.error == false) {
  //       this.groupsList = res?.data?.map((client: any) => client);
  //       // console.log('g-groupsList',this.groupsList)
  //       // console.log('g-selectedGroups',this.selectedGroups)
  //     }

  //     if (this.groups && this.groups.length > 0) {
  //       this.selectedGroups = [...this.groups];
  //       let res = this.groupsList.filter((el: any) => {
  //         return !this.selectedGroups.find((element: any) => {
  //           return element.id === el.id;
  //         });
  //       });
  //       this.groupsList = res
  //     }
  //     if (this.selectedGroups.length == 0) {
  //       let checkbox = document.getElementById('selectAll') as HTMLInputElement | null;
  //       if (checkbox != null)
  //         checkbox.checked = false;
  //     }
  //   });
  // }

  // getGrouplists02() {
  //   this.client = this.clients.map((client: any) => ({ id: client.id, type: client.type }));
  //   this.clientId.push(this.client.map((c: any) => c.id));

  //   let clientData = {
  //     "attachment_type": "groups",
  //     "clients": this.client
  //   };

  //   this.httpservice.sendPutRequest(URLUtils.getFilterTypeAttachements, clientData).subscribe(
  //     (res: any) => {
  //       this.groupsList = res?.groups?.map((client: any) => client);
  //       if (this.groups && this.groups.length > 0) {
  //         this.selectedGroups = [...this.groups];
  //         let res = this.groupsList.filter((el: any) => {
  //           return !this.selectedGroups.find((element: any) => {
  //             return element.id === el.id;
  //           });
  //         });
  //         this.groupsList = res
  //       }
  //       if (this.selectedGroups.length == 0) {
  //         let checkbox = document.getElementById('selectAll') as HTMLInputElement | null;
  //         if (checkbox != null)
  //           checkbox.checked = false;
  //       }

  //     })
  // }

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
          // console.log('g-res', res)
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
          this.selectedGroups = this.selectedGroups.concat(this.filteredData);
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
  }
  removeGroup(group: any) {

    // if (this.isEdit && group.canDelete == false) {
    //   // if (this.product != 'corporate') {
    //   //   this.confirmationDialogService.confirm('Alert', 'Clients are associated with this Group. So you cannot delete this group', false, 'OK', 'Cancel', true)
    //   // }
    //   // if (this.product == 'corporate') {
    //   //   this.confirmationDialogService.confirm('Alert', 'External Counsels are associated with this Department. So you cannot delete this department', false, 'OK', 'Cancel', true)
    //   // }
    //   this.editDoc = JSON.parse(JSON.stringify(group));
    // }

    if (this.isEdit && group.canDelete === false) {
      this.editDoc = JSON.parse(JSON.stringify(group));

      setTimeout(() => {
        // Trigger the modal
        let modalElement = document.getElementById('editInfoModal1') as HTMLElement;
        if (modalElement) {
          const modalInstance = new bootstrap.Modal(modalElement);
          modalInstance.show();
        }
      }, 0);
    } else {
      this.editDoc = null;
    }

    if ((this.isEdit && (group.canDelete == undefined || group.canDelete == true)) || (!this.isEdit)) {
      this.isSaveEnable = true;
      let index = this.selectedGroups.findIndex((d: any) => d.id === group.id); //find index in your array
      this.selectedGroups.splice(index, 1);
      this.groupsList.push(group);
      if (this.selectedGroups.length == 0 || this.groupsList.length == 1) {
        let checkbox = document.getElementById('selectAll') as HTMLInputElement | null;
        if (checkbox != null)
          checkbox.checked = false;
      }
    }
  }

  //Remove grps from the dialog
  removeDialogGroup(group: any) {
    console.log('grp', group)

    if (this.isEdit && group.canDelete == false) {
      this.toast.error('Clients are associated with this Group')
      return
    }

    if ((this.isEdit && (group.canDelete == undefined || group.canDelete == true)) || (!this.isEdit)) {
      this.isSaveEnable = true;
      let index = this.selectedGroups.findIndex((d: any) => d.id === group.id); //find index in your array
      this.selectedGroups.splice(index, 1);
      this.groupsList.push(group);
      if (this.selectedGroups.length == 0 || this.groupsList.length == 1) {
        let checkbox = document.getElementById('selectAll') as HTMLInputElement | null;
        if (checkbox != null)
          checkbox.checked = false;
      }
    }
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
  }
  keyup() {
    if (this.searchText == ' ')
      this.searchText = this.searchText.replace(/\s/g, "");
    this.filteredData = this.groupsList.filter((item: any) => item.name.toLocaleLowerCase().includes(this.searchText));
    let checkbox = document.getElementById('selectAll') as HTMLInputElement | null;
    if (checkbox != null)
      checkbox.checked = false;
  }

  editDocInfo(doc: any,tabsel?:any) {
    //console.log('form', this.editDocform)
    this.editDoc = JSON.parse(JSON.stringify(doc));
  }
}

