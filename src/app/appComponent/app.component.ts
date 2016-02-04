import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';

import {LoginComponent} from '../loginComponent/login.component';
import {ManagerComponent} from '../managerComponent/manager.component';
import {TeacherComponent} from '../teacherComponent/teacher.component';
import {AssistantComponent} from '../assistantComponent/assistant.component';
import {StudentComponent} from '../studentComponent/student.component';

@Component({
    selector: 'my-app',
    template: '<router-outlet></router-outlet>',
    styles: [require('./app.scss')],
    directives: [ROUTER_DIRECTIVES]
})
@RouteConfig([
	{ path: '/login', name: 'Login', component: LoginComponent, useAsDefault: true },
	{ path: '/manager/:id', name: 'Manager', component: ManagerComponent},
	{ path: '/teacher/:id', name: 'Teacher', component: TeacherComponent },
	{ path: '/assistant/:id', name: 'Assistant', component: AssistantComponent },
		{ path: '/student/:id', name: 'Student', component: StudentComponent},
	{ path: '/...', name: 'Asteroid', redirectTo: ['Login'] }
])
export class AppComponent { }