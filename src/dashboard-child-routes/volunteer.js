import {inject} from 'aurelia-framework';
import {App} from '../app';
import {json} from 'aurelia-fetch-client';
@inject(App)
export class Volunteer {
  constructor(app){
    this.app = app;
    this.events = [];
    this.signup = {};
    this.selectedFilter = ['future date'];
  }

  siteLocations = [];
  causes = [];
  filterby = ['keyword', 'zipcode', 'cause', 'future date'];
  // selectedFilter = [];
  expanded = false;
  keyword = false;
  siteLocation = false;
  causeFilter = false;
  filters = [
    {value: '', keys: ['voName', 'voDescription', 'voCharityName', 'voContactName', 'voStreet', 'voCity', 'voState']},
    {value: '', keys: ['voZipCode']},
    {value: '', keys: ['voCharityTypes']}
  ];

  async activate() {
    this.uid = this.app.auth.getTokenPayload().sub;
    this.user = await this.app.appState.getUser(this.uid);
    this.app.dashboardTitle = this.user.userType;
    this.app.role = this.user.userType;
    const res = await this.app.httpClient.fetch('/volopp/getall');
    this.events = await res.json();
    console.log('all events');
    console.log(this.events);
    if (this.events.length > 0){
      this.fixDates();
      this.buildWorkPrefs();
      this.buildTalents();
      this.populateSites();
      this.populateCauses();
      this.checkSignups();
      this.checkScheduled();
      this.fixZipcodes();
      if (this.selectedFilter.includes('future date')) {
        //this.startingDateFilter = true;
        console.log('you selected the starting date filter');
        this.removePast();
      }
    }
  }

  async checkScheduled(){
    //loop through each evnt
    // get signups by event id
    // if length > 0, add number of volunteers to the event. number of people signed up
    // number needed - number signed up = the number still needed
    let resp;
    let scheduledEvents;
    let total = 0;
    for (let i = 0; i < this.events.length; i++){
      resp = await this.app.httpClient.fetch('/signup/event/' + this.events[i]._id);
      scheduledEvents = await resp.json();
      //console.log('these are the schedule events for this event id');
      //console.log(scheduledEvents);
      for (let hasVolunteers of scheduledEvents){
        total = total + hasVolunteers.numPeople;
      }
      this.events[i].voNumPeopleScheduled = total;
      //console.log(this.events[i].voNumPeopleScheduled - this.events[i].voNumPeopleNeeded);
      if (this.events[i].voNumPeopleScheduled - this.events[i].voNumPeopleNeeded >= 0 && !this.events[i].scheduled){
        this.events[i].full = true;
      }
      if (this.events[i].voStatus === 'cancel' && !this.events[i].scheduled){
        this.events[i].full = true;
      }
      total = 0;
    }
  }

  fixZipcodes(){
    for (let i = 0; i < this.events.length; i++){
      if (this.events[i].voZipCode === undefined || this.events[i].voZipCode === '' || this.events[i].voZipCode === null){
        this.events[i].voZipCode = '00000';
      }
    }
  }

  async checkSignups(){
    const resp = await this.app.httpClient.fetch('/signup/' + this.uid);
    this.userSignups = await resp.json();
    console.log('this user has signed up for these events');
    console.log(this.userSignups);
    for (let next of this.userSignups){
      let nextEventId = next.voloppId;
      for (let i = 0; i < this.events.length; i++){
        if (this.events[i]._id === nextEventId){
          this.events[i].scheduled = true;
        }
      }
    }
  }

  filterPicked(){
    let arrayLength = this.selectedFilter.length;
    this.keyword = false;
    this.siteLocation = false;
    if (arrayLength === 0){
      // if (this.startingDateFilter){
      //   this.activate();
      // } else {
      this.filters[0].value = '';
      this.filters[1].value = '';
      this.filters[2].value = '';
      this.causeFilter = false;
      this.siteFilter = false;
      this.keyword = false;
      this.includePast();
        //this.filters[3].value = '';
      return;
      // }
    }
    // for (let i = 0; i < arrayLength; i++) {
    if (this.selectedFilter.includes('keyword')) {
      this.keyword = true;
    } else {
      console.log('you unchecked the keyword filter');
      this.filters[0].value = '';
      this.keyword = false;
    }
    if (this.selectedFilter.includes('zipcode')) {
      this.siteLocation = true;
    } else {
      this.filters[1].value = '';
      this.siteLocation = false;
    }
    if (this.selectedFilter.includes('cause')) {
      this.causeFilter = true;
    } else {
      this.filters[2].value = '';
      this.causeFilter = false;
    }
    if (this.selectedFilter.includes('future date')) {
      //this.startingDateFilter = true;
      console.log('you selected the starting date filter');
      this.removePast();
    } else {
      this.includePast();
    }
  }

