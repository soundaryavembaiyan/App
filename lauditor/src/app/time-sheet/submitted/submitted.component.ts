import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { URLUtils } from 'src/app/urlUtils';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'submitted',
    templateUrl: 'submitted.component.html',
    styleUrls: ['submitted.component.scss']
})
export class SubmittedComponent implements OnInit{
   
    submitted = false;
    formbsValue: Date = new Date();
    tobsValue: Date = new Date();
    pipe = new DatePipe('en-US');
    bsValue = new Date();
    maxDate: any;
    minDate: any;
    fromDate = new Date();
    toDate = new Date();
    tasks: any;
    project: any;
    hours: any = [{ "name": "Bilable", "returnValue": "bilable" }, { "name": "Non Bilable", "returnValue": "nonBilable" }];
    time: any;
    noOfhours: any;
    noOfMinitus: any;
    selectedbsValue: any;
    projectName: string = '';
    billType: string = "";
    taskName: string = "";
    dates: any;
    matterId: any;
    timeSheetList: any = [];
    nextWeek = new Date();
    prevWeek = new Date();
    currentWeek = new Date();
    //   hoursModel:HoursModel;  
    timeSheetData: any;
    isFrozen: boolean = false;
    constructor(private httpservice: HttpService, private toast: ToastrService) {

    }
    ngOnInit() {

        this.httpservice.getFeaturesdata(URLUtils.getTimeSheets).subscribe((res: any) => {
            this.isFrozen = res?.dates?.isFrozen;
            this.project = res?.timesheetList?.matters;
            this.currentWeek = res?.dates?.currentWeek;
            this.prevWeek = res?.dates?.prevWeek;
            this.nextWeek = res?.dates?.nextWeek;           
            this.timeSheetData = res?.timesheetList;
            this.getDatesList(this.currentWeek);
            this.getTimeSheet(this.currentWeek);
        });

    }
    getDatesList(date: any) {
        let currentDate = date?.split('-');
        if (currentDate) {
            let dateFormat = currentDate[1] + '-' + currentDate[0] + '-' + currentDate[2]
            let curr = new Date(dateFormat);
            let week = [];
            for (let date = 1; date <= 7; date++) {
                let first = curr.getDate() - curr.getDay() + date
                let day = new Date(curr.setDate(first))
                week.push(day)
            }
            this.dates = week;
            this.minDate = this.dates[0];
            this.maxDate = this.dates[6];
        }
    }
    selectFromDuration(date: any) {
        this.formbsValue = date;
    }
    selectToDuration(date: any) {
        this.tobsValue = date;
    }
    selectDuration(date: any) {

        this.selectedbsValue = this.pipe.transform(date, 'dd-MM-yyyy');

    }
    preAndNextWeek(data: any) {
        let filter = (data == "pre") ? this.prevWeek : this.nextWeek;
        this.getTimeSheet(filter);
    }
    deleteTimeSheetEvent(val: any) {
        let obj = {
            id: val
        }
        this.httpservice.sendPostRequest(URLUtils.getTimeSheets,obj).subscribe((res: any) => {
            this.getDatesList(this.currentWeek);
        },
        (error: HttpErrorResponse) => {
            if (error.status === 401 || error.status === 403) {
              const errorMessage = error.error.msg || 'Unauthorized';
              this.toast.error(errorMessage);
              console.log(error);
            }
          });
    }
    getName(item: any) {
        var name = item.matterName
        if (item.matterType)
            name += " - " + item.matterType

        return name
    }
    getTimeSheet(val: any) {
        this.httpservice.getFeaturesdata(URLUtils.getCurrentWeekDetails(val)).subscribe((res: any) => {
            this.isFrozen = res?.dates?.isFrozen;
            this.project = res?.timesheetList?.matters;            
            this.timeSheetData = res?.timesheetList;
            this.currentWeek = res?.dates?.currentWeek;
            this.prevWeek = res?.dates?.prevWeek;
            this.nextWeek = res?.dates?.nextWeek;
            this.getDatesList(this.currentWeek);
        });
    }
    onChange(val: any) {
        let data = val.value.split(',');
        this.projectName = data[1];
        this.matterId = data[2]
        this.httpservice.getFeaturesdata(URLUtils.getTasksDetails(data[0])).subscribe((res: any) => {
            this.tasks = res?.tasks;
        });

    }
    onChangetask(val: any) {
        this.taskName = val.value;

    }
    onChangeHours(val: any) {
        this.billType = val.value;
    }


 
    dateConversion(date: any) {
        let currentDate = date?.split('-');
        let dateFormat = currentDate[1] + '-' + currentDate[0] + '-' + currentDate[2];
        return dateFormat;
    }
    ngAfterViewInit() {

    }
weekSubmit(){
let obj={};
    this.httpservice.sendPostRequest(URLUtils.frezeDate(this.prevWeek), obj ).subscribe((res: any) => {
        this.getTimeSheet(this.selectedbsValue);
    },
    (error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403) {
          const errorMessage = error.error.msg || 'Unauthorized';
          this.toast.error(errorMessage);
          console.log(error);
        }
      })
}
}
