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
    this.checkUserRole();
  }
  
  // async activate(){
  //   if (process.env.NODE_ENV !== 'production'){
  //     this.backend = process.env.BackendUrl;
  //   } else {
  //     this.backend = '';
  //   }
  //   await fetch;
  //   //if (process.env.NODE_ENV !== 'production'){
  //   this.httpClient.configure(config => {
  //     config
  //     .useStandardConfiguration()
  //     .withBaseUrl(this.backend);
  //   });
  //   //}
  //   this.getUser();
  // }
  
  checkUserRole(){
    if (this.userType === 'Charity'){
      this.app.appState.setRoles(['charity']);
    } else if (this.userType === 'Developer'){
      this.app.appState.setRoles(['charity', 'volunteer', 'developer', 'reader', 'librarian']);
    } else {
      this.app.router.navigate('/');
    }
  }
}
