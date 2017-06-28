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
  }
  
  async activate(){
    this.types = ['Christian', 'Environmental', 'Hunger', 'Animal Rights', 'Homeless', 'Veterans', 'Elderly'];
    this.types.sort();
    this.types.push('other');
    this.states = [ 'Alabama', 'Alaska', 'American Samoa', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'District of Columbia',
      'Federated States of Micronesia', 'Florida', 'Georgia', 'Guam', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine',
      'Marshall Islands', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
      'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Northern Mariana Islands', 'Ohio', 'Oklahoma', 'Oregon', 'Palau', 'Pennsylvania', 'Puerto Rico',
      'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virgin Island', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin',
      'Wyoming'];
    this.states.sort();
    this.newCharity = {
      'charityName': '',
      'charityCity': '',
      'charityState': '',
      'charityZipCode': '',
      'charityTypes': [],
      'charityManagers': [],
      'charityMngIds': [],
      'charityTypeOther': '',
      'charityTypesHtml': ''
    };
    this.uid = this.app.auth.getTokenPayload().sub;
    this.user = await this.app.appState.getUser(this.uid);
    const res = await this.app.httpClient.fetch('/charity/' + this.uid);
    this.charities = await res.json();
    //console.log(this.charities);
    if (this.charities.length !== 0){
      this.buildTypes();
      this.buildManagers();
      console.log(this.charities[0].charityTypes);
    }
    this.setupValidation();
  }
  
  showUpdateCharity(charity){
    this.canSubmit2 = true;
    this.validType2 = true;
    let updateDiv = document.getElementById('updateCharitySection');
    updateDiv.style.display = 'block';
    this.charityName = charity.charityName;
    this.updateCharity = charity;
    this.updateCharity.charityEmail = '';
    if (this.updateCharity.charityTypes.includes('other')){
      this.typeOther = true;
    } else {
      this.typeOther = false;
      this.updateCharity.charitytypeOther = '';
    }
    this.setupValidation2();
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
    .ensure('charityPhoneNumber').matches(/\b[2-9]\d{9}\b/).withMessage('10 digit phone number')
    .ensure('charityZipCode').required().matches(/\b\d{5}\b/).withMessage('5-digit zipcode')
    .ensure('charityCity').required().matches(/[^0-9]+/).maxLength(30).withMessage('City name please')
    .ensure('charityName').required().maxLength(40).withMessage('Charity name please')
    .ensure('charityState').required().withMessage('Charity state please')
    .on(this.newCharity);
  }
  
  setupValidation2() {
    ValidationRules
    .ensure('charityPhoneNumber').matches(/\b[2-9]\d{9}\b/).withMessage('10 digit phone number')
    .ensure('charityEmail').email()
    .ensure('charityZipCode').required().matches(/\b\d{5}\b/).withMessage('5-digit zipcode')
    .ensure('charityCity').required().matches(/[^0-9]+/).maxLength(30).withMessage('City name please')
    .ensure('charityName').required().maxLength(40).withMessage('Charity name please')
    .ensure('charityState').required().withMessage('Charity state please')
    .on(this.updateCharity);
  }
  
  validate() {
    return this.validator.validateObject(this.newCharity);
  }
  
  validate2() {
    return this.validator2.validateObject(this.updateCharity);
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
  
  updateCanSubmit2(validationResults) {
    let valid = true;
    console.log('Running update funcitronfswd');
    let nub = document.getElementById('updateCharityButton');
    if (nub !== null) {
      //nub.style.display = 'none';
      for (let result of validationResults) {
        if (result.valid === false){
          console.log('Something is not valid');
          nub.style.display = 'none';
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
    this.app.httpClient.fetch('/charity/create', {
      method: 'post',
      body: json(this.newCharity)
    })
    .then((data) => {
      console.log(data);
      document.getElementById('charityDash').scrollIntoView();
      this.activate();
    });
  }
  
  buildTypes(){
    for (let l = 0; l < this.charities.length; l++){
      let typeHtml = '';
      for (let i = 0; i < this.charities[l].charityTypes.length; i++) {
        if (this.charities[l].charityTypes[i] !== ''){
          if (this.charities[l].charityTypes[i] !== 'other'){
            typeHtml = typeHtml + '<p style="font-size:10pt; padding-top:4px; margin-bottom:4px">' + this.charities[l].charityTypes[i] + '</p>';
          } else {
            typeHtml = typeHtml + '<p style="font-size:10pt; padding-top:4px; margin-bottom:4px">' + this.charities[l].charityTypeOther + '</p>';
          }
        }
      }
      if (typeHtml === ''){
        typeHtml = '<p style="font-size:10pt">not specified</p>';
      }
      this.charities[l].charityTypesHtml = typeHtml;
    }
  }
  
  buildManagers(){
    for (let l = 0; l < this.charities.length; l++){
      let manHtml = '';
      // if (this.charities[l].charityManagers.length > 1){
      //   let deleteButton = document.getElementsByClassName('delete-button' + this.charities[l]._id);
      //   console.log(deleteButton);
        //deleteButton[0].style.display = 'none';
        //document.getElementById('delete' + this.charities[l]._id).style.display = 'none';
      //}
      for (let i = 0; i < this.charities[l].charityManagers.length; i++) {
        if (this.charities[l].charityManagers[i] !== ''){
          manHtml = manHtml + '<p style="font-size:10pt; padding-top:4px; margin-bottom:4px">' + this.charities[l].charityManagers[i] + '</p>';
        }
      }
      if (manHtml === ''){
        manHtml = '<p style="font-size:10pt">not specified</p>';
      }
      this.charities[l].charityManagersHtml = manHtml;
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
  
  updateCharityFunct(){
    console.log('this is the update charity email: ' + this.updateCharity.charityEmail);
    if (this.updateCharity.charityEmail !== '' && this.updateCharity.charityEmail !== null){
      this.findUserByEmail();
    } else {
      this.putCharity();
    }
  }
  
  async putCharity(){
    console.log('this is the update charity');
    console.log(this.updateCharity);
    await fetch;
    this.app.httpClient.fetch('/charity/' + this.updateCharity._id, {
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
  
  async findUserByEmail(){
    await fetch;
    this.app.httpClient.fetch('/user/', {
      method: 'post',
      body: json({email: this.updateCharity.charityEmail})
    })
    .then((response) => response.json())
    .then((data) => {
      //this.manager = data;
      if (data.length !== 0){
        //console.log('the additional manager is: ' + JSON.stringify(data));
        const tempManager = data;
        console.log('this is the additional manager: ');
        console.log(tempManager[0].name);
        console.log(tempManager[0]._id);
        //only do this if the array does not already contain the user id, else alert that the user is already a manager of this charity
        for (let l = 0; l < this.updateCharity.charityMngIds.length; l++){
          console.log('checking for already a manager');
          if (this.updateCharity.charityMngIds.indexOf(tempManager[0]._id) > -1){
            let updateDiv = document.getElementById('updateCharitySection');
            updateDiv.style.display = 'none';
            this.updateCharity = {};
            document.getElementById('charityDash').scrollIntoView();
            this.activate();
            return alert('this user is already a manager of this charity');
          }
        }
        this.updateCharity.charityMngIds.push(tempManager[0]._id);
        this.updateCharity.charityManagers.push(tempManager[0].name);
      } else {
        alert('There is no OHAF user with that email');
      }
      this.putCharity();
    });
  }
  // attached(){
  //   if (this.updateCharityDisplay === true){
  //
  //   }
  // }
  
}
