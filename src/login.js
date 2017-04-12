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
    //TODO listen for google to repsond if not already logged in
    //https://developers.google.com/identity/sign-in/web/listeners
    //http://stackoverflow.com/questions/38876670/aurelia-click-attribute-that-requires-event-target-to-be-same-as-element
    //http://stackoverflow.com/questions/37171766/aurelia-binding-back-to-view-model-on-button-click
    ret.then(data => {
      this.auth.setToken(data.token);
      this.app.authenticated = this.auth.isAuthenticated();
      this.appState.setAuth(true);
      this.appState.setRoles(['dashboard']);
      console.log('In login authenticate');
      console.log(this.appState.getRoles());
    }, undefined);
    return ret;
  }
}
