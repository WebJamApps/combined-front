import {inject} from 'aurelia-framework';
import {App} from '../app';
import {json} from 'aurelia-fetch-client';
import {filterSelected} from '../commons/utils';
@inject(App)
export class Volunteer {
  constructor(app){
    this.app = app;
    this.events = [];
    this.signup = {};
    this.selectedFilter = ['future only'];
    this.doubleCheckSignups = false;
    this.canSignup = true;
    this.hidePast = true;
    this.zipcode = false;
    this.cause = false;
    this.keyword = false;
    this.allCauses = ['Christian', 'Environmental', 'Hunger', 'Animal Rights', 'Homeless', 'Veterans', 'Elderly'];
    this.allTalents = ['music', 'athletics', 'childcare', 'mechanics', 'construction', 'computers', 'communication', 'chess playing', 'listening'];
    this.allWorks = ['hashbrown slinging', 'nail hammering', 'leaf removal', 'floor mopping', 'counseling', 'visitation'];
    this.selectedCauses = [];
    this.selectedTalents = [];
    this.selectedWorks = [];
  }

  siteLocations = [];
  causes = [];
  filterby = ['keyword', 'zipcode', 'cause', 'future only'];
  keyword = false;
  siteLocation = false;
  causeFilter = false;
  filters = [
    {filterby: 'keyword', value: '', keys: ['voName', 'voDescription', 'voCharityName', 'voContactName', 'voStreet', 'voCity', 'voState']},
    {filterby: 'zipcode', value: '', keys: ['voZipCode']},
    {filterby: 'cause', value: '', keys: ['voCharityTypes']}
  ];


  async activate() {
    this.uid = this.app.auth.getTokenPayload().sub;
    this.user = await this.app.appState.getUser(this.uid);
    this.app.dashboardTitle = this.user.userType;
    this.app.role = this.user.userType;
    if (this.user.userDetails === 'newUser'){
      this.app.router.navigate('dashboard/user-account');
    } else {
      let res2 = await this.app.httpClient.fetch('/signup/getall');
      this.signups = await res2.json();
      await this.fetchAllEvents();
      this.displayEvents();
    }
  }

