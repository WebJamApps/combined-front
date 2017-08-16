import {inject} from 'aurelia-framework';
import {App} from '../app';
import {json} from 'aurelia-fetch-client';
//import { ValidationControllerFactory, ValidationRules, Validator, validateTrigger } from 'aurelia-validation';
//import {FormValidator} from '../classes/FormValidator';
//import {VolOpp} from '../classes/VolOpp';
//@inject(App, ValidationControllerFactory, Validator)
@inject(App)
export class VolunteerOpps {
//constructor(app, controllerFactory, validator){
  constructor(app){
    this.app = app;
    this.selectedTalents = [];
    this.selectedWorks = [];
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
      'voContactName': '',
      'voContactEmail': '',
      'voContactPhone': null
    };
    this.talents = ['music', 'athletics', 'childcare', 'mechanics', 'construction', 'computers', 'communication', 'chess playing', 'listening'];
    this.works = ['hashbrown slinging', 'nail hammering', 'leaf removal', 'floor mopping', 'counseling', 'visitation'];
    this.talents.sort();
    this.talents.push('other');
    this.works.sort();
    this.works.push('other');
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
      if (startDate.indexOf('T') !== -1){
        this.events[i].voStartDate = startDate.substr(0, startDate.indexOf('T'));
      }
      if (endDate.indexOf('T') !== -1){
        this.events[i].voEndDate = endDate.substr(0, endDate.indexOf('T'));
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
    this.voOpp.voTalentTypes = this.selectedTalents;
    if (this.selectedTalents.includes('other')){
      this.talentOther = true;
    } else {
      this.talentOther = false;
      this.voOpp.voTalentTypeOther = '';
    }
    // console.log('selected talent');
    // console.log()
  }

  workPicked(){
    this.voOpp.voWorkTypes = this.selectedWorks;
    if (this.selectedWorks.includes('other')){
      this.workOther = true;
    } else {
      this.workOther = false;
      this.voOpp.voWorkTypeOther = '';
    }
  }

  scheduleEvent(){
    this.voOpp.voStartDate = document.getElementById('start-date').date;
    this.voOpp.voStartTime = document.getElementById('start-time').time;
    this.voOpp.voEndDate = document.getElementById('end-date').date;
    this.voOpp.voEndTime = document.getElementById('end-time').time;
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

  attached(){
    document.getElementById('eventHeader').scrollIntoView();
  }

}
