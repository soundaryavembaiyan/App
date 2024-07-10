import { DatePipe } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
//import { environment } from 'src/environments/environment.dev';
import { HttpService } from '../services/http.service';
import { environment } from 'src/environments/environment';
import { URLUtils } from '../urlUtils';
declare let Strophe: any;
declare let $msg: any;
declare let $pres: any;
declare let $iq: any;
declare let $: any;

@Component({
  selector: 'messages',
  templateUrl: 'messages.component.html',
  styleUrls: ['messages.component.scss'],
})
export class MessagesComponent implements OnInit {
  @ViewChild('scrollframe') scrollFrame: any;
  @ViewChild('scrollMe') myScrollContainer!: ElementRef;

  @ViewChildren('messageElements') messageElements!: QueryList<ElementRef>;
  @ViewChild('chatContainer') private chatContainer!: ElementRef;
  //@ViewChild('scrollMe', { static: false }) private scrollMe!: ElementRef;

  @ViewChildren('item')
  itemElements!: QueryList<any>;
  selectedValue: string = 'clients';
  date:any;
  private itemContainer: any;
  private scrollContainer: any;
  private isNearBottom = true;
  timeStamp: any;
  domain = environment.xmppDomain;
  USERNAME = ''; //prof_ravitejachakkadigicoffercom@devchat.digicoffer.com
  PASSWORD: any;
  URL = 'wss://' + this.domain + ':5443/ws';
  client: any;
  toJID = '';
  toName = 'Select Contact';
  chat_title = 'Chat';
  panelOpenState = false;
  usersList: any;
  selfTeammembers = [];
  groups: any;
  firmUsersList = [];
  selectedFirm = '';
  selectedFirmJid = '';
  isAdmin = true;
  firmName: any;
  firmJid = '';
  conn = null;
  showTContacts = false;
  showRContacts = true;
  messages: any;
  filterValue = '';
  cardData = { color: '#FFE599', transparent: '' };
  chatUserName: any;
  orgUser:any;
  //if admin is presenet in team members
  // adminName = ''
  // adminGuid = ''
  adminAccess = [];
  showAdmin = false;
  action = '';
  isClient: boolean = true;
  usersListShow = false;

  usersListData = { title: 'Users' };
  connectionStatus = '';
  messegeInput: string = '';
  term: any;
  clientSearch: any;
  teamSearch: any;
  sendUser: any;
  adminIndex: any;
  public hideRuleContent: boolean[] = [];
  public iconFlag: boolean = false;
  entityClients: any;
  selectedUser: any = [];
  userIndex: any;
  //product: any;
  product = environment.product;
  data: any;
  relationshipSubscribe: any;
  userRole: string = "AAM";
  //messegeInput: string = '';
  // @HostListener('document:keyup', ['$event']) handleKeyUp(event:any) {
  //   if (event.ctrlKey && (event.which == 83)) {
  //     event.preventDefault()
  //     event.stopPropagation()
  //     return false
  //   }
  // }
  isActivediv:boolean = false;

