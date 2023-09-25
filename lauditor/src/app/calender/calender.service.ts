import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { BehaviorSubject, Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CalenderService {
  editCalenderSubject = new BehaviorSubject<any>(null);
  editCalenderObservable: Observable<any> = this.editCalenderSubject.asObservable();
  constructor() {
  }
  editEvent(event: any) {
    this.editCalenderSubject.next(event);
  }


}