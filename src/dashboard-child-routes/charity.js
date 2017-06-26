import {inject} from 'aurelia-framework';
import {App} from '../app';
import {json} from 'aurelia-fetch-client';
import { ValidationControllerFactory, ValidationRules, Validator, validateTrigger } from 'aurelia-validation';
import {FormValidator} from '../classes/FormValidator';
@inject(App, ValidationControllerFactory, Validator)
export class Charity {
  controller = null;
  validator = null;
  constructor(app, controllerFactory, validator){
    this.app = app;
    this.newCharity = {
      'charityName': '',
      'charityCity': '',
      'charityState': '',
      'charityZipCode': 0,
      //'charityPhoneNumber': 2,
      //'charityEmail': '',
      'charityTypes': [],
      'charityManagers': [],
      'charityMngIds': [],
      'charityTypeOther': '',
      'charityTypesHtml': ''
    };
    this.validator = new FormValidator(validator, (results) => this.updateCanSubmit(results)); //if the form is valid then set to true.
    this.controller = controllerFactory.createForCurrentScope(this.validator);
    this.controller.validateTrigger = validateTrigger.changeOrBlur;
    this.validator2 = new FormValidator(validator, (results) => this.updateCanSubmit2(results));
    this.controller2 = controllerFactory.createForCurrentScope(this.validator2);
    this.controller2.validateTrigger = validateTrigger.changeOrBlur;
    this.canSubmit = false;  //the button on the form
    this.canSubmit2 = true;
    this.validType = false;
    this.validType2 = true;
    this.charities = {};
    //this.updateCharityDisplay = false;
  }

  //pretty much just copy and pasted the 'causes' array from user-account.js
  //types = ['Christian', 'Environmental', 'Hunger', 'Animal Rights', 'Homeless', 'Veterans', 'Elderly'];
  states = [ 'Alabama', 'Alaska', 'American Samoa', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'District of Columbia', 'Federated States of Micronesia', 'Florida', 'Georgia', 'Guam', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Marshall Islands', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Northern Mariana Islands', 'Ohio', 'Oklahoma', 'Oregon', 'Palau', 'Pennsylvania', 'Puerto Rico', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virgin Island', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming']

  async activate(){
    this.uid = this.app.auth.getTokenPayload().sub;
    this.user = await this.app.appState.getUser(this.uid);
    const res = await this.app.httpClient.fetch('/charity/' + this.uid);
    this.charities = await res.json();
    console.log(this.charities);
    if (this.charities.length !== 0){
      this.buildTypes();
      console.log(this.charities[0].charityTypes);
    }
    this.types = ['Christian', 'Environmental', 'Hunger', 'Animal Rights', 'Homeless', 'Veterans', 'Elderly'];
    this.types.sort();
    this.types.push('other');
    this.states.sort();
    this.setupValidation();
  }

  showUpdateCharity(charity){
    //this.updateCharityDisplay = true;
    let updateDiv = document.getElementById('updateCharitySection');
    updateDiv.style.display = 'block';
    this.charityName = charity.charityName;
    this.updateCharity = charity;
    this.setupValidation2();
    if (this.updateCharity.charityTypes.includes('other')){
      this.typeOther = true;
    } else {
      this.typeOther = false;
      this.updateCharity.charitytypeOther = '';
    }
    document.getElementById('updateCharitySection').scrollIntoView();
  }

  showCheckboxes(id){
    const checkboxes = document.getElementById(id);
    if (!this.expanded) {
      checkboxes.opened = true;
      this.expanded = true;
    } else {
      checkboxes.opened = false;
      this.expanded = false;
    }
  }

  typePicked(){
    this.validType = false;
    let nub = document.getElementById('newCharityButton');
    nub.style.display = 'none';
    for (let i = 0; i < this.types.length; i++) {
      if (this.newCharity.charityTypes.indexOf(this.types[i]) > -1){
        this.validType = true;
        if (this.canSubmit){
          nub.style.display = 'block';
        }
      }
    }
    if (this.newCharity.charityTypes.includes('other')){
      this.typeOther = true;
    } else {
      this.typeOther = false;
      this.newCharity.charityTypeOther = '';
    }
  }

  updateTypePicked(){
    this.validType2 = false;
    let nub = document.getElementById('updateCharityButton');
    nub.style.display = 'none';
    for (let i = 0; i < this.types.length; i++) {
      if (this.updateCharity.charityTypes.indexOf(this.types[i]) > -1){
        this.validType2 = true;
        if (this.canSubmit2){
          nub.style.display = 'block';
        }
      }
    }
    console.log('the charity types picked are: ' + this.updateCharity.charityTypes);
    if (this.updateCharity.charityTypes.includes('other')){
      this.typeOther = true;
    } else {
      this.typeOther = false;
      this.updateCharity.charityTypeOther = '';
    }
  }

