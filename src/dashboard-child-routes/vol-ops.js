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
  // async activate(){
  // }
}
