import {Component, OnInit} from 'angular2/core';
import {Router, RouteParams, ROUTER_DIRECTIVES} from 'angular2/router';
import {UserService} from '../../lib/user.service';
import {NavComponent} from '../../navComponent/nav.component';
import {User, Class, Group, Homework, Review} from '../../lib/interface';
import {StudentService} from '../student.service';
@Component({
	selector: 'my-homeworkReview',
	template: require('./studentHomeworkReview.jade'),
	styles: [require('./studentHomeworkReview.scss')],
	directives: [ROUTER_DIRECTIVES],
})
export class StudentHomeoworkReviewComponent implements OnInit {
	studentData: User;
	toReviewHomeworkList: Homework[];
	myHomeworkReviewsList: Review[];
	myHomeworkItem: Homework;
	toReviewAssignmentId: string;
	inputReviewId: string = "";
	inputReviewScore: string = "";
	inputReviewMessage: string = "";
	//below for the bad api
	inputToReviewGroupId: string = "";
	inputToReviewStudentId: string = "";
	inputToReviewHomeworkId: string = "";
	// end
	outputSuccess = false;
	outputMessages = [];
	tabReviewOthers: boolean = true;
  constructor(private router: Router,
  						private studentService: StudentService,
  						private userService: UserService,
  						private routeParams: RouteParams) {
  	// I don't know why this statement couldn't written in ngOnInit
  	this.studentData = this.userService.getUser();
  }
  ngOnInit() {
		this.toReviewAssignmentId = this.routeParams.get('assignmentId');
		// this.studentData = this.userService.getUser();
		this.inputToReviewGroupId = this.studentData.LINK_group.toReviewGroupId;
  	this.myHomeworkItem = this.studentData.LINK_homeworks.find(homework => homework.assignmentId === this.toReviewAssignmentId)
		this.studentService.getToReviewHomeworks(this.toReviewAssignmentId)
										 	 .then(homeworksData => this.toReviewHomeworkList = homeworksData,
											       errorMessage => alert(errorMessage))
  }
  onClickMyReviewTab():void {
		this.tabReviewOthers = true;
  }
  onClickOthersReviewTab():void {
  	this.tabReviewOthers = false;
		if (!this.myHomeworkItem)
			return;
		this.studentService.getHomeworkReviews(this.myHomeworkItem._id)
											 .then(
											 	 reviewsData => {
														this.myHomeworkReviewsList = reviewsData;
											 	 },
											 	 errorMessage => {
														alert(errorMessage);
											 	 }
											 )
  }
  onClickSetUpCreateReview(toReviewStudentId: string,toReviewHomeworkId: string):void {
		this.clearInput();
		this.inputToReviewStudentId = toReviewStudentId;
		this.inputToReviewHomeworkId = toReviewHomeworkId;
  }
	onClickCreateReview():void {
		this.studentService.createReview(
					this.inputToReviewGroupId, 
					this.inputToReviewStudentId,
					this.inputToReviewHomeworkId,
					this.inputReviewScore,
					this.inputReviewMessage)
				.then(
					reviewData => {
						let _reviewData_ = <Review>reviewData;
						this.toReviewHomeworkList.forEach(homework => {
							if (homework._id === _reviewData_.homeworkId) {
								homework.LINK_review = _reviewData_;
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
	onClickSetUpUpdateReview(reviewId:string ,originalReviewScore: string, originalReviewMessage: string):void {
		this.clearInput();
		this.inputReviewId = reviewId;
		this.inputReviewScore = originalReviewScore;
		this.inputReviewMessage = originalReviewMessage;
	}
	onClickUpdateReview():void {
		this.studentService.updateReview(
					this.inputReviewId,
					this.inputReviewScore,
					this.inputReviewMessage)
				.then(
					reviewData => {
						let _reviewData_ = <Review>reviewData;
						this.toReviewHomeworkList.forEach(homework => {
							if (homework._id === _reviewData_.homeworkId) {
								homework.LINK_review = _reviewData_;
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
		this.inputReviewScore = "";
		this.inputReviewMessage = "";
		this.inputToReviewStudentId = "";
		this.inputToReviewHomeworkId = "";
		this.outputSuccess = false;
		this.outputMessages = [];
	}
}
