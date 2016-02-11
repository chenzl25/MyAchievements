import {Pipe, PipeTransform} from 'angular2/core';
import {Class, Group, User, Homework} from '../../lib/interface';
@Pipe({
  name: 'homework_group_rank',
  pure: false
})
export class HomeworkGroupRankPipe implements PipeTransform{
  transform(AssignmentId: string, args: Homework[][]/*only haveUploadedHomeworkList*/):string {
    let haveUploadedHomeworkList = args[0];
    for (let i = 0; i < haveUploadedHomeworkList.length; i++)
      if (haveUploadedHomeworkList[i].assignmentId === AssignmentId)
        return haveUploadedHomeworkList[i].groupRank;
    return null
  }
}
