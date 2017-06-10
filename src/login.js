//import {AuthService} from 'aurelia-auth';
import {inject} from 'aurelia-framework';
import {App} from './app';
//import {Router} from 'aurelia-router';
//import {AppState} from './classes/AppState.js';

@inject(App)
export class Login {
  constructor(app){
    //this.auth = authService;
    this.app = app;
    //this.router = router;
    //this.appState = appState;
  }

  attached() {
    this.title = this.app.router.currentInstruction.config.title;
  }

  authenticate(name){
    //console.log('in auth');
    let ret = this.app.auth.authenticate(name, false, null);
    ret.then((data) => {
      this.app.auth.setToken(data.token);
      //this.appState.setAuth(this.auth.isAuthenticated());
      //console.log('In login authenticate');
      //console.log(this.appState.getRoles());
    }, undefined);
    return ret;
  }
}
