import {inject} from 'aurelia-framework';
import {App} from '../app';
import {json} from 'aurelia-fetch-client';
import { ValidationControllerFactory, ValidationRules, Validator, validateTrigger } from 'aurelia-validation';
import {FormValidator} from '../classes/FormValidator';
// const MdDateTimePicker = require('md-date-time-picker');
// const moment = require('moment');
@inject(App, ValidationControllerFactory, Validator)
//@inject(App)
export class VolunteerOpps {
  controller = null;
  validator = null;
  constructor(app, controllerFactory, validator){
  //constructor(app){
    this.app = app;
    this.selectedTalents = [];
    this.selectedWorks = [];
    this.newEvent = true;
    this.validator2 = new FormValidator(validator, (results) => this.updateCanSubmit2(results));
    this.controller2 = controllerFactory.createForCurrentScope(this.validator2);
    this.controller2.validateTrigger = validateTrigger.changeOrBlur;
    this.canSubmit2 = false;
    //this.validType2 = false;
  }
  //
  async activate(){
    this.uid = this.app.auth.getTokenPayload().sub;
    this.user = await this.app.appState.getUser(this.uid);
    //console.log(this.app.router.currentInstruction.params.childRoute);
    let currentUrl = (window.location.href);
    console.log(currentUrl);
    this.charityID = currentUrl.substring(currentUrl.indexOf('vol-ops/') + 8);
    console.log(this.charityID);
    let res = await this.app.httpClient.fetch('/volopp/' + this.charityID);
    this.events = await res.json();
    console.log('this.events');
    console.log(this.events);
    if (this.events.length > 0){
      this.fixDates();
      this.buildWorkPrefs();
      this.buildTalents();
      this.charityName = this.events[0].voCharityName;
    } else {
      this.findCharityName();
    }
    this.voOpp = {
      'voName': '',
      'voCharityId': this.charityID,
      'voCharityName': this.charityName,
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
      'voContactName': this.user.name,
      'voContactEmail': this.user.email,
      'voContactPhone': this.user.userPhone
    };
    this.talents = ['music', 'athletics', 'childcare', 'mechanics', 'construction', 'computers', 'communication', 'chess playing', 'listening'];
    this.works = ['hashbrown slinging', 'nail hammering', 'leaf removal', 'floor mopping', 'counseling', 'visitation'];
    this.talents.sort();
    this.talents.push('other');
    this.works.sort();
    this.works.push('other');
    // this.dialog = new MdDateTimePicker.default({type: 'time'}, {init: new moment()});
    // console.log(this.dialog);
    this.setupValidation2();
  }

  showTime(){
    console.log('show time picker here');
  //   this.dialog.time = new moment();
  //   this.dialog.toggle();
  }

  async findCharityName(){
    let res2 = await this.app.httpClient.fetch('/charity/find/' + this.charityID);
    let foundCharity = await res2.json();
    console.log('foundCharity');
    console.log(foundCharity);
    this.charityName = foundCharity.charityName;
  }

  fixDates(){
    for (let i = 0; i < this.events.length; i++){
      let startDate = this.events[i].voStartDate;
      let endDate = this.events[i].voEndDate;
      if (startDate !== null){
        if (startDate.indexOf('T') !== -1){
          this.events[i].voStartDate = startDate.substr(0, startDate.indexOf('T'));
        }
      }
      if (endDate !== null){
        if (endDate.indexOf('T') !== -1){
          this.events[i].voEndDate = endDate.substr(0, endDate.indexOf('T'));
        }
      }
    }
  }

  buildWorkPrefs(){
    for (let l = 0; l < this.events.length; l++){
      let workHtml = '';
      for (let i = 0; i < this.events[l].voWorkTypes.length; i++) {
        if (this.events[l].voWorkTypes[i] !== ''){
          if (this.events[l].voWorkTypes[i] !== 'other'){
            workHtml = workHtml + '<p style="font-size:10pt; padding-top:4px; margin-bottom:4px">' + this.events[l].voWorkTypes[i] + '</p>';
          } else {
            workHtml = workHtml + '<p style="font-size:10pt; padding-top:4px; margin-bottom:4px">' + this.events[l].voWorkTypeOther + '</p>';
          }
        }
      }
      if (workHtml === ''){
        workHtml = '<p style="font-size:10pt">not specified</p>';
      }
      this.events[l].workHtml = workHtml;
    }
  }

