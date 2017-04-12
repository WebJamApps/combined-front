
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
  types=['Charity', 'Volunteer', 'Developer', 'Band', 'Venue'];

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
      //console.log('In get user');
      //console.log(this.appState.getUser());
      //this.firstTimeInfo = this.configured();
      if (user.userType === 'Charity'){
        //this.user.userType = 1;
        this.appState.setRoles(['ohaf']);
        this.router.navigate('ohaf');
      } else if (user.userType === 'Volunteer'){
        //this.user.userType = 2;
        this.appState.setRoles(['ohaf']);
        this.router.navigate('ohaf');
      } else if (user.userType === 'Band'){
        //this.user.userType = 2;
        this.appState.setRoles(['sc2rs']);
        this.router.navigate('sc2rs');
      } else if (user.userType === 'Venue'){
        //this.user.userType = 2;
        this.appState.setRoles(['sc2rs']);
        this.router.navigate('sc2rs');
      } else if (user.userType === 'Developer'){
        this.appState.setRoles(['ohaf', 'sc2rs', 'developer']);
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
