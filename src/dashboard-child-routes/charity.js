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
    this.canSubmit = false;  //the button on the form
    this.validType = false;
    this.charities = {};
  }

  //pretty much just copy and pasted the 'causes' array from user-account.js
  types = ['Christian', 'Environmental', 'Hunger', 'Animal Rights', 'Homeless', 'Veterans', 'Elderly'];
  states = ['Alabama', 'Alaska', 'American Samoa', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'District of Columbia', 'Federated States of Micronesia', 'Florida', 'Georgia', 'Guam', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Marshall Islands', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Northern Mariana Islands', 'Ohio', 'Oklahoma', 'Oregon', 'Palau', 'Pennsylvania', 'Puerto Rico', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virgin Island', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming']

  async activate(){
    let uid = this.app.auth.getTokenPayload().sub;
    this.user = await this.app.appState.getUser(uid);
    const res = await this.app.httpClient.fetch('/charity/' + uid);
    this.charities = await res.json();
    console.log(this.charities);
    if (this.charities.length !== 0){
      this.buildTypes();
      console.log(this.charities[0].charityTypes);
    }
    this.types.sort();
    this.types.push('other');
    this.states.sort();
    this.setupValidation();
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
      this.newCharity.charitytypeOther = '';
    }
  }

  setupValidation() {
    ValidationRules
    .ensure('charityPhoneNumber').matches(/[2-9]\d{9}/).maxLength(10).withMessage('10 digit phone number')
    .ensure('charityZipCode').required().matches(/\d{5}/).maxLength(5).withMessage('5-digit zipcode')
    .ensure('charityCity').required().matches(/[^0-9]+/).maxLength(30).withMessage('City name please')
    .ensure('charityName').required().maxLength(40).withMessage('Charity name please')
    .on(this.newCharity);
  }

  validate() {
    return this.validator.validateObject(this.newCharity);
  }

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

  createCharity(){
    this.newCharity.charityManagers[0] = this.user.name;
    this.newCharity.charityMngIds[0] = this.user._id;
    //the selection menu sets this to the index of the state array, not the actual value of the state in the array.
    //so the selected index is used to get the correct state
    this.newCharity.charityState = this.states[this.newCharity.charityState - 1];
    this.app.httpClient.fetch('/charity/create', {
      method: 'post',
      body: json(this.newCharity)
    })
    .then((data) => {
      console.log(data);
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
      //this.app.logout();
    });
  }
}
