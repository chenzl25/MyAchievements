import {Component, OnInit}     from 'angular2/core';
import {RouteConfig, RouterOutlet} from 'angular2/router';
import {UserService} from '../lib/user.service';
import {User} from '../lib/interface';
import {NavComponent} from '../navComponent/nav.component';
import {StudentComponent}   from './studentComponent/student.component';
import {StudentHomeoworkReviewComponent} from './studentHomeworkReviewComponent/studentHomeworkReview.component';
import {StudentService} from './student.service';
@Component({
  template:  `
  	<my-nav [userData]="studentData" [brandLink]="studentLinkName"></my-nav>
    <router-outlet></router-outlet>
  `,
  directives: [RouterOutlet,NavComponent],
  providers: [StudentService],
})
@RouteConfig([
  {path:'/', name: 'StudentRoot', component: StudentComponent, useAsDefault: true},
  {path:'/homeworkReview/:assignmentId', name: 'HomeworkReview', component: StudentHomeoworkReviewComponent}
])
export class CrisisCenterComponent implements OnInit {
	studentData: User;
  studentLinkName: string = 'StudentRoot';
	constructor(private userService: UserService) {}
	ngOnInit() {
		this.studentData = this.userService.getUser();
	}
}