import { inject } from 'aurelia-framework';
import { App } from './app';

const Login_ = require('./classes/Login_.js');
@inject(App)
export class Login {
  constructor(app) {
    this.app = app;
    this.login_Class = new Login_();
  }
  // showLogin(appName) {
  //   this.login_Class.loginUser(appName);
  // }
  attached() {
    this.app.checkIfLoggedIn();
  }
}
