import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ModalService } from 'src/app/model/model.service';
import { HttpService } from 'src/app/services/http.service';
import { HoursModel } from 'src/app/shared/config-model';
import { URLUtils } from 'src/app/urlUtils';


@Component({
  selector: 'non-submitted',
  templateUrl: 'non-submitted.component.html',
  styleUrls: ['non-submitted.component.scss'],
})
export class NonSubmittedComponent implements OnInit {
  @ViewChild('selectedData') selectedData!: ElementRef;
  hoursform: FormGroup;
  submitted = false;
  // formbsValue: Date = new Date();
  // tobsValue: Date = new Date();
  pipe = new DatePipe('en-US');
  bsValue = new Date();
  // minDate: any;
  tasks: any;
  project: any;
  hours: any = [
    { name: 'Billable', returnValue: 'billable' },
    { name: 'Non Billable', returnValue: 'non-billable' },
  ];
  minutes: any = [
    { name: '00', returnValue: '00' },
    { name: '15', returnValue: '15' },
    { name: '30', returnValue: '30' },
    { name: '45', returnValue: '45' },
  ];
  selectedbsValue: any;
  billType: string = '';
  taskName: string = '';
  dates: any;
  matterId: any;
  nextWeek = new Date();
  prevWeek = new Date();
  currentWeek = new Date();
  hoursModel: HoursModel = new HoursModel();
  timeSheetData: any;
  matterType: any;
  refreshDate: any;
  resMessage: any;
  taskId: any;
  btnText: string = '+ Add';
  isFrozen: boolean = false;
  addEmptyTask: boolean = false;
  minDate: any = new Date();
  maxDate: any;
  constructor(
    private httpservice: HttpService,
    private formBuilder: FormBuilder,
    private modalService: ModalService,
    public toastr: ToastrService
  ) { }
  ngOnInit() {
    this.hoursform = this.formBuilder.group({
      matter_type: ['', Validators.required],
      title: ['', Validators.required],
      billing: ['', Validators.required],
      date: ['', Validators.required],
      duration_minutes: ['', Validators.required],
      duration_hours: ['', Validators.required],
    });
    this.httpservice
      .getFeaturesdata(URLUtils.getTimeSheets)
      .subscribe((res: any) => {
        this.isFrozen = res?.dates?.isFrozen;
        this.project = res?.timesheetList?.matters;
        this.currentWeek = res?.dates?.currentWeek;
        this.prevWeek = res?.dates?.prevWeek;
        this.minDate = new Date(this.prevWeek);
        this.nextWeek = res?.dates?.nextWeek;
        this.timeSheetData = res?.timesheetList;
        this.convertMinutes();
        this.getDatesList(this.currentWeek);
        // this.getTimeSheet(this.currentWeek);
        //console.log(" this.timeSheetData  " + JSON.stringify(this.timeSheetData));
      });
  }
  getDatesList(date: any) {
    let currentDate = date?.split('-');
    if (currentDate) {
      let dateFormat =
        currentDate[1] + '-' + currentDate[0] + '-' + currentDate[2];
      let curr = new Date(currentDate[2], currentDate[1] - 1, currentDate[0]);
      let week = [];
      for (let date = 1; date <= 7; date++) {
        let first = curr.getDate() - curr.getDay() + date;
        let day = new Date(curr.setDate(first));
        week.push(day);
      }
      this.dates = week;
      this.minDate = this.dates[0];
      this.maxDate = this.dates[6];
      this.hoursform.controls['date'].setValue(this.minDate);
    }
  }
  get f() {
    return this.hoursform.controls;
  }

