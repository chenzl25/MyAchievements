import {Component, OnInit} from 'angular2/core';
import {Router} from 'angular2/router';
import {UserService} from '../lib/user.service';
import {StorageService} from '../lib/storage.service';
import {User} from '../lib/interface';
@Component({
	selector: 'my-nav',
	template: require('./nav.jade'),
	styles: [require('./nav.scss')],
	inputs: ['userData']
})
export class NavComponent {
	userData: any;
  constructor(private storageService: StorageService,
  						private router: Router) { }
	onQuit() {
		this.storageService.setQuit(true);
		this.router.navigate(['Login']);
	}
}
