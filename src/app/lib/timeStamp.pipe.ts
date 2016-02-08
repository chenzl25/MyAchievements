import {Pipe, PipeTransform} from 'angular2/core';
var moment = require('moment');
@Pipe({
  name: 'time_stamp',
  // pure: false
})
export class TimeStampPipe implements PipeTransform{
  transform(timeStamp: string, args: any[]):string {
		moment.locale('zh-cn');
		return moment(parseInt(timeStamp)).calendar();
  }
}
