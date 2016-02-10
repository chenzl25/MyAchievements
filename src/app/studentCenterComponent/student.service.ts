import {Injectable}     from 'angular2/core';
import {Http, Response, Headers, RequestOptions} from 'angular2/http';
import {Router} from 'angular2/router';
import {Observable}     from 'rxjs/Observable';
import {UserService} from '../lib/user.service';
import {ValidateService} from '../lib/validate.service';
import {User, Class, Group} from '../lib/interface';

@Injectable()
export class StudentService {
	headers: Headers;
  options: RequestOptions;
  constructor(private http: Http, private validateService: ValidateService) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.options = new RequestOptions({ headers: this.headers });
  }
  createHomework(assignmentId:string, homeworkGithub:string, homeworkMessage:string, homeworkSource:File, homeworkImage:File):Promise<any> {
  	let createHomeworkUrl = `proxy/Sapi/assignment/${assignmentId}/homework`;
    let input = {
      github: homeworkGithub,
      message: homeworkMessage
    }
    if(!homeworkSource || !homeworkImage) {
      return Promise.reject(['作业源代码和预览图都要上传'])
    }
    let validateResult = this.validateService.validateCreateHomework(input);
    if (validateResult)
      return Promise.reject(validateResult)
                    .catch(err => this.errFilter(err));
    let formData = new FormData;
    formData.append("github", input.github);
    formData.append("message", input.message);
    formData.append("source", homeworkSource);
    formData.append("image", homeworkImage);
    return new Promise((resolve, reject) => {
      let xhr:XMLHttpRequest = new XMLHttpRequest;
      xhr.onload = function(event: any) {
        let response = event.target.response;
        console.log(response);
        if (response.error === true) {
          reject([].concat(response.message));
        } else {
          resolve(response.homeworkData);
        }
      }
      xhr.onerror = function(err: any) {
        let finalErrorMessage = 'Server Error!'
        if (typeof err === 'string' || err instanceof <any>Array)
          finalErrorMessage = err;
        reject([].concat(finalErrorMessage));
      }  
      xhr.open("POST", createHomeworkUrl);
      xhr.responseType = "json";
      xhr.send(formData);
    })
  }
  updateHomework(homeworkId:string, homeworkGithub:string, homeworkMessage:string, homeworkSource:File, homeworkImage:File):Promise<any> {
    let updateHomeworkUrl = `proxy/Sapi/homework/${homeworkId}`;
    let input = {
      github: homeworkGithub,
      message: homeworkMessage
    }
    if(!homeworkSource || !homeworkImage) {
      return Promise.reject(['作业源代码和预览图都要上传'])
    }
    let validateResult = this.validateService.validateUpdateHomework(input);
    if (validateResult)
      return Promise.reject(validateResult)
                    .catch(err => this.errFilter(err));
    let formData = new FormData;
    formData.append("github", input.github);
    formData.append("message", input.message);
    formData.append("source", homeworkSource);
    formData.append("image", homeworkImage);
    return new Promise((resolve, reject) => {
      let xhr:XMLHttpRequest = new XMLHttpRequest;
      xhr.onload = function(event: any) {
        let response = event.target.response;
        console.log(response);
        if (response.error === true) {
          reject([].concat(response.message));
        } else {
          resolve(response.homeworkData);
        }
      }
      xhr.onerror = function(err: any) {
        let finalErrorMessage = 'Server Error!'
        if (typeof err === 'string' || err instanceof <any>Array)
          finalErrorMessage = err;
        reject([].concat(finalErrorMessage));
      }  
      xhr.open("PUT", updateHomeworkUrl);
      xhr.responseType = "json";
      xhr.send(formData);
    })
  }
  getToReviewHomeworks(assignmentId: string):Promise<any> {
    let getToReviewHomeworksUrl = `proxy/Sapi/assignment/${assignmentId}/toReviewHomeworks`;
    return this.http.get(getToReviewHomeworksUrl, this.options)
                    .toPromise()
                    .then(res => res.json())
                    .then(res => res.error === false?Promise.resolve(res.homeworksData):Promise.reject(res.message))
                    .catch(err => this.errFilter(err));
  }
  getHomeworkReviews(homeworkId: string):Promise<any> {
    let getHomeworkReviewsUrl = `proxy/Sapi/homework/${homeworkId}/reviews`;
    return this.http.get(getHomeworkReviewsUrl, this.options)
                    .toPromise()
                    .then(res => res.json())
                    .then(res => res.error === false?Promise.resolve(res.reviewsData):Promise.reject(res.message))
                    .catch(err => this.errFilter(err))
  }
  createReview(toReviewGroupId: string, toReviewStudentId: string, toReviewHomeworkId: string, reviewScore: string, reviewMessage: string):Promise<any> {
    let createReviewUrl = `proxy/Sapi/group/${toReviewGroupId}/student/${toReviewStudentId}/homework/${toReviewHomeworkId}/review`;
    let input = {
      score: reviewScore,
      message: reviewMessage
    }
    let validateResult = this.validateService.validateCreateReview(input);
        if (validateResult)
          return Promise.reject(validateResult)
                        .catch(err => this.errFilter(err));
    let body = JSON.stringify(input);
    return this.http.post(createReviewUrl, body, this.options)
                    .toPromise()
                    .then(res => res.json())
                    .then(res => res.error === false?Promise.resolve(res.reviewData):Promise.reject(res.message))
                    .catch(err => this.errFilter(err))
  }
  updateReview(reviewId: string , reviewScore: string, reviewMessage: string):Promise<any> {
    let updateReviewUrl = `proxy/Sapi/review/${reviewId}`;
    let input = {
      score: reviewScore,
      message: reviewMessage
    }
    let validateResult = this.validateService.validateUpdateReview(input);
        if (validateResult)
          return Promise.reject(validateResult)
                        .catch(err => this.errFilter(err));
    let body = JSON.stringify(input);
    return this.http.put(updateReviewUrl, body, this.options)
                    .toPromise()
                    .then(res => res.json())
                    .then(res => res.error === false?Promise.resolve(res.reviewData):Promise.reject(res.message))
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