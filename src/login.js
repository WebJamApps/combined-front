import {inject} from 'aurelia-framework';
import {App} from './app';
const Register_ = require('./classes/Register_.js');
const Login_ = require('./classes/Login_.js');
@inject(App)
export class Login {
  constructor(app){
    this.app = app;
    this.registerClass = new Register_();
    this.login_Class = new Login_();
  }

  attached() {
    this.title = this.app.router.currentInstruction.config.title;
    console.log('in the login module true means ohaf login ' + this.app.appState.isOhafLogin);
    this.checkIfLoggedIn();
  }

  showRegister(app) {
    this.registerClass.register(app);
  }

  showLogin(app) {
    this.login_Class.loginUser(app);
  }

  checkIfLoggedIn() {
    let token = localStorage.getItem('token');
    console.log(token);
    if (token !== null) {
      this.app.auth.setToken(token);
      this.app.authenticated = true;
      this.app.router.navigate('dashboard');
    }
  }

  authenticate(name){
    //delete all login database objects
    //create a new login database object, set isOhafLogin attribute
    //console.log('in auth');
    let ret;
    if (this.app.appState.isOhafLogin){
      ret = this.app.auth.authenticate(name, false, {'isOhafUser': true });
    } else {
      ret = this.app.auth.authenticate(name, false, {'isOhafUser': false });
    }
    ret.then((data) => {
      this.app.auth.setToken(data.token);
    }, undefined);
    return ret;
  }
}
