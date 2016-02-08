import {Component, OnInit} from 'angular2/core';
import {NgForm, NgClass, NgIf} from 'angular2/common';
import {NavComponent} from '../navComponent/nav.component';
import {Router} from 'angular2/router';
import {UserService} from '../lib/user.service';
import {StorageService} from '../lib/storage.service';
import {User, Class, Group} from '../lib/interface';
import {I18nPipe} from '../lib/i18n.pipe';
@Component({
	selector: 'assistant',
	template: require('./assistant.jade'),
	styles: [require('./assistant.scss')],
	directives: [NavComponent, NgClass],
})
export class AssistantComponent implements OnInit {
	assistantData: User;
	constructor(private userService: UserService,
  						private storageService: StorageService,
  						private router: Router) { }
	ngOnInit() {
		this.assistantData = this.userService.getUser();
		console.log(this.assistantData)
	}
}
