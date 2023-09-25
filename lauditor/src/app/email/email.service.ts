import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { BehaviorSubject } from 'rxjs';
@Injectable({
    providedIn: 'root'
})
export class EmailService {
    emailSubject = new BehaviorSubject<any>(null);
    emailObservable: Observable<any> = this.emailSubject.asObservable();
    constructor() {
    }
    emailEvent(event: any) {
        this.emailSubject.next(event);
    }


}