import {inject} from 'aurelia-framework';
import {App} from '../app';
import {json} from 'aurelia-fetch-client';
import { ValidationControllerFactory, ValidationRules, Validator, validateTrigger } from 'aurelia-validation';
import {FormValidator} from '../classes/FormValidator';
//import {VolOpp} from '../classes/VolOpp';
@inject(App, ValidationControllerFactory, Validator)
export class Charity {
  controller = null;
  validator = null;
  constructor(app, controllerFactory, validator){
    this.app = app;
    this.charities = [];
    this.validator2 = new FormValidator(validator, (results) => this.updateCanSubmit2(results));
    this.controller2 = controllerFactory.createForCurrentScope(this.validator2);
    this.controller2.validateTrigger = validateTrigger.changeOrBlur;
    this.canSubmit2 = false;
    this.validType2 = false;
  }

  async activate(){
    this.update = false;
    this.types = ['Christian', 'Environmental', 'Hunger', 'Animal Rights', 'Homeless', 'Veterans', 'Elderly'];
    this.types.sort();
    this.types.push('other');
    this.uid = this.app.auth.getTokenPayload().sub;
    this.user = await this.app.appState.getUser(this.uid);
    this.app.dashboardTitle = this.user.userType;
    this.app.role = this.user.userType;
    const res = await this.app.httpClient.fetch('/charity/' + this.uid);
    this.charities = await res.json();
    if (this.charities.length !== 0){
      this.app.buildPTag(this.charities, 'charityTypes', 'charityTypeOther', 'charityTypesHtml');
      this.buildManagers();
      this.checkEvents();
    }
  }

  async checkEvents(){
    for (let i = 0; i < this.charities.length; i++){
      let foundEvents = [];
      this.charities[i].hasEvents = false;
      let res = await this.app.httpClient.fetch('/volopp/' + this.charities[i]._id);
      foundEvents = await res.json();
      if (foundEvents.length > 0){
        this.charities[i].hasEvents = true;
      }
    }
  }

  createNewCharity(){
    console.log('createNewCharity function populates a blank charity object and then runs the showUpdateCharity function');
    let charity = {
      'charityName': '',
      'charityStreet': '',
      'charityCity': '',
      'charityState': '',
      'charityZipCode': '',
      'charityTypes': [],
      'charityManagers': [],
      'charityMngIds': [],
      'charityTypeOther': '',
      'charityTypesHtml': ''
    };
    this.update = false;
    let charitiesTable = document.getElementById('charTable');
    if (charitiesTable !== null){
      charitiesTable.style.display = 'block';
    }
    this.updateScheduledEvent = false;
    let createNewButton = document.getElementById('createNewCharityButton');
    if (createNewButton !== null){
      createNewButton.style.display = 'none';
    }
    this.showUpdateCharity(charity);
  }

  updateCharityFunction(charity){
    this.update = true;
    this.canSubmit2 = true;
    this.validType2 = true;
    this.showUpdateCharity(charity);
  }

  showUpdateCharity(charity){
    // let updateDiv = document.getElementById('updateCharitySection');
    // updateDiv.style.display = 'block';
    // let scheduleDiv = document.getElementById('scheduleCharitySection');
    // if (scheduleDiv !== null){
    //   scheduleDiv.style.display = 'none';
    // }
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
    if (this.update === true){
      document.getElementById('updateCharitySection').scrollIntoView();
    } else {
      document.getElementById('charityDash').scrollIntoView();
    }
  }

  updateTypePicked(){
    this.validType2 = false;
    let nub = document.getElementsByClassName('updateButton')[0];
    nub.style.display = 'none';
    for (let i = 0; i < this.types.length; i++) {
      if (this.updateCharity.charityTypes.indexOf(this.types[i]) > -1){
        this.validType2 = true;
        if (this.canSubmit2 && nub){
          nub.style.display = 'block';
        }
      }
    }
    this.validate2();
    console.log('the charity types picked are: ' + this.updateCharity.charityTypes);
    if (this.updateCharity.charityTypes.includes('other')){
      this.typeOther = true;
    } else {
      this.typeOther = false;
      this.updateCharity.charityTypeOther = '';
    }
  }