  setupValidation() {
    ValidationRules
    .ensure('charityPhoneNumber').matches(/[2-9]\d{9}/).maxLength(10).withMessage('10 digit phone number')
    .ensure('charityZipCode').required().matches(/\d{5}/).maxLength(5).withMessage('5-digit zipcode')
    .ensure('charityCity').required().matches(/[^0-9]+/).maxLength(30).withMessage('City name please')
    .ensure('charityName').required().maxLength(40).withMessage('Charity name please')
    .ensure('charityState').required().withMessage('Charity state please')
    .on(this.newCharity);
  }

  setupValidation2() {
    ValidationRules
    .ensure('charityPhoneNumber').matches(/[2-9]\d{9}/).maxLength(10).withMessage('10 digit phone number')
    .ensure('charityZipCode').required().matches(/\d{5}/).maxLength(5).withMessage('5-digit zipcode')
    .ensure('charityCity').required().matches(/[^0-9]+/).maxLength(30).withMessage('City name please')
    .ensure('charityName').required().maxLength(40).withMessage('Charity name please')
    .ensure('charityState').required().withMessage('Charity state please')
    .on(this.updateCharity);
  }

  validate() {
    return this.validator.validateObject(this.newCharity);
  }

  //validate2() {
  //  return this.validator2.validateObject(this.updateCharity);
  //}

  updateCanSubmit(validationResults) {
    let valid = true;
    let nub = document.getElementById('newCharityButton');
    nub.style.display = 'none';
    for (let result of validationResults) {
      if (result.valid === false){
        valid = false;
        break;
      }
    }
    this.canSubmit = valid;
    if (this.canSubmit && this.validType){
      nub.style.display = 'block';
    }
    return this.canSubmit;
  }

  updateCanSubmit2(validationResults) {
    let valid = true;
    console.log('Running update funcitronfswd');
    let nub = document.getElementById('updateCharityButton');
    if (nub !== null) {
      nub.style.display = 'none';
      for (let result of validationResults) {
        if (result.valid === false){
          console.log('Something is not valid');
          valid = false;
          break;
        }
      }
      this.canSubmit2 = valid;
      if (this.canSubmit2 && this.validType2){
        nub.style.display = 'block';
      }
      return this.canSubmit2;
    }
  }

  createCharity(){
    this.newCharity.charityManagers[0] = this.user.name;
    this.newCharity.charityMngIds[0] = this.user._id;
    //the selection menu sets this to the index of the state array, not the actual value of the state in the array.
    //so the selected index is used to get the correct state
    //this.newCharity.charityState = this.states[this.newCharity.charityState - 1];
    this.app.httpClient.fetch('/charity/create', {
      method: 'post',
      body: json(this.newCharity)
    })
    .then((data) => {
      console.log(data);
      this.newCharity = {};
      this.activate();
    });
  }

  buildTypes(){
    for (let l = 0; l < this.charities.length; l++){
      let typeHtml = '';
      for (let i = 0; i < this.charities[l].charityTypes.length; i++) {
        if (this.charities[l].charityTypes[i] !== ''){
          if (this.charities[l].charityTypes[i] !== 'other'){
            typeHtml = typeHtml + '<p style="font-size:10pt">' + this.charities[l].charityTypes[i] + '</p>';
          } else {
            typeHtml = typeHtml + '<p style="font-size:10pt">' + this.charities[l].charityTypeOther + '</p>';
          }
        }
      }
      if (typeHtml === ''){
        typeHtml = '<p style="font-size:10pt">not specified</p>';
      }
      this.charities[l].charityTypesHtml = typeHtml;
    }
  }

  async deleteCharity(charityId){
    await fetch;
    this.app.httpClient.fetch('/charity/' + charityId, {
      method: 'delete'
    })
    .then((data) => {
      console.log('your charity has been deleted');
      this.activate();
    });
  }

  async updateCharityFunct(){
    await fetch;
    this.app.httpClient.fetch('/charity/' +   this.updateCharity._id, {
      method: 'put',
      body: json(this.updateCharity)
    })
    .then((response) => response.json())
    .then((data) => {
      let updateDiv = document.getElementById('updateCharitySection');
      updateDiv.style.display = 'none';
      this.updateCharity = {};
      document.getElementById('charityDash').scrollIntoView();
      this.activate();
    });
  }

  // attached(){
  //   if (this.updateCharityDisplay === true){
  //
  //   }
  // }

}
