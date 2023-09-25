import { Component, OnDestroy, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { NavigationEnd, Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { HttpService } from 'src/app/services/http.service';
import { URLUtils } from '../../urlUtils';
import { ModalService } from 'src/app/model/model.service';
import { environment } from 'src/environments/environment';
import { type } from 'jquery';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
    selector: 'view-relationship',
    templateUrl: 'view-relationship.component.html',
    styleUrls: ['view-relationship.component.scss']
})
export class ViewRelationshipComponent implements OnInit, OnDestroy {
    @Input() data: any;
    @BlockUI()
    blockUI!: NgBlockUI;
    relationshipData: any = {};
    relationshipList: any[] = [];
    relationshipSubscribe: Subscription = new Subscription;
    activeTab: string = 'individuals';
    showModifyForm: boolean = false;
    showExchange: boolean = false;
    showDelConfirm: boolean = false;
    selectedRel: any = {};
    highlight: string = "";
    searchText: string = "";
    product = environment.product;
    isReverse:boolean=false;
    documents:any=[];
    showConfirm: boolean = false;
    selname: any;
    rel: any;
    //payload: any;
    response: any;
    payload: any;
    

    
    constructor(private httpservice: HttpService,
                private router: Router,
                private activeRoute: ActivatedRoute,
                private modal: ModalService,
                private cd: ChangeDetectorRef,
                private toastr: ToastrService) {
    }

    ngOnInit(): void {
        this.activeRoute.params.subscribe(params => {
            this.activeTab = params['filter']
            this.highlight = params['highlight']
            this.loadData()
        });
    }

    // Just reset the tab when clicked.
    tabReset(name: string){
        this.activeTab = name;
        this.showModifyForm = false;
        this.showExchange = false;
        this.showDelConfirm = false;
        this.relationshipData = {};
        this.relationshipList = [];
        this.loadData()

        console.log('dddddddddd ',this.relationshipList);
    }
    
    loadData(){
        let url:any;
        if(this.activeTab=='temporary'){
            url  = URLUtils.relationshipTemporary;
            this.relationshipSubscribe = this.httpservice.getFeaturesdata(url).subscribe(
                (res: any) => {
                    //this.relationshipList = res?.data?.relationships;
                    this.relationshipList = res?.data;
                })
        }
        else if(this.activeTab=='corporate'){
            url  = URLUtils.getcorporateRelationship;
            this.relationshipSubscribe = this.httpservice.getFeaturesdata(url).subscribe(
                (res: any) => {
                    this.relationshipList = res?.relationships;
                })
        }
        
        else{
        url  = URLUtils.getRelationshipFiltered(this.activeTab)
        
        
        this.relationshipSubscribe = this.httpservice.getFeaturesdata(url).subscribe(
            (res: any) => {
                this.relationshipList = res?.data?.relationships;
                console.log(this.relationshipList)
            })}
    }
    
    //acceptRelationshipCorp - corp accept

    accept(rel: any) {
       
        if(this.activeTab=='business' && environment.product != 'corporate'){
            this.httpservice.sendPostRequest(URLUtils.acceptRelationship(rel),
                {}).subscribe((res: any) => {
                    this.loadData()
                    console.log('formTab', this.activeTab)
                    if(res.error)
                    this.toastr.error(res.msg)
                },
                (error: HttpErrorResponse) => {
                    if (error.status === 401 || error.status === 403) {
                      const errorMessage = error.error.msg || 'Unauthorized';
                      this.toastr.error(errorMessage);
                      console.log(error);
                    }
                  }
               
            )
            }
            
          else{  
            let payload = {
                "response":"yes"
            }
            this.httpservice.sendPutRequest(URLUtils.acceptRelationshipCorp(rel), payload
                ).subscribe((res: any) => {
                    this.loadData()
                },
                (error: HttpErrorResponse) => {
                    if (error.status === 401 || error.status === 403) {
                      const errorMessage = error.error.msg || 'Unauthorized';
                      this.toastr.error(errorMessage);
                      console.log(error);
                    }
                  })
        
       console.log('activeTab', this.activeTab)
        //console.log('payload', this.payload)
    }
}

    
    ngOnDestroy() {
        if (this.relationshipSubscribe) {
            this.relationshipSubscribe.unsubscribe();
        }
    }

    delrel(rel: any){
        this.selectedRel = rel
        this.showDelConfirm = true
    }

    deleteRel(){
        this.httpservice.sendPostRequest(URLUtils.terminateRelationship(this.selectedRel), {}).subscribe(
            (res: any) => {
                this.showDelConfirm = false
                this.loadData()
            },
            (error: HttpErrorResponse) => {
                if (error.status === 401 || error.status === 403) {
                  const errorMessage = error.error.msg || 'Unauthorized';
                  this.toastr.error(errorMessage);
                  console.log(error);
                }
              })
    }

    // getButtonActive(buttonName:any){
    //   const categoryList=document.getElementsByClassName("relSubTab");
    //   for(let i=0;i<categoryList.length;i++){
    //     if(categoryList[i].classList.contains(buttonName)){
    //       categoryList[i].classList.add('active');
    //     }else{
    //       categoryList[i].classList.remove('active');
    //     }
    //   }
    // }
    
    closeModal(id: any) {
        this.modal.close(id);
    }

    openModel(id: any) {
        this.modal.open(id);
    }
    gotoDetail(name: string): void {
        this.activeTab = name
    }

    modifyGroups(rel: any){
        this.relationshipData = rel;
        this.showModifyForm = true;
    }

    exchangeInfo(rel: any){
        this.relationshipData = rel;
        this.showExchange = true
    }
    openConfirmBox(rel:any){
        this.relationshipData = rel;
        this.showConfirm = true
        this.selname = rel?.name

    }
    send_invite_temp(){
        
        let payload = {
            "client_id": this.relationshipData?.client_id,
            "client_type": this.relationshipData?.clientType
        }
    
        this.blockUI.start()
        this.httpservice.sendPostRequest(URLUtils.ConvertTempClients,payload).subscribe((resp:any)=>{
            if(resp.msg){
                this.showConfirm = false
                this.blockUI.stop()
                this.toastr.success(resp.msg)
                this.loadData()
            } else if(resp.errors){
                this.blockUI.stop()
                for(let error of resp.errors){
                    if(error.field === 'client_type'){
                        // handle error related to client_type field
                        this.toastr.error(`client_type: ${error.msg}`)
                    } else {
                        // handle other error cases
                        this.toastr.error(`client id: ${error.msg}`)
                    }
                }
            }
        },
        (error: HttpErrorResponse) => {
            if (error.status === 401 || error.status === 403) {
              const errorMessage = error.error.msg || 'Unauthorized';
              this.toastr.error(errorMessage);
              console.log(error);
            }
          }
        )
        
        
    }

    onChildEvent(msg: string){
        if(msg == 'group-access-close'){
            this.showModifyForm = false
        }
        if(msg == 'group-access-done'){
           this.showModifyForm = false
           this.modal.open('group-update-success')
           this.loadData()
        }
        if(msg == 'exchange-close'){
            this.showExchange = false
        }
    }
    sortingFile(val: any) {
        this.isReverse = !this.isReverse;
        if (this.isReverse) {
            this.relationshipList = this.relationshipList?.sort((p1: any, p2: any) => (p1[val] < p2[val]) ? 1 : (p1[val] > p2[val]) ? -1 : 0);
           
        } else {
            this.relationshipList = this.relationshipList?.sort((p1: any, p2: any) => (p1[val] > p2[val]) ? 1 : (p1[val] < p2[val]) ? -1 : 0);
            
        }
    }
}
