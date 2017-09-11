import {inject} from 'aurelia-framework';
import {App} from '../app';
import {json} from 'aurelia-fetch-client';
import { ValidationControllerFactory, ValidationRules, Validator, validateTrigger } from 'aurelia-validation';
import {FormValidator} from '../classes/FormValidator';
const Inputmask = require('inputmask');
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
    this.newAddress = false;
    this.charity = {};
    this.voOpp = {};
    this.showVolunteers = false;
  }
  //
  async activate(){
    this.canSubmit2 = false;
    this.showVolunteers = false;
    this.uid = this.app.auth.getTokenPayload().sub;
    this.user = await this.app.appState.getUser(this.uid);
    //console.log(this.app.router.currentInstruction.params.childRoute);
    let currentUrl = (window.location.href);
    //console.log(currentUrl);
    this.charityID = currentUrl.substring(currentUrl.indexOf('vol-ops/') + 8);
    //console.log(this.charityID);
    let res = await this.app.httpClient.fetch('/volopp/' + this.charityID);
    this.events = await res.json();
    //console.log('this.events');
    //console.log(this.events);
    // let res2 = await this.app.httpClient.fetch('/charity/find/' + this.charityID);
    // this.charity = await res2.json();
    // this.voOpp
    //console.log(this.charity);
    if (this.events.length > 0){
      this.fixDates();
      this.buildWorkPrefs();
      this.buildTalents();
      this.checkScheduled();
      this.markPast();
      //this.charityName = this.events[0].voCharityName;
    }
    //else {
    this.findCharity();
    //}
    this.talents = ['music', 'athletics', 'childcare', 'mechanics', 'construction', 'computers', 'communication', 'chess playing', 'listening'];
    this.works = ['hashbrown slinging', 'nail hammering', 'leaf removal', 'floor mopping', 'counseling', 'visitation'];
    this.talents.sort();
    this.talents.push('other');
    this.works.sort();
    this.works.push('other');
    this.today = new Date().toISOString().split('T')[0];
    this.minEndDate = this.today;
    this.maxStartDate = '';
    //console.log('today is ' + this.today);
    this.states = [ 'Alabama', 'Alaska', 'American Samoa', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'District of Columbia',
      'Federated States of Micronesia', 'Florida', 'Georgia', 'Guam', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine',
      'Marshall Islands', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
      'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Northern Mariana Islands', 'Ohio', 'Oklahoma', 'Oregon', 'Palau', 'Pennsylvania', 'Puerto Rico',
      'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virgin Island', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
    this.states.sort();
  }

  async checkScheduled(){
    //loop through each evnt
    // get signups by event id
    // if length > 0, add number of volunteers to the event. number of people signed up
    // number needed - number signed up = the number still needed
    let resp;
    let scheduledEvents;
    let total = 0;
    let signupUserIds = [];
    for (let i = 0; i < this.events.length; i++){
      resp = await this.app.httpClient.fetch('/signup/event/' + this.events[i]._id);
      scheduledEvents = await resp.json();
      //console.log('these are the schedule events for this event id');
      //console.log(scheduledEvents);
      for (let hasVolunteers of scheduledEvents){
        total = total + hasVolunteers.numPeople;
        signupUserIds.push(hasVolunteers.userId);
      }
      // if (total > 0){
      //   this.events[i].voNumPeopleScheduled = '<a click.delegate="viewPeople(event)">' + total + '</a>';
      // } else {
      this.events[i].voNumPeopleScheduled = total;
      this.events[i].voSignupUserIds = signupUserIds;
      // }
      total = 0;
      signupUserIds = [];
    }
  }

  async viewPeople(thisevent){
    this.showVolunteers = true;
    console.log(thisevent);
    let res;
    let person;
//     const userSchema = new Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   userPhone: { type: Number, required: false },
//   userType: { type: String, required: false },
//   userCity: { type: String, required: false },
//   userZip: { type: String, required: false },
//   userDetails:{ type: String, required: false },
//   volTravelDistMiles: { type: Number, required: false },
//   volCauses: { type: [String], required: false },
//   volTalents: { type: [String], required: false },
//   volWorkPrefs: { type: [String], required: false },
//   volCauseOther:{ type: String, required: false },
//   volTalentOther:{ type: String, required: false },
//   volWorkOther:{ type: String, required: false }
// });
    this.allPeople = [];
    for (let i = 0; i < thisevent.voSignupUserIds.length; i++){
      res = await this.app.httpClient.fetch('/user/' + thisevent.voSignupUserIds[i]);
      person = await res.json();
      this.allPeople.push(person);
    }
    console.log(this.allPeople);
    this.eventTitle = thisevent.voName;
    let display = document.getElementById('showvolunteers');
    if (display !== null){
      display.scrollIntoView();
    }
  }

  markPast() {
    let testDate;
    let today = new Date();
    let mm = today.getMonth() + 1; // getMonth() is zero-based
    let dd = today.getDate();
    today = [today.getFullYear(),
      (mm > 9 ? '' : '0') + mm,
      (dd > 9 ? '' : '0') + dd].join('');
    console.log(today);
    for (let i = 0; i < this.events.length; i++){
        //console.log(this.events[i].voStartDate);

      if (this.events[i].voStartDate === undefined || this.events[i].voStartDate === null || this.events[i].voStartDate === ''){
        console.log('undefined date');
        this.events[i].voStartDate = today;
      }
      testDate = this.events[i].voStartDate.replace('-', '');
      testDate = testDate.replace('-', '');
      console.log(testDate);
      if (testDate < today){
        console.log('this date is past');
        console.log(this.events[i].voStartDate);
        this.events[i].past = true;
      }
        //console.log()
    }
  }

  showTime(){
    console.log('show time picker here');
  }

  selectDate(dtype){
    //console.log('show date picker here');
    if (dtype === 'start-date'){
      //console.log(dtype);
      //console.log(this.voOpp.voStartDate);
      this.minEndDate = this.voOpp.voStartDate;
    } else {
      //console.log(dtype);
      //console.log(this.voOpp.voEndDate);
      this.maxStartDate = this.voOpp.voEndDate;
    }
    //   this.dialog.time = new moment();
    //   this.dialog.toggle();
  }

  async findCharity(){
    let res2 = await this.app.httpClient.fetch('/charity/find/' + this.charityID);
    this.charity = await res2.json();
    console.log('foundCharity');
    console.log(this.charity);
    //this.charityName = foundCharity.charityName;
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
    // console.log('the charity types attached to this event');
    // console.log(this.voOpp.voCharityTypes);
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
      checkboxes.style.display = 'block';
      this.expanded = true;
    } else {
      checkboxes.style.display = 'none';
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
    this.voOpp.voStatus = 'new';
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
    this.canSubmit2 = true;
    document.getElementById('topSection').style.display = 'none';
    this.voOpp = thisEvent;
    this.talentPicked();
    this.workPicked();
    this.setupValidation2();
    this.controller2.errors = [];
    this.validate2();
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
    // this.voOpp.voCharityTypes = this.charity.charityTypes;
    // console.log('this.charity.charityTypes');
    // console.log(this.charity.charityTypes.length);
    this.newEvent = true;
    //this.canSubmit2 = false;
    let topSection = document.getElementById('topSection');
    topSection.style.display = 'block';
    topSection.scrollIntoView();
    //this.activate();
    this.setupValidation2();
    this.controller2.errors = [];
    let startTimeInput = document.getElementById('s-time');
    let endTimeInput = document.getElementById('e-time');
    // console.log('the start time input is ');
    // console.log(startTimeInput);
    let imst = new Inputmask('99:99 am');
    imst.mask(startTimeInput);
    imst.mask(endTimeInput);
    //document.getElementById('eventHeader').scrollIntoView();
  }

  cancelEvent(theEvent){
    this.voOpp = theEvent;
    this.updateEvent('cancel');
    if (this.voOpp.voDescription !== undefined){
      this.voOpp.voDescription = this.voOpp.voDescription.replace('<p style="background-color:green"><strong>The Charity Has Reactivated This Event</strong></p>', '');
    // this.voOpp.voDescription = this.voOpp.voDescription.replace('<p style="background-color:green"><strong>The Charity Has Reactivated This Event</strong></p>', '');
    // this.voOpp.voDescription = this.voOpp.voDescription.replace('<p style="background-color:green"><strong>The Charity Has Reactivated This Event</strong></p>', '');
      this.voOpp.voDescription = '<p style="background-color:red"><strong>The Charity Has Cancelled This Event</strong></p>' + this.voOpp.voDescription;
    //console.log(this.voOpp.voDescription);
    }
  }

  reactivateEvent(theEvent){
    this.voOpp = theEvent;
    //this.voOpp.voDescription = this.voOpp.voDescription.replace('<p style="background-color:red"><strong>The Charity Has Cancelled This Event</strong></p>', '');
    if (this.voOpp.voDescription !== undefined){
      this.voOpp.voDescription = this.voOpp.voDescription.replace('<p style="background-color:red"><strong>The Charity Has Cancelled This Event</strong></p>', '<p style="background-color:green"><strong>The Charity Has Reactivated This Event</strong></p>');
    }
    this.updateEvent('update');
  }

  async updateEvent(updateType){
    console.log('update Event');
    //console.log('this is the update charity');
    this.voOpp.voStatus = updateType;
    if (updateType === 'update'){
      //this.voOpp.voDescription = this.voOpp.voDescription.replace('<p style="background-color:yellow"><strong>The Charity Has Updated Details About This Event</strong></p>', '');
      this.voOpp.voDescription = '<p style="background-color:yellow"><strong>The Charity Has Updated Details About This Event</strong></p>' + this.voOpp.voDescription;
    }
    //console.log(this.voOpp);
    await fetch;
    this.app.httpClient.fetch('/volopp/' + this.voOpp._id, {
      method: 'put',
      body: json(this.voOpp)
    })
    .then((response) => response.json())
    .then((data) => {
      this.activate();
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
      this.activate();
    });
  }

  updateCanSubmit2(validationResults) {
    let valid = true;
    console.log('Running updateCanSubmit2');
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

  attached(){
    this.showNewEvent();
  }

}
