import {Pipe, PipeTransform} from 'angular2/core';
import {Class, Group, User} from '../lib/interface';
@Pipe({
  name: 'teacher_name_of_class_pipe',
  pure: false
})
export class TeacherNameOfClassPipe implements PipeTransform{
  transform(classItem: Class, args: User[][]/*only userList*/):string {
    let userList = args[0];
    for(let i = 0; i < userList.length; i++)
      if(userList[i]._id === classItem.teachersId[0])
        return userList[i].name;
    return null;
  }
}
