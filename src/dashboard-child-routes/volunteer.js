import {inject} from 'aurelia-framework';
import {App} from '../app';
import {json} from 'aurelia-fetch-client';
@inject(App)
export class Volunteer {
  constructor(app){
    this.app = app;
    this.events = [];
    this.signup = {};
  }

  //charityTypes
  //mediaTypes = ['hardback', 'paperback', 'pdf', 'webpage', 'video', 'audiobook', 'template'];
  //zipcodes
  siteLocations = [];
  causes = [];
  //filterby = ['keyword', 'media type', 'location'];
  filterby = ['keyword', 'zipcode', 'cause'];
  selectedFilter = [];
  expanded = false;
  keyword = false;
  //mediaType = false;
  siteLocation = false;
  causeFilter = false;
  filters = [
    {value: '', keys: ['voName', 'voDescription', 'voCharityName', 'voContactName', 'voStreet', 'voCity', 'voState']},
    //{value: '', keys: ['type']},
    {value: '', keys: ['voZipCode']},
    {value: '', keys: ['voCharityTypes']}
  ];

  async activate() {
    this.uid = this.app.auth.getTokenPayload().sub;
    this.user = await this.app.appState.getUser(this.uid);
    this.app.dashboardTitle = this.user.userType;
    const res = await this.app.httpClient.fetch('/volopp/getall');
    this.events = await res.json();
    console.log('all events');
    console.log(this.events);
    if (this.events.length > 0){
      this.fixDates();
      this.buildWorkPrefs();
      this.buildTalents();
      this.populateTypes();
      this.populateSites();
      this.populateCauses();
      this.checkSignups();
      //this.charityName = this.events[0].voCharityName;
    }
  }

  async checkSignups(){
    const resp = await this.app.httpClient.fetch('/signup/' + this.uid);
    this.userSignups = await resp.json();
    console.log('this user has signed up for these events');
    console.log(this.userSignups);
    //loop through all userSignups and check against looping through all events
    for (let next of this.userSignups){
      let nextEventId = next.voloppId;
      for (let i = 0; i < this.events.length; i++){
        if (this.events[i]._id === nextEventId){
          this.events[i].scheduled = true;
        }
        // if (this.mediaTypes.indexOf(nextType) === -1){
        //   this.mediaTypes.push(nextType);
      }
    }
  }

  filterPicked(){
    let arrayLength = this.selectedFilter.length;
    this.keyword = false;
    //this.mediaType = false;
    this.siteLocation = false;
    if (arrayLength === 0){
      this.filters[0].value = '';
      this.filters[1].value = '';
      //this.filters[2].value = '';
      return;
    }
    for (let i = 0; i < arrayLength; i++) {
      /* look in array, if filter type is contained then set the selected filtertype to be true  this.keyword = true; this.mediaType=true; this.siteLocation=true*/
      if (this.selectedFilter.includes('keyword')) {
        this.keyword = true;
      } else {
        console.log('you unchecked the keyword filter');
        this.filters[0].value = '';
        this.keyword = false;
        //this.activate();
      }
      // if (this.selectedFilter.includes('media type')) {
      //   this.mediaType = true;
      // } else {
      //   this.filters[1].value = '';
      //   this.mediaType = false;
      // }
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
    }
  }

  populateTypes(){
    // this.mediaTypes.push('');
    // for (let next of this.books){
    //   let nextType = next.type;
    //   if (this.mediaTypes.indexOf(nextType) === -1){
    //     this.mediaTypes.push(nextType);
    //   }
    // }
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
  // setFilter(filterType){
  //   this.filterType = this.filterby[this.filterType - 1];
  // }

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
    //console.log('this is the causes html' + causesHtml);
    if (causesHtml === ''){
      causesHtml = '<p style="font-size:10pt">not specified</p>';
    }
    //console.log('current causes: ' + causesHtml);
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
    //console.log('current causes: ' + causesHtml);
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
    //console.log('current causes: ' + causesHtml);
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
    //   voloppId: { type: String, required: true },
    // userId: { type: String, required: true },
    // numPeople: { type: Number, required: true },
    // groupName: { type: String, required: false }
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
      //document.getElementById('charityDash').scrollIntoView();
      this.activate();
      //this.createNewCharity();
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
      //this.createNewCharity();
    });
  }

  attached(){
    this.buildUserCauses();
    this.buildUserTalents();
    this.buildUserWorks();
  }
}
