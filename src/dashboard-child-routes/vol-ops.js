import {inject} from 'aurelia-framework';
import {App} from '../app';
import {json} from 'aurelia-fetch-client';
import { ValidationControllerFactory, ValidationRules, Validator, validateTrigger } from 'aurelia-validation';
import {FormValidator} from '../classes/FormValidator';
import {fixDates, formatDate, markPast} from '../commons/utils.js';
@inject(App, ValidationControllerFactory, Validator)
export class VolunteerOpps {
  controller = null;
  validator = null;
  constructor(app, controllerFactory, validator){
    //this.validationRules = ValidationRules;
    this.app = app;
    this.selectedTalents = [];
    this.selectedWorks = [];
    this.newEvent = true;
    //this.utils = utils;
    this.validator2 = new FormValidator(validator, (results) => this.updateCanSubmit2(results));
    this.controller2 = controllerFactory.createForCurrentScope(this.validator2);
    this.controller2.validateTrigger = validateTrigger.changeOrBlur;
    this.canSubmit2 = false;
    this.newAddress = false;
    this.charity = {};
    this.voOpp = {};
    this.showVolunteers = false;
    this.events = [];
  }
  async activate(){
    this.counter = 1;
    this.canSubmit2 = false;
    this.showVolunteers = false;
    this.uid = this.app.auth.getTokenPayload().sub;
    this.user = await this.app.appState.getUser(this.uid);
    this.app.role = this.user.userType;
    let currentUrl = (window.location.href);
    this.charityID = currentUrl.substring(currentUrl.indexOf('vol-ops/') + 8);
    let res = await this.app.httpClient.fetch('/volopp/' + this.charityID);
    this.events = await res.json();
    await this.makeDataTable();
  }

  makeDataTable(){
    if (this.events.length > 0){
      this.events = fixDates(this.events);
      //this.buildWorkPrefs();
      this.app.buildPTag(this.events, 'voWorkTypes', 'voWorkTypeOther ', 'workHtml');
      this.app.buildPTag(this.events, 'voTalentTypes', 'voTalentTypeOther', 'talentHtml');
      //this.buildTalents();
      this.checkScheduled();
      markPast(this.events, formatDate);
    }
    this.findCharity();
    this.talents = ['music', 'athletics', 'childcare', 'mechanics', 'construction', 'computers', 'communication', 'chess playing', 'listening'];
    this.works = ['hashbrown slinging', 'nail hammering', 'leaf removal', 'floor mopping', 'counseling', 'visitation'];
    this.talents.sort();
    this.talents.push('other');
    this.works.sort();
    this.works.push('other');
    this.today = new Date().toISOString().split('T')[0];
    this.minEndDate = this.today;
    this.maxStartDate = '';
  }

  async checkScheduled(){
    for (let i = 0; i < this.events.length; i++){
      this.events[i].voNumPeopleScheduled = 0;
      if (this.events[i].voPeopleScheduled !== null && this.events[i].voPeopleScheduled !== undefined){
        for (let j = 0; j < this.events[i].voPeopleScheduled.length; j++){
          try {
            await this.app.httpClient.fetch('/user/' + this.events[i].voPeopleScheduled[j]);
          } catch (err) {
            //user does not exist, remove it from voPeopleScheduled and update this event, then run make data makeDataTable
            console.log('user does not exist');
            this.events[i].voPeopleScheduled = this.events[i].voPeopleScheduled.filter((e) => e !== this.events[i].voPeopleScheduled[j]);
            await this.app.updateById('/volopp/', this.events[i]._id, this.events[i]);
            return this.makeDataTable();
          }
        }
        this.events[i].voNumPeopleScheduled = this.events[i].voPeopleScheduled.length;
      }
    }
  }

  async viewPeople(thisevent){
    this.showVolunteers = true;
    let res;
    let person;
    this.allPeople = [];
    for (let i = 0; i < thisevent.voPeopleScheduled.length; i++){
      res = await this.app.httpClient.fetch('/user/' + thisevent.voPeopleScheduled[i]);
      //if (res !== null && res !== undefined && res !== ''){
      person = await res.json();
      this.allPeople.push(person);
      //res = '';
      // }
    }
    this.eventTitle = thisevent.voName;
    let display = document.getElementById('showvolunteers');
    // if (display !== null){
    display.scrollIntoView();
    // }
  }

