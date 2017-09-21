import {inject} from 'aurelia-framework';
import {App} from '../app';
import {json} from 'aurelia-fetch-client';
@inject(App)
export class Volunteer {
  constructor(app){
    this.app = app;
    this.events = [];
    this.signup = {};
    this.selectedFilter = ['future only'];
    this.doubleCheckSignups = false;
    this.canSignup = true;
    //this.showtable = false;
  }

  siteLocations = [];
  causes = [];
  filterby = ['keyword', 'zipcode', 'cause', 'future only'];
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
    let res2 = await this.app.httpClient.fetch('/signup/getall');
    this.signups = await res2.json();
    await this.fetchAllEvents();
    if (this.events.length > 0){
      await this.checkSignups();
      this.fixZipcodes();
      this.fixDates();
      this.buildWorkPrefs();
      this.buildTalents();
      this.populateSites();
      this.populateCauses();
      await this.checkScheduled();
      if (this.selectedFilter.includes('future only')) {
        this.removePast();
      }
      //this.showtable = true;
    }
    if (this.user.userDetails === 'newUser'){
      this.app.router.navigate('dashboard/user-account');
    }
  }

  async fetchAllEvents(){
    const res = await this.app.httpClient.fetch('/volopp/getall');
    this.events = await res.json();
  }

  async checkScheduled(){
    let total = 0;
    let signupUserIds = [];
    for (let i = 0; i < this.events.length; i++){
      for (let e = 0; e < this.signups.length; e++){
        if (this.events[i]._id === this.signups[e].voloppId){
          total = total + this.signups[e].numPeople;
          signupUserIds.push(this.signups[e].userId);
        }
      }
      this.events[i].voNumPeopleScheduled = total;
      this.events[i].voSignupUserIds = signupUserIds;
      if (this.events[i].voNumPeopleScheduled - this.events[i].voNumPeopleNeeded >= 0 && !this.events[i].scheduled){
        this.events[i].full = true;
        if (this.doubleCheckSignups){
          alert('someone else signed up for the last spot to volunteer at this event');
          this.doubleCheckSignups = false;
          return this.canSignup = false;
        }
      }
      if (this.events[i].voStatus === 'cancel' && !this.events[i].scheduled){
        this.events[i].full = true;
      }
      total = 0;
      signupUserIds = [];
    }
    //let resp;
    //let scheduledEvents;
    //let total = 0;
    //for (let i = 0; i < this.events.length; i++){
      //resp = await this.app.httpClient.fetch('/signup/event/' + this.events[i]._id);
      //scheduledEvents = await resp.json();
      //for (let hasVolunteers of scheduledEvents){
        //total = total + hasVolunteers.numPeople;
      //}
      //this.events[i].voNumPeopleScheduled = total;
      //total = 0;
    //}
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
    for (let next of this.userSignups){
      let nextEventId = next.voloppId;
      for (let i = 0; i < this.events.length; i++){
        if (this.events[i]._id === nextEventId){
          this.events[i].scheduled = true;
        }
        // } else {
        //   this.events[i].scheduled = false;
        // }
      }
    }
  }

  filterPicked(){
    let arrayLength = this.selectedFilter.length;
    this.keyword = false;
    this.siteLocation = false;
    if (arrayLength === 0){
      this.filters[0].value = '';
      this.filters[1].value = '';
      this.filters[2].value = '';
      this.causeFilter = false;
      this.siteFilter = false;
      this.keyword = false;
      this.includePast();
      return;
    }
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
    if (this.selectedFilter.includes('future only')) {
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
    for (let i = 0; i < this.events.length; i++){
      if (this.events[i].voStartDate === undefined || this.events[i].voStartDate === null || this.events[i].voStartDate === ''){
        this.events[i].voStartDate = today;
      }
      testDate = this.events[i].voStartDate.replace('-', '');
      testDate = testDate.replace('-', '');
      if (testDate < today){
        this.events[i].past = true;
      }
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

  async signupEvent(thisevent){
    //doublecheck that someone else has not already signedup to hit the max volunteers needed
    this.doubleCheckSignups = true;
    await this.checkScheduled();
    if (!this.canSignup){
      return;
    }
    this.signup.voloppId = thisevent._id;
    this.signup.userId = this.uid;
    this.signup.numPeople = 1;
    this.signup.groupName = '';
    await this.app.httpClient.fetch('/signup/create', {
      method: 'post',
      body: json(this.signup)
    })
      .then((data) => {
        console.log(data);
        //this.showtable = false;
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
        //this.showtable = false;
        this.activate();
      });
  }

  attached(){
    this.buildUserCauses();
    this.buildUserTalents();
    this.buildUserWorks();
  }
}
