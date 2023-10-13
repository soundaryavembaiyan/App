import { Component, OnInit } from '@angular/core';
import { ngxCsv } from 'ngx-csv';
import { HttpService } from 'src/app/services/http.service';
import { URLUtils } from 'src/app/urlUtils';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'aggregate-projects',
    templateUrl: 'aggregate-projects.component.html',
    styleUrls: ['aggregate-projects.component.scss']
})
export class AggregateProjectsComponent implements OnInit {

    minDate = new Date();
    maxDate = new Date();
    projectsMember: any;
    viewMode: any = 'week';
    projectData: any;
    isReverse:boolean=false;
    list:any;
    calendarDates:any;
    grandTotal:any;
    searchTeam:any;
    product = environment.product;
    
    constructor(private httpService: HttpService) {

    }
    ngOnInit() {
        this.weekView();

    }
    getLength(length:any) {
        if (length == 0)
          return 1
        //   //console.log("length "+length);
        return length
       
      }
      getClientNames(clients:any){
        var html = "<p>"
        for (let item of clients){
          html += `${item},<br>`
        }
    
        html += "</p>"
        // //console.log("html "+html)
        return html
    
      }
    weekView() {
        this.httpService.sendGetRequest(URLUtils.aggregateProjects).subscribe((res: any) => {
            this.projectsMember = res;
            this.list = res.timesheets.data;
            this.calendarDates = res.dates;
            this.grandTotal=res.timesheets.grandTotal;
            // //console.log(" list"  +JSON.stringify(this.list));
        })

    }
    monthView(){
        this.httpService.sendGetRequest(URLUtils.aggregateProjectMounthView).subscribe((res: any) => {
            this.projectsMember = res;
            this.list = res.timesheets?.data;
            this.calendarDates = res.dates;
            this.grandTotal=res.timesheets.grandTotal;
            //console.log(" list"  +JSON.stringify(this.list));
        })
    }
    
    preAndNextMonth(data: any) {
        this.httpService.sendGetRequest(URLUtils.aggregateProjectDataMonthByMonth(data)).subscribe((res: any) => {
            this.projectsMember = res;
            this.list = res?.timesheets?.data;
            this.calendarDates = res.dates;
            this.grandTotal=res.timesheets.grandTotal;
            // //console.log(" list"  +JSON.stringify(this.list));
            
        });

    }
    preAndNextWeek(data: any) {
        this.httpService.sendGetRequest(URLUtils.aggregateProjectDataWeekByWeek(data)).subscribe((res: any) => {
            this.projectsMember = res;
            this.list = res?.timesheets?.data;
            this.calendarDates = res.dates;
            this.grandTotal=res.timesheets.grandTotal;
            // //console.log(" list"  +JSON.stringify(this.list));
            
        });

    }
    projectWeekSort(val: any) {
        this.isReverse = !this.isReverse;
        if (this.isReverse) {
            this.list = this.list?.sort((p1: any, p2: any) => (p1[val] < p2[val]) ? 1 : (p1[val] > p2[val]) ? -1 : 0);
        } else {
            this.list = this.list?.sort((p1: any, p2: any) => (p1[val] > p2[val]) ? 1 : (p1[val] < p2[val]) ? -1 : 0);
        }
    }
    downloadCSV() {
        var exportcsvList = []
        if (this.viewMode == 'week') {
            var csvOptions = {
                fieldSeparator: ',',
                quoteStrings: '"',
                decimalseparator: '.',
                showLabels: true,
                showTitle: true,
                title: 'Aggregate Timesheet Project -- ' + this.calendarDates['start'] + ' to ' + this.calendarDates['end'],
                useBom: true,
                noDownload: false,
                headers: ["Case Number", "Project", "Client Name", "Team Member", "Billable", "Non Billable", "Total"]
              }
              for (let item of this.list) {
                for (let tm of item['teamMembers']) {
                  var mdata = { "case_no": item['caseNo'], 'project': item['projectName'], "client_name": item['clientName'], 'tm_name': tm['name'], "billable": tm['billableHours'], 'non_billable': tm['billableHours'], 'total': tm['total']}
                  exportcsvList.push(mdata)
                }
              }
            const fileInfo = new ngxCsv(exportcsvList, "AggregateTimesheetTeamMemberWeek", csvOptions);
            // new AngularCsv(exportcsvList, "AggregateTimesheetTeamMemberWeek", this.csvOptions);
        }
        else if (this.viewMode == 'month') {
            var csvOptions = {
                fieldSeparator: ',',
                quoteStrings: '"',
                decimalseparator: '.',
                showLabels: true,
                showTitle: true,
                title: 'Aggregate Timesheet Project -- ' + this.calendarDates['start'] + ' to ' + this.calendarDates['end'],
                useBom: true,
                noDownload: false,
                headers: ["Case Number", "Project", "Client Name", "Team Member", "Billable", "Non Billable", "Total"]
              }
              for (let item of this.list) {
                for (let tm of item['teamMembers']) {
                  var mdata = { "case_no": item['caseNo'], 'project': item['projectName'], "client_name": item['clientName'], 'tm_name': tm['name'], "billable": tm['billableHours'], 'non_billable': tm['billableHours'], 'total': tm['total']}
                  exportcsvList.push(mdata)
                }
              }
            const fileInfo = new ngxCsv(exportcsvList, "AggregateTimesheetTeamMember",csvOptions);
            // new AngularCsv(exportcsvList, "AggregateTimesheetTeamMemberMonth", this.csvOptions);
        }
    }
}
