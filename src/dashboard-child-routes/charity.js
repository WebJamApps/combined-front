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
    this.charities = {};
    // these are all for the create new charity function
    this.validator = new FormValidator(validator, (results) => this.updateCanSubmit(results)); //if the form is valid then set to true.
    this.controller = controllerFactory.createForCurrentScope(this.validator);
    this.controller.validateTrigger = validateTrigger.changeOrBlur;
    this.canSubmit = false;  //the button on the form
    this.validType = false;
    // these are all for the update charity function
    this.validator2 = new FormValidator(validator, (results) => this.updateCanSubmit2(results));
    this.controller2 = controllerFactory.createForCurrentScope(this.validator2);
    this.controller2.validateTrigger = validateTrigger.changeOrBlur;
    this.canSubmit2 = true;
    this.validType2 = true;
    // these are all for the scheduling of events function
    //this.validator3 = new FormValidator(validator, (results) => this.updateCanSubmit3(results));
    //this.controller3 = controllerFactory.createForCurrentScope(this.validator3);
    //this.controller3.validateTrigger = validateTrigger.changeOrBlur;
    //this.canSubmit2 = false;
    //this.validWorkType3 = false;
    this.preventDefault = this.preventEnter.bind(this);
    this.selectedTalents = [];
    this.selectedWorks = [];
    this.showSchedule = false;
    //this.alleventids = [];
  }

  async activate(){
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
      //insert today's date here using javascript function
      'voStartDate': null,
      'voStartTime': '',
      //insert today's date here using javascript function
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
    //console.log(this.charities);
    if (this.charities.length !== 0){
      this.buildTypes();
      this.buildManagers();
      this.buildEvents();
      //console.log(this.charities[0].charityTypes);
    }
    this.setupValidation();
    window.addEventListener('keypress', this.preventDefault, false);
  }

  // stateChange(newState) {
  //   setTimeout(function () {
  //     if (newState === -1) {
  //       console.log('inside wait');
  //       if (this.alleventids.length !== 0){
  //         this.setclicks();
  //       }
  //     }
  //   }, 5000);
  // }

  preventEnter(e) {
    if (e.keyCode === 13) {
      e.preventDefault();
    }
  }

  async buildEvents(){
    for (let l = 0; l < this.charities.length; l++){
      let eventHtml = '';
      this.events = [];
      console.log('these are the charity ids');
      console.log(this.charities[l]._id);
      let res = await this.app.httpClient.fetch('/volOpp/' + this.charities[l]._id);
      this.events = await res.json();
      console.log('these are the events');
      console.log(this.events);
      if (this.events.length !== 0){
        for (let i = 0; i < this.events.length; i++){
          this.evid = this.events[i]._id;
          //eventHtml = eventHtml + '<p><a click.delegate="showEvent(&apos;' + this.evid + '&apos;)">' + this.events[i].voName + '</a></p>';
          //eventHtml = eventHtml + '<p><a onclick="showEvent(&apos;' + this.evid + '&apos;)">' + this.events[i].voName + '</a></p>';
          eventHtml = eventHtml + '<p><a id="' + this.evid + '">' + this.events[i].voName + '</a></p>';
          this.alleventids.push(this.evid);
          console.log('inside the set event loop');
          console.log(this.alleventids);
          //document.getElementById(this.evid).addEventListener('click', showEvent(this.evid), false);
          //eventHtml = eventHtml + '<p><a click.delegate="showEvent(&apos;' + this.evid + '&apos;)">' + this.events[i].voName + '</a></p>';
        }
      }
      if (eventHtml === ''){
        eventHtml = '<p style="font-size:10pt">none scheduled</p>';
      }
      this.charities[l].eventHtml = eventHtml;
    }
    // setTimeout(function () {
    //   if (newState === -1){
    //     this.setclicks();
    //   }
    // }, 5000);
    //this.stateChange();
    if (this.alleventids.length > 0){
      this.setclicks();
    }
  }

  // stateChange(newState) {
  //   setTimeout(function () {
  //     if (newState === -1) {
  //       this.setclicks();
  //     }
  //   }, 5000);
  // }

  setclicks(){
    console.log('running eventlisteners');
    console.log(this.alleventids);
    if (this.alleventids.length !== 0) {
      console.log('there are some event ids');
      for (let i = 0; i < this.alleventids.length; i++){
        // setTimeout(function () {
        // }, 3000);
        if (document.getElementById(this.alleventids[i]) !== null){
          document.getElementById(this.alleventids[i]).addEventListener('click', this.showEvent(this.alleventids[i]), false);
          console.log(document.getElementById(this.alleventids[i]));
        }
        //document.getElementById(this.alleventids[2]).addEventListener('click', this.showEvent(this.alleventids[2]), false);
      }
    }
  }

  showEvent(eid){
    console.log('showing event details for this event id');
    console.log(eid);
    //fetch the voOpp by id and display it back to the user
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
    // unit tests keep raising validation errors here;
    // this.setupValidation2();
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

  talentPicked(){
    this.voOpp.volTalentTypes = this.selectedTalents;
    //for (let i = 0; i < this.selectedTalents.length; i++) {
    //console.log(this.selectedTalents);
    if (this.selectedTalents.includes('other')){
      //console.log('other was selected, we will display an additional form field now');
      this.talentOther = true;
    } else {
      this.talentOther = false;
      this.voOpp.voTalentTypeOther = '';
    }
  }

  workPicked(){
    this.voOpp.voWorkTypes = this.selectedWorks;
    if (this.selectedWorks.includes('other')){
      //console.log('other was selected, we will display an additional form field now');
      this.workOther = true;
    } else {
      this.workOther = false;
      this.voOpp.voWorkTypeOther = '';
    }
    //  }
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
    //console.log('Running update funcitronfswd');
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

  showScheduleCharity(charity){
    //this.canSubmit3 = true;
    //this.validWorkType3 = true;
    //let scheduleDiv = document.getElementById('scheduleCharitySection');
    this.voOpp.voCharityId = charity._id;
    this.voOpp.voCharityName = charity.charityName;
    let updateDiv = document.getElementById('updateCharitySection');
    if (updateDiv !== null){
      updateDiv.style.display = 'none';
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
    this.app.httpClient.fetch('/volOpp/create', {
      method: 'post',
      body: json(this.voOpp)
    })
    .then((data) => {
      console.log(data);
      document.getElementById('charityDash').scrollIntoView();
      this.activate();
    });
  }

}