  includePast(){
    for (let i = 0; i < this.events.length; i++){
      this.events[i].past = false;
    }
  }

  removePast() {
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

  populateSites(){
    this.siteLocations.push('');
    for (let next of this.events){
      let nextSite = next.voZipCode;
      if (this.siteLocations.indexOf(nextSite) === -1){
        this.siteLocations.push(nextSite);
      }
    }
  }

  populateCauses(){
    this.causes.push('');
    for (let next of this.events){
      let nextCharityType = next.voCharityTypes;
      for (let nextType of nextCharityType){
        if (this.causes.indexOf(nextType) === -1){
          this.causes.push(nextType);
        }
      }
    }
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

  buildUserCauses(){
    let causesHtml = '';
    for (let i = 0; i < this.user.volCauses.length; i++) {
      if (this.user.volCauses[i] !== ''){
        if (this.user.volCauses[i] !== 'other'){
          causesHtml = causesHtml + '<p style="font-size:10pt">' + this.user.volCauses[i] + '</p>';
        } else {
          causesHtml = causesHtml + '<p style="font-size:10pt">' + this.user.volCauseOther + '</p>';
        }
      }
    }
    if (causesHtml === ''){
      causesHtml = '<p style="font-size:10pt">not specified</p>';
    }
    document.getElementById('causes').innerHTML = causesHtml;
  }

  buildUserTalents(){
    let talentsHtml = '';
    for (let i = 0; i < this.user.volTalents.length; i++) {
      if (this.user.volTalents[i] !== ''){
        if (this.user.volTalents[i] !== 'other'){
          talentsHtml = talentsHtml + '<p style="font-size:10pt">' + this.user.volTalents[i] + '</p>';
        } else {
          talentsHtml = talentsHtml + '<p style="font-size:10pt">' + this.user.volTalentOther + '</p>';
        }
      }
    }
    if (talentsHtml === ''){
      talentsHtml = '<p style="font-size:10pt">not specified</p>';
    }
    document.getElementById('talents').innerHTML = talentsHtml;
  }

  buildUserWorks(){
    let worksHtml = '';
    for (let i = 0; i < this.user.volWorkPrefs.length; i++) {
      if (this.user.volWorkPrefs[i] !== ''){
        if (this.user.volWorkPrefs[i] !== 'other'){
          worksHtml = worksHtml + '<p style="font-size:10pt">' + this.user.volWorkPrefs[i] + '</p>';
        } else {
          worksHtml = worksHtml + '<p style="font-size:10pt">' + this.user.volWorkOther + '</p>';
        }
      }
    }
    if (worksHtml === ''){
      worksHtml = '<p style="font-size:10pt">not specified</p>';
    }
    document.getElementById('works').innerHTML = worksHtml;
  }

  showCheckboxes(){
    const checkboxes = document.getElementById('checkboxes-iron');
    if (!this.expanded) {
      checkboxes.style.display = 'block';
      this.expanded = true;
    } else {
      checkboxes.style.display = 'none';
      this.expanded = false;
    }
  }

  signupEvent(eventID){
    this.signup.voloppId = eventID;
    this.signup.userId = this.uid;
    this.signup.numPeople = 1;
    this.signup.groupName = '';
    this.app.httpClient.fetch('/signup/create', {
      method: 'post',
      body: json(this.signup)
    })
      .then((data) => {
        console.log(data);
        this.activate();
      });
  }

  async cancelSignup(eId){
    await fetch;
    this.app.httpClient.fetch('/signup/' + eId, {
      method: 'delete'
    })
      .then((data) => {
        console.log('no longer volunteering for that event');
        this.activate();
      });
  }

  attached(){
    this.buildUserCauses();
    this.buildUserTalents();
    this.buildUserWorks();
  }
}
