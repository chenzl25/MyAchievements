import {Component, OnInit} from 'angular2/core';
import {Router, ROUTER_DIRECTIVES} from 'angular2/router';
import {UserService} from '../lib/user.service';
import {StorageService} from '../lib/storage.service';
import {ChangePasswordService} from './changePassword.service';

import {User} from '../lib/interface';
@Component({
	selector: 'my-change-password',
	template: require('./changePassword.jade'),
	styles: [require('./changePassword.scss')],
	inputs: ['userData'],
	// directives: [ROUTER_DIRECTIVES],
	providers: [ChangePasswordService]
})
export class ChangePasswordComponent implements OnInit {
	userData: User;
	inputOldPassword: string = "";
	inputNewPassowrd: string = "";
	inputNewPassowrdAgain: string = "";
	changePassowrdSuccess: boolean = false;
	changePassowrdMessages: string[] = [];
  constructor(private storageService: StorageService,
  						private userService: UserService,
  						private changePasswordService: ChangePasswordService,
  						private router: Router) { }
  ngOnInit() {
		this.userData = this.userService.getUser(); // this will check the login
  }
  onClickChangePassword():void {
  	if(this.inputNewPassowrd !== this.inputNewPassowrdAgain) {
			this.changePassowrdSuccess = false;
			this.changePassowrdMessages = ['新密码两次输入不同'];
			return;
  	}
  	this.changePasswordService
  			.changePassword(this.inputOldPassword, this.inputNewPassowrd)
  			.then(
  				successMessage => {
						this.changePassowrdSuccess = true;
						this.changePassowrdMessages = successMessage;
  				},
  				errorMessage => {
						this.changePassowrdSuccess = false;
						this.changePassowrdMessages = errorMessage;
  				}
  			)
  }
	onQuit():void {
		this.storageService.setQuit(true);
		this.router.navigate(['Login']);
	}
}
