import {inject} from 'aurelia-framework';
import {App} from '../app';
import {AuthService} from 'aurelia-auth';
@inject(AuthService, App)
export class UserAccount {
  constructor(auth, app){
    this.app = app;
    this.auth = auth;
  }

  async activate() {
    let uid = this.auth.getTokenPayload().sub;
    await this.app.appState.getUser(uid);
    this.user = this.app.appState.user;
    console.log('this is the user ' + this.user.name);
  }

  deleteUser(){

  }

}
