
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  public selectedDocs = new Subject();
  public messageSubject = new Subject();
  document: any;
  docModel: any;
  constructor() {

  }
  updateDocData(data: any) {
    this.selectedDocs.next(data);

  }
  public setData(message: string) {
    this.messageSubject.next(message);
  }

  public getData(): Observable<any> {
    return this.messageSubject.asObservable();
  }
  addToService(doc: any) {
    this.document = doc;
  }

  getItems() {
    return this.document;
  }

  addDocModel(doc: any) {
    this.docModel = doc
  }
  getDocModel() {
    return this.docModel;
  }
}