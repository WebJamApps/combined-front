import { inject } from 'aurelia-framework';
import { json } from 'aurelia-fetch-client';
import { ValidationControllerFactory, ValidationRules, Validator, validateTrigger } from 'aurelia-validation';
import { App } from '../app';
import { FormValidator } from '../classes/FormValidator';
import { fixDates, formatDate, markPast, showCheckboxes } from '../commons/utils';

@inject(App, ValidationControllerFactory, Validator)
export class VolunteerOpps {
  controller = null;
  validator = null;

  constructor(app, controllerFactory, validator) {
    this.app = app;
    this.selectedTalents = [];
    this.selectedWorks = [];
    this.newEvent = true;
    this.showCheckboxes = showCheckboxes;
    this.validator2 = new FormValidator(validator, results => this.updateCanSubmit2(results));
    this.controller2 = controllerFactory.createForCurrentScope(this.validator2);
    this.controller2.validateTrigger = validateTrigger.changeOrBlur;
    this.canSubmit2 = false;
    this.newAddress = false;
    this.charity = {};
    this.voOpp = {};
    this.showVolunteers = false;
    this.events = [];
  }

  async activate() {
    this.counter = 1;
    this.canSubmit2 = false;
    this.showVolunteers = false;
    this.uid = this.app.auth.getTokenPayload().sub;
    this.user = await this.app.appState.getUser(this.uid);
    this.app.role = this.user.userType;
    const currentUrl = (window.location.href);
    this.charityID = currentUrl.substring(currentUrl.indexOf('vol-ops/') + 8);
    const res = await this.app.httpClient.fetch(`/volopp/${this.charityID}`);
    this.events = await res.json();
    await this.makeDataTable();
  }

