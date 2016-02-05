import {Component, OnInit} from 'angular2/core';
import {NavComponent} from '../navComponent/nav.component';
import {Router} from 'angular2/router';
import {UserService} from '../lib/user.service';
import {StorageService} from '../lib/storage.service';
import {ManageService} from './manage.service';
import {User, Class, Group} from '../lib/interface';
@Component({
	selector: 'manager',
	template: require('./manager.jade'),
	styles: [require('./manager.scss')],
	directives: [NavComponent],
	providers: [ManageService]
})
export class ManagerComponent implements OnInit {
	managerData: any;
	registerClassMessages: string[];
	registerGroupMessages: string[];
	registerUserMessages: string[];
	routeToClassList: boolean;
	routeToGroupList: boolean;
	routeToUserList: boolean;
	classList: Class[];
	groupList: Group[];
	userList: User[];
  constructor(private userService: UserService,
  						private storageService: StorageService,
  						private router: Router,
  						private manageService: ManageService) { }
	ngOnInit() {
		this.managerData = this.userService.getUser();
		this.registerClassMessages = ['a', 'b'];
		this.registerGroupMessages = ['c', 'd'];
		this.registerUserMessages  = ['e', 'f'];
		this.routeToClassList = true;
		this.routeToGroupList = true;
		this.routeToUserList = true;
		this.classList = [];
		this.groupList = [];
		this.userList = [];
	}
	onQuit():void {
		this.storageService.setQuit(true);
		this.router.navigate(['Login']);
	}
	onClickRouteToClassList():void {
		this.routeToClassList = true;
	}
	onClickRouteToClassAdd():void {
		this.routeToClassList = false;
	}
	onClickRouteToGroupList():void {
		this.routeToGroupList = true;
	}
	onClickRouteToGroupAdd():void {
		this.routeToGroupList = false;
	}
	onClickRouteToUserList():void {
		this.routeToUserList = true;
	}
	onClickRouteToUserAdd():void {
		this.routeToUserList = false;
	}
}