  setupValidation2() {
    ValidationRules
    .ensure('charityPhoneNumber').matches(/\b[2-9]\d{9}\b/).withMessage('10 digits only')
    .ensure('charityName').required().maxLength(40).withMessage('Charity name please')
    .ensure('charityEmail').email()
    .ensure('charityZipCode').required().matches(/\b\d{5}\b/).withMessage('5-digit zipcode')
    .ensure('charityCity').required().matches(/[^0-9]+/).maxLength(30).withMessage('City name please')
    .ensure('charityStreet').required().maxLength(40).withMessage('Charity street address please')
    .ensure('charityState').required().withMessage('Charity state please')
    .on(this.updateCharity);
  }

  validate2() {
    return this.validator2.validateObject(this.updateCharity);
  }

  updateCanSubmit2(validationResults) {
    let valid = true;
    console.log('Running updateCanSubmit2');
    let nub = document.getElementsByClassName('updateButton')[0];
    if (nub) {
      for (let result of validationResults) {
        if (result.valid === false){
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
    this.updateCharity.charityManagers[0] = this.user.name;
    this.updateCharity.charityMngIds[0] = this.user._id;
    console.log('this is the update charity email: ' + this.updateCharity.charityEmail);
    if (this.updateCharity.charityEmail !== '' && this.updateCharity.charityEmail !== null){
      this.findUserByEmail('post');
    } else {
      this.postCharity();
    }
  }

  postCharity(){
    this.app.httpClient.fetch('/charity/create', {
      method: 'post',
      body: json(this.updateCharity)
    })
    .then((data) => {
      console.log(data);
      document.getElementById('charityDash').scrollIntoView();
      this.activate();
      this.createNewCharity();
    });
  }
  
  buildManagers(){
    for (let l = 0; l < this.charities.length; l++){
      let manHtml = '';
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
      this.createNewCharity();
    });
  }

  updateCharityFunct(){
    console.log('this is the update charity email: ' + this.updateCharity.charityEmail);
    if (this.updateCharity.charityEmail !== '' && this.updateCharity.charityEmail !== null){
      this.findUserByEmail('put');
    } else {
      this.putCharity();
    }
  }

  removeManager(charity){
    this.updateCharity = charity;
    const index = this.updateCharity.charityMngIds.indexOf(this.uid);
    if (index > -1){
      this.updateCharity.charityMngIds.splice(index, 1);
    }
    const index2 = this.updateCharity.charityManagers.indexOf(this.user.name);
    if (index > -1){
      this.updateCharity.charityManagers.splice(index2, 1);
    }
    this.putCharity();
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
      // let updateDiv = document.getElementById('updateCharitySection');
      // if (updateDiv !== null){
      //   updateDiv.style.display = 'none';
      // }
      this.updateCharity = {};
      document.getElementById('charityDash').scrollIntoView();
      this.activate();
      this.createNewCharity();
    });
  }

  async findUserByEmail(thenDo){
    await fetch;
    this.app.httpClient.fetch('/user/', {
      method: 'post',
      body: json({email: this.updateCharity.charityEmail})
    })
    .then((response) => response.json())
    .then((data) => {
      if (data.length !== 0){
        //console.log('the additional manager is: ' + JSON.stringify(data));
        const tempManager = data;
        console.log('this is the additional manager: ');
        console.log(tempManager[0].name);
        console.log(tempManager[0]._id);
        //only do this if the array does not already contain the user id, else alert that the user is already a manager of this charity
        for (let l = 0; l < this.updateCharity.charityMngIds.length; l++){
          console.log('checking for already a manager');
          /* istanbul ignore else */
          if (this.updateCharity.charityMngIds.indexOf(tempManager[0]._id) > -1){
            return alert('this user is already a manager of this charity');
          }
        }
        this.updateCharity.charityMngIds.push(tempManager[0]._id);
        this.updateCharity.charityManagers.push(tempManager[0].name);
        if (thenDo === 'put'){
          this.putCharity();
        } else {
          this.postCharity();
        }
      } else {
        alert('There is no OHAF user with that email');
      }
    });
  }

  // removeHyphen(){
  //   console.log('running remove hyphen');
  //   let charityPhone = document.getElementById('charity-phone').value;
  //   console.log(charityPhone);
  //   if (charityPhone.indexOf('-') !== -1){
  //     charityPhone.replace('-', '');
  //   }
  // }

  attached(){
    this.createNewCharity();
  }
}
