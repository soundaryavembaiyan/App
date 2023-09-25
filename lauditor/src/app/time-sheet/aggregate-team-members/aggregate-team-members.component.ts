import { Component, OnInit } from '@angular/core';
import { ngxCsv } from 'ngx-csv';
import { HttpService } from 'src/app/services/http.service';

import { URLUtils } from 'src/app/urlUtils';

@Component({
    selector: 'aggregate-team-members',
    templateUrl: 'aggregate-team-members.component.html',
    styleUrls: ['aggregate-team-members.component.scss']
})
export class AggregateTeamMembersComponent implements OnInit {
    minDate: any;
    maxDate: any;
    nextDate: any;
    preDate: any;
    teamMember: any;
    viewMode: any = 'week';
    teamMemberData: any;
    teamMonthView: any;
    isWeekView: boolean = false;
    searchTeam: any;
    isReverse: boolean = false;
    csvOptions: any;
    constructor(private httpService: HttpService) {

    }
    ngOnInit() {

        this.weekView();
    }
    removeSpace(){
        let el:any = document.getElementById('space')as HTMLInputElement | null;
        let val = el.value.replace(/\s/g, "");
        //console.log("val "+val);
    }
    weekView() {
        this.teamMonthView = [];
        this.httpService.sendGetRequest(URLUtils.aggregateTeamMembers).subscribe((res: any) => {
            this.teamMemberData = res;
        });
    }
    preAndNextWeek(data: any) {
        this.teamMonthView = [];
        this.httpService.sendGetRequest(URLUtils.aggregateTeamDataWeekByWeek(data)).subscribe((res: any) => {
            this.teamMemberData = res;
        })
    }
    monthView() {
        this.teamMemberData = [];
        this.httpService.sendGetRequest(URLUtils.aggregateTeamMembersMounthView).subscribe((res: any) => {
            this.teamMonthView = res;
            //console.log("response  " + JSON.stringify(this.teamMonthView));
        })
    }
    preAndNextMonth(data: any) {
        //console.log('data ' + data);
        this.teamMemberData = [];
        this.httpService.sendGetRequest(URLUtils.aggregateTeamDataWeekByMonth(data)).subscribe((res: any) => {
            this.teamMonthView = res;
        })

    }
    teamMemberWeekSort(val: any) {
        this.isReverse = !this.isReverse;
        if (this.isReverse) {
            this.teamMemberData.timesheets = this.teamMemberData?.timesheets?.sort((p1: any, p2: any) => (p1[val] < p2[val]) ? 1 : (p1[val] > p2[val]) ? -1 : 0);
        } else {
            this.teamMemberData.timesheets = this.teamMemberData?.timesheets?.sort((p1: any, p2: any) => (p1[val] > p2[val]) ? 1 : (p1[val] < p2[val]) ? -1 : 0);
        }
    }
    downloadCSV() {
        var exportcsvList = []
        if (this.viewMode == 'week') {
            this.csvOptions = {
                fieldSeparator: ',',
                quoteStrings: '"',
                decimalseparator: '.',
                showLabels: true,
                showTitle: true,
                title: 'Aggregate Timesheet TeamMember Weekly -- ' + this.teamMemberData.dates.start + ' to ' + this.teamMemberData.dates.end,
                useBom: true,
                noDownload: false,
                headers: ["Name", "Billable", "Non Billable", "Total"]
            }
            for (let item of this.teamMemberData.timesheets) {
                var data = {
                    "ame": item['name'],
                    'billable': item['tb'],
                    "non_billable": item['tnb'],
                    'total': item['total']
                }
                exportcsvList.push(data)
            }
            const fileInfo = new ngxCsv(exportcsvList, "AggregateTimesheetTeamMemberWeek", this.csvOptions);
            // new AngularCsv(exportcsvList, "AggregateTimesheetTeamMemberWeek", this.csvOptions);
        }
        else if (this.viewMode == 'month') {
            this.csvOptions = {
                fieldSeparator: ',',
                quoteStrings: '"',
                decimalseparator: '.',
                showLabels: true,
                showTitle: true,
                title: 'Aggregate Timesheet TeamMember Monthly - ' +this.teamMonthView.dates.start + ' to ' + this.teamMonthView.dates.end,
                useBom: true,
                noDownload: false,
                headers: ["Name", "Billable-Week1", "Billable-Week2", "Billable-Week3", "Billable-Week4", "Billable-Week5", "Billable-Total", "Non Billable-Week1", "Non Billable-Week2", "Non Billable-Week3", "Non Billable-Week4", "Non Billable-Week5", "Non Billable Total", "Grand Total"]
            }
            for (let item of this.teamMonthView.timesheets) {
                var mdata = { "name": item['name'], 'bw1': item['bw1'], "bw2": item['bw2'], 'bw3': item['bw3'], "bw4": item['bw4'], 'bw5': item['bw5'], 'btotal': item['tb'], 'nbw1': item['nbw1'], "nbw2": item['nbw2'], 'nbw3': item['nbw3'], "nbw4": item['nbw4'], 'nbw5': item['nbw5'], 'nbtota;': item['tnb'], "grand_total": item['total'] }
                exportcsvList.push(mdata)
            }
            const fileInfo = new ngxCsv(exportcsvList, "AggregateTimesheetTeamMemberMonth", this.csvOptions);
            // new AngularCsv(exportcsvList, "AggregateTimesheetTeamMemberMonth", this.csvOptions);
        }
    }

}
