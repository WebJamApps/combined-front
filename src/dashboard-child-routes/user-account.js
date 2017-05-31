import {inject} from 'aurelia-framework';
import {App} from '../app';
@inject(App)
export class UserAccount {
  constructor(app){
    this.app = app;
  }

  async activate() {
    //this.configHttpClient();
    this.uid = this.app.auth.getTokenPayload().sub;
    await this.app.appState.getUser(this.uid);
    this.user = this.app.appState.user;
    console.log('this is the user ' + this.user.name);
  }

  async deleteUser(){
    //let uid = this.auth.getTokenPayload().sub;
    await fetch;
    this.app.httpClient.fetch('/user/' + this.uid, {
      method: 'delete'
    })
    //.then(response=>response.json())
    .then((data) => {
      //console.log(data);
      this.app.logout();
    });
  }

}
