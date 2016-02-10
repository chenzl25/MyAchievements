import {Component, OnInit} from 'angular2/core';
import {Router, ROUTER_DIRECTIVES} from 'angular2/router';
import {UserService} from '../lib/user.service';
import {StorageService} from '../lib/storage.service';
import {ChangePasswordComponent} from '../changePasswordComponent/changePassword.component';
import {QuitService} from './quit.service';
import {I18nPipe} from '../lib/i18n.pipe';
import {User} from '../lib/interface';
@Component({
	selector: 'my-nav',
	template: require('./nav.jade'),
	styles: [require('./nav.scss')],
	inputs: ['userData', 'brandLink'],
	pipes: [I18nPipe],
  providers: [QuitService],
	directives: [ROUTER_DIRECTIVES,
							 ChangePasswordComponent],
})
export class NavComponent {
	userData: User;
	brandLink: string;
  constructor(private storageService: StorageService,
  						private quitService: QuitService,
  						private router: Router) { }
	onQuit() {
		this.quitService
				.quit()
				.then(successMessage => {
						this.storageService.setQuit(true);
						this.router.navigate(['Login']);
					},
					err => {
						console.log(err); // acctually it should send some log to the server.
						this.storageService.setQuit(true);
						this.router.navigate(['Login']);
					}
				)
	}
}
