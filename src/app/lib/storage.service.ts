import {Injectable}     from 'angular2/core';
import {Observable}     from 'rxjs/Observable';
import {User} from '../lib/interface';

@Injectable()
export class StorageService {
  private setItem(key: string, data: any):void {
    localStorage.setItem(key, JSON.stringify(data));
  }
  private getItem(key: string):any {
    return JSON.parse(localStorage.getItem(key));
  }
  getAccount(): string {
    return this.getItem('account') === null? '': this.getItem('account');
  }
  getPassword(): string {
    return this.getItem('password') === null? '': this.getItem('password');
  }
  getRemember(): boolean {
    return this.getItem('remember') === null? false : this.getItem('remember');
  }
  getQuit(): boolean {
    return this.getItem('quit') === null? false : this.getItem('quit');
  }
  setAccount(account: string) {
    this.setItem('account', account);
  }
  setPassword(password: string) {
    this.setItem('password', password);
  }
  setRemember(remember: boolean) {
    this.setItem('remember', remember);
  }
  setQuit(quit: boolean) {
    this.setItem('quit', quit);
  }
}
