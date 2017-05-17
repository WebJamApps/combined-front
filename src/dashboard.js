
import {inject} from 'aurelia-framework';
import {App} from './app';
//import {Router} from 'aurelia-router';
import {AuthService} from 'aurelia-auth';
import {HttpClient, json} from 'aurelia-fetch-client';
//import {AppState} from './classes/AppState.js';

@inject(AuthService, HttpClient, App)
export class Dashboard {
  constructor(auth, httpClient, app){
    this.app = app;
    this.auth = auth;
    this.httpClient = httpClient;
    //this.router = router;
    //this.appState = appState;
  }
  
  types=['Charity', 'Volunteer', 'Developer', 'Reader', 'Librarian'];
  
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
  
  configHttpClient(){
    if (process.env.NODE_ENV !== 'production'){
      this.backend = process.env.BackendUrl;
    } else {
      this.backend = '';
    }
    //await fetch;
    //if (process.env.NODE_ENV !== 'production'){
    this.httpClient.configure(config => {
      config
      .useStandardConfiguration()
      .withBaseUrl(this.backend);
    });
    //}
  }
  
  async activate() {
    //await fetch;
    this.configHttpClient();
    //this.appState = new AppState(this.httpClient);
    //let user;
    //if (this.auth.isAuthenticated()) {
    //this.authenticated = true; //Logout element is reliant upon a local var;
    /* istanbul ignore else */
    //if (this.app.appState.getUserID() === undefined){
    let uid = this.auth.getTokenPayload().sub;
    await this.app.appState.getUser(uid);
    console.log('this is the user ' + this.app.appState.user.name);
    this.userType = this.app.appState.user.userType;
    this.checkUserRole();
  }
  // }
  
  checkUserRole(){
    //console.log('this is the user' + this.user);
    //this.authenticated = this.auth.isAuthenticated();
    //let uid = this.auth.getTokenPayload().sub;
    //this.httpClient.fetch('/user/' + uid)
    //.then(response => response.json())
    //.then(data => {
    //let user = data;
    //this.appState.setUser(user);
    
    if (this.userType === 'Charity'){
      this.app.appState.setRoles(['charity']);
      this.app.router.navigate('dashboard/charity');
    } else if (this.userType === 'Volunteer'){
      this.app.appState.setRoles(['volunteer']);
      this.app.router.navigate('dashboard/volunteer');
    } else if (this.userType === 'Reader'){
      this.app.appState.setRoles(['reader']);
      this.app.router.navigate('dashboard/reader');
    } else if (this.userType === 'Librarian'){
      this.app.appState.setRoles(['librarian']);
      this.app.router.navigate('dashboard/volunteer');
    } else if (this.userType === 'Developer'){
      this.app.appState.setRoles(['charity', 'volunteer', 'developer', 'reader', 'librarian']);
      this.app.router.navigate('dashboard/developer');
    }
    // });
  }
  
  async updateUser(){
    let uid = this.auth.getTokenPayload().sub;
    await this.app.appState.getUser(uid);
    let user = this.app.appState.user;
    await fetch;
    // let uid = this.auth.getTokenPayload().sub;
    // //let tempUserType = this.user.userType;
    // let user = this.appState.getUser();
    user.userType = this.types[this.user.userType - 1];
    this.httpClient.fetch('/user/' + uid, {
      method: 'put',
      body: json(user)
    })
    .then(response=>response.json())
    .then(data=> {
      //this.user.userType = tempUserType;
      this.activate();
    });
  }
}
