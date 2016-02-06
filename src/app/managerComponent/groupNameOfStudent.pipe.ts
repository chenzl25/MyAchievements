import {Pipe, PipeTransform} from 'angular2/core';
import {Class, Group, User} from '../lib/interface';
@Pipe({
  name: 'group_name_of_student_pipe',
  // pure: false
})
export class GroupNameOfStudentPipe implements PipeTransform{
  transform(studentItem: User, args: Group[][]/*only classList*/):string {
    let groupList = args[0];
    for(let i = 0; i < groupList.length; i++)
      if(groupList[i]._id === studentItem.groupsId[0])
        return groupList[i].name;
    return null;
  }
}
