import {Component, OnInit} from 'angular2/core';
import {NgForm, NgClass, NgIf} from 'angular2/common';
import {NavComponent} from '../navComponent/nav.component';
import {Router} from 'angular2/router';
import {UserService} from '../lib/user.service';
import {StorageService} from '../lib/storage.service';
import {ManagerService} from './manager.service';
import {User, Class, Group} from '../lib/interface';
import {TotalStudentsOfClassPipe} from './totalStudentsOfClass.pipe';
import {GroupNameOfStudentPipe} from './groupNameOfStudent.pipe';
import {ClassNameOfGroupPipe} from './classNameOfGroup.pipe';
import {TeacherNameOfClassPipe} from './teacherNameOfClass.pipe';
import {AssistantNameOfGroupPipe} from './assistantNameOfGroup.pipe';
import {I18nPipe} from '../lib/i18n.pipe';
@Component({
	selector: 'manager',
	template: require('./manager.jade'),
	styles: [require('./manager.scss')],
	directives: [NavComponent, NgClass],
	providers: [ManagerService],
	pipes: [TotalStudentsOfClassPipe,
					GroupNameOfStudentPipe,
					ClassNameOfGroupPipe,
					TeacherNameOfClassPipe,
					AssistantNameOfGroupPipe,
					I18nPipe,]
})
export class ManagerComponent implements OnInit {
	managerData: User;
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
	stateGCIndicate: boolean = false;
  constructor(private userService: UserService,
  						private storageService: StorageService,
  						private router: Router,
  						private manageService: ManagerService) { }
	ngOnInit() {
		this.managerData = this.userService.getUser(); // this will check the login
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
												errorMessages => this.registerGroupMessages = errorMessages)
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
		this.stateGCIndicate = true;
		let transferData = JSON.stringify({ flag: 'class', classData: classItem });
		event.dataTransfer.setData("text/plain", transferData);
	}
	onGroupDragStart(event:DragEvent, groupItem: Group):void {
		this.stateGCIndicate = true;
		let transferData = JSON.stringify({ flag: 'group', groupData: groupItem });
		event.dataTransfer.setData("text/plain", transferData);
	}
	onUserDragStart(event:DragEvent, userItem: User):void {
		this.stateGCIndicate = true;
		let transferData = JSON.stringify({flag:'user', userData:userItem})
		event.dataTransfer.setData("text/plain", transferData);
		switch(userItem.position) {
			case 'teacher':
				this.classIndicateForTeacher(userItem);
				break;
			case 'assistant':
				this.groupIndicateForAssistant(userItem);
				break;
			case 'student':
				this.groupIndicateForStudent(userItem);
				break;
			default:
		}
	}
	onItemDragEnd(event:DragEvent):void {
		this.stateGCIndicate = false;
		this.classList.forEach(classItem => classItem.indicate = false);
		this.groupList.forEach(groupItem => groupItem.indicate = false);
	}
	onItemDragEnter(event:DragEvent):void {
		event.preventDefault();
		event.toElement.classList.add('item-drag-over');
	}
	onItemDragLeave(event:DragEvent):void {
		event.preventDefault();
		event.toElement.classList.remove('item-drag-over');
	}
	onGroupItemDragOver(event:DragEvent):void {
		event.preventDefault();
	}
	onClassItemDragOver(event: DragEvent): void {
		event.preventDefault();
	}
	onGroupItemDrop(event:DragEvent, groupItem: Group):void {
		event.toElement.classList.remove('item-drag-over');
		let transferData = event.dataTransfer.getData('text');
		let parsedData = JSON.parse(transferData);
		if (parsedData.flag === 'user' && parsedData.userData.position === 'assistant'){
			let assistantItem = parsedData.userData;
			this.manageService
					.addAssistantToGroup(groupItem._id, assistantItem._id)
					.then(
						groupData => {
							this.groupListAddAssistantToGroup(groupData, assistantItem);
						},
						errorMessage => {
								alert(errorMessage);
						}
					)
		}
		if (parsedData.flag === 'user' && parsedData.userData.position === 'student'){
			let studentItem = parsedData.userData;
			this.manageService
					.addStudentToGroup(groupItem._id, studentItem._id)
					.then(
						groupData => {
							this.groupListAddStudentToGroup(groupData, studentItem);
						},
						errorMessage => {
								alert(errorMessage);
						}
					)
		}
	}
	onClassItemDrop(event:DragEvent, classItem: Class):void {
		event.toElement.classList.remove('item-drag-over');
		let transferData = event.dataTransfer.getData('text');
		let parsedData = JSON.parse(transferData);
		if (parsedData.flag === 'user' && parsedData.userData.position === 'teacher'){
			let teacherItem = parsedData.userData;
			this.manageService
					.addTeacherToClass(classItem._id, teacherItem._id)
					.then(
						classData => {
							this.classListAddTeacherToClass(classData, teacherItem);
						},
						errorMessage => {
								alert(errorMessage);
						}
					)
		}
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
		this.stateGCDragOver = false;
		let transferData = event.dataTransfer.getData('text');
		let parsedData = JSON.parse(transferData);
		switch(parsedData.flag) {
			case 'user':
				let userData = parsedData.userData;
				this.manageService
						.deleteUser(userData.account)
						.then(() => {
										this.GCsuccess = true;
										setTimeout(()=>this.GCsuccess = false,3000);
										this.userListRemoveUser(userData);
									},
									errorMessage => {
										alert(errorMessage)
										this.GCfail = true;
										setTimeout(()=>this.GCfail = false, 3000);
									})
				break;
			case 'group':
				let groupData = parsedData.groupData;
				this.manageService
						.deleteGroup(groupData._id)
						.then(() => {
										this.GCsuccess = true;
										setTimeout(()=>this.GCsuccess = false,3000);
										this.groupListRemoveGroup(groupData);
									},
									errorMessage => {
										alert(errorMessage)
										this.GCfail = true;
										setTimeout(()=>this.GCfail = false, 3000);
									})
				break;
			case 'class':
				let classData = parsedData.classData;
					this.manageService
							.deleteClass(classData._id)
							.then(() => {
											this.GCsuccess = true;
											setTimeout(()=>this.GCsuccess = false,3000);
											this.classListRemoveClass(classData);
										},
										errorMessage => {
											alert(errorMessage)	
											this.GCfail = true;
											setTimeout(()=>this.GCfail = false, 3000);
										})
				break;
			default:
		}
	}
	studentRemoveRefreshUpper(userId: string): void {
		for(let i = 0; i < this.groupList.length; i++)
			for(let j = 0; j < this.groupList[i].studentsId.length; j++)
				if(userId === this.groupList[i].studentsId[j]) {
					this.groupList[i].studentsId.splice(j, 1);
					return;
				}
	}
	assistantRemoveRefreshUpper(assistantId: string): void {
		for(let i = 0; i < this.groupList.length; i++)
			if(assistantId === this.groupList[i].assistantsId[0])
				this.groupList[i].assistantsId = [];
	}
	teacherRemoveRefreshUpper(teacherId: string): void {
		for (let i = 0; i < this.classList.length; i++)
			if (teacherId === this.classList[i].teachersId[0])
				this.classList[i].teachersId = [];
	}
	userListRemoveUser(userItem: User): void {
		let userId = userItem._id;
		switch(userItem.position) {
			case 'teacher':
				this.teacherRemoveRefreshUpper(userId);
				break;
			case 'assistant':
				this.assistantRemoveRefreshUpper(userId);
				break;
			case 'student':
				this.studentRemoveRefreshUpper(userId);
				break;
			default:
		}
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
	classListAddTeacherToClass(classItem: Class, teacherItem: User):void {
			let classId = classItem._id;
			let teacherId = teacherItem._id;
			let toUpdateClassItem = this.classList.find(v => v._id === classId);
			toUpdateClassItem.teachersId.push(teacherId);
			let toUpdateTeacherItem = this.userList.find(v => v._id === teacherId);
			toUpdateTeacherItem.classsId.push(classId);
	}
	groupListAddAssistantToGroup(groupItem: Group, assistantItem: User):void {
			let groupId = groupItem._id;
			let assistantId = assistantItem._id;
			let toUpdateGroupItem = this.groupList.find(v => v._id === groupId);
			toUpdateGroupItem.assistantsId.push(assistantId);
			let toUpdateAssistantItem = this.userList.find(v => v._id === assistantId);
			toUpdateAssistantItem.groupsId.push(groupId);
	}
	groupListAddStudentToGroup(groupItem: Group, studentItem: User):void {
			let groupId = groupItem._id;
			let studentId = studentItem._id;
			let toUpdateGroupItem = this.groupList.find(v => v._id === groupId);
			toUpdateGroupItem.studentsId.push(studentId);
			let toUpdateStudentItem = this.userList.find(v => v._id === studentId);
			toUpdateStudentItem.groupsId.push(groupId);
	}
	classIndicateForTeacher(teacherItem: User):void {
		for (let i = 0; i < this.classList.length; i++) {
			if (teacherItem.classsId.length === 0 && this.classList[i].teachersId.length === 0)
				this.classList[i].indicate = true;
			for (let j = 0; j < teacherItem.classsId.length; j++)
				if (this.classList[i]._id !== teacherItem.classsId[j] &&
						this.classList[i].teachersId.length === 0)
					this.classList[i].indicate = true;
		}
	}
	groupIndicateForAssistant(assistantItem: User):void {
		for (let i = 0; i < this.groupList.length; i++) {
			if (assistantItem.groupsId.length === 0 && this.groupList[i].assistantsId.length === 0)
				this.groupList[i].indicate = true;
			for (let j = 0; j < assistantItem.groupsId.length; j++)
				if (this.groupList[i]._id !== assistantItem.groupsId[j] &&
					this.groupList[i].assistantsId.length === 0)
					this.groupList[i].indicate = true;
		}
	}
	groupIndicateForStudent(studentItem: User):void {
		if (studentItem.groupsId.length !== 0) {
				this.groupList.forEach(groupItem => groupItem.indicate = false);
				return;
		}
		for (let i = 0; i < this.groupList.length; i++)
			if (!(studentItem._id in this.groupList[i].studentsId))
				this.groupList[i].indicate = true;
	}
}
