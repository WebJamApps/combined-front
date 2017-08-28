import {inject} from 'aurelia-framework';
import {App} from '../app';
//import {json} from 'aurelia-fetch-client';
@inject(App)
export class Volunteer {
  constructor(app){
    this.app = app;
    this.events = [];
  }

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
      //this.charityName = this.events[0].voCharityName;
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
      checkboxes.opened = true;
      this.expanded = true;
    } else {
      checkboxes.opened = false;
      this.expanded = false;
    }
  }

  attached(){
    this.buildUserCauses();
    this.buildUserTalents();
    this.buildUserWorks();
  }
}
