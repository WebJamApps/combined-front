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
    this.checkUserRole();
  }
  
  checkUserRole(){
    if (this.userType === 'Volunteer'){
      this.app.appState.setRoles(['volunteer']);
    } else if (this.userType === 'Developer'){
      this.app.appState.setRoles(['charity', 'volunteer', 'developer', 'reader', 'librarian']);
    } else {
      this.app.router.navigate('/');
    }
  }
}
