import {inject} from 'aurelia-framework';
import {App} from '../app';
//import {json} from 'aurelia-fetch-client';
//import { ValidationControllerFactory, ValidationRules, Validator, validateTrigger } from 'aurelia-validation';
//import {FormValidator} from '../classes/FormValidator';
//import {VolOpp} from '../classes/VolOpp';
//@inject(App, ValidationControllerFactory, Validator)
@inject(App)
export class VolunteerOpps {
//constructor(app, controllerFactory, validator){
  constructor(app){
    this.app = app;
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
    if (this.events.length > 0){
      this.fixDates();
    }
    console.log(this.events);
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
}
