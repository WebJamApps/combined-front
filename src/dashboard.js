import { inject } from 'aurelia-framework';
import { App } from './app';
// import {json} from 'aurelia-fetch-client';
// import { ValidationControllerFactory, ValidationRules, Validator, validateTrigger } from 'aurelia-validation';
// import {FormValidator} from './classes/FormValidator';
// @inject(App, ValidationControllerFactory, Validator)
@inject(App)
export class Dashboard {
  // controller = null;
  // validator = null;
  // constructor(app, controllerFactory, validator){
  constructor(app) {
    this.app = app;
    // this.validator = new FormValidator(validator, (results) => this.updateCanSubmit(results)); //if the form is valid then set to true.
    // this.controller = controllerFactory.createForCurrentScope(this.validator);
    // this.controller.validateTrigger = validateTrigger.changeOrBlur;
    // this.canSubmit = false;  //the button on the form
  }

  async activate() {
    // this.userTypes = JSON.parse(process.env.userRoles).roles;
    this.uid = this.app.auth.getTokenPayload().sub;
    this.user = await this.app.appState.getUser(this.uid);
    window.localStorage.setItem('userEmail', this.user.email);
    /* istanbul ignore else */
    // if (this.user.userType === 'Developer'){
    //   this.userTypes.push('Developer');
    // }
    // if (localStorage.getItem('token') === null) {
    //   let newToken = localStorage.getItem('aurelia_id_token');
    //   if (newToken !== null) {
    //     localStorage.setItem('token', newToken);
    //   }
    // }
    this.childRoute();
  }
  childRoute() {
    if (this.user.userStatus === 'disabled') {
      return this.app.router.navigate('dashboard/user-account');
    }
    if (this.user.userType === undefined || this.user.userType === '') {
      this.user.userDetails = 'newUser';
      if (this.user.isOhafUser) {
        this.user.userType = 'Volunteer';
      } else {
        this.user.userType = 'user-account';
      }
      this.app.appState.setUser(this.user);
      return this.app.router.navigate('dashboard/user-account');
    }
    /* istanbul ignore else */
    if (this.user.userType === 'Charity') {
      return this.app.router.navigate('dashboard/charity');
    } else if (this.user.userType === 'Volunteer') {
      return this.app.router.navigate('dashboard/volunteer');
    } else if (this.user.userType === 'Reader') {
      return this.app.router.navigate('dashboard/reader');
    } else if (this.user.userType === 'Librarian') {
      return this.app.router.navigate('dashboard/librarian');
    } else if (this.user.userType === 'Developer') {
      return this.app.router.navigate('dashboard/developer');
    }
    return this.app.router.navigate('/');
  }
}
