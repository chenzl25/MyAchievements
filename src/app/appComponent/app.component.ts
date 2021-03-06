import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';

import {LoginComponent} from '../loginComponent/login.component';
import {ManagerComponent} from '../managerComponent/manager.component';
import {TeacherCenterComponent} from '../teacherCenterComponent/teacherCenter.component';
import {AssistantCenterComponent} from '../assistantCenterComponent/assistantCenter.component';
import {StudentCenterComponent} from '../studentCenterComponent/studentCenter.component';
// import {ChangePasswordComponent} from '../changePasswordComponent/changePassword.component';

@Component({
    selector: 'my-app',
    template: '<router-outlet></router-outlet>',
    styles: [require('./app.scss')],
    directives: [ROUTER_DIRECTIVES]
})
@RouteConfig([
	{ path: '/login', name: 'Login', component: LoginComponent, useAsDefault: true },
	{ path: '/manager/:account', name: 'Manager', component: ManagerComponent},
	{ path: '/teacher/:account/...', name: 'Teacher', component: TeacherCenterComponent },
	{ path: '/assistant/:account/...', name: 'Assistant', component: AssistantCenterComponent },
	{ path: '/student/:account/...', name: 'Student', component: StudentCenterComponent},
	// { path: '/changePassword', name: 'ChangePassword', component: ChangePasswordComponent},
	{ path: '/...', name: 'Asteroid', redirectTo: ['Login'] }
])
export class AppComponent { }
