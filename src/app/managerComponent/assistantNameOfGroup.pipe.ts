import {Pipe, PipeTransform} from 'angular2/core';
import {Class, Group, User} from '../lib/interface';
@Pipe({
  name: 'assistant_name_of_group_pipe',
  pure: false
})
export class AssistantNameOfGroupPipe implements PipeTransform{
  transform(groupItem: Group, args: User[][]/*only userList*/):string {
    let userList = args[0];
    for(let i = 0; i < userList.length; i++)
      if(userList[i]._id === groupItem.assistantsId[0])
        return userList[i].name;
    return null;
  }
}
