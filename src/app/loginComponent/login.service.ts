import {Injectable}     from 'angular2/core';
import {Http, Response, Headers, RequestOptions} from 'angular2/http';
import {Router} from 'angular2/router';
import {Observable}     from 'rxjs/Observable';
import {UserService} from '../lib/user.service';
import {User} from '../lib/interface';
@Injectable()
export class LoginService {
    private _loginUrl = 'proxy/api/login';
    constructor(private http: Http,
                private userService: UserService,
                private router: Router) { }

    login(account: string, password: string): Promise<User> {
        let body = JSON.stringify({ account, password })
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this._loginUrl, body, options)
            .toPromise()
            .then(res => res.json())
            .then(res => {
                if (res.error)
                    return Promise.reject(res.message);
                this.userService.setUser(res.userData);
                this.navigateAccordingToPosition(res.userData.position, res.userData.account);
                return res.userData;
            })
            .catch(err => this.errFilter(err, 'Server Error!'))
    }
    private errFilter(err: any, finalErrorMessage = 'Server Error!'): any {
        if (typeof err === 'string' || err instanceof <any>Array)
            finalErrorMessage = err;
        // finalErrorMessage = err   // use this to debug
        return Promise.reject([].concat(finalErrorMessage))
    }
    private navigateAccordingToPosition(position: string, account: string): void {
        this.router.navigate([this.capitalizeFirstLetter(position), { 'account': account}]);
    }
    private capitalizeFirstLetter(input: string) {
      return input.charAt(0).toUpperCase() + input.slice(1);
  }
}
