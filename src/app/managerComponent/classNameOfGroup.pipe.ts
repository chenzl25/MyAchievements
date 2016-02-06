import {Pipe, PipeTransform} from 'angular2/core';
import {Class, Group, User} from '../lib/interface';
@Pipe({
  name: 'class_name_of_group_pipe',
  // pure: false
})
export class ClassNameOfGroupPipe implements PipeTransform{
  transform(groupItem: Group, args: Class[][]/*only classList*/):string {
    let classList = args[0];
    for(let i = 0; i < classList.length; i++)
      if(classList[i]._id === groupItem.classId)
        return classList[i].name;
    return null;
  }
}
