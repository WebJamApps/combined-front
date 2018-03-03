import {inject} from 'aurelia-framework';
import {App} from './app';
const Login_ = require('./classes/Login_.js');
@inject(App)
export class Login {
  constructor(app){
    this.app = app;
    this.login_Class = new Login_();
  }

  showLogin(app) {
    this.login_Class.loginUser(app);
  }

  attached() {
    this.app.checkIfLoggedIn();
  }
}
