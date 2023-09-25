import { Injectable, EventEmitter, Output } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subject, throwError } from 'rxjs';
import { map, catchError, take } from "rxjs/operators";
// import { ConfirmationDialogService } from '../../../../commonlib/confirmation-dialog/confirmation-dialog.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { NavigationEnd, Router } from "@angular/router";
import { ConnectionService } from 'ng-connection-service';
import { environment } from '../../environments/environment';
import { Utils } from '../utils';
import { URLUtils } from '../urlUtils';

// import { ConfirmationDialogService } from '../confirmation-dialog/confirmation-dialog.service';

const httpOptions = {
	headers: new HttpHeaders({
		"Authorization": "Bearer " + localStorage.getItem('TOKEN')
	})
};


@Injectable({ providedIn: 'root' })
export class AjaxService {
	@BlockUI() blockUI: NgBlockUI;
	private subject = new Subject<any>();
	private notification_count = new Subject<any>()
	
	api: string;
	// api = "https://apidev.digicoffer.com/cors/professional"

	token: any;

	constructor(private http: HttpClient,
		public toastr: ToastrService,
		private router: Router,
		// public confirmationDialogService: ConfirmationDialogService,
		private connectionService: ConnectionService) {
		this.api = environment.apiUrl
		// this.api = "https://apidev.digicoffer.com/cors/professional"
		this.router.events.subscribe(event => {
			if (event instanceof NavigationEnd) {
				var url_end = event.urlAfterRedirects
				var list = ["/", "/login", "/register", "/forgetpassword", "/register", "/resetpwd"]
				if (url_end.includes("?")) {
					url_end = url_end.split("?")[0]
				}
				if (list.indexOf(url_end) == -1) {
					this.token = localStorage.getItem('TOKEN')
					if (this.token == null) {
						this.router.navigate(['/login'])
					}
				}
			}
		})
		// this.token = localStorage.getItem('TOKEN')
		// if (this.token == null) {
		// 	this.router.navigate(['login'])
		// } 
	}

	handleError(error: Response | any) {
		this.blockUI.stop();
		if (error.status == 401) {
			localStorage.clear()
			localStorage.setItem('error_alert_msg', "Session expired, Login to continue")
			this.router.navigate(['/login'])
		}
		else {
			if (this.check_internet()) {
				this.error_alert("Error, Please try again or contact support")
			}
			else {
				this.error_alert("Please check your internet connectivity")
			}
		}
	}

	get(url: string) {
		// this.blockUI.start('Loading...');
		return this.http.get(this.api + url, this.get_httpoptions()).subscribe(
			// return this.http.get(this.api + url).pipe(map(
			(res: any) => {
				// this.blockUI.stop();
				return res
			}
		),
			catchError(err => {
				this.handleError(err)
				return throwError(err);
			})

	}

	post(url: string, data: any) {
		this.blockUI.start('Loading...');
		return this.http.post(this.api + url, data, this.get_httpoptions()).pipe(map(
			(res: any) => {
				this.blockUI.stop();
				return res;
			}
		),
			catchError(err => {
				this.handleError(err)
				return throwError(err);
			})
		)
	}

	put(url: string, data: any) {
		this.blockUI.start('Loading...');
		return this.http.put(this.api + url, data, this.get_httpoptions()).subscribe(
			(res: any) => {
				this.blockUI.stop();
				return res
			}
		),
			catchError(err => {
				this.handleError(err)
				return throwError(err);
			})

	}

	delete(url: string, data: any) {
		this.blockUI.start('Loading...');
		if (data == "") {
			return this.http.delete(this.api + url, this.get_httpoptions()).subscribe(
				(res: any) => {
					this.blockUI.stop();
					return res
				}
			),
				catchError(err => {
					this.handleError(err)
					return throwError(err);
				})

		}
		else {
			// return this.http.delete(this.api+url, data, httpOptions)
			return this.http.request('delete', this.api + url, {
				body: data, headers: new HttpHeaders({
					"Authorization": "Bearer " + localStorage.getItem('TOKEN')
				})
			}).subscribe((res: any) => {
				this.blockUI.stop();
				return res
			}
			),
				catchError(err => {
					this.handleError(err)
					return throwError(err);
				})

		}
	}

	public async asynpost(url: string, data: any) {
		var response: any = {}
		try {
			var result = await this.http.post(this.api + url, data, this.get_httpoptions()).toPromise()
			response['status'] = 200
			response['response'] = result
		}
		catch (err: any) {
			//console.log(err)
			response['status'] = err.status
			response['message'] = err.statusText
		}
		return response
	}

	login(url: string, data: any) {
		return this.http.post(this.api + url, data)
	}

	load_currencies() {
		this.http.get(URLUtils.getCurrencies).subscribe(
			(resp: any) => {
				var currencies_list = []
				var mapping_currencies: any = {};
				currencies_list.push({ name: 'Select', value: 'select' })
				for (let item of resp['data']['currencies']) {
					var list_item = { name: item['country'], value: item['currency'] }
					currencies_list.push(list_item)
					mapping_currencies[item['currency']] = item
				}
				mapping_currencies['default'] = { country: "", symbol: "" }
				// Utils.currenciesList = currencies_list
				// Utils.currenciesMapping = mapping_currencies
			}
		)

	}

	token_verification(url: string, data: any) {
		return this.http.put(this.api + url, data)
	}

	success_alert(message: any) {
		this.toastr.success(message, 'Alert');
	}

	error_alert(message: any) {
		this.toastr.error(message, 'Alert');
	}
	show_notification(currentScreen: any, notificationCount: any) {
		if (Utils.notificationCount < notificationCount) {
			var count = Number(notificationCount) - Utils.notificationCount
			this.toastr.info(`Received ${count} notification`, '', { positionClass: 'toast-top-right', timeOut: 10000, })
				.onTap
				.pipe(take(1))
				.subscribe(() => this.toasterClickedHandler(currentScreen))
			Utils.notificationCount = Number(notificationCount)
		}
	}

	toasterClickedHandler(currentScreen: any) {
		// if (currentScreen != '/notifications')
		this.router.navigate(['notifications'])
	}

	setContactName(name: string, firmName: String) {
		this.subject.next({ text: name, firmName: firmName });
	}
	getContactName(): Observable<any> {
		return this.subject.asObservable();
	}

	getCount() {
		this.http.get('/count').subscribe(
			(resp: any) => {
				if (!resp['error']) {
					this.setNotificationCount(resp['data']['notifications'])
					Utils.notificationCount = Number(resp['data']['notifications'])
				}
			}
		),
			catchError(err => {
				this.handleError(err)
				return throwError(err);
			})
	}

	setNotificationCount(count: String) {
		this.notification_count.next({ count: count })
	}

	getNotificationCount(): Observable<any> {
		return this.notification_count.asObservable();
	}

	get_httpoptions() {
		// this.token = localStorage.getItem('TOKEN')
		// if (this.token == null) {
		// 	this.redirect_login()
		// } else {
		const httpOptions = {
			headers: new HttpHeaders({
				"Authorization": "Bearer " + localStorage.getItem('TOKEN')
			})
		};
		return httpOptions
		// }


	}
	redirect_login() {
		localStorage.clear()
		localStorage.setItem('error_alert_msg', "Session expired, Login to continue")
		this.router.navigate(['login'])
		// this.router.navigate('/login')
		// window.location.href = "login.html"
	}

	check_internet() {
		this.connectionService.monitor().subscribe(isConnected => {
			if (isConnected) {
				return true;
			}
			else {
				return false;
			}
		})
		return false;
	}

}
