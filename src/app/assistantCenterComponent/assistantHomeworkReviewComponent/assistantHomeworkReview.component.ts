import {Component, OnInit} from 'angular2/core';
import {Router, RouteParams, ROUTER_DIRECTIVES} from 'angular2/router';
import {UserService} from '../../lib/user.service';
import {NavComponent} from '../../navComponent/nav.component';
import {User, Class, Group, Homework, Review} from '../../lib/interface';
import {AssistantService} from '../assistant.service';
@Component({
	selector: 'my-homeworkReview',
	template: require('./assistantHomeworkReview.jade'),
	styles: [require('./assistantHomeworkReview.scss')],
	directives: [ROUTER_DIRECTIVES],
})
export class AssistantHomeoworkReviewComponent implements OnInit {
	assistantData: User;
	toReviewHomeworkList: Homework[];
	toReviewAssignmentId: string;
	//below for the bad api
	inputToReviewGroupId: string = "";
	inputToReviewStudentId: string = "";
	inputToReviewHomeworkId: string = "";
	// end
	inputHomeworkFinalScore: string = "";
	inputHomeworkFinalMessage: string = "";
	outputSuccess = false;
	outputMessages = [];
  constructor(private router: Router,
  						private assistantService: AssistantService,
  						private userService: UserService,
  						private routeParams: RouteParams) {
  	// I don't know why this statement couldn't written in ngOnInit
  	this.assistantData = this.userService.getUser();
  }
  ngOnInit() {
		this.toReviewAssignmentId = this.routeParams.get('assignmentId');
		this.assistantService.getToReviewHomeworks(this.toReviewAssignmentId)
										 	 .then(homeworksData => this.toReviewHomeworkList = homeworksData,
											       errorMessage => alert(errorMessage))
  }
  onClickSetUpCreateFinalReview(toReviewGroupId: string, toReviewStudentId: string,toReviewHomeworkId: string):void {
		this.clearInput();
		this.inputToReviewGroupId = toReviewGroupId;
		this.inputToReviewStudentId = toReviewStudentId;
		this.inputToReviewHomeworkId = toReviewHomeworkId
  }
	onClickCreateFinalReview():void {
		this.assistantService.createFinalReview(
					this.inputToReviewGroupId,
					this.inputToReviewStudentId,
					this.inputToReviewHomeworkId,
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
	onClickSetUpUpdateFinalReview(toReviewGroupId: string, toReviewStudentId: string, toReviewHomeworkId: string, toReviewHomeworkFinalScore: string, toReviewHomeworkFinalMessage: string):void {
		this.clearInput();
		this.inputToReviewGroupId = toReviewGroupId;
		this.inputToReviewStudentId = toReviewStudentId;
		this.inputToReviewHomeworkId = toReviewHomeworkId;
		this.inputHomeworkFinalScore = toReviewHomeworkFinalScore;
		this.inputHomeworkFinalMessage = toReviewHomeworkFinalMessage;
	}
	// actually the api of update and create are same,
	// but I make it abstract
	onClickUpdateFinalReview(): void {
		this.assistantService.updateFinalReview(
					this.inputToReviewGroupId,
					this.inputToReviewStudentId,
					this.inputToReviewHomeworkId,
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
		this.inputToReviewGroupId = "";
		this.inputToReviewStudentId = "";
		this.inputToReviewHomeworkId = "";

		this.inputHomeworkFinalScore = "";
		this.inputHomeworkFinalMessage = "";

		this.outputSuccess = false;
		this.outputMessages = [];
	}
}
