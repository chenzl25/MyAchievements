import {Component, OnInit} from 'angular2/core';
import {NgForm, NgClass, NgIf} from 'angular2/common';
import {NavComponent} from '../navComponent/nav.component';
import {Router} from 'angular2/router';
import {UserService} from '../lib/user.service';
import {StorageService} from '../lib/storage.service';
import {StudentService} from './student.service';
import {User, Class, Group} from '../lib/interface';
import {I18nPipe} from '../lib/i18n.pipe';
import {TimeStampPipe} from '../lib/timeStamp.pipe';
import {HomeworkImagePipe} from './homeworkImage.pipe';
@Component({
	selector: 'student',
	template: require('./student.jade'),
	styles: [require('./student.scss')],
	directives: [NavComponent, NgClass],
	providers: [StudentService],
	pipes: [TimeStampPipe,HomeworkImagePipe]
})
export class StudentComponent implements OnInit {
	studentData: User;
	inputHomeworkGithub: string = "";
	inputHomeworkMessage: string = "";
	inputHomeworkSource: File;
	inputHomeworkImage: File;
	inputAssignmentId: string = "";
	// updateHomeworkId: string = "";
	outputSuccess: boolean = false;
	outputMessages: string[] = [];
	constructor(private userService: UserService,
  						private storageService: StorageService,
  						private studentService: StudentService,
  						private router: Router) { }
	ngOnInit() {
		this.studentData = this.userService.getUser();
		console.log(this.studentData)
	}
	onClickSetUpCreateHomework(assignmentId):void {
		this.inputAssignmentId = assignmentId;
		this.inputHomeworkGithub = "";
		this.inputHomeworkMessage = "";
		this.inputHomeworkSource = null;
		this.inputHomeworkImage = null;
		this.outputSuccess = false;
		this.outputMessages = [];
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
				.then(homeworkData => {
						this.outputSuccess = true;					
						this.outputMessages = ['ok'];
						console.log(homeworkData);
					},
					errorMessage => {
						this.outputSuccess = false;
						this.outputMessages = errorMessage;
					}
				)
	}
	clearInput():void {
	}
}
