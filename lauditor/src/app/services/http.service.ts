import { async } from '@angular/core/testing';
import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { Subject } from 'rxjs';
const httpOptions = {
  headers: new HttpHeaders({
    "Authorization": "Bearer " + localStorage.getItem('TOKEN')
  })
};
@Injectable({
  providedIn: 'root'
})
export class HttpService {
  api: string;
  featureapi: string;
  emailApi:string;
  public items = new Subject();
  public selectedDocs = new Subject();
  constructor(private httpClient: HttpClient) {
    this.api = environment.apiUrl,
      this.featureapi = environment.apiUrl;
      this.emailApi=environment.emailApi;
  }


  sendGetRequest(apiUrl: any) {
    let finalUrl = this.api + apiUrl;
    return this.httpClient.get(finalUrl, this.get_httpoptions());
  }
  sendGetEmailRequest(apiUrl: any) {
    let finalUrl = this.emailApi + apiUrl;
    return this.httpClient.get(finalUrl,this.get_httpoptions());
  }
  sendPostEmailRequest(apiUrl: any, data: any): Observable<Object> {
    let finalUrl = this.emailApi + apiUrl;
    return this.httpClient.post(finalUrl, data, this.get_httpoptions());
  }
  // sendGetMessages(apiUrl: any){
  //   return this.httpClient.get(apiUrl,this.get_httpoptions());
  // }
  sendPostRequest(apiUrl: any, data: any): Observable<Object> {
    let finalUrl = this.api + apiUrl;
    return this.httpClient.post(finalUrl, data, this.get_httpoptions());
  }
  sendPutRequest(apiUrl: any, data: any): Observable<Object> {
    let finalUrl = this.api + apiUrl;
    return this.httpClient.put(finalUrl, data, this.get_httpoptions());
  }
  sendPatchRequest(apiUrl: any, data: any): Observable<Object> {
    let finalUrl = this.api + apiUrl;
    return this.httpClient.patch(finalUrl, data, this.get_httpoptions());
  }
  sendUpdateRequest(apiUrl: any, data: any): Observable<Object> {
    let finalUrl = this.api + apiUrl;
    return this.httpClient.put(finalUrl, data, this.get_httpoptions());
  }
  sendDeleteRequest(apiUrl: any): Observable<Object> {
    let finalUrl = this.featureapi + apiUrl;
    return this.httpClient.delete(finalUrl, this.get_httpoptions());
  }
  sendDeleteRequestwithObj(apiUrl: any, data: any): Observable<Object> {
    let finalUrl = this.featureapi + apiUrl;
    return this.httpClient.delete(finalUrl, this.httpOptionsDelete(data));
  }
  httpOptionsDelete(data: any) {
    const httpOptions = {
      body: data,
      headers: new HttpHeaders({
        "Authorization": "Bearer " + localStorage.getItem('TOKEN')
      })
    };
    return httpOptions
  }
  get_httpoptions() {
    const httpOptions = {
      headers: new HttpHeaders({
        "Authorization": "Bearer " + localStorage.getItem('TOKEN')
      })
    };
    return httpOptions
  }
  getFeaturesdata(apiUrl: any) {
    let finalUrl = this.featureapi + apiUrl;
    return this.httpClient.get(finalUrl, this.get_httpoptions());
  }
  updateCategoty(cat: any) {
    this.items.next(cat);
  }
  updateDocData(data: any) {
    this.selectedDocs.next(data);

  }
}