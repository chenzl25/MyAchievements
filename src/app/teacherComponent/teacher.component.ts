import {Component, OnInit} from 'angular2/core';
import {NgForm, NgClass, NgIf} from 'angular2/common';
import {NavComponent} from '../navComponent/nav.component';
import {Router} from 'angular2/router';
import {UserService} from '../lib/user.service';
import {StorageService} from '../lib/storage.service';
import {User, Class, Group} from '../lib/interface';
import {TeacherService} from './teacher.service';
import {I18nPipe} from '../lib/i18n.pipe';
import {TimeStampPipe} from '../lib/timeStamp.pipe';
var moment = require('moment');

@Component({
	selector: 'teacher',
	template: require('./teacher.jade'),
	styles: [require('./teacher.scss')],
	pipes: [TimeStampPipe],
	directives: [NavComponent, NgClass],
	providers: [TeacherService]
})
export class TeacherComponent implements OnInit {
	teacherData: User;
	inputAssignmentName: string = "";
	inputAssignmentLink: string = "";
	inputAssignmentFrom: string = "";
	inputAssignmentEnd: string = "";
	inputAssignmentFromTimeStamp: string = "";
	inputAssignmentEndTimeStamp: string = "";
	createAssignmentSuccess: boolean = false;
	createAssignmentMessages: string[] = [];
	constructor(private userService: UserService,
  						private storageService: StorageService,
  						private teacherService: TeacherService,
  						private router: Router) { }
	ngOnInit() {
		this.teacherData = this.userService.getUser();
		console.log(this.teacherData);
		console.log(moment().format());
	}
	onClickCreateAssignment():void {
		this.inputAssignmentFromTimeStamp = moment(this.inputAssignmentFrom).toDate().getTime().toString();
		this.inputAssignmentEndTimeStamp = moment(this.inputAssignmentEnd).toDate().getTime().toString();
		this.teacherService
				.createAssignment(
					this.inputAssignmentName,
					this.inputAssignmentLink,
					this.inputAssignmentFromTimeStamp,
					this.inputAssignmentEndTimeStamp)
				.then(
					assignmentData => {
						console.log(assignmentData)
						this.createAssignmentSuccess = true;
						this.createAssignmentMessages = ['ok'];
						this.teacherData.LINK_assignments.push({
							end: assignmentData.end,
							from: assignmentData.from,
							state: assignmentData.state,
							name: assignmentData.name,
						  _id: assignmentData._id,
						  link: assignmentData.link,
						});
					},
					errorMessage => {
						this.createAssignmentSuccess = false;
						this.createAssignmentMessages = errorMessage;
					})
	}
}
