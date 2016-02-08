import {Pipe, PipeTransform} from 'angular2/core';
import {Class, Group, User} from '../lib/interface';
@Pipe({
  name: 'total_students_of_class',
  pure: false
})
export class TotalStudentsOfClassPipe implements PipeTransform{
  private totalStudentNumber: number;
  transform(classItem:Class, args:Group[][]/*only the GroupList*/):number {
    this.totalStudentNumber = 0;
    let groupList = args[0];
    for (let i = 0; i < classItem.groupsId.length; i++)
      for (let j = 0; j < groupList.length; j++)
        if (classItem.groupsId[i] === groupList[j]._id)
          this.totalStudentNumber += groupList[j].studentsId.length;
    return this.totalStudentNumber;
  }
}
