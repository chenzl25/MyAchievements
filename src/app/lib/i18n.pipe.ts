import {Pipe, PipeTransform} from 'angular2/core';
import {Class, Group, User} from '../lib/interface';
interface MapperOrder1 {
  [index: string]: string;
}
interface MapperOrder2 {
	[index: string]: MapperOrder1;
}
@Pipe({
  name: 'i18n',
  // pure: false
})
export class I18nPipe implements PipeTransform{
  private totalMapper: MapperOrder2;
  private chineseMapper: MapperOrder1;
  transform(value: string, args: string[]):string {
		if (!args[0]) return value;
		let language = args[0].toLowerCase();
		this.setUpMapper();
		return this.totalMapper[language][value];
  }
  setUpMapper():void {
		this.totalMapper = {};
		this.chineseMapper = {};
		this.totalMapper['chinese'] = this.chineseMapper;
		this.chineseMapper['manager'] = "管理员";
		this.chineseMapper['teacher'] = "教师";
		this.chineseMapper['student'] = "学生";
		this.chineseMapper['assistant'] = "助教";
  }
}
