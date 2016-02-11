import {Pipe, PipeTransform} from 'angular2/core';
import {Class, Group, User, Homework} from '../../lib/interface';
@Pipe({
  name: 'homework_final_score',
  pure: false
})
export class HomeworkFinalScorePipe implements PipeTransform{
  transform(AssignmentId: string, args: Homework[][]/*only haveUploadedHomeworkList*/):string {
    let haveUploadedHomeworkList = args[0];
    for (let i = 0; i < haveUploadedHomeworkList.length; i++)
      if (haveUploadedHomeworkList[i].assignmentId === AssignmentId)
        return haveUploadedHomeworkList[i].finalScore;
    return null
  }
}
