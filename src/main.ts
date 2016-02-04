import 'es6-shim';
import 'es6-promise';
import 'angular2/bundles/angular2-polyfills';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {bootstrap}    from 'angular2/platform/browser';
import {AppComponent} from './app/appComponent/app.component';
import {ROUTER_PROVIDERS} from 'angular2/router';

bootstrap(AppComponent, [ROUTER_PROVIDERS]);