  buildTalents(){
    for (let l = 0; l < this.events.length; l++){
      let talentHtml = '';
      for (let i = 0; i < this.events[l].voTalentTypes.length; i++) {
        if (this.events[l].voTalentTypes[i] !== ''){
          if (this.events[l].voTalentTypes[i] !== 'other'){
            talentHtml = talentHtml + '<p style="font-size:10pt; padding-top:4px; margin-bottom:4px">' + this.events[l].voTalentTypes[i] + '</p>';
          } else {
            talentHtml = talentHtml + '<p style="font-size:10pt; padding-top:4px; margin-bottom:4px">' + this.events[l].voTalentTypeOther + '</p>';
          }
        }
      }
      if (talentHtml === ''){
        talentHtml = '<p style="font-size:10pt">not specified</p>';
      }
      this.events[l].talentHtml = talentHtml;
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
    //this.voOpp.voTalentTypes = this.selectedTalents;
    if (this.voOpp.voTalentTypes.includes('other')){
      this.talentOther = true;
    } else {
      this.talentOther = false;
      this.voOpp.voTalentTypeOther = '';
    }
    // console.log('selected talent');
    // console.log()
  }

  workPicked(){
    //this.voOpp.voWorkTypes = this.selectedWorks;
    if (this.voOpp.voWorkTypes.includes('other')){
      this.workOther = true;
    } else {
      this.workOther = false;
      this.voOpp.voWorkTypeOther = '';
    }
  }

  scheduleEvent(){
    //this.voOpp.voStartDate = document.getElementById('start-date').date;
    //this.voOpp.voStartTime = document.getElementById('start-time').time;
    //this.voOpp.voEndDate = document.getElementById('end-date').date;
    //this.voOpp.voEndTime = document.getElementById('end-time').time;
    this.voOpp.voCharityName = this.charityName;
    console.log(this.voOpp);
    //this.newCharity.charityManagers[0] = this.user.name;
    //this.newCharity.charityMngIds[0] = this.user._id;
    this.app.httpClient.fetch('/volopp/create', {
      method: 'post',
      body: json(this.voOpp)
    })
    .then((data) => {
      console.log(data);
      document.getElementById('eventHeader').scrollIntoView();
      this.activate();
    });
  }

  showUpdateEvent(thisEvent){
    this.newEvent = false;
    document.getElementById('topSection').style.display = 'none';
    this.voOpp = thisEvent;
    // let startDate = document.getElementById('start-date');
    // startDate.value = this.voOpp.voStartDate;
    // console.log(startDate);
    // console.log('this event to be updated');
    // console.log(this.voOpp);
    this.talentPicked();
    this.workPicked();
    //document.getElementById('start-date').date = this.voOpp.voStartDate;
  }

  showNewEvent(){
    this.newEvent = true;
    let topSection = document.getElementById('topSection');
    topSection.style.display = 'block';
    topSection.scrollIntoView();
    this.activate();
    //document.getElementById('eventHeader').scrollIntoView();
  }

  async updateEvent(){
    console.log('update Event');
    //console.log('this is the update charity');
    console.log(this.voOpp);
    await fetch;
    this.app.httpClient.fetch('/volopp/' + this.voOpp._id, {
      method: 'put',
      body: json(this.voOpp)
    })
    .then((response) => response.json())
    .then((data) => {
      this.showNewEvent();
    });
  }

  async deleteEvent(thisEventId){
    await fetch;
    this.app.httpClient.fetch('/volopp/' + thisEventId, {
      method: 'delete'
    })
    .then((data) => {
      console.log('your event has been deleted');
      this.showNewEvent();
    });
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
      if (this.canSubmit2){
        nub.style.display = 'block';
      }
      return this.canSubmit2;
    }
  }

  validate2() {
    return this.validator2.validateObject(this.voOpp);
  }

  setupValidation2() {
    ValidationRules
    .ensure('voContactPhone').matches(/\b[2-9]\d{9}\b/).withMessage('10 digit phone number')
    .ensure('voContactEmail').email()
    .ensure('voName').required().maxLength(40).withMessage('Name of Event please')
    .ensure('voNumPeopleNeeded').required().withMessage('How Many Volunteers please')
    .ensure('voStartTime').required()
    .ensure('voEndTime').required()
    // .ensure('voStartDate').required()
    // .ensure('voEndDate').required()
    .on(this.voOpp);
  }

  onlyPositive(){
    if (this.voOpp.voNumPeopleNeeded < 1){
      this.voOpp.voNumPeopleNeeded = 1;
    }
  }

  // setEndDate(){
  //   console.log(document.getElementById('start-date').date);
  // }

}
