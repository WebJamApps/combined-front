import {inject} from 'aurelia-framework';
import {App} from '../app';
@inject(App)
export class Developer {
  constructor(app){
    this.app = app;
  //   this.auth = auth;
  //
  }

  async activate() {
    this.uid = this.app.auth.getTokenPayload().sub;
    this.user = await this.app.appState.getUser(this.uid);
    this.app.dashboardTitle = this.user.userType;
  }

}
