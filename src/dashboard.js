
import {inject} from 'aurelia-framework';
import {App} from './app';
import {Router} from 'aurelia-router';
import {AuthService} from 'aurelia-auth';
import {HttpClient, json} from 'aurelia-fetch-client';
import {AppState} from './classes/AppState.js';

@inject(AuthService, HttpClient, App, Router, AppState)
export class Dashboard {
  constructor(auth, httpClient, app, router, appState){
    this.app = app;
    this.auth = auth;
    this.httpClient = httpClient;
    this.router = router;
    this.appState = appState;
    this.backend = '';
  }

  //authenticated=false;
  //firstTimeInfo = false;
  types=['Charity', 'Volunteer', 'Developer', 'Reader', 'Librarian'];

  async activate(){
    if (process.env.NODE_ENV !== 'production'){
      this.backend = process.env.BackendUrl;
    }
    await fetch;
    //if (process.env.NODE_ENV !== 'production'){
    this.httpClient.configure(config => {
      config
      .useStandardConfiguration()
      .withBaseUrl(this.backend);
    });
    //}
    this.getUser();
  }

  getUser(){
    this.authenticated = this.auth.isAuthenticated();
    let uid = this.auth.getTokenPayload().sub;
    this.httpClient.fetch('/user/' + uid)
    .then(response => response.json())
    .then(data => {
      let user = data;
      this.appState.setUser(user);
  
      if (user.userType === 'Charity'){
        this.appState.setRoles(['charity']);
        this.router.navigate('charity');
      } else if (user.userType === 'Volunteer'){
        this.appState.setRoles(['volunteer']);
        this.router.navigate('volunteer');
      } else if (user.userType === 'Reader'){
        this.appState.setRoles(['reader']);
        this.router.navigate('reader');
      } else if (user.userType === 'Librarian'){
        this.appState.setRoles(['librarian']);
        this.router.navigate('volunteer');
      } else if (user.userType === 'Developer'){
        this.appState.setRoles(['charity', 'volunteer', 'developer', 'reader', 'librarian']);
        this.router.navigate('developer');
      }
    });
  }

  updateUser(){
    let uid = this.auth.getTokenPayload().sub;
    //let tempUserType = this.user.userType;
    let user = this.appState.getUser();
    user.userType = this.types[this.user.userType - 1];
    this.httpClient.fetch('/user/' + uid, {
      method: 'put',
      body: json(user)
    })
    .then(response=>response.json())
    .then(data=> {
      //this.user.userType = tempUserType;
      this.getUser();
    });
  }
}