  selectDate(dtype){
    if (dtype === 'start-date'){
      this.minEndDate = this.voOpp.voStartDate;
    } else {
      this.maxStartDate = this.voOpp.voEndDate;
    }
  }

  async findCharity(){
    let res2 = await this.app.httpClient.fetch('/charity/find/' + this.charityID);
    this.charity = await res2.json();
    this.voOpp.voCharityName = this.charity.charityName;
    this.voOpp.voStreet = this.charity.charityStreet;
    this.voOpp.voCity = this.charity.charityCity;
    this.voOpp.voState = this.charity.charityState;
    this.voOpp.voZipCode = this.charity.charityZipCode;
    this.voOpp.voCharityTypes = this.charity.charityTypes;
    /* istanbul ignore else */
    if (this.charity.charityTypeOther !== ''){
      let index = this.voOpp.voCharityTypes.indexOf('other');
      /* istanbul ignore else */
      if (index > -1) {
        this.voOpp.voCharityTypes.splice(index, 1);
      }
      this.voOpp.voCharityTypes.push(this.charity.charityTypeOther);
    }
  }

  scheduleEvent(){
    console.log(this.voOpp);
    this.voOpp.voStatus = 'new';
    this.app.httpClient.fetch('/volopp/create', {
      method: 'post',
      body: json(this.voOpp)
    })
    .then((data) => {
      this.voOpp = {};
      document.getElementById('eventHeader').scrollIntoView();
      this.activate();
    });
  }

  showUpdateEvent(thisEvent, type){
    if (type === 'update'){
      this.newEvent = false;
      this.canSubmit2 = false;
      document.getElementById('topSection').style.display = 'none';
      this.voOpp = thisEvent;
    }
    this.app.selectPickedChange(this.voOpp, this, 'voTalentTypes', 'voTalentTypeOther', 'talentOther');
    this.app.selectPickedChange(this.voOpp, this, 'voWorkTypes', 'voWorkTypeOther', 'workOther');
    //this.updateCanSubmit2([{result: {valid: false}}]);
    let nub = document.getElementById('updateScheduleEvent');
    if (nub !== null){
      nub.style.display = 'none';
    }
    this.setupValidation2();
    this.controller2.validate();
  }

