import {Component, OnInit} from 'angular2/core';
import {NgForm, NgClass} from 'angular2/common';
import {NavComponent} from '../navComponent/nav.component';
import {Router} from 'angular2/router';
import {UserService} from '../lib/user.service';
import {StorageService} from '../lib/storage.service';
import {ManageService} from './manage.service';
import {User, Class, Group} from '../lib/interface';
import {TotalStudentsOfClassPipe} from './totalStudentsOfClass.pipe';
import {GroupNameOfStudentPipe} from './groupNameOfStudent.pipe';
import {ClassNameOfGroupPipe} from './classNameOfGroup.pipe';
import {I18nPipe} from '../lib/i18n.pipe';
@Component({
	selector: 'manager',
	template: require('./manager.jade'),
	styles: [require('./manager.scss')],
	directives: [NavComponent, NgClass],
	providers: [ManageService],
	pipes: [TotalStudentsOfClassPipe,
					GroupNameOfStudentPipe,
					ClassNameOfGroupPipe,
					I18nPipe,]
})
export class ManagerComponent implements OnInit {
	managerData: any;
	registerClassMessages: string[] = [];
	registerGroupMessages: string[] = [];
	registerUserMessages: string[] = [];
	registerClassSuccess: boolean = false;
	registerGroupSuccess: boolean = false;
	registerUserSuccess: boolean = false;
	getClassAllMessages: string[] = [];
	getGroupAllMessages: string[] = [];
	getUserAllMessages: string[] = [];
	routeToClassList: boolean = true;
	routeToGroupList: boolean = true;
	routeToUserList: boolean = true;
	classList: Class[] = [];
	groupList: Group[] = [];
	userList: User[] = [];
	inputUserAccount: string;
	inputUserPassword: string;
	inputUserName: string;
	inputUserEmail: string;
	inputUserPosition: string;
	inputClassName: string;
	inputGroupName: string;
	inputGroupClassId: string;
	inputGroupClassName: string;
	GCsuccess: boolean = false;
	GCfail: boolean = false;
	stateGCDragOver: boolean = false;
  constructor(private userService: UserService,
  						private storageService: StorageService,
  						private router: Router,
  						private manageService: ManageService) { }
	ngOnInit() {
		this.managerData = this.userService.getUser();
		this.manageService.getClassAll()
				.then(classsData => this.classList = classsData,
							errorMessages => this.getClassAllMessages = errorMessages);
		this.manageService.getGroupAll()
				.then(groupsData => this.groupList = groupsData,
							errorMessages => this.getGroupAllMessages = errorMessages);
		this.manageService.getUserAll()
				.then(usersData => this.userList = usersData,
							errorMessages => this.getUserAllMessages = errorMessages);
	}
	onQuit():void {
		this.storageService.setQuit(true);
		this.router.navigate(['Login']);
	}
	findInputGroupClassIdByClassName(className) {
		for (let i = 0; i < this.classList.length; i++)
			if (this.classList[i].name === className)
				this.inputGroupClassId = this.classList[i]._id
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
	onClickRegisterClass(): void {
		this.manageService.registerClass(this.inputClassName)
											.then(
												classData => {
													this.registerClassMessages = ['创建班级成功'];
													this.inputClassName = '';
													this.registerClassSuccess = true;
													this.classList.push(classData);
												},
												errorMessages => this.registerClassMessages = errorMessages)
	}
	registerGroupRefreshUpper(groupItem: Group): void {
		let classId = groupItem.classId;
		for (let i = 0; i < this.classList.length; i++)
			if(classId === this.classList[i]._id) {
				this.classList[i].groupsId.push(groupItem._id);
				break;
			}
	}
	onClickRegisterGroup(): void {
		this.manageService.registerGroup(this.inputGroupClassId,this.inputGroupName)
											.then(
												groupData => {
													this.registerGroupMessages = ['创建小组成功'];
													this.inputGroupName = '';
													this.registerGroupSuccess = true;
													this.groupList.push(groupData);
													this.registerGroupRefreshUpper(groupData);
												},
												errorMessages => this.registerClassMessages = errorMessages)
	}
	onClickRegisterUser(): void {
		this.manageService.registerUser(this.inputUserAccount, this.inputUserPassword, this.inputUserName, this.inputUserEmail, this.inputUserPosition)
											.then(
												userData => {
													this.registerUserMessages = ['注册用户成功'];
													// this.inputUserName = '';
													this.registerUserSuccess = true;
													this.userList.push(userData);
												},
												errorMessages => this.registerUserMessages = errorMessages)
	}
	onClassDragStart(event:DragEvent, classItem: Class):void {
		let transferData = JSON.stringify({ flag: 'class', classData: classItem });
		event.dataTransfer.setData("text/plain", transferData);
	}
	onGroupDragStart(event:DragEvent, groupItem: Group):void {
		let transferData = JSON.stringify({ flag: 'group', groupData: groupItem });
		event.dataTransfer.setData("text/plain", transferData);
	}
	onUserDragStart(event:DragEvent, userItem: User):void {
		let transferData = JSON.stringify({flag:'user', userData:userItem})
		event.dataTransfer.setData("text/plain", transferData);
	}
	onGCDragOver(event: DragEvent):void {
		event.preventDefault();
		event.dataTransfer.dropEffect = "move"
		this.stateGCDragOver = true;
	}
	onGCDragEnter(event: DragEvent):void {
		event.preventDefault();
		this.stateGCDragOver = true;
	}
	onGCDragLeave(event: DragEvent):void {
		event.preventDefault();
		this.stateGCDragOver = false;
	}
	onGCDrop(event: DragEvent):void {
		console.log('Drop');
		this.stateGCDragOver = false;
		let transferData = event.dataTransfer.getData('text');
		let parsedData = JSON.parse(transferData);
		console.log(parsedData);
		switch(parsedData.flag) {
			case 'user':
				let userData = parsedData.userData;
				this.manageService
						.deleteUser(userData.account)
						.then(() => {
										this.GCsuccess = true;
										setTimeout(()=>this.GCsuccess = false,2000);
										this.userListRemoveUser(userData);
									},
									() => {
										this.GCfail = true;
										setTimeout(()=>this.GCfail = false, 2000);
									})
				break;
			case 'group':
				let groupData = parsedData.groupData;
				this.manageService
						.deleteGroup(groupData._id)
						.then(() => {
										this.GCsuccess = true;
										setTimeout(()=>this.GCsuccess = false,2000);
										this.groupListRemoveGroup(groupData);
									},
									() => {
										this.GCfail = true;
										setTimeout(()=>this.GCfail = false, 2000);
									})
				break;
			case 'class':
				let classData = parsedData.classData;
					this.manageService
							.deleteClass(classData._id)
							.then(() => {
											this.GCsuccess = true;
											setTimeout(()=>this.GCsuccess = false,2000);
											this.classListRemoveClass(classData);
										},
										() => {
											this.GCfail = true;
											setTimeout(()=>this.GCfail = false, 2000);
										})
				break;
			default:
		}
	}
	userRemoveRefreshUpper(userId: string): void {
		for(let i = 0; i < this.groupList.length; i++) {
			for(let j = 0; j < this.groupList[i].studentsId.length; j++)
				if(userId === this.groupList[i].studentsId[j]) {
					this.groupList[i].studentsId.splice(j, 1);
					break;
				}
			for(let j = 0; j < this.groupList[i].assistantsId.length; j++)
				if(userId === this.groupList[i].assistantsId[j]) {
					this.groupList[i].assistantsId.splice(j, 1);
					break;
				}
		}
	}
	userListRemoveUser(userItem: User): void {
		let userId = userItem._id;
		this.userRemoveRefreshUpper(userId);
		for(let i = 0; i < this.userList.length; i++)
			if (userId === this.userList[i]._id) {
				this.userList.splice(i, 1);
				break;
			}
	}
	groupRemoveRefreshUpper(groupId: string):void {
		for(let i = 0; i < this.classList.length; i++)
			for(let j = 0; j < this.classList[i].groupsId.length; j++)
				if(groupId === this.classList[i].groupsId[j]) {
					this.classList[i].groupsId.splice(j, 1);
					break;
				}
	}
	groupRemoveRefreshLower(groupId: string): void {
		for (let i = 0; i < this.userList.length; i++)
			if(groupId === this.userList[i].groupsId[0])
				this.userList[i].groupsId = [];
	}
	groupListRemoveGroup(groupItem: Group):void {
		let groupId = groupItem._id;
		this.groupRemoveRefreshUpper(groupId);
		this.groupRemoveRefreshLower(groupId);
		for(let i = 0; i < this.groupList.length; i++)
			if (groupId === this.groupList[i]._id){
				this.groupList.splice(i, 1);
				break;
			}
	}
	classRemoveRefreshLower(classItem: Class): void {
		let classId = classItem._id;
		for (let i = 0; i < this.groupList.length;)
			if (classId === this.groupList[i].classId) {
				this.groupListRemoveGroup(this.groupList[i])
			} else {
				i++;
			}
		for (let i = 0; i < classItem.teachersId.length; i++)
			for (let j = 0; j < this.userList.length; j++)
				if (classItem.teachersId[i] === this.userList[j]._id)
					for (let k = 0; k < this.userList[j].classsId.length; k++)
						if (classId === this.userList[j].classsId[k]) {
							this.userList[j].classsId.splice(k, 1);
							return;
						}
	}
	classListRemoveClass(classItem: Class):void {
		let classId = classItem._id;
		this.classRemoveRefreshLower(classItem);
		for(let i = 0; i < this.classList.length; i++)
			if (classId === this.classList[i]._id){
				this.classList.splice(i, 1);
				break;
			} 
	}
}
