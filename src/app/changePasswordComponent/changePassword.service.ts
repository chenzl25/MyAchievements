import {Injectable}     from 'angular2/core';
import {Http, Response, Headers, RequestOptions} from 'angular2/http';
import {Router} from 'angular2/router';
import {Observable}     from 'rxjs/Observable';
import {UserService} from '../lib/user.service';
import {User} from '../lib/interface';
import {ValidateService} from '../lib/validate.service';
@Injectable()
export class ChangePasswordService {
    private _changePasswordUrl = 'proxy/api/changePassword';
    constructor(private http: Http,
                private router: Router,
                private validateService: ValidateService) { }
    changePassword(oldPassword: string, newPassword: string):Promise<any> {
      let input = { oldPassword, newPassword };
      let validateResult = this.validateService.validateChangePassword(input);
      if (validateResult)
        return Promise.reject(validateResult)
                      .catch(err => this.errFilter(err, ''));
      let body = JSON.stringify(input)
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      let options = new RequestOptions({ headers: headers });
      return this.http.post(this._changePasswordUrl, body, options)
                 .toPromise()
                 .then(res => res.json())
                 .then(res => res.error === false?Promise.resolve(res.message):Promise.reject(res.message))
                 .then(successMessage => this.messageToArray(successMessage))
                 .catch(err => this.errFilter(err, 'Server Error!'))
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
