import {Component} from 'angular2/core';
import {UserService} from '../lib/user.service';
import {OnInit} from 'angular2/core';
@Component({
	selector: 'student',
	template: require('./student.jade'),
	styles: [require('./student.scss')]
})
export class StudentComponent implements OnInit {
	studentData: any;
	constructor(private userService: UserService) {}
	ngOnInit() {
		this.studentData = this.userService.getUser();
	}
}
