import {inject} from 'aurelia-framework';
import {App} from '../app';
import {AuthService} from 'aurelia-auth';
@inject(AuthService, App)
export class Volunteer {
  constructor(auth, app){
    this.app = app;
    this.auth = auth;
  }
  
  async activate() {
    let uid = this.auth.getTokenPayload().sub;
    await this.app.appState.getUser(uid);
    console.log('this is the user ' + this.app.appState.user.name);
    this.userType = this.app.appState.user.userType;
    this.doubleCheckUserRole();
  }
  
  doubleCheckUserRole(){
    if (this.userType !== 'Developer' && this.userType !== 'Volunteer'){
      this.app.router.navigate('/');
    }
  }
}
