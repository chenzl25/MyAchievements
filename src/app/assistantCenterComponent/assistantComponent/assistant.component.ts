import {Component, OnInit} from 'angular2/core';
import {NgForm, NgClass, NgIf} from 'angular2/common';
import {NavComponent} from '../../navComponent/nav.component';
import {Router, ROUTER_DIRECTIVES} from 'angular2/router';
import {UserService} from '../../lib/user.service';
import {StorageService} from '../../lib/storage.service';
import {User, Class, Group} from '../../lib/interface';
import {AssistantService} from '../assistant.service';
import {I18nPipe} from '../../lib/i18n.pipe';
import {TimeStampPipe} from '../../lib/timeStamp.pipe';
@Component({
	selector: 'assistant',
	template: require('./assistant.jade'),
	styles: [require('./assistant.scss')],
	directives: [NavComponent, NgClass, ROUTER_DIRECTIVES],
	pipes: [TimeStampPipe]
})
export class AssistantComponent implements OnInit {
	assistantData: User;
	constructor(private userService: UserService,
  						private storageService: StorageService,
  						private teacherService: AssistantService,
  						private router: Router) { }
	ngOnInit() {
		this.assistantData = this.userService.getUser();
	}
}
