import {inject} from 'aurelia-framework';
import {App} from './app';
const Register_ = require('./classes/Register_.js');
//const Login_ = require('./classes/Login_.js');
@inject(App)
export class Register {
  constructor(app){
    this.app = app;
    this.registerClass = new Register_();
  }

  showRegister(app) {
    this.registerClass.register(app);
  }

  attached() {
    this.app.checkIfLoggedIn();
  }

}
