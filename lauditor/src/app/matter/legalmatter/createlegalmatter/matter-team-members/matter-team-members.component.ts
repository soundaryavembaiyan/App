import { URLUtils } from 'src/app/urlUtils';
import { HttpService } from 'src/app/services/http.service';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({

    selector: 'matter-team-members',
    templateUrl: 'matter-team-members.component.html',
    styleUrls: ['matter-team-members.component.scss']
})
export class MatterTeamMembersComponent {
    
    @Output() selectedTmsEvent: EventEmitter<any> = new EventEmitter();
    @Input() data: any = {};
    @Input() teammembers: any = {};
    @Input() groups: any[] = []
    @Input() clients: any = {};
    // @Input() tmGrp:any ={}
    
    teammembersList: any = [];
    selectedTeammembers: any = [];
    searchText: any = '';
    ownerName:any;
    filteredData:any;
    //@Input()grouplist:any=[]
    isSelectAllVisible = true;
    
    constructor(private httpservice: HttpService) { }

    ngOnInit() {
        this.ownerName=localStorage.getItem('name');
        this.getTeammembers();
    }
    getTeammembers() {
        let grps = this.groups.map((obj: any) => obj.id);
        this.httpservice.sendPutRequest(URLUtils.getFilterTypeAttachements,
                                        {'group_acls': grps, 'attachment_type': 'members'}).subscribe(
            (res: any) => {
                if (!res['error'] && res['members']?.length > 0){
                    this.teammembersList = res['members'];
                    let index = this.teammembersList.findIndex((d: any) => d.name === this.ownerName); //find index in your array
                   if(index > -1 ){
                    this.teammembersList.splice(index, 1); //to remove the owner name in 1st index
                   }
                    if (this.teammembers && this.teammembers.length > 0) {
                        this.selectedTeammembers = [...this.teammembers];
                        let res = this.teammembersList.filter((el: any) => {
                            return !this.selectedTeammembers.find((element: any) => {
                                return element.id === el.id;
                            });
                        });
                        this.teammembersList = res
                    }
                    if (this.selectedTeammembers.length == 0) {
                        let checkbox = document.getElementById('selectAll') as HTMLInputElement | null;
                        if (checkbox != null)
                          checkbox.checked = false;
                      }
                }
        })
    }
    selectAll(event: any) {
        if (event?.target?.checked) {
            if (this.teammembersList?.length > 0) {
                if(this.filteredData?.length>0){
                    this.selectedTeammembers = this.selectedTeammembers.concat(this.teammembersList);
                    this.teammembersList = this.teammembersList.filter((el: any) => {
                      return !this.selectedTeammembers.find((element: any) => {
                        return element.id === el.id;
                      });
                    });
                  }
                  else{
                this.selectedTeammembers = this.selectedTeammembers.concat(this.teammembersList);
                this.teammembersList = [];
                  }
            }
        } else {
            this.teammembersList = this.selectedTeammembers.concat(this.teammembersList);
            this.selectedTeammembers = [];
        }
        this.searchText = '';
    }
    selectTeammember(group: any, value?: any) {
        this.selectedTeammembers.push(group);
        let index = this.teammembersList.findIndex((d: any) => d.id === group.id); //find index in your array
        this.teammembersList.splice(index, 1);
        if (this.teammembersList.length==0) {
            let checkbox = document.getElementById('selectAll') as HTMLInputElement | null;
            if (checkbox != null)
              checkbox.checked = true;
          }
        this.searchText = '';
    }
    removeTeammember(group: any) {
        let index = this.selectedTeammembers.findIndex((d: any) => d.id === group.id); //find index in your array
        this.selectedTeammembers.splice(index, 1);
        this.teammembersList.push(group);
        if (this.selectedTeammembers.length == 0|| this.teammembersList.length==1) {
            let checkbox = document.getElementById('selectAll') as HTMLInputElement | null;
            if (checkbox != null)
                checkbox.checked = false;
        }
    }
    saveTeammembers() {
        this.selectedTmsEvent.emit(this.selectedTeammembers);
    }
    OnCancel() {
        this.teammembersList = this.teammembersList.concat(this.selectedTeammembers);
        this.selectedTeammembers = [];
        const checkbox = document.getElementById('selectAll') as HTMLInputElement | null;
        if (checkbox) {
            checkbox.checked = false;
        }
    }
    // keyup(){
    //     if(this.searchText == ' ')
    //     this.searchText=this.searchText.replace(/\s/g, "");
    //     this.filteredData = this.teammembersList.filter((item:any) =>item.name.toLocaleLowerCase().includes(this.searchText));
    //     let checkbox = document.getElementById('selectAll') as HTMLInputElement | null;
    //     if (checkbox != null)
    //       checkbox.checked = false;
    //   }
    keyup() {
        if (this.searchText == ' ') {
          this.searchText = this.searchText.replace(/\s/g, '');
        }
        this.filteredData = this.teammembersList.filter((item: any) => item.name.toLocaleLowerCase().includes(this.searchText));
        // Update visibility based on the filtered data
        this.isSelectAllVisible = this.filteredData.length > 0;
    
        let checkbox = document.getElementById('selectAll') as HTMLInputElement | null;
        if (checkbox != null) {
          checkbox.checked = false;
        }
      }
      truncateString(text: string): string {
        if (text.length > 25) {
          return text.slice(0, 25) + '...';
        }
        return text;
    }  
}
