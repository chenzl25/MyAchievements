import {Component, OnInit} from 'angular2/core';
import {NgForm, NgClass, NgIf} from 'angular2/common';
import {NavComponent} from '../../navComponent/nav.component';
import {Router, ROUTER_DIRECTIVES} from 'angular2/router';
import {UserService} from '../../lib/user.service';
import {StorageService} from '../../lib/storage.service';
import {User, Class, Group, Assignment} from '../../lib/interface';
import {TeacherService} from '../teacher.service';
import {I18nPipe} from '../../lib/i18n.pipe';
import {TimeStampPipe} from '../../lib/timeStamp.pipe';
var moment = require('moment');

@Component({
	selector: 'teacher',
	template: require('./teacher.jade'),
	styles: [require('./teacher.scss')],
	pipes: [TimeStampPipe],
	directives: [NavComponent, NgClass,ROUTER_DIRECTIVES],
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
	updateAssignmentId: string = "";
	outputAssignmentSuccess: boolean = false;
	outputAssignmentMessages: string[] = [];
	constructor(private userService: UserService,
  						private storageService: StorageService,
  						private teacherService: TeacherService,
  						private router: Router) { }
	ngOnInit() {
		this.teacherData = this.userService.getUser();
	}
	onClickSetUpCreateAssignment() {
		this.clearInput();
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
						this.outputAssignmentSuccess = true;
						this.outputAssignmentMessages = ['ok'];
						this.teacherData.LINK_assignments.push({
							end: assignmentData.end,
							from: assignmentData.from,
							state: assignmentData.state,
							name: assignmentData.name,
						  _id: assignmentData._id,
						  link: assignmentData.link,
						});
						this.clearInput();
					},
					errorMessage => {
						this.outputAssignmentSuccess = false;
						this.outputAssignmentMessages = errorMessage;
						this.clearInput();
					})
	}
	onClickSetUpUpdateAssignment(assignmentItem: Assignment): void {
		this.updateAssignmentId = assignmentItem._id;
		this.inputAssignmentName = assignmentItem.name;
		this.inputAssignmentLink = assignmentItem.link;
		this.inputAssignmentFrom = this.convertTimeStampToInput(assignmentItem.from);
		this.inputAssignmentEnd = this.convertTimeStampToInput(assignmentItem.end);
	}
	onClickUpdateAssignment():void {
		this.inputAssignmentFromTimeStamp = moment(this.inputAssignmentFrom).toDate().getTime().toString();
		this.inputAssignmentEndTimeStamp = moment(this.inputAssignmentEnd).toDate().getTime().toString();
		this.teacherService
				.updateAssignment(
					this.updateAssignmentId,
					this.inputAssignmentName,
					this.inputAssignmentLink,
					this.inputAssignmentFromTimeStamp,
					this.inputAssignmentEndTimeStamp)
				.then(
					assignmentData => {
						this.outputAssignmentSuccess = true;
						this.outputAssignmentMessages = ['ok'];
						this.teacherData.LINK_assignments.forEach(assignment => {
							if (assignment._id === assignmentData._id) {
								assignment.end = assignmentData.end;
								assignment.from = assignmentData.from;
								assignment.state = assignmentData.state;
								assignment.name = assignmentData.name;
							  assignment.link = assignmentData.link;
							}
						})
						this.clearInput();
					},
					errorMessage => {
						this.outputAssignmentSuccess = false;
						this.outputAssignmentMessages = errorMessage;
						this.clearInput();
					})
	}
	onClickGetRank(assignmentId: string):void {
		this.teacherService.getRank(assignmentId)
											 .then(successMessage => alert('OK'),
											 			 errorMessage => alert(errorMessage))
	}
	clearInput():void {
		this.inputAssignmentName = "";
		this.inputAssignmentLink = "";
		this.inputAssignmentFrom = "";
		this.inputAssignmentEnd = "";
		this.inputAssignmentFromTimeStamp = "";
		this.inputAssignmentEndTimeStamp = "";
	}
	convertTimeStampToInput(timeStamp: string):string {
		return moment(parseInt(timeStamp)).format().toString().slice(0,16);
	}
}