  makeDataTable() {
    if (this.events.length > 0) {
      this.events = fixDates(this.events);
      this.app.buildPTag(this.events, 'voWorkTypes', 'voWorkTypeOther ', 'workHtml');
      this.app.buildPTag(this.events, 'voTalentTypes', 'voTalentTypeOther', 'talentHtml');
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

  async checkScheduled() {
    for (const i of this.events) {
      i.voNumPeopleScheduled = 0;
      for (const j of i.voPeopleScheduled) {
        try {
          this.app.httpClient.fetch(`/user/${j}`);
        } catch (err) {
          // user does not exist, remove it from voPeopleScheduled and update this event, then run make data makeDataTable
          // console.log('user does not exist');
          i.voPeopleScheduled = i.voPeopleScheduled.filter(e => e !== j);
          this.app.updateById('/volopp/', i._id, i);
          return this.makeDataTable();
        }
      }
      i.voNumPeopleScheduled = i.voPeopleScheduled.length;
    }
    return null;
  }

  async viewPeople(thisevent) {
    this.showVolunteers = true;
    let res, person;
    this.allPeople = [];
    for (let i = 0; i < thisevent.voPeopleScheduled.length; i += 1) {
      res = this.app.httpClient.fetch(`/user/${thisevent.voPeopleScheduled[i]}`);
      // console.log(res);
      person = res.json();
      this.allPeople.push(person);
    }
    this.eventTitle = thisevent.voName;
    const display = document.getElementById('showvolunteers');
    display.scrollIntoView();
  }

  selectDate(dtype) {
    if (dtype === 'start-date') {
      this.minEndDate = this.voOpp.voStartDate;
    } else {
      this.maxStartDate = this.voOpp.voEndDate;
    }
  }

  async findCharity() {
    const res2 = await this.app.httpClient.fetch(`/charity/find/${this.charityID}`);
    this.charity = await res2.json();
    this.voOpp.voCharityName = this.charity.charityName;
    this.voOpp.voStreet = this.charity.charityStreet;
    this.voOpp.voCity = this.charity.charityCity;
    this.voOpp.voState = this.charity.charityState;
    this.voOpp.voZipCode = this.charity.charityZipCode;
    this.voOpp.voCharityTypes = this.charity.charityTypes;
    /* istanbul ignore else */
    if (this.charity.charityTypeOther !== '') {
      const index = this.voOpp.voCharityTypes.indexOf('other');
      /* istanbul ignore else */
      if (index > -1) {
        this.voOpp.voCharityTypes.splice(index, 1);
      }
      this.voOpp.voCharityTypes.push(this.charity.charityTypeOther);
    }
  }

  scheduleEvent() {
    this.voOpp.voStatus = 'new';
    this.app.httpClient.fetch('/volopp/create', { method: 'post', body: json(this.voOpp) })
      .then(() => {
        this.voOpp = {};
        document.getElementById('eventHeader').scrollIntoView();
        this.activate();
      });
  }

  showUpdateEvent(thisEvent, type) {
    if (type === 'update') {
      this.newEvent = false;
      this.canSubmit2 = false;
      document.getElementById('topSection').style.display = 'none';
      this.voOpp = thisEvent;
    }
    this.app.selectPickedChange(this.voOpp, this, 'voTalentTypes', 'voTalentTypeOther', 'talentOther');
    this.app.selectPickedChange(this.voOpp, this, 'voWorkTypes', 'voWorkTypeOther', 'workOther');
    // this.updateCanSubmit2([{result: {valid: false}}]);
    const nub = document.getElementById('updateScheduleEvent');
    if (nub !== null) {
      nub.style.display = 'none';
    }
    this.setupValidation2();
    this.controller2.validate();
  }

  showNewEvent() {
    this.voOpp = {
      voName: '',
      voCharityId: this.charityID,
      voNumPeopleNeeded: 1,
      voDescription: '',
      voWorkTypes: [],
      voTalentTypes: [],
      voWorkTypeOther: '',
      voTalentTypeOther: '',
      voStartDate: null,
      voStartTime: '',
      voEndDate: null,
      voEndTime: '',
      voContactName: this.user.name,
      voContactEmail: this.user.email,
      voContactPhone: this.user.userPhone
    };
    this.voOpp.voCharityName = this.charity.charityName;
    this.voOpp.voStreet = this.charity.charityStreet;
    this.voOpp.voCity = this.charity.charityCity;
    this.voOpp.voState = this.charity.charityState;
    this.voOpp.voZipCode = this.charity.charityZipCode;
    this.newEvent = true;
    const topSection = document.getElementById('topSection');
    topSection.style.display = 'block';
    topSection.scrollIntoView();
    this.showUpdateEvent(null, 'new');
  }

  cancelEvent(theEvent) {
    this.voOpp = theEvent;
    this.updateEvent('cancel');
    if (this.voOpp.voDescription !== undefined) {
      this.voOpp.voDescription = this.voOpp.voDescription.replace('<p style="background-color:green"><strong>The Charity Has Reactivated This Event'
        + '</strong></p>', '');
      this.voOpp.voDescription = this.voOpp.voDescription.replace('<p style="background-color:yellow"><strong>The Charity Has Updated Details About'
        + ' This Event</strong></p>', '');
      this.voOpp.voDescription = `<p style="background-color:red"><strong>The Charity Has Cancelled This Event</strong>
        </p>${this.voOpp.voDescription}`;
    }
  }

  reactivateEvent(theEvent) {
    this.voOpp = theEvent;
    if (this.voOpp.voDescription !== undefined) {
      this.voOpp.voDescription = this.voOpp.voDescription.replace('<p style="background-color:yellow">'
        + '<strong>The Charity Has Updated Details About This Event</strong></p>', '');
      this.voOpp.voDescription = this.voOpp.voDescription.replace('<p style="background-color:red"><strong>The Charity Has Cancelled This '
        + 'Event</strong></p>', '<p style="background-color:green"><strong>The Charity Has Reactivated This Event</strong></p>');
    }
    this.updateEvent('reactivate');
  }

  async updateEvent(updateType) {
    this.voOpp.voStatus = updateType;
    if (updateType === 'update') {
      this.voOpp.voDescription = this.voOpp.voDescription.replace('<p style="background-color:yellow">'
        + '<strong>The Charity Has Updated Details About This Event</strong></p>', '');
      this.voOpp.voDescription = this.voOpp.voDescription.replace('<p style="background-color:yellow">'
        + '<strong>The Charity Has Updated Details About This Event</strong></p>', '');
      this.voOpp.voDescription = this.voOpp.voDescription.replace('<p style="background-color:green">'
        + '<strong>The Charity Has Reactivated This Event</strong></p>', '');
      this.voOpp.voDescription = `<p style="background-color:yellow"><strong>The Charity Has Updated Details About This Event</strong>
        </p>${this.voOpp.voDescription}`;
    }
    await this.app.updateById('/volopp/', this.voOpp._id, this.voOpp);
    if (process.env.NODE_ENV !== 'test') {
      window.location.reload();
    }
    // this.activate();
  }

  async deleteEvent(thisEventId) {
    await fetch;
    this.app.httpClient.fetch(`/volopp/${thisEventId}`, { method: 'delete' })
      .then(() => {
        this.activate();
      });
  }

  updateCanSubmit2(validationResults) {
    let valid = true;
    const nub = document.getElementsByClassName('updateButton')[0];
    if (nub !== undefined) nub.style.display = 'none';
    for (const result of validationResults) {
      if (result.valid === false) {
        valid = false;
        break;
      }
    }
    this.canSubmit2 = valid;
    if (this.canSubmit2) {
      if (this.counter !== 1 || !this.updateEvent) {
        nub.style.display = 'block';
      }
      this.counter += 1;
    }
    return this.canSubmit2;
  }

  /* istanbul ignore next */
  setupValidation2() {
    ValidationRules
      .ensure('voContactPhone').matches(/\b[2-9]\d{9}\b/).withMessage('10 digits only')
      .ensure('voContactEmail').email()
      .ensure('voName').required().withMessage('Event Name is required').maxLength(40)
      .ensure('voNumPeopleNeeded').required().withMessage('How Many Volunteers please')
      .ensure('voStartTime').required().withMessage('Event Start time is required')
      .ensure('voEndTime').required().withMessage('Event End time is required')
      .satisfies(val => (this.voOpp.voEndDate > this.voOpp.voStartDate) || (val > this.voOpp.voStartTime))
      .ensure('voStartDate').required().withMessage('Event Start Date is required')
      .ensure('voEndDate').required().withMessage('Event End Date is required')
      .ensure('voZipCode').required().withMessage('5-digit Zipcode is required').matches(/\b\d{5}\b/)
      .ensure('voCity').required().withMessage('Event City is required').matches(/[^0-9]+/).maxLength(30)
      .ensure('voStreet').required().withMessage('Event Street Address is required').maxLength(40)
      .ensure('voState').required().withMessage('Event State is required')
      .on(this.voOpp);
  }

  onlyPositive() {
    if (this.voOpp.voNumPeopleNeeded < 1) {
      this.voOpp.voNumPeopleNeeded = 1;
    }
  }

  selectPickChange(type) {
    this.selectedTalents = this.voOpp.voTalentTypes;
    this.selectedWorks = this.voOpp.voWorkTypes;
    if (type === 'work') {
      this.app.selectPickedChange(this.user, this, 'selectedWorks', 'volWorkOther', 'workOther', true, 'volWorkPrefs');
    }
    if (type === 'talents') {
      this.app.selectPickedChange(this.user, this, 'selectedTalents', 'volTalentOther', 'talentOther', true, 'volTalents');
    }
  }

  clickaChooAndChaa(position) {
    const element = document.querySelector(`#${position} input`);
    element.click();
  }

  attached() {
    this.showNewEvent();
    this.setupValidation2();
  }
}
