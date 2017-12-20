import {inject} from 'aurelia-framework';
import {App} from '../app';
import {json} from 'aurelia-fetch-client';
import { ValidationControllerFactory, ValidationRules, Validator, validateTrigger } from 'aurelia-validation';
import {FormValidator} from '../classes/FormValidator';
import {fixDates} from '../commons/utils.js';
const Inputmask = require('inputmask');
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
    this.canSubmit2 = false;
    this.showVolunteers = false;
    this.uid = this.app.auth.getTokenPayload().sub;
    this.user = await this.app.appState.getUser(this.uid);
    this.app.role = this.user.userType;
    let currentUrl = (window.location.href);
    this.charityID = currentUrl.substring(currentUrl.indexOf('vol-ops/') + 8);
    let res = await this.app.httpClient.fetch('/volopp/' + this.charityID);
    this.events = await res.json();
    let res2 = await this.app.httpClient.fetch('/signup/getall');
    this.signups = await res2.json();
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
      this.markPast();
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

  async fixUserSignups(){
    let allSignups = [];
    let res = await this.app.httpClient.fetch('/signup/getall');
    allSignups = await res.json();
    for (let i = 0; i < allSignups.length; i++){
      try {
        await this.app.httpClient.fetch('/user/' + allSignups[i].userId);
      } catch (err) {
        await this.removeSignup(allSignups[i].userId);
      }
    }
  }

  async removeSignup(userid){
    await fetch;
    this.app.httpClient.fetch('/signup/remove/' + userid, {
      method: 'delete'
    })
    .then((data) => {
      //console.log('removed signup attached to a nonexisting user');
    });
  }

  async checkScheduled(){
    let total = 0;
    let signupUserIds = [];
    for (let i = 0; i < this.events.length; i++){
      for (let e = 0; e < this.signups.length; e++){
        /* istanbul ignore else */
        if (this.events[i]._id === this.signups[e].voloppId){
          total = total + this.signups[e].numPeople;
          signupUserIds.push(this.signups[e].userId);
        }
      }
      this.events[i].voNumPeopleScheduled = total;
      this.events[i].voSignupUserIds = signupUserIds;
      total = 0;
      signupUserIds = [];
    }
  }

  async viewPeople(thisevent){
    this.showVolunteers = true;
    let res;
    let person;
    this.allPeople = [];
    for (let i = 0; i < thisevent.voSignupUserIds.length; i++){
      try {
        res = await this.app.httpClient.fetch('/user/' + thisevent.voSignupUserIds[i]);
      } catch (err) {
        //console.log('the user does not exist');
        await this.fixUserSignups();
      }
      /* istanbul ignore else */
      if (res !== undefined && res !== ''){
        person = await res.json();
        this.allPeople.push(person);
        res = '';
      }
    }
    this.eventTitle = thisevent.voName;
    let display = document.getElementById('showvolunteers');
    /* istanbul ignore else */
    if (display !== null){
      display.scrollIntoView();
    }
  }

  markPast() {
    let testDate;
    let today = new Date();
    let mm = today.getMonth() + 1; // getMonth() is zero-based
    let dd = today.getDate();
    /* istanbul ignore next */
    today = [today.getFullYear(), (mm > 9 ? '' : '0') + mm, (dd > 9 ? '' : '0') + dd].join('');
    for (let i = 0; i < this.events.length; i++){
      if (this.events[i].voStartDate === undefined || this.events[i].voStartDate === null || this.events[i].voStartDate === ''){
        //console.log('undefined date');
        this.events[i].voStartDate = today;
      }
      testDate = this.events[i].voStartDate.replace('-', '');
      testDate = testDate.replace('-', '');
      if (testDate < today){
        this.events[i].past = true;
      }
    }
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
    this.voOpp.voStatus = 'new';
    //console.log(this.voOpp);
    this.app.httpClient.fetch('/volopp/create', {
      method: 'post',
      body: json(this.voOpp)
    })
    .then((data) => {
      //console.log(data);
      document.getElementById('eventHeader').scrollIntoView();
      this.activate();
    });
  }

  showUpdateEvent(thisEvent, type){
    if (type === 'update'){
      this.newEvent = false;
      this.canSubmit2 = true;
      document.getElementById('topSection').style.display = 'none';
      this.voOpp = thisEvent;
    }
    this.app.selectPickedChange(this.voOpp, this, 'voTalentTypes', 'voTalentTypeOther', 'talentOther');
    this.app.selectPickedChange(this.voOpp, this, 'voWorkTypes', 'voWorkTypeOther', 'workOther');
    //this.setupValidation2();
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
    let startTimeInput = document.getElementById('s-time');
    let endTimeInput = document.getElementById('e-time');
    let imst = new Inputmask('99:99 am');
    imst.mask(startTimeInput);
    imst.mask(endTimeInput);
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
    //console.log('update Event');
    this.voOpp.voStatus = updateType;
    if (updateType === 'update'){
      this.voOpp.voDescription = this.voOpp.voDescription.replace('<p style="background-color:yellow"><strong>The Charity Has Updated Details About This Event</strong></p>', '');
      this.voOpp.voDescription = this.voOpp.voDescription.replace('<p style="background-color:yellow"><strong>The Charity Has Updated Details About This Event</strong></p>', '');
      this.voOpp.voDescription = this.voOpp.voDescription.replace('<p style="background-color:green"><strong>The Charity Has Reactivated This Event</strong></p>', '');
      this.voOpp.voDescription = '<p style="background-color:yellow"><strong>The Charity Has Updated Details About This Event</strong></p>' + this.voOpp.voDescription;
    }
    await fetch;
    this.app.httpClient.fetch('/volopp/' + this.voOpp._id, {
      method: 'put',
      body: json(this.voOpp)
    })
    .then((response) => response.json())
    .then((data) => {
      this.activate();
    });
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
    /* istanbul ignore else */
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
/* istanbul ignore next */
  setupValidation2() {
    ValidationRules
    .ensure('voContactPhone').matches(/\b[2-9]\d{9}\b/).withMessage('10 digits only')
    .ensure('voContactEmail').email()
    .ensure('voName').required().maxLength(40).withMessage('Name of Event please')
    .ensure('voNumPeopleNeeded').required().withMessage('How Many Volunteers please')
    .ensure('voStartTime').required().matches(/\b((1[0-2]|0?[1-9]):([0-5][0-9]) ([ap][m]))/)
    .ensure('voEndTime').required().matches(/\b((1[0-2]|0?[1-9]):([0-5][0-9]) ([ap][m]))/)
    .ensure('voStartDate').required()
    .ensure('voEndDate').required()
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
