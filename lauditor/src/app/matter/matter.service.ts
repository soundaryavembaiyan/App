import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { BehaviorSubject, Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class MatterService {
  legalMatter: any;
  editLegalMatterSubject = new BehaviorSubject<any>(null);
  editLegalMatterObservable: Observable<any> = this.editLegalMatterSubject.asObservable();
  editGeneralMatterSubject = new BehaviorSubject<any>(null);
  editGeneralMatterObservable: Observable<any> = this.editGeneralMatterSubject.asObservable();
  constructor() {
  }
  editLegalMatter(legalMatter: any) {
    this.editLegalMatterSubject.next(legalMatter);
  }
  editGeneralMatter(generalMatter: any) {
    this.editGeneralMatterSubject.next(generalMatter);
  }


}