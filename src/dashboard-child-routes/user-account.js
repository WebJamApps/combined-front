import {inject} from 'aurelia-framework';
import {App} from '../app';
import { ValidationControllerFactory, ValidationRules, Validator, validateTrigger } from 'aurelia-validation';
import {FormValidator} from '../classes/FormValidator';
@inject(App, ValidationControllerFactory, Validator)
export class UserAccount {
  controller = null;
  validator = null;
  constructor(app, controllerFactory, validator){
    this.app = app;
    this.canChangeUserType = true;
    this.validator = new FormValidator(validator, (results) => this.updateCanSubmit(results));
    this.controller = controllerFactory.createForCurrentScope(this.validator);
    this.controller.validateTrigger = validateTrigger.changeOrBlur;
    this.canSubmit = false;
  }

  async activate() {
    this.userTypes = JSON.parse(process.env.userRoles).roles;
    this.uid = this.app.auth.getTokenPayload().sub;
    this.user = await this.app.appState.getUser(this.uid);
    this.app.role = this.user.userType;
    this.checkChangeUserType();
    this.userTypes.sort();
    this.setupValidation();
  }

  setupValidation() {
    ValidationRules
    .ensure('userPhone').matches(/\b[2-9]\d{9}\b/).withMessage('10 digits only')
    .ensure('userType').required().minLength(5).withMessage('select a user type')
    .ensure('userZip').required().matches(/\b\d{5}\b/).withMessage('5-digit zipcode')
    .ensure('userCity').required().matches(/[^0-9]+/).maxLength(30).withMessage('City name please')
    .ensure('userState').required()
    .on(this.user);
  }

  // validate() {
  //   this.validator.validateObject(this.user);
  // }

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
      let nub = document.getElementById('updateUserButton');
      nub.style.display = 'block';
    }
    return this.canSubmit;
  }

  async checkChangeUserType(){
    this.reasons = '';
    if (this.user.userType === 'Volunteer' || this.user.userType === 'Developer'){
      await this.fetchAllEvents();
      this.checkScheduled();
    }
    if (this.user.userType === 'Charity' || this.user.userType === 'Developer'){
      // Do not allow user to change their primary userType away from Charity if they have created a charity
      const res = await this.app.httpClient.fetch('/charity/' + this.uid);
      this.charities = await res.json();
      if (this.charities.length > 0){
        this.canChangeUserType = false;
        this.reasons = this.reasons + '<li>You are the manager of a charity.</li>';
      }
    }
    if (this.user.userType === 'Reader' || this.user.userType === 'Developer'){
      const res = await this.app.httpClient.fetch('/book/findcheckedout/' + this.uid);
      this.books = await res.json();
      if (this.books.length > 0){
        this.canChangeUserType = false;
        this.reasons = this.reasons + '<li>You have a book checked out.</li>';
      }
    }
  }

  async fetchAllEvents(){
    const res = await this.app.httpClient.fetch('/volopp/getall');
    this.events2 = await res.json();
  }

  checkScheduled(){
    for (let i = 0; i < this.events2.length; i++){
      if (this.events2[i].voPeopleScheduled !== null && this.events2[i].voPeopleScheduled !== undefined){
        if (this.events2[i].voPeopleScheduled.includes(this.uid)){
          this.canChangeUserType = false;
          this.reasons = this.reasons + '<li>You signed up to work at a charity event.</li>';
        }
      }
    }
  }

  async setCharity(){
    this.user.userDetails = '';
    this.user.userType = 'Charity';
    await this.app.updateById('/user/', this.uid, this.user, null);
  }

  afterUpdateUser(){
    this.app.appState.setUser(this.user);
    this.app.appState.checkUserRole();
    this.app.router.navigate('dashboard');
  }

  async updateUser(){
    await this.app.updateById('/user/', this.uid, this.user, null);
    // this.app.appState.updateUser(this.user)
    // this.app.router.navigate('dashboard');
    this.afterUpdateUser();
  }

  async deleteUser(){
    await fetch;
    this.app.httpClient.fetch('/user/' + this.uid, {
      method: 'delete'
    })
    .then((data) => {
      this.app.logout();
    });
  }

}
