import {inject} from 'aurelia-framework';
import {App} from '../app';
import {AuthService} from 'aurelia-auth';
//import {HttpClient} from 'aurelia-fetch-client';
@inject(AuthService, App)
export class UserAccount {
  constructor(auth, app, httpClient){
    this.app = app;
    this.auth = auth;
    //this.httpClient = httpClient;
  }

  async activate() {
    //this.configHttpClient();
    let uid = this.auth.getTokenPayload().sub;
    await this.app.appState.getUser(uid);
    this.user = this.app.appState.user;
    console.log('this is the user ' + this.user.name);
  }

  async deleteUser(){
    let uid = this.auth.getTokenPayload().sub;
    await fetch;
    this.app.httpClient.fetch('/user/' + uid, {
      method: 'delete'
    })
    //.then(response=>response.json())
    .then((data) => {
      //console.log(data);
      this.app.logout();
    });
  }

}
