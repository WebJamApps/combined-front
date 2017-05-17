import {inject} from 'aurelia-framework';
import {App} from './app';
import {AuthService} from 'aurelia-auth';
import {HttpClient, json} from 'aurelia-fetch-client';
@inject(AuthService, HttpClient, App)
export class Dashboard {
  constructor(auth, httpClient, app){
    this.app = app;
    this.auth = auth;
    this.httpClient = httpClient;
  }
  
  types=['Charity', 'Volunteer', 'Developer', 'Reader', 'Librarian'];
  
  async activate() {
    this.configHttpClient();
    let uid = this.auth.getTokenPayload().sub;
    await this.app.appState.getUser(uid);
    console.log('this is the user ' + this.app.appState.user.name);
    this.userType = this.app.appState.user.userType;
    this.childRoute();
  }
  
  configHttpClient(){
    if (process.env.NODE_ENV !== 'production'){
      this.backend = process.env.BackendUrl;
    } else {
      this.backend = '';
    }
    this.httpClient.configure(config => {
      config
      .useStandardConfiguration()
      .withBaseUrl(this.backend);
    });
  }
  
  childRoute(){
    if (this.userType === 'Charity'){
      //this.app.appState.setRoles(['charity']);
      this.app.router.navigate('dashboard/charity');
    } else if (this.userType === 'Volunteer'){
      //this.app.appState.setRoles(['volunteer']);
      this.app.router.navigate('dashboard/volunteer');
    } else if (this.userType === 'Reader'){
      //this.app.appState.setRoles(['reader']);
      this.app.router.navigate('dashboard/reader');
    } else if (this.userType === 'Librarian'){
      //this.app.appState.setRoles(['librarian']);
      this.app.router.navigate('dashboard/volunteer');
    } else if (this.userType === 'Developer'){
      //this.app.appState.setRoles(['charity', 'volunteer', 'developer', 'reader', 'librarian']);
      this.app.router.navigate('dashboard/developer');
    }
  }
  
  async updateUser(){
    let uid = this.auth.getTokenPayload().sub;
    await this.app.appState.getUser(uid);
    let user = this.app.appState.user;
    await fetch;
    user.userType = this.types[this.user.userType - 1];
    this.httpClient.fetch('/user/' + uid, {
      method: 'put',
      body: json(user)
    })
    .then(response=>response.json())
    .then(data=> {
      this.activate();
    });
  }
}
