import {Component} from 'angular2/core';
import {OnInit} from 'angular2/core';
import {HTTP_PROVIDERS} from 'angular2/http';
import {LoginService} from './login.service';
import {NgForm}    from 'angular2/common';

@Component({
	selector: 'login',
	template: require('./login.jade'),
	styles: [require('./login.scss')],
	providers: [HTTP_PROVIDERS, LoginService]
})
export class LoginComponent implements OnInit {
	account: string;
	password: string;
	message: string;
	constructor(private _loginService:LoginService) {}
	ngOnInit() {
		this.account = 'DDDD';
		this.password = 'PPPP';
		this.message = 'error'
	}
	onLogin() {
		this._loginService.login(this.account, this.password)
			.subscribe(
				res => this.message = res,
				err => this.message = err
			);
	}
}
