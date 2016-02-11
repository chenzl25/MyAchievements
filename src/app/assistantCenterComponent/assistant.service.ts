import {Injectable}     from 'angular2/core';
import {Http, Response, Headers, RequestOptions} from 'angular2/http';
import {Router} from 'angular2/router';
import {Observable}     from 'rxjs/Observable';
import {UserService} from '../lib/user.service';
import {ValidateService} from '../lib/validate.service';
import {User, Class, Group} from '../lib/interface';

@Injectable()
export class AssistantService {
	headers: Headers;
  options: RequestOptions;
  constructor(private http: Http, private validateService: ValidateService) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.options = new RequestOptions({ headers: this.headers });
  }
  createFinalReview(groupId: string, studentId: string ,homeworkId: string, homeworkFinalScore: string, homeworkFinalMessage: string):Promise<any> {
    let createFinalReviewUrl = `proxy/Aapi/group/${groupId}/student/${studentId}/homework/${homeworkId}/finalReview`;
    let input = {
      score: homeworkFinalScore,
      message: homeworkFinalMessage
    }
    let validateResult = this.validateService.validateCreateReview(input);
    if (validateResult)
      return Promise.reject(validateResult)
                    .catch(err => this.errFilter(err, ''));
    let body = JSON.stringify(input)
    return this.http.post(createFinalReviewUrl, body, this.options)
                    .toPromise()
                    .then(res => res.json())
                    .then(res => res.error === false? Promise.resolve(res.homeworkData): Promise.reject(res.message))
                    .catch(err => this.errFilter(err))
  }
  updateFinalReview(groupId: string, studentId: string ,homeworkId: string, homeworkFinalScore: string, homeworkFinalMessage: string):Promise<any> {
    return this.createFinalReview(groupId, studentId, homeworkId, homeworkFinalScore, homeworkFinalMessage);
  }  
  getToReviewHomeworks(assignmentId: string):Promise<any> {
  	let getToReviewHomeworksByAssignmentIdUrl = `proxy/Aapi/assignment/${assignmentId}/toReviewHomeworks`;
    return this.http.get(getToReviewHomeworksByAssignmentIdUrl,this.options)
    								.toPromise()
    								.then(res => res.json())
    								.then(res => res.error === false?res.homeworksData:Promise.reject(res.message))
    								.catch(err => this.errFilter(err))
  }
  private messageToArray(message: any):Promise<any> {
    return Promise.resolve([].concat(message));
  }
  private errFilter(err: any, finalErrorMessage = 'Server Error!'): any {
    if (typeof err === 'string' || err instanceof <any>Array)
        finalErrorMessage = err;
    // finalErrorMessage = err   // use this to debug
    return Promise.reject([].concat(finalErrorMessage))
  }
}