  selectDuration(date: any) {
    //console.log('date ' + date.value);
    this.selectedbsValue = this.pipe.transform(date.value, 'dd-MM-yyyy');
  }
  preAndNextWeek(data: any) {
    let filter = data == 'pre' ? this.prevWeek : this.nextWeek;
    let convertDate = this.dateConversion(filter);
    this.bsValue = new Date(convertDate);
    this.getTimeSheet(filter);
    this.onReset();
    this.isFrozen = false;
    this.addEmptyTask = false;
  }
  deleteTimeSheetEvent(val: any) {
    this.taskId = val;
    this.modalService.open('delete-Alert');
  }
  deleteTask() {
    let obj = {
      id: this.taskId,
    };
    this.httpservice
      .sendDeleteRequestwithObj(URLUtils.getTimeSheets, obj)
      .subscribe((res: any) => {
        this.taskId = '';
        this.onReset();

        this.resMessage = res.msg;
        this.modalService.open('success');
      },
      (error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403) {
          const errorMessage = error.error.msg || 'Unauthorized';
          this.toastr.error(errorMessage);
          console.log(error);
        }
      }
        );
    this.getTimeSheet(this.currentWeek);
    this.convertMinutes();
  }
  getTimeSheet(val: any) {
    this.httpservice
      .getFeaturesdata(URLUtils.getCurrentWeekDetails(val))
      .subscribe((res: any) => {
        this.isFrozen = res?.dates?.isFrozen;
        this.project = res?.timesheetList?.matters;
        this.timeSheetData = res?.timesheetList;
        this.currentWeek = res?.dates?.currentWeek;
        this.convertMinutes();
        this.prevWeek = res?.dates?.prevWeek;
        this.nextWeek = res?.dates?.nextWeek;
        this.getDatesList(this.currentWeek);
      });

  }
  onChange(val: any) {
    this.selectedProject(val.value);
    //console.log("test  "+JSON.stringify(val));
    // this.hoursform.value.title = '';
  }
  onChangetask(val: any) {
    // this.taskName = val.value;
  }
  onChangeHours(val: any) {
    // this.billType = val.value;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.hoursform.invalid) {
      return;
    }
    if (this.hoursform.value.duration_hours == '24') {
      this.hoursform.controls['duration_minutes'].setValue('00');
    }
    this.hoursform.value.duration_hours = this.hoursform.value.duration_hours
      ? this.hoursform.value.duration_hours
      : '00';

    this.hoursform.value.date = this.pipe.transform(
      this.hoursform.value.date,
      'MMM d, y'
    );
    this.hoursform.value.action = 'hours';

    this.hoursform.value.matter_id = this.matterId;
    this.hoursform.value.matter_type = this.matterType;
    // this.hoursform.value.title = this.hoursform.value.title +" - "+ this.hoursform.value.billing;
    if (this.taskId) {
      this.hoursform.value.id = this.taskId;

      this.hoursform.value.duration_hours = this.hoursform.value.duration_hours.toString();
      this.httpservice
        .sendPutRequest(URLUtils.getTimeSheets, this.hoursform.value)
        .subscribe(
          (res: any) => {
            this.resMessage = res.msg;
            this.toastr.success(res.msg);
            let selectedDate = this.pipe.transform(this.minDate, 'dd-MM-yyyy');
            this.getTimeSheet(selectedDate);
            if (res) {
              this.btnText = '+ Add';
              this.onReset();
              this.taskId = '';
            }
          },
          // (err: any) => {
          //   this.toastr.error(
          //     err.error.errors[0].field + ' ' + err.error.errors[0].msg
          //   );
          // }

          (error: HttpErrorResponse) => {
            if (error.status === 401|| error.status === 403) {
              const errorMessage = error.error.msg || 'Unauthorized';
              this.toastr.error(errorMessage);
              console.log(error);
            }
            else {
              this.toastr.error(
                error.error.errors[0].field + ' ' + error.error.errors[0].msg
              );
            }
      
          }

        );
    } else {
      this.httpservice
        .sendPostRequest(URLUtils.getTimeSheets, this.hoursform.value)
        .subscribe(
          (res: any) => {
            this.resMessage = res.msg;
            this.toastr.success(res.msg);
            let selectedDate = this.pipe.transform(this.minDate, 'dd-MM-yyyy');
            this.getTimeSheet(selectedDate);

            if (res) {
              this.addEmptyTask = false;
              this.btnText = '+ Add';
              this.onReset();
            }
          },
          (error: HttpErrorResponse) => {
            if (error.status === 401 || error.status === 403) {
              const errorMessage = error.error.msg || 'Unauthorized';
              this.toastr.error(errorMessage);
              console.log(error);
            }
            else{
             this.toastr.error(error.error.errors[0].field + ' ' + error.error.errors[0].msg);
             }
          }


        );
    }
  }
  onReset() {
    this.submitted = false;
    this.hoursModel.duration_minutes = '00';
    this.hoursModel.duration_hours = '00';
    this.hoursModel.title = '';
    this.hoursModel.billing = '';
    this.hoursModel.matter_type = '';
    this.btnText = '+ Add';
    this.taskId = '';
  }
  dateConversion(date: any) {
    let currentDate = date?.split('-');
    let dateFormat =
      currentDate[1] + '/' + currentDate[0] + '/' + currentDate[2];
    return dateFormat;
  }
  ngAfterViewInit() { }
  weekSubmit() {
    let obj = {};
    this.httpservice
      .sendPostRequest(URLUtils.frezeDate(this.currentWeek), obj)
      .subscribe((res: any) => {
        if (res) {
          this.resMessage = res.msg;
          this.modalService.open('success');
        }
        this.getTimeSheet(this.currentWeek);
      },
      (error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403) {
          const errorMessage = error.error.msg || 'Unauthorized';
          this.toastr.error(errorMessage);
          console.log(error);
        }
      });
  }

  addTimesheet(
    _taskDayDetails: any,
    day: any,
    matterIndex: any,
    taskIndex: any,
    _taskName: any,
    item: any
  ) {
    this.selectedProject(item.matterName);
    this.addEmptyTask = true;
    this.hoursModel.billing = this.timeSheetData['matters'][matterIndex]['tasks'][taskIndex]['billing'];
    let selectedDetails = { day: day };
    this.hoursModel.duration_hours = this.timeSheetData['matters'][matterIndex]['tasks'][taskIndex][day]['hours'];
    this.hoursModel.duration_minutes = this.timeSheetData['matters'][matterIndex]['tasks'][taskIndex][day]['minutes'];
    this.hoursModel.matter_type = item.matterName;
    this.hoursModel.title = _taskName;
    this.bsValue = new Date(
      this.timeSheetData['headers'][selectedDetails['day']]
    );
    this.hoursform.controls['date'].setValue(this.bsValue);
  }
  editTimesheet(
    _taskDayDetails: any,
    day: any,
    matterIndex: any,
    taskIndex: any,
    _taskName: any,
    item: any
  ) {
    this.btnText = "Update";
    this.selectedProject(item.matterName);

    this.hoursModel.billing = this.timeSheetData['matters'][matterIndex]['tasks'][taskIndex]['billing'];
    let selectedDetails = { day: day };
    this.hoursModel.duration_hours = this.timeSheetData['matters'][matterIndex]['tasks'][taskIndex][day]['hours'];
    this.hoursform.controls["duration_minutes"].setValue(this.timeSheetData['matters'][matterIndex]['tasks'][taskIndex][day]['minutes']);
    this.hoursModel.matter_type = item.matterName;
    this.hoursModel.title = _taskName;
    this.taskId = this.timeSheetData['matters'][matterIndex]['tasks'][taskIndex][day]['taskId'];
    this.bsValue = new Date(
      this.timeSheetData['headers'][selectedDetails['day']]
    );
    this.hoursform.controls['date'].setValue(this.bsValue);
    //console.log('hoursform ' + JSON.stringify(this.hoursform.value));
    console.log('Update!!', this.hoursform)
  }
  selectedProject(value: any) {
    if (value == 'Others' || value == 'Overhead') {
      this.matterType = value == 'Others' ? 'others' : 'overhead';
      this.matterId = value == 'Others' ? 'Others' : 'Overhead';
    } else {
      this.project.forEach((item: any) => {
        if (item.matterName == value) {
          this.matterId = item.matterId;
          this.matterType = item.matterType;
        }
      });
    }
    this.httpservice
      .getFeaturesdata(URLUtils.getTasksDetails(this.matterType))
      .subscribe((res: any) => {
        this.tasks = res?.tasks;
      });
  }
  openModal(id: string) {
    this.modalService.open(id);
  }

  closeModal(id: string) {
    this.modalService.close(id);
  }
  onKey(event: any) {
    // without type info
    let keyValue = event.target.value;
    this.hoursModel.duration_hours = keyValue < 24 ? keyValue : 24;
  }
  convertMinutes() {
    this.timeSheetData?.matters?.forEach((item: any) => {
      item.tasks.forEach((item: any) => {
        item.total = this.formatZero(item.total);
        item.Mon.minutes = item.Mon.minutes == 0 ? '00' : item.Mon.minutes;
        item.Tue.minutes = item.Tue.minutes == 0 ? '00' : item.Tue.minutes;
        item.Wed.minutes = item.Wed.minutes == 0 ? '00' : item.Wed.minutes;
        item.Thu.minutes = item.Thu.minutes == 0 ? '00' : item.Thu.minutes;
        item.Fri.minutes = item.Fri.minutes == 0 ? '00' : item.Fri.minutes;
        item.Sat.minutes = item.Sat.minutes == 0 ? '00' : item.Sat.minutes;
        item.Sat.minutes = item.Sat.minutes == 0 ? '00' : item.Sat.minutes;
      })
    });
    this.timeSheetData.weekTotal['wTotal'] = this.formatZero(this.timeSheetData?.weekTotal['wTotal']);
  }

  formatZero(data: any) {
    if (data != '0') {
      let y = data.split(":")[1];
      let z = data.split(":")[0];
      if (y == '0') {
        return z + ":" + '00';
      }
      return data;
    }
  }
}