  async displayEvents(){
    if (this.events.length > 0){
      await this.checkSignups();
      this.fixZipcodes();
      this.fixDates('voStartDate');
      this.fixDates('voEndDate');
      this.app.buildPTag(this.events, 'voWorkTypes', 'voWorkTypeOther ', 'workHtml');
      this.app.buildPTag(this.events, 'voTalentTypes', 'voTalentTypeOther', 'talentHtml');
      this.populateSites();
      this.populateCauses();

      await this.checkScheduled();
      //if (this.selectedFilter.includes('future only')) {
      this.markPast();
    //  }
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
      }
    }
  }

  filterPicked(){
    filterSelected(this);
    if (this.selectedFilter.includes('future only')) {
      console.log('you selected the starting date filter');
      this.markPast();
      this.hidePast = true;
    } else {
      console.log('show past now!');
      this.hidePast = false;
    }
  }

  formatDate(today){
    console.log(today);
    let mm = today.getMonth() + 1; // getMonth() is zero-based
    let dd = today.getDate();
    today = [today.getFullYear(),
      (mm > 9 ? '' : '0') + mm,
      (dd > 9 ? '' : '0') + dd].join('');
    return today;
  }

  markPast() {
    let testDate;
    let today = new Date();
    today = this.formatDate(today);
    for (let i = 0; i < this.events.length; i++){
      if (this.events[i].voStartDate === undefined || this.events[i].voStartDate === null || this.events[i].voStartDate === ''){
        this.events[i].voStartDate = today;
      }
      testDate = this.events[i].voStartDate.replace('-', '');
      testDate = testDate.replace('-', '');
      if (testDate < today){
        this.events[i].past = true;
      } else {
        this.events[i].past = false;
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

  fixDates(key){
    for (let i = 0; i < this.events.length; i++){
      let fixDate = this.events[i][key];
      if (fixDate !== null && fixDate !== undefined){
        if (fixDate.indexOf('T') !== -1){
          this.events[i][key] = fixDate.substr(0, fixDate.indexOf('T'));
        }
      }
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

  selectPickChange(type){
    // console.log('I picked something:');
    // console.log(type);
    this.showButton();
    if (type === 'causes'){
      this.app.selectPickedChange(this.user, this, 'selectedCauses', 'volCauseOther', 'causeOther', true, 'volCauses');
      this.selectedCauses = this.selectedCauses.filter((e) => e !== '');
      // console.log(this.selectedCauses.length);
      // console.log(this.selectedCauses);
    }
    if (type === 'work'){
      this.app.selectPickedChange(this.user, this, 'selectedWorks', 'volWorkOther', 'workOther', true, 'volWorkPrefs');
      this.selectedWorks = this.selectedWorks.filter((e) => e !== '');
      // console.log(this.selectedWorks.length);
      // console.log(this.selectedWorks);
    }
    if (type === 'talents'){
      console.log('you picked talents');
      this.app.selectPickedChange(this.user, this, 'selectedTalents', 'volTalentOther', 'talentOther', true, 'volTalents');
      this.selectedTalents = this.selectedTalents.filter((e) => e !== '');
      // console.log(this.selectedTalents.length);
      // console.log(this.selectedTalents);
    }
    if (this.selectedCauses.length === 0){
      let checkboxes = document.getElementById('selectCauses');
      if (checkboxes.style.display === 'block') {
        checkboxes.style.display = 'none';
      }
    }
    if (this.selectedTalents.length === 0){
      let checkboxes = document.getElementById('selectTalents');
      if (checkboxes.style.display === 'block') {
        checkboxes.style.display = 'none';
      }
    }
    if (this.selectedWorks.length === 0){
      let checkboxes = document.getElementById('selectWork');
      if (checkboxes.style.display === 'block') {
        checkboxes.style.display = 'none';
      }
    }
  }

  setupVolunteerUser(){
    this.changeCauses(this.allCauses, this.user.volCauses, this.selectedCauses);
    this.selectedCauses = this.selectedCauses.filter((e) => e !== '');
    this.changeCauses(this.allTalents, this.user.volTalents, this.selectedTalents);
    this.selectedTalents = this.selectedTalents.filter((e) => e !== '');
    this.changeCauses(this.allWorks, this.user.volWorkPrefs, this.selectedWorks);
    this.selectedWorks = this.selectedWorks.filter((e) => e !== '');
    if (this.selectedWorks.includes('other')){
      this.workOther = true;
    } else {
      this.workOther = false;
    }
    if (this.selectedTalents.includes('other')){
      this.talentOther = true;
    } else {
      this.talentOther = false;
    }
    if (this.selectedCauses.includes('other')){
      this.causeOther = true;
    } else {
      this.causeOther = false;
    }
    if (this.selectedCauses.length > 0){
      console.log('I have selected a cause');
      let causesSelector = document.getElementById('causesSelector');
      console.log(causesSelector);
      causesSelector.click();
    }
    if (this.selectedTalents.length > 0){
      console.log('I have selected a talent');
      let talentsSelector = document.getElementById('talentsSelector');
      console.log(talentsSelector);
      talentsSelector.click();
    }
    if (this.selectedWorks.length > 0){
      console.log('I have selected a work pref');
      let worksSelector = document.getElementById('worksSelector');
      //console.log(causesSelector);
      worksSelector.click();
    }
  }

  changeCauses(item, vol, container) {
    item.sort();
    item.push('other');
    for (let i of item) {
      if (vol.includes(i)) {
        container.push(i);
      } else {
        container.push('');
      }
    }
  }

  async updateUser(){
    await this.app.updateById('/user/', this.uid, this.user, null);
    this.afterUpdateUser();
  }

  afterUpdateUser(){
    this.app.appState.setUser(this.user);
    this.app.appState.checkUserRole();
    this.app.router.navigate('dashboard');
  }

  showButton(){
    console.log('show button!');
    document.getElementById('updateUserButton').style.display = 'block';
  }

  attached(){
    document.getElementById('distanceInput').addEventListener('keydown', this.showButton);
    // this.buildVolunteerPTag('volCauses', 'volCauseOther', 'causes');
    // this.buildVolunteerPTag('volTalents', 'volTalentOther', 'talents');
    // this.buildVolunteerPTag('volWorkPrefs', 'volWorkOther', 'works');
    this.setupVolunteerUser();
  }
}