  showNewEvent(){
    this.voOpp = {
      'voName': '',
      'voCharityId': this.charityID,
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
    this.voOpp.voCharityName = this.charity.charityName;
    this.voOpp.voStreet = this.charity.charityStreet;
    this.voOpp.voCity = this.charity.charityCity;
    this.voOpp.voState = this.charity.charityState;
    this.voOpp.voZipCode = this.charity.charityZipCode;
    this.newEvent = true;
    let topSection = document.getElementById('topSection');
    topSection.style.display = 'block';
    topSection.scrollIntoView();
    this.showUpdateEvent(null, 'new');
  }

  cancelEvent(theEvent){
    this.voOpp = theEvent;
    this.updateEvent('cancel');
    if (this.voOpp.voDescription !== undefined){
      this.voOpp.voDescription = this.voOpp.voDescription.replace('<p style="background-color:green"><strong>The Charity Has Reactivated This Event</strong></p>', '');
      this.voOpp.voDescription = this.voOpp.voDescription.replace('<p style="background-color:yellow"><strong>The Charity Has Updated Details About This Event</strong></p>', '');
      this.voOpp.voDescription = '<p style="background-color:red"><strong>The Charity Has Cancelled This Event</strong></p>' + this.voOpp.voDescription;
    }
  }

  reactivateEvent(theEvent){
    this.voOpp = theEvent;
    if (this.voOpp.voDescription !== undefined){
      this.voOpp.voDescription = this.voOpp.voDescription.replace('<p style="background-color:yellow"><strong>The Charity Has Updated Details About This Event</strong></p>', '');
      this.voOpp.voDescription = this.voOpp.voDescription.replace('<p style="background-color:red"><strong>The Charity Has Cancelled This Event</strong></p>', '<p style="background-color:green"><strong>The Charity Has Reactivated This Event</strong></p>');
    }
    this.updateEvent('reactivate');
  }

  async updateEvent(updateType){
    this.voOpp.voStatus = updateType;
    if (updateType === 'update'){
      this.voOpp.voDescription = this.voOpp.voDescription.replace('<p style="background-color:yellow"><strong>The Charity Has Updated Details About This Event</strong></p>', '');
      this.voOpp.voDescription = this.voOpp.voDescription.replace('<p style="background-color:yellow"><strong>The Charity Has Updated Details About This Event</strong></p>', '');
      this.voOpp.voDescription = this.voOpp.voDescription.replace('<p style="background-color:green"><strong>The Charity Has Reactivated This Event</strong></p>', '');
      this.voOpp.voDescription = '<p style="background-color:yellow"><strong>The Charity Has Updated Details About This Event</strong></p>' + this.voOpp.voDescription;
    }
    await this.app.updateById('/volopp/', this.voOpp._id, this.voOpp);
    this.activate();
  }

  async deleteEvent(thisEventId){
    await fetch;
    this.app.httpClient.fetch('/volopp/' + thisEventId, {
      method: 'delete'
    })
    .then((data) => {
      //console.log('your event has been deleted');
      this.activate();
    });
  }

  updateCanSubmit2(validationResults) {
    let valid = true;
    //console.log('Running updateCanSubmit2');
    let nub = document.getElementsByClassName('updateButton')[0];
    if (nub !== undefined){
      nub.style.display = 'none';
    }
    // let updateButton = document.getElementById('updateScheduleEvent');
    // if (createButton !== null){
    //   createButton.style.display = 'none';
    // }
    // if (updateButton !== null){
    //   updateButton.style.display = 'none';
    // }
    /* istanbul ignore else */
    if (nub) {
      for (let result of validationResults) {
        if (result.valid === false){
          //nub.style.display = 'none';
          valid = false;
          break;
        }
      }
      this.canSubmit2 = valid;
      if (this.canSubmit2){
        // if (this.newEvent === false && updateButton !== null){
        //   updateButton.style.display = 'block';
        // } else {
        //   createButton.style.display = 'block';
        if (this.counter !== 1 || !this.updateEvent){
          nub.style.display = 'block';
        }
        this.counter ++;
      }
      return this.canSubmit2;
    }
  }

  validate2() {
    return this.validator2.validateObject(this.voOpp);
  }
  /* istanbul ignore next */
  setupValidation2() {
    ValidationRules
    .ensure('voContactPhone').matches(/\b[2-9]\d{9}\b/).withMessage('10 digits only')
    .ensure('voContactEmail').email()
    .ensure('voName').required().withMessage('Event Name is required').maxLength(40).withMessage('Name of Event please')
    .ensure('voNumPeopleNeeded').required().withMessage('How Many Volunteers please')
    .ensure('voStartTime').required().withMessage('Event Start time is required')
    .ensure('voEndTime').required().withMessage('Event End time is required')
    .ensure('voStartDate').required().withMessage('Event Start Date is required')
    .ensure('voEndDate').required().withMessage('Event End Date is required')
    .ensure('voZipCode').required().matches(/\b\d{5}\b/).withMessage('5-digit zipcode')
    .ensure('voCity').required().matches(/[^0-9]+/).maxLength(30).withMessage('City name please')
    .ensure('voStreet').required().maxLength(40).withMessage('Charity street address please')
    .ensure('voState').required().withMessage('Charity state please')
    .on(this.voOpp);
  }

  onlyPositive(){
    if (this.voOpp.voNumPeopleNeeded < 1){
      this.voOpp.voNumPeopleNeeded = 1;
    }
  }

  selectPickChange(type){
    this.selectedTalents = this.voOpp.voTalentTypes;
    this.selectedWorks = this.voOpp.voWorkTypes;
    if (type === 'work'){
      this.app.selectPickedChange(this.user, this, 'selectedWorks', 'volWorkOther', 'workOther', true, 'volWorkPrefs');
    }
    if (type === 'talents'){
      this.app.selectPickedChange(this.user, this, 'selectedTalents', 'volTalentOther', 'talentOther', true, 'volTalents');
    }
  }

  attached(){
    this.showNewEvent();
    this.setupValidation2();
  }

}
