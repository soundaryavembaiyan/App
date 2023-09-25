import { URLUtils } from 'src/app/urlUtils';
import { HttpService } from './../../services/http.service';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CalendarEvent, CalendarView, CalendarWeekViewBeforeRenderEvent } from 'angular-calendar';
import { DatePipe } from '@angular/common';
import { addDays, differenceInMinutes, startOfDay, startOfHour, subDays, subWeeks } from 'date-fns';
import { reduce, Subject } from 'rxjs';
const colors: any = {
  violet:{
    primary:'#B233FF',
    secondary:'#B233FF'
  },
  orange: {
    primary: '#F39C12',
    secondary: '#F39C12'
  },
  blue: {
    primary: '#3880F7',
    secondary: '#3880F7'
  },
  pink: {
    primary: '#FF69B4',
    secondary: '#FF69B4'
  },
  green: {
    primary: '#28B463',
    secondary: '#28B463'
  }
};
@Component({
  selector: 'app-viewcalender',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './viewcalender.component.html',
  styleUrls: ['./viewcalender.component.scss']
})
export class ViewCalenderComponent implements OnInit, AfterViewInit {
  view: CalendarView = CalendarView.Day;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  pipe = new DatePipe('en-US');
  events: CalendarEvent[] = [];
  monthData: any;
  refresh: Subject<any> = new Subject();
  @ViewChild('scrollContainer') scrollContainer: ElementRef<HTMLElement> | undefined;
  constructor(private router: Router, private httpservice: HttpService) { }

  ngOnInit() {
    let val = localStorage.getItem('CalendarView') as CalendarView;
    this.view = val ? val : CalendarView.Day;
    localStorage.setItem('CalendarView', this.view);
    this.getCurrentView();
  }
  ngAfterViewInit() {
    this.scrollToCurrentView();
  }
  getCalenderData(currentDate: any) {
    this.httpservice.sendGetRequest(URLUtils.getCalendarList({
      offset: (new Date().getTimezoneOffset()),
      currentPage: currentDate
    })).subscribe((res: any) => {
      this.monthData = [];
      this.monthData = res?.events;
      this.createEvents()
    })
  }
  createEvents() {
    this.events = [];
    this.monthData.forEach((item: any) => {
      this.events = this.events.concat(
        {
          start: new Date(item.from_ts),
          end: new Date(item.to_ts),
          title: item.allday ? '' + item.title : this.pipe.transform(item.from_ts, 'h:mm a') + ' ' + item.title,
          id: item.id + 'TZ' +  (0 - Number(item.timezone_offset?.split(',')[0])),
          allDay: item.allday
         // color: this.applyColor(item.event_type)
        }
      );
    });
    this.refresh.next(true);
    this.scrollToCurrentView();
  }
  applyColor(eventtype: any) {
    switch (eventtype) {
      case 'legal':
        return colors.violet;
      case 'general':
        return colors.pink;
      case 'overhead':
        return colors.orange;
      case 'others':
        return colors.green;
      case 'reminders':
        return colors.blue;
        default:
          return colors.blue;
    }
    return colors.blue;
  }
  onEventClick(day: any) {
    let x = day.id.split('TZ');
    if(x?.length>1){
      x[1]=0-Number(x[1]);
    }
    //console.log("id-" + x[0] + "Timezone-" + x[1]);
    this.router.navigateByUrl('/meetings/view/event', { state: { eventId: x[0], offset: x[1] } });
  }
  getCurrentView() {
    var currentDate;
    if (this.view == CalendarView.Month) {
      currentDate = 'M' + this.pipe.transform(this.viewDate, 'MMyyyy')
    }
    else if (this.view == CalendarView.Week) {
      console.log(this.viewDate)
      let curr = this.viewDate; // get current date
      const firstday = new Date(curr.getFullYear(), curr.getMonth(), curr.getDate() - curr.getDay());
      const lastday = new Date(curr.getFullYear(), curr.getMonth(), curr.getDate() + (6 - curr.getDay()));
      const startDateStr = this.pipe.transform(firstday, 'ddMMyyyy');
      const endDateStr = this.pipe.transform(lastday, 'ddMMyyyy');
      currentDate = `W${startDateStr}-${endDateStr}`;

    }
    else if (this.view == CalendarView.Day) {
      currentDate = 'D' + this.pipe.transform(this.viewDate, "ddMMyyyy");
    }
    this.getCalenderData(currentDate);
  }
  onClickRefresh() {
    localStorage.setItem('CalendarView', this.view);
    this.refresh.next(true);
    this.getCurrentView();
  }
  onDayView() {
    localStorage.setItem('CalendarView', this.view);
    this.viewDate = new Date();
    this.getCurrentView();
  }
  private scrollToCurrentView() {
    if (this.view === CalendarView.Week || this.view === CalendarView.Day) {
      // each hour is 60px high, so to get the pixels to scroll it's just the amount of minutes since midnight
      const minutesSinceStartOfDay = differenceInMinutes(
        startOfHour(new Date()),
        startOfDay(new Date())
      );
      const headerHeight = this.view === CalendarView.Week ? 60 : 0;
      if (this.scrollContainer)
        this.scrollContainer.nativeElement.scrollTop =
          minutesSinceStartOfDay + headerHeight;
    }
  }
}
