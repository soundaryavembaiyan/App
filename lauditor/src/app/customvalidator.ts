import { FormControl, AbstractControl, FormGroup, Validators } from '@angular/forms';
import { min } from 'rxjs/operators';
// import { Utils } from './utils';

export class CustomValidator {
    static zipcodevalidation(control: FormControl) {
        let re = /^[0-9]*$/
        let zipcode = control.value;
        if (zipcode == "" || zipcode == null) {
            return null
        }
        if (re.test(zipcode)) {
            return null
        }
        else {
            return { msg: 'Invalid zipcode' }
        }

    }

    static alphabet_validation(control: FormControl) {
        let re = /^[a-zA-Z. ]*$/
        let value = control.value;
        if (re.test(value)) {
            return null
        }
        else {
            return { msg: 'This field should be alphabet' }
        }

    }

    static phone_validation(control: FormControl) {
        let re = /^[0-9]*$/
        let number = control.value;
        // //console.log(re.test(number))

        if (number.length == 0) {
            return null
        }
        else if (!re.test(number)) {
            return { msg: 'Contact phone should be numeric' }
        }
        if ((number.length > 9) && (number.length < 13)) {
            return null;
        }
        return { msg: 'Please enter a valid phone number' }

    }

    static category_validation(control: FormControl) {
        if (control.value == 'Select') {
            return { msg: 'Select Category' }
        }
        return null


    }
:
    static dropdown_validation(name:any) {
        return (control: AbstractControl): { [key: string]: string } | null => {
            if (control.value == 'select') {
                return { msg: 'Select ' + name }
            }
            return null
        }

    }

    static general_matter_date_validation(group: FormGroup) {
        var start_date = group.controls.startdate.value
        var close_date = group.controls.closedate.value
        if (start_date != undefined && start_date != '' && close_date != undefined && close_date != '') {
            if (new Date(start_date) > new Date(close_date)) {
                group.controls.closedate.setErrors({ msg: 'Close Date should be future date from start date' })
            }
        }
        return null
    }

    static expiration_date_validation(group: FormGroup) {
        var expiration_date = group.controls.expiration_date.value
        if (expiration_date != null && expiration_date.toString().toLowerCase() == 'invalid date') {
            group.controls.expiration_date.setErrors({ msg: 'Please select valid Expiration date' })
        }
        else if (expiration_date != '' && expiration_date != null) {
            var selected_date
            if (expiration_date.toString().indexOf('/') >= 0) {
                var exp_date = expiration_date.split('/')
                selected_date = new Date(exp_date[1] + "/" + exp_date[0] + "/" + exp_date[2])
            }
            else {
                selected_date = new Date(expiration_date)
            }
            var current_date = new Date()
            if (selected_date < current_date) {
                group.controls.expiration_date.setErrors({ msg: 'Expiration date should be future date' })
            }
        }
        return null
    }

    static target_validation(group: FormGroup) {
        var target_date = group.controls.target.value
        if (target_date != '' && target_date != null) {
            var current_date = new Date()
            var selected_date = new Date(target_date)
            if (selected_date < current_date) {
                group.controls.target.setErrors({ msg: 'Target date should be future date' })
            }
        }
        return null
    }

    static validate_type(group: FormGroup) {
        var type = group.controls.type.value
        const NUMBER_REGEXP = /^-?[\d.]+(?:e-?\d+)?$/;
        const EMAIL_REGEXP = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/
        // if (type == 'mobile') {
        //     var mobile = group.controls.mobile.value
        //     if (!(NUMBER_REGEXP.test(mobile))) {
        //         group.controls.mobile.setErrors({ mobile: 'Mobile Number should be numeric' })
        //     }
        //     else if (mobile.length != 10) {
        //         group.controls.mobile.setErrors({ mobile: 'Please enter a valid mobile number' })
        //     }
        //     group.controls.email.setErrors(null)
        // }
        // else if (type == 'email') {
        var email = group.controls.email.value
        if (email == '') {
            group.controls.email.setErrors({ email: 'Email is required' })
        }
        else if (!EMAIL_REGEXP.test(email)) {
            group.controls.email.setErrors({ email: 'Please enter a valid email address' })
        }
        // group.controls.mobile.setErrors(null)
        // }
    }

    static validate_email(control: FormControl) {
        var email = control.value
        const EMAIL_REGEXP = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/
        if (email != "" && email != null) {
            if (!EMAIL_REGEXP.test(email)) {
                return { msg: 'Invalid email' }
            }

        }

    }

