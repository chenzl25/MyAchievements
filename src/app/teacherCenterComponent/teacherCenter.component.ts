import {Component, OnInit}     from 'angular2/core';
import {RouteConfig, RouterOutlet} from 'angular2/router';
import {UserService} from '../lib/user.service';
import {User} from '../lib/interface';
import {NavComponent} from '../navComponent/nav.component';
import {TeacherComponent}   from './teacherComponent/teacher.component';
import {TeacherHomeoworkReviewComponent} from './teacherHomeworkReviewComponent/teacherHomeworkReview.component';
import {TeacherService} from './teacher.service';
@Component({
  template:  `
  	<my-nav [userData]="teacherData" [brandLink]="teacherLinkName"></my-nav>
    <router-outlet></router-outlet>
  `,
  directives: [RouterOutlet,NavComponent],
  providers: [TeacherService],
})
@RouteConfig([
  {path:'/', name: 'TeacherRoot', component: TeacherComponent, useAsDefault: true},
  {path:'/homeworkReview/:assignmentId', name: 'TeacherHomeworkReview', component: TeacherHomeoworkReviewComponent}
])
export class TeacherCenterComponent implements OnInit {
	teacherData: User;
  teacherLinkName: string = 'TeacherRoot';
	constructor(private userService: UserService) {}
	ngOnInit() {
		this.teacherData = this.userService.getUser();
	}
}