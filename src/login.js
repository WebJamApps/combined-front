import 'url-search-params-polyfill';
import { inject } from 'aurelia-framework';
import { App } from './app';

const Login_ = require('./classes/Login_.js');
@inject(App)
export class Login {
  constructor(app) {
    this.app = app;
    this.login_Class = new Login_();
  }

  attached() {
    if (localStorage.getItem('origin') !== location.origin || !this.app.auth.isAuthenticated()) {
      localStorage.clear();
    }
    this.app.appUtils.checkIfLoggedIn(this.app);
    if (document.location.search.includes('email=')) {
      document.getElementsByClassName('topSection')[0].style.display = 'none';
      this.app.showForm('', this.login_Class);
      this.searchParams = new URLSearchParams(window.location.search);
      this.userEmail = this.searchParams.get('email');
      document.getElementsByClassName('loginemail')[0].value = this.userEmail;
    }
  }
}
