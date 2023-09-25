import { DatePipe } from "@angular/common"
import { environment } from "src/environments/environment"

export class Utils {

    static list = ["/", "/login", "/register", "/forgetpassword", "/register", "/resetpwd"]

    static relationType = [{ name: 'Choose Business Type', value: "select" },
    { name: 'Business - Public Companies', value: "Business - Public Companies" },
    { name: 'Business - Private Companies', value: "Business - Private Companies" },
    { name: 'Business - Partnerships', value: "Business - Partnerships" },
    { name: 'Business - Proprietorship', value: "Business - Proprietorship" },
    { name: 'Education Institutions', value: "Education Institutions" },
    { name: 'Trusts', value: "Trusts" },
    { name: 'Others', value: "Others" }]

    static EMAIL_REGEXP = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/

    static productName = environment.product
    static notificationCount = 0
    static currenciesList = []
    static currenciesMapping = {}
    // static currencyListMapping = { INR: { country: 'India', symbol: '₹' }, USD: { country: 'USA', symbol: '$' }, EUR: { country: "Europe", symbol: '€' }, SGD: { country: "Singapore", symbol: '$' } }

    static generalDoctypeName = 'general'
    static mergedDoctypeName = 'merged'
    static versionedDoctypeName = 'versioned'


    static is_admin() {
        var isadmin = localStorage.getItem('isadmin')
        return isadmin
    }


    static get_userid() {
        if (localStorage.getItem('user_id') == null) {
            return null
        }
        return localStorage.getItem('user_id')
    }

    static get_plan() {
        return localStorage.getItem('plan')
    }

    static titleCaseWord(word: String) {
        return word[0].toUpperCase() + word.substr(1)
    }

    static trim_value(value: string) {
        return value.replace(/\s/g, "")
    }

    static get_firmName() {
        return localStorage.getItem("firm_name")
    }

    static get_firmJid() {
        return localStorage.getItem('jid')
    }

    static get_jid() {
        if (localStorage.getItem('user_id') == 'admin' || localStorage.getItem('user_id') == null)
            return localStorage.getItem('jid')
        else
            return localStorage.getItem('jid') + "_" + localStorage.getItem('user_id')
    }

    static expirationDateFormate = "MMM dd, yyyy"

    static isDataChangeStatus = false

    static time12to24HoursConvertor(time:any) {
        let hour
        var PM = time.match('PM') ? true : false

        time = time.split(':')
        var min = time[1]

        if (PM) {
            hour = 12 + parseInt(time[0], 10)
            // var sec = time[2].replace('PM', '')
        } else {
            hour = time[0]
            // var sec = time[2].replace('AM', '')       
        }

        return ({ hour: hour, minute: min })
    }

    static time24To12(date:any) {
        var d = new Date(date);
        var hh = d.getHours();
        var m = d.getMinutes();
        var s = d.getSeconds();
        var dd = "AM";
        var h = hh;
        if (h >= 12) {
            h = hh - 12;
            dd = "PM";
        }
        if (h == 0) {
            h = 12;
        }
        var minutes = m < 10 ? "0" + m : m;

        var sec = s < 10 ? "0" + s : s;

        /* if you want 2 digit hours:
        h = h<10?"0"+h:h; */

        var pattern = new RegExp("0?" + hh + ":" + minutes + ":" + sec);

        var replacement = h + ":" + minutes;
        /* if you want to add seconds
        replacement += ":"+s;  */
        replacement += ":00 " + dd;

        // return date.replace(pattern, replacement);
        return { hour: hh, minute: minutes, day: dd }
    }

    static getTimeDetails(time:any) {
        let hour
        var PM = ((time.toString()).includes(["PM"]) || (time.toString()).includes(["pm"])) ? true : false
        var item

        item = (time.toString()).split(':')
        var min = item[1] == '00' ? '0' : item[1]
        hour = item[0]
        return { hour: hour, minutes: min, meriden: PM ? 'PM' : "AM" }
    }

    static timeDiffCalc(dateFuture:any, dateNow:any) {
        var futureTime = new DatePipe('en-US').transform(dateFuture, 'HH:mm')
        if (futureTime == '00:00') {
            dateFuture.setHours(24)
        }
        let diffInMilliSeconds = Math.abs(dateFuture - dateNow) / 1000;
        diffInMilliSeconds = Math.round(diffInMilliSeconds)

        // calculate days
        const days = Math.floor(diffInMilliSeconds / 86400);
        diffInMilliSeconds -= days * 86400;
        // //console.log('calculated days', days);

        // calculate hours
        const hours = Math.floor(diffInMilliSeconds / 3600) % 24;
        diffInMilliSeconds -= hours * 3600;
        // //console.log('calculated hours', hours);

        // calculate minutes
        const minutes = Math.floor(diffInMilliSeconds / 60) % 60;
        diffInMilliSeconds -= minutes * 60;
        // //console.log('minutes', minutes);

        let difference = '';
        if (days > 0) {
            difference += (days === 1) ? `${days} day, ` : `${days} days, `;
        }

        difference += (hours === 0 || hours === 1) ? `${hours} hour, ` : `${hours} hours, `;

        difference += (minutes === 0 || hours === 1) ? `${minutes} minutes` : `${minutes} minutes`;

        return difference;
    }


    static returnTimeDiffCalc(dateFuture:any, dateNow:any) {
        var duration = { days: "", hours: "", minutes: "" }
        let diffInMilliSeconds = Math.abs(dateFuture - dateNow) / 1000;
        diffInMilliSeconds = Math.round(diffInMilliSeconds)

        // calculate days
        const days = Math.floor(diffInMilliSeconds / 86400);
        diffInMilliSeconds -= days * 86400;
        // //console.log('calculated days', days);

        // calculate hours
        const hours = Math.floor(diffInMilliSeconds / 3600) % 24;
        diffInMilliSeconds -= hours * 3600;
        // //console.log('calculated hours', hours);

        // calculate minutes
        const minutes = Math.floor(diffInMilliSeconds / 60) % 60;
        diffInMilliSeconds -= minutes * 60;
        // //console.log('minutes', minutes);

        let difference = '';
        if (days > 0) {
            duration['days'] = (days === 1) ? `${days} day, ` : `${days} days, `;
        }

        duration['hours'] = (hours === 0 || hours === 1) ? `${hours}` : `${hours}`;

        duration['minutes'] = (minutes === 0 || hours === 1) ? `${minutes}` : `${minutes}`;

        return duration;
    }


    static getCalculatedTime(time:any) {
        var dateTime = new Date()
        var hour
        hour = time['hour']
        if (time['meriden'] == 'PM') {
            if (hour != 12)
                hour = Number(time['hour']) + 12
        }
        else {
            hour = (Number(hour) == 12) ? 0 : hour
        }
        dateTime.setHours(hour)
        dateTime.setMinutes(time['minute'])
        dateTime.setSeconds(0)
        return dateTime
    }

}