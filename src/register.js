import { inject } from 'aurelia-framework';
import { App } from './app';

const Register_ = require('./classes/Register_.js');
@inject(App)
export class Register {
  constructor(app) {
    this.app = app;
    this.registerClass = new Register_();
  }
  // showRegister(appName) {
  //   this.registerClass.register(appName);
  // }
  attached() {
    this.app.checkIfLoggedIn();
  }
}
