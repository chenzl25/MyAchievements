import {Injectable}     from 'angular2/core';
import {Http, Response, Headers, RequestOptions} from 'angular2/http';
import {Router} from 'angular2/router';
import {Observable}     from 'rxjs/Observable';
import {UserService} from '../lib/user.service';
import {ValidateService} from '../lib/validate.service';
import {User, Class, Group} from '../lib/interface';

@Injectable()
export class TeacherService {
	headers: Headers;
  options: RequestOptions;
  constructor(private http: Http, private validateService: ValidateService) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.options = new RequestOptions({ headers: this.headers });
  }
  createAssignment(assignmentName:string, assignmentLink:string, assignmentFrom: string, assignmentEnd: string):Promise<any> {
  	let createAssignmentUrl = 'proxy/Tapi/assignment';
    let input = {
      name: assignmentName,
      link: assignmentLink,
      from: assignmentFrom,
      end: assignmentEnd
    }
    let validateResult = this.validateService.validateCreateAssignment(input);
    if (validateResult)
      return Promise.reject(validateResult)
                    .catch(err => this.errFilter(err));
    let body = JSON.stringify(input)
    return this.http.post(createAssignmentUrl, body, this.options)
    								.toPromise()
    								.then(res => res.json())
    								.then(res => res.error === false?res.assignmentData:Promise.reject(res.message))
    								.catch(err => this.errFilter(err))
  }
  updateAssignment(assignmentId: string, assignmentName:string, assignmentLink:string, assignmentFrom: string, assignmentEnd: string):Promise<any> {
  	let createAssignmentUrl = `proxy/Tapi/assignment/${assignmentId}`;
    let input = {
      name: assignmentName,
      link: assignmentLink,
      from: assignmentFrom,
      end: assignmentEnd
    }
    let validateResult = this.validateService.validateUpdateAssignment(input);
    if (validateResult)
      return Promise.reject(validateResult)
                    .catch(err => this.errFilter(err, ''));
    let body = JSON.stringify(input)
    return this.http.put(createAssignmentUrl, body, this.options)
    								.toPromise()
    								.then(res => res.json())
    								.then(res => res.error === false?res.assignmentData:Promise.reject(res.message))
    								.catch(err => this.errFilter(err))
  }
  createFinalReview(homeworkId: string, homeworkFinalScore: string, homeworkFinalMessage: string):Promise<any> {
    let createFinalReviewUrl = `proxy/Tapi/homework/${homeworkId}/finalReview`;
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
  updateFinalReview(homeworkId: string, homeworkFinalScore: string, homeworkFinalMessage: string):Promise<any> {
    return this.createFinalReview(homeworkId, homeworkFinalScore, homeworkFinalMessage);
  }  
  getToReviewHomeworks(assignmentId: string):Promise<any> {
  	let getToReviewHomeworksByAssignmentIdUrl = `proxy/Tapi/assignment/${assignmentId}/toReviewHomeworks`;
    return this.http.get(getToReviewHomeworksByAssignmentIdUrl,this.options)
    								.toPromise()
    								.then(res => res.json())
    								.then(res => res.error === false?res.homeworksData:Promise.reject(res.message))
    								.catch(err => this.errFilter(err))
  }
  getRank(assignmentId: string):Promise<any> {
  	// after this method better to get the assignmentId again to update the homework score
  	let getRankByAssignmentIdUrl = `proxy/Tapi/assignment/${assignmentId}/rank`;
    return this.http.put(getRankByAssignmentIdUrl,'',this.options)
    								.toPromise()
    								.then(res => res.json())
    								.then(res => res.error === false?Promise.resolve(res.message):Promise.reject(res.message))
    								.then(successMessage => this.messageToArray(successMessage))
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