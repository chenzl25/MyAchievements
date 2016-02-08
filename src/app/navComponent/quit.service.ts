import {Injectable}     from 'angular2/core';
import {Http, Response, Headers, RequestOptions} from 'angular2/http';
import {Router} from 'angular2/router';
import {Observable}     from 'rxjs/Observable';
import {UserService} from '../lib/user.service';
import {User} from '../lib/interface';
@Injectable()
export class QuitService {
    private _quitUrl = 'proxy/api/quit';
    constructor(private http: Http,
                private router: Router) { }
    quit():Promise<any> {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      let options = new RequestOptions({ headers: headers });
      return this.http.post(this._quitUrl, '', options)
        .toPromise()
        .then(res => res.json())
        .then(res => res.message)
        .then(successMessage => this.messageToArray(successMessage),
              err => this.errFilter(err));
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
