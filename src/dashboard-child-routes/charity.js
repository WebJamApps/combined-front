import {inject} from 'aurelia-framework';
import {App} from '../app';
import {AuthService} from 'aurelia-auth';
//import {HttpClient} from 'aurelia-fetch-client';
@inject(AuthService, App)
export class Charity {
  constructor(auth, app){
    this.app = app;
    this.auth = auth;
    //this.httpClient = httpClient;
  }
  
  async activate() {
    //this.configHttpClient();
    let uid = this.auth.getTokenPayload().sub;
    await this.app.appState.getUser(uid);
    console.log('this is the user ' + this.app.appState.user.name);
    this.userType = this.app.appState.user.userType;
    this.doubleCheckUserRole();
  }
  
  doubleCheckUserRole(){
    if (this.userType !== 'Developer' && this.userType !== 'Charity'){
      this.app.router.navigate('/');
    }
  }
}