    static validate_date(control: FormControl) {
        var value = control.value
        if (value != "" && value != null) {
            if (value.toString().toLowerCase() == 'invalid date')
                return { msg: 'Select a valid date' }

        }

    }

    static validate_negative_number(control: FormControl) {
        var value = control.value
        if (value != null && value != "") {
            if (Math.sign(value) == -1) {
                return { msg: 'Negative could not allow' }
            }
        }
        return null
    }

    static validate_hours(control: FormControl) {
        var value = control.value
        let re = /^\-?[0-9]*$/
        if (value != null && value != "") {
            if (!re.test(value))
                return { msg: 'Hours should be numeric' }
            else if (Math.sign(value) == -1) {
                return { msg: 'Invalid Hours' }
            }
            else if (Math.sign(value) == NaN) {
                return { msg: 'Hours should be numeric' }
            }
            else if (value > 24) {
                return { msg: 'Must be between 0 to 24 Hours' }
            }
        }
        return null
    }

    static validate_minutes(control: FormControl) {
        var value = control.value
        let re = /^[0-9]*$/
        if (value != null && value != "") {
            if (!re.test(value))
                return { msg: 'Minutes should be numeric' }
            else if (Math.sign(value) == -1) {
                return { msg: 'Negative could not allow' }
            }
            else if (Math.sign(value) == NaN) {
                return { msg: 'Minutes should be numeric' }
            }
            else if (value > 59) {
                return { msg: 'Must be between 0 to 59 Minutes' }
            }
        }
        return null
    }

    static validate_timesheet_time(group: FormGroup) {
        var hours = group.controls.durationhour.value
        var minutes = group.controls.durationminutes.value
        if (hours != "" && Number(hours) != 0 && minutes != "" && Number(minutes) != 0) {


            if (Math.sign(minutes) == -1) {
                group.controls.durationminutes.setErrors({ msg: 'Negative could not allow' })
            }
            else if (Math.sign(minutes) == NaN) {
                group.controls.durationminutes.setErrors({ msg: 'Minutes should be numeric' })
            }
            else if (minutes > 59) {
                group.controls.durationminutes.setErrors({ msg: 'Must be between 0 to 59 Minutes' })
            }
            else if (Number(hours) == 24 && Number(minutes) != 0) {
                group.controls.durationminutes.setErrors({ msg: "select a valid time" })
            }
        }
        return null
    }

    static permissions(group: FormGroup) {
        var user = group.controls.userid.value
        var permission = group.controls.permission.value
        if (user == 'select') {
            group.controls.userid.setErrors({ userid: 'Select user' })
        }
        else if (permission == 'select') {
            group.controls.permission.setErrors({ permission: 'Select user' })
        }

    }

    static validateMergePdfPreamble(group: FormGroup) {
        var title = group.controls.title.value
        var content = group.controls.content.value
        if (content.trim() != "") {
            if (title.trim() == "")
                group.controls.title.setErrors({ msg: 'Title is required' })
            else
                group.controls.title.setErrors(null)
        } else
            group.controls.title.setErrors(null)

    }


    static reminder_targer_validation(group: FormGroup) {
        if (group.controls.isreminder.value) {
            var target_date = group.controls.target.value
            var remmsg = group.controls.remmsg.value
            if (target_date == "" || target_date == null) {
                group.controls.target.setErrors({ msg: 'Target data is required' })
            }
            else {
                var current_date = new Date()
                var selected_date = new Date(target_date)
                if (selected_date < current_date) {
                    group.controls.target.setErrors({ msg: 'Target data should be future date' })
                }
            }

            if (remmsg == "" || remmsg == null) {
                group.controls.remmsg.setErrors({ msg: 'Message is required' })
            }
        }
        else {
            group.controls.target.setErrors(null)
            group.controls.remmsg.setErrors(null)
        }
    }

    static validate_confirm_email(group: FormGroup) {
        var email = group.controls.email.value
        var confirm_email = group.controls.confirmemail.value
        var isemailErrorMsg = true
        const EMAIL_REGEXP = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/
        if (email != "") {
            isemailErrorMsg = false
            if (!EMAIL_REGEXP.test(email)) {
                isemailErrorMsg = true
                group.controls.email.setErrors({ msg: 'Invalid email' })
            }
        }
        if (confirm_email != "") {
            if (!EMAIL_REGEXP.test(confirm_email)) {
                group.controls.confirmemail.setErrors({ msg: 'Invalid email' })
            }
            else if (!isemailErrorMsg && email != "" && email != null && confirm_email != "" && confirm_email != null) {
                if (email != confirm_email) {
                    group.controls.confirmemail.setErrors({ msg: 'Confirm email does not match with email' })
                }
                else {
                    group.controls.confirmemail.setErrors(null)
                }

            }
            else {
                group.controls.confirmemail.setErrors(null)
            }
        }
    }

