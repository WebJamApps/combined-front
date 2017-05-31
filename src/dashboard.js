import {inject} from 'aurelia-framework';
import {App} from './app';
import {json} from 'aurelia-fetch-client';
import { ValidationControllerFactory, ValidationRules, Validator, validateTrigger } from 'aurelia-validation';
import {FormValidator} from './classes/FormValidator';
@inject(App, ValidationControllerFactory, Validator)
export class Dashboard {
  controller = null;
  validator = null;
  constructor(app, controllerFactory, validator){
    this.app = app;
    this.validator = new FormValidator(validator, (results) => this.updateCanSubmit(results)); //if the form is valid then set to true.
    this.controller = controllerFactory.createForCurrentScope(this.validator);
    this.controller.validateTrigger = validateTrigger.changeOrBlur;
    this.canSubmit = false;  //the button on the form
  }

  userTypes=JSON.parse(process.env.userRoles).roles;

  async activate() {
    this.uid = this.app.auth.getTokenPayload().sub;
    this.user = await this.app.appState.getUser(this.uid);
    this.childRoute();
    this.setupValidation();
  }

  updateCanSubmit(validationResults) {
    let valid = true;
    for (let result of validationResults) {
      if (result.valid === false){
        valid = false;
        break;
      }
    }
    this.canSubmit = valid;
    if (this.user.userType !== '' && this.canSubmit){
      let nub = document.getElementById('newUserButton');
      nub.style.display = 'block';
    }
    return this.canSubmit;
  }

  dropdownChanged() {
    let nub = document.getElementById('newUserButton');
    if (this.user.userType !== '' && this.canSubmit){
      nub.style.display = 'block';
    } else {
      nub.style.display = 'none';
    }
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

  setupValidation() {
    ValidationRules
    .ensure('userPhone').matches(/[2-9]\d{9}/).maxLength(10).withMessage('10 digits')
    .ensure('userType').required().minLength(5).withMessage('select a user type')
    .ensure('userZip').required().matches(/\d{5}/).maxLength(5).withMessage('5-digit zipcode')
    .ensure('userCity').required().matches(/[^0-9]+/).maxLength(30).withMessage('City name please')
    .on(this.user);
  }

  validate() {
    this.validator.validateObject(this.user);
  }

  async updateUser(){
    await fetch;
    this.app.httpClient.fetch('/user/' + this.uid, {
      method: 'put',
      body: json(this.user)
    })
    .then((response) => response.json())
    .then((data) => {
      this.app.appState.setUser(this.user);
      this.app.appState.checkUserRole();
      this.childRoute();
    });
  }
}
