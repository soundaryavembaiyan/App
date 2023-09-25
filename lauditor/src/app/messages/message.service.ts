
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  
    public editDataDetails: any = [];
    public subject = new Subject<any>();
    private messageSource = new  BehaviorSubject(this.editDataDetails);
    currentMessage = this.messageSource.asObservable();

    constructor(){

    }
    changeMessage(message: string) {
    this.messageSource.next(message)
    //console.log("message"+ JSON.stringify(message));
    }
}