    static validate_change_password(group: FormGroup) {
        var PASSWORD_PATTERN = /^((?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*?_-]).{8,15})/;
        var old_pwd = group.controls.oldpwd.value
        var new_pwd = group.controls.newpwd.value
        var confirm_pwd = group.controls.confirmpwd.value
        if (old_pwd != "" && old_pwd != null && new_pwd != "" && new_pwd != "" && confirm_pwd != "" && confirm_pwd != null) {
            if (old_pwd == new_pwd) {
                group.controls.newpwd.setErrors({ msg: 'New password can not be the same as old password' })
            }
            else if (!PASSWORD_PATTERN.test(new_pwd)) {
                group.controls.newpwd.setErrors({ msg: 'Minimum 8 characters, at least 1 uppercase, 1 lowercase, 1 number and 1 special character except {}[],.()+=<>' })
            }
            else if (new_pwd != confirm_pwd) {
                group.controls.confirmpwd.setErrors({ msg: 'The password fields do not match. Please try again' })
            }
        }
    }

    static validate_reset_password(group: FormGroup) {
        var PASSWORD_PATTERN = /^((?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*?_-]).{8,15})/;
        var password = group.controls.password.value
        var confirm_password = group.controls.confirm_password.value
        var isPwdErrorMsg = true
        if (password != "") {
            isPwdErrorMsg = false
            if (!PASSWORD_PATTERN.test(password)) {
                isPwdErrorMsg = true
                group.controls.password.setErrors({ msg: 'Minimum 8 characters, at least 1 uppercase, 1 lowercase, 1 number and 1 special character except {}[],.()+=<>' })
            }
        }
        if (!isPwdErrorMsg && password != "" && password != null && confirm_password != "" && confirm_password != "") {
            if (!PASSWORD_PATTERN.test(password)) {
                group.controls.password.setErrors({ msg: 'Minimum 8 characters, at least 1 uppercase, 1 lowercase, 1 number and 1 special character except {}[],.()+=<>' })
            }
            else if (password != confirm_password) {
                group.controls.confirm_password.setErrors({ msg: 'The password fields do not match. Please try again' })
            }
            else {
                group.controls.confirm_password.setErrors(null)
            }
        }
    }

    static phone_number_validation(name) {
        return (control: AbstractControl): { [key: string]: string } | null => {
            var number = control.value
            let re = /^[0-9]*$/
            if (number == null) {
                return null
            }
            if (number.length == 0) {
                return null
            }
            else if (!re.test(number)) {
                return { msg: name + ' should be numeric' }
            }
            if ((number.length > 9) && (number.length < 13)) {
                return null;
            } else {
                return { msg: 'Invalid ' + name }
            }
        }
    }

    static number_validation(name) {
        return (control: AbstractControl): { [key: string]: string } | null => {
            var number = control.value
            let re = /^[0-9]*$/
            if (number == null) {
                return null
            }
            if (number.length == 0) {
                return null
            }
            else if (!re.test(number)) {
                return { msg: name + ' should be numeric' }
            }
        }
    }

    static custom_required_validation(name) {
        return (control: AbstractControl): { [key: string]: string } | null => {
            if (control.value == '') {
                return { msg: name + ' is required' }
            }
            return null
        }

    }

    static url_validation(control: FormControl) {
        var website = control.value
        const URL_REGEXP = /^([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
        // /^(http?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
        // const URL_REGEXP = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
        // const URL_REGEXP = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm;
        if (website != "" && website != null) {
            if (!URL_REGEXP.test(website)) {
                return { msg: 'Please enter a valid website' }
            }
        }
        return null

    }

    static calendar_validation(group: FormGroup) {
        var event_date = group.controls.eventdate.value
        if (event_date == '') {
            group.controls.eventdate.setErrors({ msg: 'Please select a date' })
        }
        else if (event_date == null || event_date.toString().toLowerCase() == 'invalid date') {
            group.controls.eventdate.setErrors({ msg: 'Please select valid Event date' })
        }
        else
            group.controls.eventdate.setErrors(null)

        var title = group.controls.title.value.trim()
        if (title == '')
            group.controls.title.setErrors({ msg: 'Event Title is required' })
        else
            group.controls.title.setErrors(null)
        // else if (event_date != '' && event_date != null) {
        //     var selected_date
        //     if (event_date.toString().indexOf('/') >= 0) {
        //         var exp_date = event_date.split('/')
        //         selected_date = new Date(exp_date[1] + "/" + exp_date[0] + "/" + exp_date[2])
        //     }
        //     else {
        //         selected_date = new Date(event_date)
        //     }
        //     var current_date = new Date()
        //     if (selected_date < current_date) {
        //         group.controls.eventdate.setErrors({ msg: 'Event date should be future date' })
        //     }
        // }

        var allDay = group.controls.allday.value
        // //console.log(allDay)
        if (!allDay) {
            let startTime = group.controls.starttime.value
            if (startTime == "")
                group.controls.starttime.setErrors({ msg: 'Starttime is required' })
            else
                group.controls.starttime.setErrors(null)
            let endTime = group.controls.endtime.value
            if (endTime == "")
                group.controls.endtime.setErrors({ msg: 'Endtime is required' })
            else
                group.controls.endtime.setErrors(null)
            if (startTime != '' && startTime != null && endTime != '' && endTime != null) {
                var starthour = startTime['hour']
                var endhour = endTime['hour']
                if (startTime['meriden'] == 'PM') {
                    if (starthour != 12)
                        starthour = Number(startTime['hour']) + 12
                }
                else {
                    if (starthour == 12)
                        starthour = 0
                }
                if (endTime['meriden'] == 'PM') {
                    if (endhour != 12)
                        endhour = Number(endTime['hour']) + 12
                }
                else {
                    if (endhour == 12)
                        endhour = 0
                }
                if (Number(starthour) > Number(endhour)) {
                    if (endhour == 0 && Number(endTime['minute']) == 0) {

                    } else
                        group.controls.endtime.setErrors({ msg: 'Please select a valid time' })
                }
                else if (Number(starthour) == Number(endhour)) {
                    if (startTime['minute'] > endTime['minute'])
                        group.controls.endtime.setErrors({ msg: 'Please select a valid time' })
                    else if (startTime['minute'] == endTime['minute'])
                        group.controls.endtime.setErrors({ msg: 'Please select a valid time' })
                }
                else {
                    group.controls.starttime.setErrors(null)
                    group.controls.endtime.setErrors(null)
                }
            }
        }
        else {
            group.controls.starttime.setErrors(null)
            group.controls.endtime.setErrors(null)
        }


        return null
    }


    static calendar_HearingDate_validation(group: FormGroup) {
        var event_date = group.controls.eventdate.value
        if (event_date == '') {
            group.controls.eventdate.setErrors({ msg: 'Please select a date' })
        }
        else if (event_date == null || event_date.toString().toLowerCase() == 'invalid date') {
            group.controls.eventdate.setErrors({ msg: 'Please select valid Event date' })
        }
        else
            group.controls.eventdate.setErrors(null)

        var allDay = group.controls.allday.value
        // //console.log(allDay)
        if (!allDay) {
            let startTime = group.controls.starttime.value
            if (startTime == "")
                group.controls.starttime.setErrors({ msg: 'Starttime is required' })
            else
                group.controls.starttime.setErrors(null)
            let endTime = group.controls.endtime.value
            if (endTime == "")
                group.controls.endtime.setErrors({ msg: 'Endtime is required' })
            else
                group.controls.endtime.setErrors(null)
            if (startTime != '' && startTime != null && endTime != '' && endTime != null) {
                var starthour = startTime['hour']
                var endhour = endTime['hour']
                if (startTime['meriden'] == 'PM') {
                    if (starthour != 12)
                        starthour = Number(startTime['hour']) + 12
                }
                else {
                    if (starthour == 12)
                        starthour = 0
                }
                if (endTime['meriden'] == 'PM') {
                    if (endhour != 12)
                        endhour = Number(endTime['hour']) + 12
                }
                else {
                    if (endhour == 12)
                        endhour = 0
                }
                if (Number(starthour) > Number(endhour)) {
                    if (endhour == 0 && Number(endTime['minute']) == 0) {

                    } else
                        group.controls.endtime.setErrors({ msg: 'Please select a valid time' })
                }
                else if (Number(starthour) == Number(endhour)) {
                    if (startTime['minute'] > endTime['minute'])
                        group.controls.endtime.setErrors({ msg: 'Please select a valid time' })
                    else if (startTime['minute'] == endTime['minute'])
                        group.controls.endtime.setErrors({ msg: 'Please select a valid time' })
                }
                else {
                    group.controls.starttime.setErrors(null)
                    group.controls.endtime.setErrors(null)
                }
            }
        }
        else {
            group.controls.starttime.setErrors(null)
            group.controls.endtime.setErrors(null)
        }


        return null
    }
}