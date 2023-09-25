import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { URLUtils } from 'src/app/urlUtils';
import { environment } from 'src/environments/environment.dev';
import { MessageService } from '../message.service';
declare let Strophe: any;
declare let $msg: any;
declare let $pres: any;
declare let $iq: any;
declare let $: any;
@Component({
    selector: 'chat',
    templateUrl: 'chat.component.html',
    styleUrls: ['chat.component.scss']
})
export class ChatComponent implements OnInit {


    domain = environment.xmppDomain;
    URL = "wss://' + this.domain + ':5443/ws";

    isAdmin: boolean = true
    firmName: any;
    clientInfo: any;
    USERNAME: any;
    PASSWORD: any;
    messages: any = [];

    private itemContainer: any;
    private scrollContainer: any;
    private isNearBottom = true;
    toJID: any;
    toName: any;
    timeStamp:any;
    constructor(private httpservice: HttpService, private messageService: MessageService) {

    }
    ngOnInit(): void {
      this.messageService.currentMessage.subscribe((message: any) => {
        this.clientInfo = message;
        this.toJID = this.clientInfo.guid;
        if (!this.toJID && this.clientInfo?.name) {
            this.httpservice.sendGetRequest(URLUtils.getNotify(this.clientInfo)).subscribe((res: any) => {
                this.toJID = res?.data?.uid;
              this.restoreMessages();
            })
        } else {
          if(this.toJID)
          this.restoreMessages();
        }
    }); 
        this.firmName = URLUtils.get_firmName();
        this.isAdmin = URLUtils.get_userid() == null || URLUtils.get_userid() == "admin" ? true : false
        this.PASSWORD = localStorage.getItem("TOKEN");
        this.USERNAME = URLUtils.get_jid() + "@" + this.domain;

        // this.xmppConnection()
     
        var connection = new Strophe.Connection(this.URL);
        connection.connect(this.USERNAME, this.PASSWORD, this.onConnect);
        
        Strophe.ui = this;
        Strophe.ui.conn = connection;
       
    }
    onConnect(status: any) {
        console.log("status " + status);
        if (status == Strophe.Status.CONNECTING) {
            console.log('Strophe is connecting.');
        } else if (status == Strophe.Status.CONNFAIL) {
            console.log('Strophe failed to connect.');
        } else if (status == Strophe.Status.DISCONNECTING) {
            console.log('Strophe is disconnecting.');
        } else if (status == Strophe.Status.DISCONNECTED) {
            console.log('Strophe is disconnected.');
        } else if (status == Strophe.Status.CONNECTED) {
            console.log('Strophe is connected.');
        }
    }
    sendMessage(text: any) {
        let message = text;
        var subject = localStorage.getItem('name') + " ##" + URLUtils.get_jid() + "## #N#" + localStorage.getItem('name') + "#N#"
        var msgXML = $msg({ to: `${Strophe.ui.toJID}@${Strophe.ui.domain}`, type: "chat" }).c('subject').t(subject);
        msgXML.up().c('body').t(message);
        Strophe.ui.conn.send(msgXML);
        var timeStamp = new DatePipe('en-US').transform(new Date(), 'MMM dd yyyy HH:mm')
        Strophe.ui.messages.push({ text: message, action: 'SENT', timestamp: timeStamp })
        
    }

    private isUserNearBottom(): boolean {
        const threshold = 150;
        const position = this.scrollContainer.scrollTop + this.scrollContainer.offsetHeight;
        const height = this.scrollContainer.scrollHeight;
        return position > height - threshold;
    }
    scrolled(event: any): void {
        this.isNearBottom = this.isUserNearBottom();
    }


    chatUsers(jid: any, name: any, item: any) {
        // (<HTMLInputElement>document.getElementById("btn_send")).disabled = false;
        this.toJID = jid
        if (item['clientType'] == 'Consumer') {
            this.toName = name;
        } else {
            this.toName = name + " - " + item.name;
        }
        this.messages = [];
        this.restoreMessages();
    }

    restoreMessages() {
        this.messages = [];
        var query = $iq({ type: 'set', id: this.toJID })
            .c('query', { xmlns: 'urn:xmpp:mam:2' })
            .c('x', { xmlns: 'jabber:x:data', type: 'submit' })
            .c('field', { var: 'FORM_TYPE', type: 'hidden' })
            .c('value', {}).t('urn:xmpp:mam:2').up().up()
            .c('field', { var: 'with' })
            .c('value', {}).t(`${this.toJID}@${this.domain}`).up().up().up()
            .c('set', { xmlns: 'http://jabber.org/protocol/rsm' })
            .c('max', {}).t('500').up()
            .c('before');
        Strophe.ui.conn.send(query)
    }
    on_presence(presence:any) {
        //console.log('onPresence:');
        var presence_type = $(presence).attr('type'); // unavailable, subscribed, etc...
        var from = $(presence).attr('from'); // the jabber_id of the contact
        if (presence_type != 'error') {
          if (presence_type === 'unavailable') {
            // Mark contact as offline
          } else {
            var show = $(presence).find("show").text(); // this is what gives away, dnd, etc.
            if (show === 'chat' || show === '') {
              // Mark contact as online
            } else {
              // etc...
            }
          }
        }
        return true;
      }

    stanzaHandler(msg:any) {
        // Strophe.ui.conn.addHandler(Strophe.ui.stanzaHandler, null, "message")
        Strophe.ui.xmlParser(msg)
        // Strophe.ui.conn.addHandler(Strophe.ui.stanzaHandler, null, "message");
        return true
      }
      async xmlParser(msg:any) {
        var action = "RECEIVE"
        var from = ""
        var messaageBody = $(msg).find('forwarded')[0]
        var body = ""
        if (messaageBody != undefined) {
          var messaage = $(messaageBody).find('message')[0]
          var to = $(messaage).attr('to')
          from = $(messaage).attr('from')
          this.timeStamp = $(messaageBody).find('delay').attr("stamp");
          this.timeStamp = new DatePipe('en-US').transform(this.timeStamp, 'MMM dd yyyy HH:mm')
        }
        else {
          var to = $(msg).attr('to')
          from = $(msg).attr('from')
          this.timeStamp = new DatePipe('en-US').transform(new Date(), 'MMM dd yyyy HH:mm')
        }
    
        if (from.indexOf("/") != -1)
          from = from.split("/")[0]
    
        var bodies = $(msg).find('body')
        body = Strophe.xmlunescape(Strophe.getText(bodies[0]))
        if (to == (this.toJID + "@" + this.domain))
          action = "SENT"
        else if (from != (this.toJID + "@" + this.domain))
          action = "NONE"
        if (action != "NONE")
          Strophe.ui.messages.push({ text: body, action: action, timestamp: this.timeStamp })
        this.scrollToBottom()
      }
      private scrollToBottom(): void {
        this.scrollContainer.scroll({
          top: this.scrollContainer.scrollHeight,
          left: 0,
          behavior: 'smooth'
        });
      }
}
