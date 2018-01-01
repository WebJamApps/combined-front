import {inject} from 'aurelia-framework';
import {App} from '../app';
//import {json} from 'aurelia-fetch-client';
import { ValidationControllerFactory, ValidationRules, Validator, validateTrigger } from 'aurelia-validation';
import {FormValidator} from '../classes/FormValidator';
@inject(App, ValidationControllerFactory, Validator)
export class UserAccount {
  controller = null;
  validator = null;
  constructor(app, controllerFactory, validator){
    this.app = app;
    this.selectedCauses = [];
    this.selectedTalents = [];
    this.selectedWorks = [];
    this.canChangeUserType = true;
    this.validator = new FormValidator(validator, (results) => this.updateCanSubmit(results));
    this.controller = controllerFactory.createForCurrentScope(this.validator);
    this.controller.validateTrigger = validateTrigger.changeOrBlur;
    this.canSubmit = false;
  }

  causes = ['Christian', 'Environmental', 'Hunger', 'Animal Rights', 'Homeless', 'Veterans', 'Elderly'];
  talents = ['music', 'athletics', 'childcare', 'mechanics', 'construction', 'computers', 'communication', 'chess playing', 'listening'];
  works = ['hashbrown slinging', 'nail hammering', 'leaf removal', 'floor mopping', 'counseling', 'visitation'];


  async activate() {
    this.userTypes = JSON.parse(process.env.userRoles).roles;
    this.uid = this.app.auth.getTokenPayload().sub;
    this.user = await this.app.appState.getUser(this.uid);
    this.app.role = this.user.userType;
    //this.setupVolunteerUser();
    this.checkChangeUserType();
    this.userTypes.sort();
    this.setupValidation();
  }

  // setUserTypes(){
  //   if (this.user.isOhafUser && this.user.userType === 'Volunteer'){
  //     this.userTypes = ['Charity', 'Volunteer'];
  //   }
  //   /* istanbul ignore next */
  //   if (process.env.NODE_ENV === 'development' || this.user.userType === 'Developer'){
  //     this.userTypes.push('Developer');
  //   }
  //   this.userTypes.sort();
  // }

  // changeCauses(item, vol, container) {
  //   item.sort();
  //   item.push('other');
  //   for (let i of item) {
  //     if (vol.includes(i)) {
  //       container.push(i);
  //     } else {
  //       container.push('');
  //     }
  //   }
  // }

  // setupVolunteerUser(){
  //   this.changeCauses(this.causes, this.user.volCauses, this.selectedCauses);
  //   this.changeCauses(this.talents, this.user.volTalents, this.selectedTalents);
  //   this.changeCauses(this.works, this.user.volWorkPrefs, this.selectedWorks);
  //   if (this.selectedWorks.includes('other')){
  //     this.workOther = true;
  //   } else {
  //     this.workOther = false;
  //   }
  //   if (this.selectedTalents.includes('other')){
  //     this.talentOther = true;
  //   } else {
  //     this.talentOther = false;
  //   }
  //   if (this.selectedCauses.includes('other')){
  //     this.causeOther = true;
  //   } else {
  //     this.causeOther = false;
  //   }
  // }

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
  //   this.reasons = '';
  //   console.log('check change user type');
  //   if (this.user.userType === 'Volunteer' || this.user.userType === 'Developer'){
  //     await this.checkSignups();
  //     if (this.userSignups.length > 0){
  //       this.canChangeUserType = false;
  //       this.reasons = this.reasons + '<li>You signed up to work at a charity event.</li>';
  //     }
  //     // console.log('the user signups inside the check function');
  //     // console.log(this.userSignups);
  //     // console.log('I can change the user type: ' + this.canChangeUserType);
  //   }
  //   if (this.user.userType === 'Charity' || this.user.userType === 'Developer'){
  //     // Do not allow user to change their primary userType away from Charity if they have created a charity
  //     const res = await this.app.httpClient.fetch('/charity/' + this.uid);
  //     this.charities = await res.json();
  //     /* istanbul ignore else */
  //     if (this.charities.length > 0){
  //       //this.canDelete = false;
  //       this.canChangeUserType = false;
  //       this.reasons = this.reasons + '<li>You are the manager of a charity.</li>';
  //     }
  //   }
  //   /* istanbul ignore else */
    if (this.user.userType === 'Reader' || this.user.userType === 'Developer'){
      const res = await this.app.httpClient.fetch('/book/findcheckedout/' + this.uid);
      this.books = await res.json();
      /* istanbul ignore else */
      if (this.books.length > 0){
        this.canChangeUserType = false;
        this.reasons = this.reasons + '<li>You have a book checked out.</li>';
      }
    }
  }

  // async checkSignups(){
  //   alert('need to get events and check signups there, also if event is in the past then allow the user to disable their account rather than delete their user account');
  //   // this.userSignups = [];
  //   // const resp = await this.app.httpClient.fetch('/signup/' + this.uid);
  //   // this.userSignups = await resp.json();
  // }

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