  constructor(
    private httpservice: HttpService,
    private router: Router,
    private toastr: ToastrService, private spinnerService: NgxSpinnerService
  ) {
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.getButtonActive(window.location.pathname.split('/').splice(-1)[0]);
        let data = window.location.pathname.split('/').splice(-1)[0];
        this.isClient = data == 'clients' ? true : false;
        this.chatUserName = '';
        this.messages = [];
      }
    });
  }
  ngOnDestroy(): void {
    // //console.log("disconnecting")
    Strophe.ui.conn.disconnect();
  }

  onFocus(): void {
    this.isActivediv = true;
  }
  onBlur(): void {
    this.isActivediv = false;
  }

  toggle(index: any, val: any) {
    this.messegeInput = '';
    this.term = '';
    // toggle based on index
    this.userIndex = index;
    //this.spinnerService.show()
    this.hideRuleContent[index] = !this.hideRuleContent[index];
    //console.log('hideRuleContent[index]',this.hideRuleContent[index])
    this.usersList.forEach((item: any) => {
      if (item.id == val.id) item.isExpand = true;
      else  item.isExpand = false;
    });
    //console.log('usersList',this.usersList)
    this.groups.forEach((item: any) => {
      if (item.id == val.id) item.isExpand = true;
      else item.isExpand = false;
    });
    //console.log('groups',this.groups)
  }
  isMessageEmpty(): boolean {
    return !this.messegeInput.trim();
  }

  ngOnInit() {

    //this.router.navigate(['/messages/clients']);
  
    var role = localStorage.getItem("role");
    // console.log('role',role)
    if(role != null){
      this.userRole = role
      //console.log('this.userRole',this.userRole)
    }

   if(window.location.pathname == '/messages/clients'){
      this.selectedValue = 'clients';
    }
    else if(window.location.pathname == '/messages/teams'){
      this.selectedValue = 'teams';
    }
    else{
    }

    this.sendUser = localStorage.getItem('name');
    this.messages = [];
    this.getTeams();
    // this.getRelationships();
    // this.getcorpRelationships();
    this.firmName = URLUtils.get_firmName();
    this.isAdmin =
      URLUtils.get_userid() == null || URLUtils.get_userid() == 'admin'
        ? true
        : false;
    this.PASSWORD = localStorage.getItem('TOKEN');
    this.USERNAME = URLUtils.get_jid() + '@' + this.domain;

    // this.xmppConnection()
    var connection = new Strophe.Connection(this.URL);
    connection.connect(this.USERNAME, this.PASSWORD, this.onConnect);
    Strophe.ui = this;
    Strophe.ui.conn = connection;
    this.toasterAlert();

    if (this.product == 'corporate') {
      this.getcorpRelationships();
    }
    else {
      this.getRelationships();
      this.getcorpRelationships();
    }

    //this.scrollToBottom();

    if (this.product !== 'corporate' && this.product !== 'content' && this.userRole === 'AAM') {
      this.isActiveTeam('teams'); // Call isActiveTeam function with 'teams' as initial value
    }
  }

  expandRow(val: any) {
    this.adminIndex = val;
  }
  StartVideo(){
    let token = localStorage.getItem('TOKEN')
    const link =  `${environment.AVChat}?logintype=pro&token=${token}&jid=${URLUtils.get_jid()}&name=${this.chatUserName}`;
    window.location.href = link;
  }
  stanzaHandler(msg: any) {
    // Strophe.ui.conn.addHandler(Strophe.ui.stanzaHandler, null, "message")
    Strophe.ui.xmlParser(msg);
    // Strophe.ui.conn.addHandler(Strophe.ui.stanzaHandler, null, "message");
    return true;
  }
  getButtonActive(buttonName: any) {
    const categoryList = document.getElementsByClassName('button1');
    for (let i = 0; i < categoryList.length; i++) {
      if (categoryList[i].classList.contains(buttonName)) {
        categoryList[i].classList.add('active');
      } else {
        categoryList[i].classList.remove('active');
      }
    }
  }
  onOwnMessage(msg: any) {
    var elems = msg.getElementsByTagName('own-message');
    if (elems.length > 0) {
      var own = elems[0];
      var to = msg.getAttribute('to');
      var from = msg.getAttribute('from');
      var iq = $iq({
        to: from,
        type: 'error',
        id: msg.getAttribute('id'),
      })
        .cnode(own)
        .up()
        .c('error', { type: 'cancel', code: '501' })
        .c('feature-not-implemented', {
          xmlns: 'urn:ietf:params:xml:ns:xmpp-stanzas',
        });

      Strophe.ui.conn.sendIQ(iq);
    }

    return true;
  }

  on_presence(presence: any) {
    //console.log('onPresence:');
    var presence_type = $(presence).attr('type'); // unavailable, subscribed, etc...
    var from = $(presence).attr('from'); // the jabber_id of the contact
    //console.log('   >' + from + ' --> ' + presence_type);
    if (presence_type != 'error') {
      if (presence_type === 'unavailable') {
        // Mark contact as offline
      } else {
        var show = $(presence).find('show').text(); // this is what gives away, dnd, etc.
        if (show === 'chat' || show === '') {
          // Mark contact as online
        } else {
          // etc...
        }
      }
    }
    return true;
  }

  onConnect(status: any) {
    if (status == Strophe.Status.CONNECTING) {
      //console.log('Strophe is connecting.');
    } else if (status == Strophe.Status.CONNFAIL) {
      //console.log('Strophe failed to connect.');
    } else if (status == Strophe.Status.DISCONNECTING) {
      //console.log('Strophe is disconnecting.');
    } else if (status == Strophe.Status.DISCONNECTED) {
      //console.log('Strophe is disconnected.');
    } else if (status == Strophe.Status.CONNECTED) {
      //console.log('Strophe is connected.');

      // Strophe.ui.ajax.success_alert("Connection Established")
      Strophe.ui.conn.addHandler(Strophe.ui.stanzaHandler, null, 'message');
      // Strophe.ui.conn.addHandler(Strophe.ui.onOwnMessage, null, 'iq', 'set', null, null);
      // Strophe.ui.conn.addHandler(Strophe.ui.on_presence, null, 'presence', null, null, null);
      Strophe.ui.conn.send($pres().tree());
    }
  }
  toasterAlert() {
    this.toastr.success('Connection Established');
  }

  // getFilterValue(item:any) {
  //   var name = ""
  //   if (item.client == "business") {
  //     name = item.business
  //   }
  //   else if (item.client == "professional" || item == "prof") {
  //     name = item.professional
  //   }
  //   else if (item.client == "consumer") {
  //     name = item['consumer']['first_name'] + ' ' + item['consumer']['last_name']
  //   }
  //   return name
  // }

  getTMFilterValue(value: any) {
    return value.toLowerCase();
  }

  // private onItemElementsChanged(): void {
  //   if (this.isNearBottom) {
  //     this.scrollToBottom();
  //   }
  // }

  // loadUsersData() {
  //   this.ajax.get(URLUtils.getRelationship).subscribe(
  //     (resp:any) => {
  //       this.usersList = resp['data']['relationships']
  //       // this.loadSelfTeamMembers()
  //     }
  //   )
  // }
  getRelationships() {
    this.httpservice
      .getFeaturesdata(URLUtils.getChatRelationship)
      .subscribe((res: any) => {
        this.usersList = res?.data?.relationships;
        //console.log('usersList',this.usersList)
        this.usersList.forEach((item: any) => {
          if (item.isAccepted) {
            item.isSelected = false;

            this.selectedUser.push(item);
            //console.log('seleUser',this.selectedUser)
          }
        });
        //console.log('chat clients ' + JSON.stringify(this.selectedUser));
      });
  }

  //Corporate Client list
  getcorpRelationships() {
    this.httpservice
      .getFeaturesdata(URLUtils.getcorporateRelationship)
      .subscribe((res: any) => {
        this.usersList = res?.relationships;
        this.usersList.forEach((item: any) => {
          if (item.isAccepted) {
            item.isSelected = false;

            this.selectedUser.push(item);
          }
        });
        //console.log('chat clients ' + JSON.stringify(this.selectedUser));
        //console.log('corp',this.usersList)
      });
  }

  getTeams() {
    this.httpservice
      .getFeaturesdata(URLUtils.getChatUsers)
      .subscribe((res: any) => {
        this.groups = res?.groups;
        this.groups.forEach((item: any) => {
          item.isExpand = false;
        });
        //console.log('chat groups' + JSON.stringify(this.groups));
      });
  }
  removeSpace() {
    let el: any = document.getElementById('space') as HTMLInputElement | null;
    let val = el.value.replace(/\s/g, '');
    //console.log('val' + val);
    this.clientSearch = val;
  }
  // getUsersList(id:any) {
  //   this.ajax.get(`/relationship/${id}/users/notify`).subscribe(
  //     (resp:any) => {
  //       return resp['data'];
  //     }
  //   )
  // }

  // onEnter() {
  //   this.sendMessage(this.messegeInput);
  // }

  // Handle Enter key to send msg.
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.sendMessage(this.messegeInput);
    }
  }

  sendMessage(message: any) {
    // console.log('msg',message)
    // console.log('messages',this.messages)
    // console.log('this.chatUserName',this.chatUserName)
    //console.log('this.orgUser',this.orgUser)

    // Set focus on the inputfield
    setTimeout(() => {
      const textareas = document.querySelectorAll('.form-control.textbox.chatinput');
      const lastTextarea = textareas[textareas.length - 1] as HTMLTextAreaElement;
      if (lastTextarea) {
        lastTextarea.focus();
      }
    });

    if (message.trim() == '') {
      this.toastr.error('Please enter text.');
      return;
    } else if (this.chatUserName == undefined || this.chatUserName == '' || this.orgUser.clientType === "Entity") {
      this.toastr.error('Please select client.');
      return;
    }
    if (message !== 0) {
      var subject =
        localStorage.getItem('name') +
        ' ##' +
        URLUtils.get_jid() +
        '## #N#' +
        localStorage.getItem('name') +
        '#N#';
      var msgXML = $msg({
        to: `${Strophe.ui.toJID}@${Strophe.ui.domain}`,
        type: 'chat',
      })
        .c('subject')
        .t(subject);
      msgXML.up().c('body').t(message);
      Strophe.ui.conn.send(msgXML);
      var timeStamp = new DatePipe('en-US').transform(
        new Date(),
        'MMM dd yyyy HH:mm'
      );
      Strophe.ui.messages.push({
        text: message,
        action: 'SENT',
        timestamp: timeStamp,
      });
      console.log('text', Strophe.ui.messages)
      this.messegeInput = '';
      this.term = '';
    }
    //this.scrollToBottom();
  }

  resetmsgcount(){
    //this.toastr.info('calling...')
    let data = { 'tojid':`${this.toJID}@${this.domain}` , 'fromjid': this.USERNAME}
    //console.log('data',data)
    this.httpservice.sendPostChatRequest(URLUtils.resetmsgcount,data).subscribe((res:any)=>{
    //console.log(res)
    })
  }

  restoreMessages() {
    this.messages = [];

    var query = $iq({ type: 'set', id: this.toJID })
      .c('query', { xmlns: 'urn:xmpp:mam:2' })
      .c('x', { xmlns: 'jabber:x:data', type: 'submit' })
      .c('field', { var: 'FORM_TYPE', type: 'hidden' })
      .c('value', {})
      .t('urn:xmpp:mam:2')
      .up()
      .up()
      .c('field', { var: 'with' })
      .c('value', {})
      .t(`${this.toJID}@${this.domain}`)
      .up()
      .up()
      .up()
      .c('set', { xmlns: 'http://jabber.org/protocol/rsm' })
      .c('max', {})
      .t('500')
      .up()
      .c('before');
    Strophe.ui.conn.send(query);
  }

  handleREsponse(stanza: any) {
    //console.log(stanza);
  }

  async xmlParser(msg: any) {
    var timeStamp;
    var action = 'RECEIVE';
    var from = '';
    var messaageBody = $(msg).find('forwarded')[0];
    var body = '';
    // if (messaageBody != undefined) {
    //   var messaage = $(messaageBody).find('message')[0];
    //   var to = $(messaage).attr('to');
    //   from = $(messaage).attr('from');
    //   this.timeStamp = $(messaageBody).find('delay').attr('stamp');
    //   this.timeStamp = new DatePipe('en-US').transform(
    //     timeStamp,
    //     'MMM dd yyyy HH:mm'
    //   );
    // } else {
    //   var to = $(msg).attr('to');
    //   from = $(msg).attr('from');
    //   this.timeStamp = new DatePipe('en-US').transform(
    //     new Date(),
    //     'MMM dd yyyy HH:mm'
    //   );
    // }
      
    if (messaageBody != undefined) {
      var messaage = $(messaageBody).find('message')[0];
      var to = $(messaage).attr('to');
      from = $(messaage).attr('from');
      timeStamp = $(messaageBody).find('delay').attr('stamp');
      timeStamp = new DatePipe('en-US').transform(
        timeStamp,
        'MMM dd yyyy HH:mm'
      );
      // console.log('timeStamp inside if:', timeStamp);
    } else {
      const to = $(msg).attr('to');
      from = $(msg).attr('from');
      timeStamp = new DatePipe('en-US').transform(
        new Date(),
        'MMM dd yyyy HH:mm'
      );
      // console.log('timeStamp inside else:', timeStamp);
    }

    if (from.indexOf('/') != -1) from = from.split('/')[0];

    var bodies = $(msg).find('body');
    body = Strophe.xmlunescape(Strophe.getText(bodies[0]));
    if (to == this.toJID + '@' + this.domain) action = 'SENT';
    else if (from != this.toJID + '@' + this.domain) action = 'NONE';
    if (action != 'NONE')
      Strophe.ui.messages.push({
        text: body,
        action: action,
        timestamp: timeStamp,
      });
  }
  
  // loadFirmUsers(panelOpenState:any, item:any) {
  //   this.selectedFirm = ""
  //   this.selectedFirmJid = ""
  //   this.client = ""
  //   this.firmUsersList = []
  //   this.ajax.get(`/relationship/${item.id}/users/notify`).subscribe(
  //     (resp:any) => {
  //       // var name = ""
  //       // this.client = item.client
  //       // if (item.client == "professional" || item.client == "prof")
  //       //   name = item.professional
  //       // else if (item.client == "business")
  //       //   name = item.business
  //       // else if (item.client == 'consumer')
  //       //   name = item['consumer']['first_name'] + " " + item['consumer']['last_name']
  //       this.selectedFirm = item['adminName']
  //       this.selectedFirmJid = resp['data']['uid']
  //       this.firmUsersList = resp['data']['users']
  //     }
  //   )
  // }
  selectChatUser(val: any) {
    //console.log('val',val)
    this.messegeInput = '';
    this.term = '';
    // Set focus on the inputfield
    setTimeout(() => {
      const textareas = document.querySelectorAll('.form-control.textbox.chatinput');
      const lastTextarea = textareas[textareas.length - 1] as HTMLTextAreaElement;
      if (lastTextarea) {
        lastTextarea.focus();
      }
    });

    this.selectedUser.forEach((item: any) => {
      if (item.name == val.name) {
        item.isSelected = true;
      } else {
        item.isSelected = false;
      }
    });

    this.toJID = '';
    this.chatUserName = val.name;
    this.orgUser = val
    //console.log('user' + JSON.stringify(val));
    this.toJID = val.guid;
    if (val.clientType == 'Entity') {
      this.spinnerService.show()
      this.httpservice
        .sendGetRequest(URLUtils.getNotify(val))
        .subscribe((res: any) => {
          this.spinnerService.hide()
          //console.log('notify ' + JSON.stringify(res));
          this.entityClients = res?.data?.users;
          //console.log("temp clients "+JSON.stringify(this.entityClients));
          // console.log('notify ' + JSON.stringify(res));
          // console.log('entityClients ',this.entityClients);
          
          this.restoreMessages();
          this.resetmsgcount();
        });
    }
    this.messages = [];
    this.restoreMessages();
    this.resetmsgcount();
  }


  selectUser(jid: any, name: any, groupName: any) {
    // (<HTMLInputElement>document.getElementById("btn_send")).disabled = false;
    // this.toJID = jid
    // if (groupName.toLowerCase() == 'admin')
    //   this.toName = name + " - " + groupName
    // else if (groupName.toLowerCase() == 'backupadmin')
    //   this.toName = name + " - " + groupName
    // else
    //   this.toName = groupName + " - " + name
    this.messages = [];
    this.restoreMessages();
    //console.log();
  }

  chatUsers(
    jid: any,
    name: any,
    isAdmin: any,
    userid: any,
    firm: any,
    item: any
  ) {
    // (<HTMLInputElement>document.getElementById("btn_send")).disabled = false;
    // this.toJID = jid
    // if(item['clientType'] == 'Consumer'){
    //    this.toName = name
    // } else {
    //     this.toName = name + " - " + item.name
    // }
    this.messages = [];
    this.restoreMessages();
  }

  // private scrollToBottom(): void {
  //   this.scrollContainer.scroll({
  //     top: this.scrollContainer.scrollHeight,
  //     left: 0,
  //     behavior: 'smooth'
  //   });
  // }

  private isUserNearBottom(): boolean {
    const threshold = 150;
    const position =
      this.scrollContainer.scrollTop + this.scrollContainer.offsetHeight;
    const height = this.scrollContainer.scrollHeight;
    return position > height - threshold;
  }

  scrolled(event: any) {
    this.isNearBottom = this.isUserNearBottom();
  }
  ngAfterViewInit() {
    // this.getRelationships();
    //this.scrollToBottom();
    // this.scrollContainer = this.scrollFrame.nativeElement;
    // this.itemElements.changes.subscribe(_ => this.onItemElementsChanged());
  }

  // scrollToBottom() {
  //   try {
  //     if (this.myScrollContainer)
  //       this.myScrollContainer.nativeElement.scroll({
  //         top: this.myScrollContainer.nativeElement.scrollHeight,
  //         left: 0,
  //         behavior: 'smooth',
  //       });
  //   } catch (err) { }
  // }

   scrollToBottom() {
    let scrollerContent = document.getElementById("coffer-chat");
    document.getElementById('btn_send')?.addEventListener('click', function () {
      if (scrollerContent?.lastElementChild) {
        let newChild = scrollerContent.lastElementChild.cloneNode(true) as HTMLElement;
        newChild.innerHTML = "" + (scrollerContent.children.length);
        scrollerContent.appendChild(newChild);
        scrollerContent.scrollTop = scrollerContent.scrollHeight; // Scroll to bottom
      }
    });
  }
  
  isActive(value: string) {
    this.clientSearch = '';
    this.teamSearch = '';
    this.messegeInput = '';
    this.term = ''; //clear value on search
    this.selectedValue = value;
    this.selectedValue == 'clients' ? this.router.navigate(['/messages/clients']) : this.router.navigate(['/messages/teams']);
  }

  isActiveTeam(value: string): void {
    this.clientSearch = '';
    this.teamSearch = '';
    this.messegeInput = '';
    this.term = ''; //clear value on search
    this.selectedValue = value;
    this.selectedValue === 'teams' ? this.router.navigate(['/messages/teams']) : this.router.navigate(['/messages/clients']);
  }

  restricttextSpace(event: any) {
    let inputValue: string = event.target.value;
    inputValue = inputValue.replace(/^\s+/, '');
    inputValue = inputValue.replace(/\s{2,}/g, ' ');
    event.target.value = inputValue;
    return;
  }

}

//     constructor(private router:Router){
//       this.router.events.subscribe((val) => {
//         if (val instanceof NavigationEnd) {
//           this.getButtonActive(window.location.pathname.split("/").splice(-1)[0]);
//         }
//     });

//     }
//     ngOnInit(): void {

//     }
//     getButtonActive(buttonName:any){
//         const categoryList=document.getElementsByClassName("button1");
//         for(let i=0;i<categoryList.length;i++){
//           if(categoryList[i].classList.contains(buttonName)){
//             categoryList[i].classList.add('active');
//           }else{
//             categoryList[i].classList.remove('active');
//           }
//         }
//     }
// }


