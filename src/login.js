import {AuthService} from 'aurelia-auth';
import {inject} from 'aurelia-framework';
import {App} from './app';
import {Router} from 'aurelia-router';
import {AppState} from './classes/AppState.js';

@inject(AuthService, App, Router, AppState)
export class Login {
  constructor(authService, app, router, appState){
    this.auth = authService;
    this.app = app;
    this.router = router;
    this.appState = appState;
  }
  
  attached() {
    this.title = this.router.currentInstruction.config.title;
  }
  
  authenticate(name){
    console.log('in auth');
    let ret = this.auth.authenticate(name, false, null);
    ret.then(data => {
      this.auth.setToken(data.token);
      this.appState.setAuth(this.auth.isAuthenticated());
      console.log('In login authenticate');
      console.log(this.appState.getRoles());
    }, undefined);
    return ret;
  }
}
