import {Component, OnInit}     from 'angular2/core';
import {RouteConfig, RouterOutlet} from 'angular2/router';
import {UserService} from '../lib/user.service';
import {User} from '../lib/interface';
import {NavComponent} from '../navComponent/nav.component';
import {AssistantComponent}   from './assistantComponent/assistant.component';
import {AssistantHomeoworkReviewComponent} from './assistantHomeworkReviewComponent/assistantHomeworkReview.component';
import {AssistantService} from './assistant.service';
@Component({
  template:  `
  	<my-nav [userData]="assistantData" [brandLink]="assistantLinkName"></my-nav>
    <router-outlet></router-outlet>
  `,
  directives: [RouterOutlet,NavComponent],
  providers: [AssistantService],
})
@RouteConfig([
  {path:'/', name: 'AssistantRoot', component: AssistantComponent, useAsDefault: true},
  {path:'/homeworkReview/:assignmentId', name: 'AssistantHomeworkReview', component: AssistantHomeoworkReviewComponent}
])
export class AssistantCenterComponent implements OnInit {
	assistantData: User;
  assistantLinkName: string = 'AssistantRoot';
	constructor(private userService: UserService) {}
	ngOnInit() {
		this.assistantData = this.userService.getUser();
	}
}