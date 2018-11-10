import { inject } from 'aurelia-framework';
import { App } from './app';

const Register_ = require('./classes/Register_.js');
@inject(App)
export class Register {
  constructor(app) {
    this.app = app;
    this.registerClass = new Register_();
  }

  attached() {
    this.app.appUtils.checkIfLoggedIn(this.app);
  }
}
