import {Component, OnInit} from 'angular2/core';
import {NgForm, NgClass, NgIf} from 'angular2/common';
import {NavComponent} from '../../navComponent/nav.component';
import {Router, ROUTER_DIRECTIVES} from 'angular2/router';
import {UserService} from '../../lib/user.service';
import {StorageService} from '../../lib/storage.service';
import {StudentService} from '../student.service';
import {User, Class, Group, Homework} from '../../lib/interface';
import {I18nPipe} from '../../lib/i18n.pipe';
import {TimeStampPipe} from '../../lib/timeStamp.pipe';
import {HomeworkImagePipe} from './homeworkImage.pipe';
import {HomeworkSourcePipe} from './homeworkSource.pipe';
import {HomeworkFinalScorePipe} from './homeworkFinalScore.pipe';
import {HomeworkClassRankPipe} from './homeworkClassRank.pipe';
import {HomeworkGroupRankPipe} from './homeworkGroupRank.pipe';
@Component({
	selector: 'student',
	template: require('./student.jade'),
	styles: [require('./student.scss')],
	directives: [NavComponent,
							 NgClass,
							 ROUTER_DIRECTIVES],
	pipes: [TimeStampPipe,
					HomeworkImagePipe,
					HomeworkSourcePipe,
					HomeworkFinalScorePipe,
					HomeworkClassRankPipe,
					HomeworkGroupRankPipe]
})
export class StudentComponent implements OnInit {
	studentData: User;
	inputHomeworkGithub: string = "";
	inputHomeworkMessage: string = "";
	inputHomeworkSource: File;
	inputHomeworkImage: File;
	inputAssignmentId: string = "";
	inputHomeworkId: string = "";
	outputSuccess: boolean = false;
	outputMessages: string[] = [];
	constructor(private userService: UserService,
  						private storageService: StorageService,
  						private studentService: StudentService,
  						private router: Router) { }
	ngOnInit() {
		this.studentData = this.userService.getUser();
	}
	onClickSetUpCreateHomework(assignmentId: string):void {
		this.clearInput();
		this.inputAssignmentId = assignmentId;
	}
	onClickCreateHomework():void {
		this.inputHomeworkSource = (<HTMLInputElement>document.getElementById('homework-create-source')).files[0];
		this.inputHomeworkImage = (<HTMLInputElement>document.getElementById('homework-create-image' )).files[0];
		this.studentService
				.createHomework(
					this.inputAssignmentId,
					this.inputHomeworkGithub,
					this.inputHomeworkMessage,
					this.inputHomeworkSource,
					this.inputHomeworkImage)
				.then(
					homeworkData => {
						let _homeworkData_ = <Homework>homeworkData;
						this.outputSuccess = true;					
						this.outputMessages = ['ok'];
						_homeworkData_.LINK_assignment = this.studentData.LINK_assignments.find(assignment => assignment._id === _homeworkData_.assignmentId);						
						this.studentData.LINK_homeworks.push(_homeworkData_)
						this.userService.setUser(this.studentData);
					},
					errorMessage => {
						this.outputSuccess = false;
						this.outputMessages = errorMessage;
					}
				)
	}
	onClickSetUpUpdateHomework(assignmentId: string):void {
		this.clearInput();
		let haveUploadedHomeworkList = this.studentData.LINK_homeworks;
		this.clearInput();
		for(let i = 0; i < haveUploadedHomeworkList.length; i++)
      if(haveUploadedHomeworkList[i].assignmentId === assignmentId) {
      	this.inputHomeworkId = haveUploadedHomeworkList[i]._id;
      	this.inputHomeworkGithub = haveUploadedHomeworkList[i].github;
      	this.inputHomeworkMessage = haveUploadedHomeworkList[i].message;
      }
	}
	onClickUpdateHomework():void {
		this.inputHomeworkSource = (<HTMLInputElement>document.getElementById('homework-update-source')).files[0];
		this.inputHomeworkImage = (<HTMLInputElement>document.getElementById('homework-update-image' )).files[0];
		this.studentService
				.updateHomework(
					this.inputHomeworkId,
					this.inputHomeworkGithub,
					this.inputHomeworkMessage,
					this.inputHomeworkSource,
					this.inputHomeworkImage)
				.then(
					homeworkData => {
						this.outputSuccess = true;					
						this.outputMessages = ['ok'];
						this.studentData.LINK_homeworks.forEach(homework => {
							if(homework._id === homeworkData._id) {
								homework.github = homeworkData.github;
								homework.message = homeworkData.message;
								homework.source = homeworkData.source;
								homework.image = homeworkData.image;
							}
							this.userService.setUser(this.studentData);
						})
					},
					errorMessage => {
						this.outputSuccess = false;
						this.outputMessages = errorMessage;
					}
				)
	}
	clearInput():void {
		this.inputHomeworkGithub = "";
		this.inputHomeworkMessage = "";
		this.inputHomeworkSource = null;
		this.inputHomeworkImage = null;
		this.inputAssignmentId = "";
		this.inputHomeworkId = "";
		this.outputSuccess = false;
		this.outputMessages = [];
	}
}
