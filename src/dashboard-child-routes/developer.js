import {inject} from 'aurelia-framework';
import {App} from '../app';
import {Router} from 'aurelia-router';
import {AuthService} from 'aurelia-auth';
import {HttpClient} from 'aurelia-fetch-client';
import {AppState} from '../classes/AppState.js';

@inject(AuthService, HttpClient, App, Router, AppState)
export class Developer {
  constructor(auth, httpClient, app, router, appState){
    this.app = app;
    this.auth = auth;
    this.httpClient = httpClient;
    this.router = router;
    this.appState = appState;
    this.backend = '';
  }
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
      if (user.userType === 'Developer'){
        this.appState.setRoles(['charity', 'volunteer', 'developer', 'reader', 'librarian']);
      } else {
        this.router.navigate('/');
      }
    });
  }
  
}
