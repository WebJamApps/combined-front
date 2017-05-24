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
    // this.validator = {
    //   validatorName: 'my-custom-validator',
    //   validatorType: 'validator',
    //   validate: function(value) {console.log('I am validating');}
    // };
    // this.form = new Polymer.IronMeta({
    //   type: this.validator.validatorType,
    //   key: this.validator.validatorName,
    //   value: this.validator
    // });
    //console.log('options for user roles: ' + JSON.parse(process.env.userRoles).roles);
  }
  selectedValue;
  userTypes=JSON.parse(process.env.userRoles).roles;

  async activate() {
    this.configHttpClient();
    let uid = this.auth.getTokenPayload().sub;
    this.user = await this.app.appState.getUser(uid);
    console.log('this is the user ' + this.user.name);
    this.childRoute();
  }

  DropdownChanged(changedVal) {
    //alert(changedVal);
    let nub = document.getElementById('newUserButton');
    console.log(nub);
    if (this.selectedValue !== ''){
      nub.style.display = 'block';
    } else {
      nub.style.display = 'none';
    }
  }

  configHttpClient(){
    this.backend = '';
    /* istanbul ignore else */
    if (process.env.NODE_ENV !== 'production'){
      this.backend = process.env.BackendUrl;
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
    this.user.userType = this.selectedValue;
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
