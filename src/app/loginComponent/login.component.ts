import {Component} from 'angular2/core';
import {OnInit} from 'angular2/core';
import {HTTP_PROVIDERS} from 'angular2/http';
import {LoginService} from './login.service';
import {NgForm}    from 'angular2/common';
import {User} from '../lib/interface';
import {StorageService} from '../lib/storage.service';

@Component({
	selector: 'login',
	template: require('./login.jade'),
	styles: [require('./login.scss')],
	providers: [HTTP_PROVIDERS, LoginService]
})
export class LoginComponent implements OnInit {
	account: string;
	password: string;
	messages: string[];
	remember: boolean;
	quit: boolean;
	constructor(private loginService:LoginService,
							private storageService: StorageService) {}
	ngOnInit() {
		this.account = this.storageService.getAccount();
		this.password = this.storageService.getPassword();
		this.messages = [];
		this.remember = this.storageService.getRemember();
		this.quit = this.storageService.getQuit();
		if(this.remember && !this.quit) {
			this.onLogin();
		}
	}
	onLogin() {
		this.storeAccordingToRemember();
		this.loginService.login(this.account, this.password)
										 .then(() => this.storageService.setQuit(false))
										 .catch(errorMessages => { this.messages = errorMessages });
	}
	onClickRemember() {
		this.remember = !this.remember;
		this.storeAccordingToRemember();
	}
	storeAccordingToRemember() {
		this.storageService.setRemember(this.remember);
		if (this.remember) {
			this.storageService.setAccount(this.account);
			this.storageService.setPassword(this.password);
		} else {
			this.storageService.setAccount("");
			this.storageService.setPassword("");
		}
	}
}
