import {inject} from 'aurelia-framework';
import {App} from '../app';
// import {Router} from 'aurelia-router';
import {AuthService} from 'aurelia-auth';
// import {HttpClient} from 'aurelia-fetch-client';
// import {AppState} from '../classes/AppState.js';

@inject(AuthService, App)
export class Developer {
  constructor(auth, app){
    this.app = app;
    this.auth = auth;
    // this.httpClient = httpClient;
    // this.router = router;
    // this.appState = appState;
    // this.backend = '';
  }
  
  async activate() {
    //this.configHttpClient();
    let uid = this.auth.getTokenPayload().sub;
    await this.app.appState.getUser(uid);
    console.log('this is the user ' + this.app.appState.user.name);
    this.userType = this.app.appState.user.userType;
    this.checkUserRole();
  }
  
  checkUserRole(){
    // if (this.userType === 'Charity'){
    //   this.app.appState.setRoles(['charity']);
    if (this.userType === 'Developer'){
      this.app.appState.setRoles(['charity', 'volunteer', 'developer', 'reader', 'librarian']);
    } else {
      this.app.router.navigate('/');
    }
  }
}
