import {Injectable}     from 'angular2/core';
import {Router} from 'angular2/router'
import {Http, Response, Headers, RequestOptions} from 'angular2/http';
import {Observable}     from 'rxjs/Observable';
import {User} from '../lib/interface';

@Injectable()
export class UserService {
  userData: User;
  isLogin: boolean;
  constructor(private http: Http, private _router: Router) {
    this.userData = null;
    this.isLogin = false;
  }
  getUser():User {
    if (this.isLogin)
      return this.userData;
    this._router.navigate(['Login']);
  }
  setUser(userData:User):void {
    this.userData = userData;
    this.isLogin = true;
  }
}
