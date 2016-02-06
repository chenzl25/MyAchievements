import {Injectable}     from 'angular2/core';
import {Http, Response, Headers, RequestOptions} from 'angular2/http';
import {Router} from 'angular2/router';
import {Observable}     from 'rxjs/Observable';
import {UserService} from '../lib/user.service';
import {ValidateService} from '../lib/validate.service';
import {User, Class, Group} from '../lib/interface';
@Injectable()
export class ManageService {
  private _getClassAllUrl = 'proxy/Mapi/classs';
  private _getGroupAllUrl = 'proxy/Mapi/groups';
  private _getUserAllUrl = 'proxy/Mapi/users';
  headers: Headers;
  options: RequestOptions;
  constructor(private http: Http, private validateService: ValidateService) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.options = new RequestOptions({ headers: this.headers });
  }
  getClassAll(): Promise<Class[]> {
    return this.http.get(this._getClassAllUrl)
                    .toPromise()
                    .then(res => res.json())
                    .then(res => res.error?Promise.reject(res.message) : res.classsData )
                    .catch(err => this.errFilter(err))
  }
  getGroupAll(): Promise<Group[]> {
    return this.http.get(this._getGroupAllUrl)
                    .toPromise()
                    .then(res => res.json())
                    .then(res => res.error?Promise.reject(res.message) : res.groupsData )
                    .catch(err => this.errFilter(err))
  }
  getUserAll(): Promise<User[]> {
    return this.http.get(this._getUserAllUrl)
                    .toPromise()
                    .then(res => res.json())
                    .then(res => res.error?Promise.reject(res.message) : res.usersData )
                    .catch(err => this.errFilter(err))
  }
  registerClass(className: string): Promise<any> {
    let registerClassUrl = 'proxy/Mapi/class';
    let input = {name: className}
    let validateResult = this.validateService.validateCreateClass(input);
    if (validateResult)
      return Promise.reject(validateResult)
                    .catch(err => this.errFilter(err, ''));
    let body = JSON.stringify(input)
    return this.http.post(registerClassUrl, body, this.options)
                    .toPromise()
                    .then(res => res.json())
                    .then(res => res.error? Promise.reject(res.message):res.classData)
                    .catch(err => this.errFilter(err, 'Server Error!'))
  }
  registerGroup(classId: string ,groupName: string): Promise<any> {
    let registerGroupUrl = `proxy/Mapi/class/${classId}/group`
    let input = {name: groupName}
    let validateResult = this.validateService.validateCreateGroup(input);
    if (validateResult)
      return Promise.reject(validateResult)
                    .catch(err => this.errFilter(err, ''));
    let body = JSON.stringify(input)
    return this.http.post(registerGroupUrl, body, this.options)
                    .toPromise()
                    .then(res => res.json())
                    .then(res => res.error? Promise.reject(res.message):res.groupData)
                    .catch(err => this.errFilter(err, 'Server Error!'))
  }
  registerUser(userAccount: string, userPassword: string, userName: string, userEmail: string, userPosition: string): Promise<any> {
    let registerUserUrl = 'proxy/Mapi/register';
    let input = {
      account: userAccount,
      password: userPassword,
      name: userName,
      email: userEmail,
      position: userPosition
    }
    let validateResult = this.validateService.validateRegister(input);
    if (validateResult)
      return Promise.reject(validateResult)
                    .catch(err => this.errFilter(err, ''));
    let body = JSON.stringify(input)
    return this.http.post(registerUserUrl, body, this.options)
                    .toPromise()
                    .then(res => res.json())
                    .then(res => res.error? Promise.reject(res.message):res.userData)
                    .catch(err => this.errFilter(err, 'Server Error!'))
  }
  deleteUser(userAccount: string):Promise<any> {
    let deleteUserUrl = `proxy/Mapi/user/${userAccount}`;
    return this.http.delete(deleteUserUrl, this.options)
                    .toPromise()
                    .catch(err => this.errFilter(err));
  }
  deleteGroup(groupId: string):Promise<any>  {
    let deleteGroupUrl = `proxy/Mapi/group/${groupId}`;
    return this.http.delete(deleteGroupUrl, this.options)
                    .toPromise()
                    .catch(err => this.errFilter(err));
  }
  deleteClass(classId: string):Promise<any>  {
    let deleteClassUrl = `proxy/Mapi/class/${classId}`;
    return this.http.delete(deleteClassUrl, this.options)
                    .toPromise()
                    .catch(err => this.errFilter(err));
  }
  private errFilter(err: any, finalErrorMessage = 'Server Error!'): any {
    if (typeof err === 'string' || err instanceof <any>Array)
        finalErrorMessage = err;
    // finalErrorMessage = err   // use this to debug
    return Promise.reject([].concat(finalErrorMessage))
  }
}
