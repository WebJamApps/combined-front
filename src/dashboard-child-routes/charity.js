import {inject} from 'aurelia-framework';
import {App} from '../app';
import {json} from 'aurelia-fetch-client';
import { ValidationControllerFactory, ValidationRules, Validator, validateTrigger } from 'aurelia-validation';
import {FormValidator} from '../classes/FormValidator';
import {VolOpp} from '../classes/VolOpp';
@inject(App, ValidationControllerFactory, Validator)
export class Charity {
  controller = null;
  validator = null;
  constructor(app, controllerFactory, validator){
    this.app = app;
    this.charities = [];
    this.validator2 = new FormValidator(validator, (results) => this.updateCanSubmit2(results));
    this.volopp = new VolOpp();
    this.controller2 = controllerFactory.createForCurrentScope(this.validator2);
    this.controller2.validateTrigger = validateTrigger.changeOrBlur;
    this.canSubmit2 = true;
    this.validType2 = true;
    //this.preventDefault = this.preventEnter.bind(this); //FormValidator
    this.selectedTalents = [];
    this.selectedWorks = [];
    this.showSchedule = false;
    this.updateScheduledEvent = false;
  }

  async activate(){
    this.update = false;
    this.updateScheduleEvent = false; //VolOpp
    this.alleventids = [];
    this.voOpp = {
      'voName': '',
      'voCharityId': '',
      'voCharityName': '',
      'voNumPeopleNeeded': 1,
      'voDescription': '',
      'voWorkTypes': [],
      'voTalentTypes': [],
      'voWorkTypeOther': '',
      'voTalentTypeOther': '',
      'voStartDate': null,
      'voStartTime': '',
      'voEndDate': null,
      'voEndTime': '',
      'voContactName': '',
      'voContactEmail': '',
      'voContactPhone': null
    };
    this.types = ['Christian', 'Environmental', 'Hunger', 'Animal Rights', 'Homeless', 'Veterans', 'Elderly'];
    this.types.sort();
    this.types.push('other');
    this.states = [ 'Alabama', 'Alaska', 'American Samoa', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'District of Columbia',
      'Federated States of Micronesia', 'Florida', 'Georgia', 'Guam', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine',
      'Marshall Islands', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
      'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Northern Mariana Islands', 'Ohio', 'Oklahoma', 'Oregon', 'Palau', 'Pennsylvania', 'Puerto Rico',
      'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virgin Island', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
    this.states.sort();
    this.talents = ['music', 'athletics', 'childcare', 'mechanics', 'construction', 'computers', 'communication', 'chess playing', 'listening'];
    this.works = ['hashbrown slinging', 'nail hammering', 'leaf removal', 'floor mopping', 'counseling', 'visitation'];
    this.talents.sort();
    this.talents.push('other');
    this.works.sort();
    this.works.push('other');
    this.uid = this.app.auth.getTokenPayload().sub;
    this.user = await this.app.appState.getUser(this.uid);
    const res = await this.app.httpClient.fetch('/charity/' + this.uid);
    this.charities = await res.json();
    if (this.charities.length !== 0){
      this.buildTypes();
      this.buildManagers();
      this.buildEvents();
    }
    //window.addEventListener('keypress', this.preventDefault, false);
  }

  // preventEnter(e) {
  //   if (e.keyCode === 13) {
  //     e.preventDefault();
  //   }
  // }

  async buildEvents(){
    for (let l = 0; l < this.charities.length; l++){
      let eventHtml = '';
      this.events = [];
      console.log('these are the charity ids');
      console.log(this.charities[l]._id);
      let res = await this.app.httpClient.fetch('/volopp/' + this.charities[l]._id);
      this.events = await res.json();
      eventHtml = this.events;
      this.charities[l].eventHtml = eventHtml;
    }
  }

  createNewCharity(){
    console.log('createNewCharity function populates a blank charity object and then runs the showUpdateCharity function');
    let charity = {
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
    this.update = false;
    let charitiesTable = document.getElementById('charTable');
    if (charitiesTable !== null){
      charitiesTable.style.display = 'block';
    }
    this.updateScheduledEvent = false;
    document.getElementById('createNewCharityButton').style.display = 'none';
    this.showUpdateCharity(charity);
  }

  updateCharityFunction(charity){
    this.update = true;
    this.showUpdateCharity(charity);
  }

  showUpdateCharity(charity){
    this.canSubmit2 = true;
    this.validType2 = true;
    let updateDiv = document.getElementById('updateCharitySection');
    updateDiv.style.display = 'block';
    let scheduleDiv = document.getElementById('scheduleCharitySection');
    if (scheduleDiv !== null){
      scheduleDiv.style.display = 'none';
    }
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

  talentPicked(){
    this.voOpp.volTalentTypes = this.selectedTalents;
    if (this.selectedTalents.includes('other')){
      this.talentOther = true;
    } else {
      this.talentOther = false;
      this.voOpp.voTalentTypeOther = '';
    }
  }

  workPicked(){
    this.voOpp.voWorkTypes = this.selectedWorks;
    if (this.selectedWorks.includes('other')){
      this.workOther = true;
    } else {
      this.workOther = false;
      this.voOpp.voWorkTypeOther = '';
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
    .ensure('charityPhoneNumber').matches(/\b[2-9]\d{9}\b/).withMessage('10 digit phone number')
    .ensure('charityEmail').email()
    .ensure('charityZipCode').required().matches(/\b\d{5}\b/).withMessage('5-digit zipcode')
    .ensure('charityCity').required().matches(/[^0-9]+/).maxLength(30).withMessage('City name please')
    .ensure('charityName').required().maxLength(40).withMessage('Charity name please')
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
      this.findUserByEmail();
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
      let updateDiv = document.getElementById('updateCharitySection');
      if (updateDiv !== null){
        updateDiv.style.display = 'none';
      }
      this.updateCharity = {};
      document.getElementById('charityDash').scrollIntoView();
      this.activate();
      this.createNewCharity();
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

  async showEvent(eid){
    console.log('showing event details for this event id');
    console.log(eid);
    const res = await this.app.httpClient.fetch('/volopp/get/' + eid);
    this.voOpp = await res.json();
    console.log(this.voOpp);
    const tempCharity = {
      '_id': this.voOpp.voCharityId, 'charityName': this.voOpp.voCharityName
    };
    this.updateScheduledEvent = true;
    // document.getElementById('start-date').date = this.voOpp.voStartDate;
    // document.getElementById('start-time').time = this.voOpp.voStartTime;
    // document.getElementById('end-date').date = this.voOpp.voEndDate;
    // document.getElementById('end-time').time = this.voOpp.voEndTime;
    this.showScheduleCharity(tempCharity);
    //fetch the voOpp by id and display it back to the user
  }

  showScheduleCharity(charity){
    if (this.updateScheduledEvent === false){
      this.voOpp = {
        'voName': '',
        'voCharityId': '',
        'voCharityName': '',
        'voNumPeopleNeeded': 1,
        'voDescription': '',
        'voWorkTypes': [],
        'voTalentTypes': [],
        'voWorkTypeOther': '',
        'voTalentTypeOther': '',
        'voStartDate': null,
        'voStartTime': '',
        'voEndDate': null,
        'voEndTime': '',
        'voContactName': '',
        'voContactEmail': '',
        'voContactPhone': null
      };
    }
    //this.canSubmit3 = true;
    //this.validWorkType3 = true;
    //let scheduleDiv = document.getElementById('scheduleCharitySection');
    this.voOpp.voCharityId = charity._id;
    this.voOpp.voCharityName = charity.charityName;
    let updateDiv = document.getElementById('updateCharitySection');
    if (updateDiv !== null){
      updateDiv.style.display = 'none';
    }
    let charitiesTable = document.getElementById('charTable');
    if (charitiesTable !== null){
      charitiesTable.style.display = 'none';
    }
    let scheduleDiv = document.getElementById('scheduleCharitySection');
    if (scheduleDiv !== null){
      scheduleDiv.style.display = 'block';
    }
    //scheduleDiv.style.display = 'block';
    this.showSchedule = true;
    this.charityName = charity.charityName;
    //this.scheduleCharity = charity;
    //this.setupValidation3();
    if (document.getElementById('scheduleCharitySection') !== null){
      document.getElementById('scheduleCharitySection').scrollIntoView();
    }
  }

  scheduleCharityFunct(){
    this.voOpp.voStartDate = document.getElementById('start-date').date;
    this.voOpp.voStartTime = document.getElementById('start-time').time;
    this.voOpp.voEndDate = document.getElementById('end-date').date;
    this.voOpp.voEndTime = document.getElementById('end-time').time;
    console.log(this.voOpp);
    //this.newCharity.charityManagers[0] = this.user.name;
    //this.newCharity.charityMngIds[0] = this.user._id;
    this.app.httpClient.fetch('/volopp/create', {
      method: 'post',
      body: json(this.voOpp)
    })
    .then((data) => {
      console.log(data);
      document.getElementById('charityDash').scrollIntoView();
      this.activate();
    });
  }

  attached(){
    this.createNewCharity();
  }
}
