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
  createHomework(AssignmentId:string, HomeworkGithub:string, HomeworkMessage:string, HomeworkSource:File, homeworkImage:File):Promise<any> {
  	let createHomeworkUrl = `proxy/Sapi/assignment/${AssignmentId}/homework`;
    let input = {
      github: HomeworkGithub,
      message: HomeworkMessage
    }
    if(!HomeworkSource || !homeworkImage) {
      return Promise.reject(['作业源代码和预览图都要上传'])
    }
    let validateResult = this.validateService.validateCreateHomework(input);
    if (validateResult)
      return Promise.reject(validateResult)
                    .catch(err => this.errFilter(err));
    let formData = new FormData;
    formData.append("github", input.github);
    formData.append("message", input.message);
    formData.append("source", HomeworkSource);
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