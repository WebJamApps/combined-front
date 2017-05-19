import {inject} from 'aurelia-framework';
import {App} from './app';
import {AuthService} from 'aurelia-auth';
import {HttpClient, json} from 'aurelia-fetch-client';
@inject(AuthService, HttpClient, App)
export class Dashboard {
  constructor(auth, httpClient, app){
    this.app = app;
    this.auth = auth;
    this.httpClient = httpClient;
  }

  types=['Charity', 'Volunteer', 'Developer', 'Reader', 'Librarian'];

  async activate() {
    this.configHttpClient();
    let uid = this.auth.getTokenPayload().sub;
    this.user = await this.app.appState.getUser(uid);
    console.log('this is the user ' + this.user.name);
    this.childRoute();
  }

  configHttpClient(){
    if (process.env.NODE_ENV !== 'production'){
      this.backend = process.env.BackendUrl;
    } else {
      this.backend = '';
    }
    this.httpClient.configure(config => {
      config
      .useStandardConfiguration()
      .withBaseUrl(this.backend);
    });
  }

  childRoute(){
    if (this.user.userType === 'Charity'){
      this.app.router.navigate('dashboard/charity');
    } else if (this.user.userType === 'Volunteer'){
      this.app.router.navigate('dashboard/volunteer');
    } else if (this.user.userType === 'Reader'){
      this.app.router.navigate('dashboard/reader');
    } else if (this.user.userType === 'Librarian'){
      this.app.router.navigate('dashboard/librarian');
    } else if (this.user.userType === 'Developer'){
      this.app.router.navigate('dashboard/developer');
    }
  }

  async updateUser(){
    let uid = this.auth.getTokenPayload().sub;
    await fetch;
    this.user.userType = this.types[this.user.userType - 1];
    this.httpClient.fetch('/user/' + uid, {
      method: 'put',
      body: json(this.user)
    })
    .then(response=>response.json())
    .then(data=> {
      this.app.appState.setUser(this.user);
      this.app.appState.checkUserRole();
      this.childRoute();
    });
  }
}
