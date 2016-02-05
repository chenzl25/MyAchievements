import 'es6-shim';
import 'es6-promise';
import 'angular2/bundles/angular2-polyfills';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';	
import 'bootstrap/dist/css/bootstrap.min.css';
import 'jquery/dist/jquery.min.js';
import 'bootstrap/dist/js/bootstrap.min.js';
import {bootstrap}    from 'angular2/platform/browser';
import {AppComponent} from './app/appComponent/app.component';
import {ROUTER_PROVIDERS} from 'angular2/router';
import {UserService} from './app/lib/user.service';
import {StorageService} from './app/lib/storage.service'
import {HTTP_PROVIDERS} from 'angular2/http'

bootstrap(AppComponent, [ROUTER_PROVIDERS, HTTP_PROVIDERS, UserService, StorageService]);
