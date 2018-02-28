import {inject} from 'aurelia-framework';
import {App} from './app';
//import {json} from 'aurelia-fetch-client';
//import { ValidationControllerFactory, ValidationRules, Validator, validateTrigger } from 'aurelia-validation';
//import {FormValidator} from './classes/FormValidator';
//@inject(App, ValidationControllerFactory, Validator)
@inject(App)
export class Dashboard {
  //controller = null;
  //validator = null;
  //constructor(app, controllerFactory, validator){
  constructor(app){
    this.app = app;
    //this.validator = new FormValidator(validator, (results) => this.updateCanSubmit(results)); //if the form is valid then set to true.
    //this.controller = controllerFactory.createForCurrentScope(this.validator);
    //this.controller.validateTrigger = validateTrigger.changeOrBlur;
    //this.canSubmit = false;  //the button on the form
  }

  async activate() {
    //this.userTypes = JSON.parse(process.env.userRoles).roles;
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

  // updateCanSubmit(validationResults) {
  //   let valid = true;
  //   for (let result of validationResults) {
  //     if (result.valid === false){
  //       valid = false;
  //       break;
  //     }
  //   }
  //   this.canSubmit = valid;
  //   if (this.user.userType !== '' && this.canSubmit){
  //     let nub = document.getElementById('newUserButton');
  //   /* istanbul ignore else */
  //     if (nub !== null){
  //       nub.style.display = 'block';
  //     }
  //   }
  //   return this.canSubmit;
  // }

  // dropdownChanged() {
  //   let nub = document.getElementById('newUserButton');
  //   if (this.user.userType !== '' && this.canSubmit){
  //     nub.style.display = 'block';
  //   } else {
  //     nub.style.display = 'none';
  //   }
  // }

  childRoute(){
    if (this.user.userStatus === 'disabled'){
      return this.app.router.navigate('dashboard/user-account');
    }
    if (this.user.userType === undefined || this.user.userType === ''){
      this.user.userDetails = 'newUser';
      if (this.user.isOhafUser){
        this.user.userType = 'Volunteer';
      } else {
        this.user.userType = 'user-account';
      }
      this.app.appState.setUser(this.user);
      this.app.router.navigate('dashboard/user-account');
    } else {
      /* istanbul ignore else */
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
      //else {
      //   this.setupValidation();
      //}
    }
  }

  // setupValidation() {
  //   ValidationRules
  //   .ensure('userPhone').matches(/\b[2-9]\d{9}\b/).withMessage('10 digits only')
  //   .ensure('userType').required().minLength(5).withMessage('select a user type')
  //   .ensure('userZip').required().matches(/\b\d{5}\b/).withMessage('5-digit zipcode')
  //   .ensure('userCity').required().matches(/[^0-9]+/).maxLength(30).withMessage('City name please')
  //   .ensure('userState').required()
  //   .on(this.user);
  // }

  // validate() {
  //   this.validator.validateObject(this.user);
  // }

  // async updateUser(){
  //   await fetch;
  //   this.app.httpClient.fetch('/user/' + this.uid, {
  //     method: 'put',
  //     body: json(this.user)
  //   })
  //   .then((response) => response.json())
  //   .then((data) => {
  //     this.app.appState.setUser(this.user);
  //     this.app.appState.checkUserRole();
  //     //this.app.appState.newUser = false;
  //     this.activate();
  //   });
  //  }

  // attached(){
  //   this.setupValidation();
  // }
}
