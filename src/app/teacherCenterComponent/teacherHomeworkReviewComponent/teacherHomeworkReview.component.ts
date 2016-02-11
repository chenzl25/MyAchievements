import {Component, OnInit} from 'angular2/core';
import {Router, RouteParams, ROUTER_DIRECTIVES} from 'angular2/router';
import {UserService} from '../../lib/user.service';
import {NavComponent} from '../../navComponent/nav.component';
import {User, Class, Group, Homework, Review} from '../../lib/interface';
import {TeacherService} from '../teacher.service';
@Component({
	selector: 'my-homeworkReview',
	template: require('./teacherHomeworkReview.jade'),
	styles: [require('./teacherHomeworkReview.scss')],
	directives: [ROUTER_DIRECTIVES],
})
export class TeacherHomeoworkReviewComponent implements OnInit {
	teacherData: User;
	toReviewHomeworkList: Homework[];
	toReviewAssignmentId: string;
	inputHomeworkId: string = "";
	inputHomeworkFinalScore: string = "";
	inputHomeworkFinalMessage: string = "";
	outputSuccess = false;
	outputMessages = [];
  constructor(private router: Router,
  						private teacherService: TeacherService,
  						private userService: UserService,
  						private routeParams: RouteParams) {
  	// I don't know why this statement couldn't written in ngOnInit
  	this.teacherData = this.userService.getUser();
  }
  ngOnInit() {
		this.toReviewAssignmentId = this.routeParams.get('assignmentId');
		this.teacherService.getToReviewHomeworks(this.toReviewAssignmentId)
										 	 .then(homeworksData => this.toReviewHomeworkList = homeworksData,
											       errorMessage => alert(errorMessage))
  }
  onClickSetUpCreateFinalReview(toReviewHomeworkId: string):void {
		this.clearInput();
		this.inputHomeworkId = toReviewHomeworkId;
  }
	onClickCreateFinalReview():void {
		this.teacherService.createFinalReview(
					this.inputHomeworkId,
					this.inputHomeworkFinalScore,
					this.inputHomeworkFinalMessage)
				.then(
					homeworkData => {
						let _homeworkData_ = <Homework>homeworkData;
						this.toReviewHomeworkList.forEach(homework => {
							if (homework._id === _homeworkData_._id) {
								homework.finalScore = _homeworkData_.finalScore;
								homework.finalMessage = _homeworkData_.finalMessage;
							}
						})
						this.outputSuccess = true;
						this.outputMessages = ['ok'];
					},
					errorMessage => {
						this.outputSuccess = false;
						this.outputMessages = errorMessage;
					}
				)
	}
	onClickSetUpUpdateFinalReview(toReviewHomeworkId: string, toReviewHomeworkFinalScore: string, toReviewHomeworkFinalMessage: string):void {
		this.clearInput();
		this.inputHomeworkId = toReviewHomeworkId;
		this.inputHomeworkFinalScore = toReviewHomeworkFinalScore;
		this.inputHomeworkFinalMessage = toReviewHomeworkFinalMessage;
	}
	// actually the api of update and create are same,
	// but I make it abstract
	onClickUpdateFinalReview(): void {
		this.teacherService.updateFinalReview(
					this.inputHomeworkId,
					this.inputHomeworkFinalScore,
					this.inputHomeworkFinalMessage)
				.then(
					homeworkData => {
						let _homeworkData_ = <Homework>homeworkData;
						this.toReviewHomeworkList.forEach(homework => {
							if (homework._id === _homeworkData_._id) {
								homework.finalScore = _homeworkData_.finalScore;
								homework.finalMessage = _homeworkData_.finalMessage;
							}
						})
						this.outputSuccess = true;
						this.outputMessages = ['ok'];
					},
					errorMessage => {
						this.outputSuccess = false;
						this.outputMessages = errorMessage;
					}
				)
	}
  clearInput():void {
		this.inputHomeworkFinalScore = "";
		this.inputHomeworkFinalMessage = "";
		this.inputHomeworkId = "";
		this.outputSuccess = false;
		this.outputMessages = [];
	}
}
