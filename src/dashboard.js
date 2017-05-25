import {inject} from 'aurelia-framework';
import {App} from './app';
import {AuthService} from 'aurelia-auth';
import {HttpClient, json} from 'aurelia-fetch-client';
import { ValidationControllerFactory, ValidationRules, Validator, validateTrigger } from 'aurelia-validation';
//import { ValidationControllerFactory, ValidationRules, Validator } from 'aurelia-validation';
class FormValidator {
  constructor(validator, cb) {
    this.validator = validator;
    this.cb = cb;
  }
  /**
  * This method will be called by the controller when validating a specific field. For instance,
  * when the user is interacting with the title input. So, we need to validate the whole form
  * and call our callback in order for TodoPage.canSave to be correctly updated.
  */
  validateProperty(object, propertyName, rules) {
    let validationDefered = this.validator.validateProperty(object, propertyName, rules);
    validationDefered.then(() => this.validateObject(object, rules));

    return validationDefered;
  }

  /**
  * Each time the whole form is validated, we call the registered callback to do whatever
  * the user wants to do with the results of the validation. In our case: update
  * TodoPage.canSave.
  */
  validateObject(object, rules) {
    return this.validator.validateObject(object, rules).then(results => {
      this.cb(results);
      return results;
    });
  }

  /**
  * Implemented so the interface is complete.
  */
  ruleExists(rules, rule) {
    return this.validator(rules, rule);
  }
}

@inject(AuthService, HttpClient, App, ValidationControllerFactory, Validator)
export class Dashboard {
  controller = null;
  validator = null;
  constructor(auth, httpClient, app, controllerFactory, validator){
    this.app = app;
    this.auth = auth;
    this.httpClient = httpClient;
    //TODO you cannot set callback which is null. the earlier argument is a function that return null.
    this.validator = new FormValidator(validator, results => this.updateCanSubmit(results)); //if the form is valid then set to true.
    this.controller = controllerFactory.createForCurrentScope(this.validator);
    this.controller.validateTrigger = validateTrigger.changeOrBlur;
    this.canSubmit = false;  //the button on the form
  }

  selectedValue;
  userTypes=JSON.parse(process.env.userRoles).roles;

  async activate() {
    this.configHttpClient();
    let uid = this.auth.getTokenPayload().sub;
    this.user = await this.app.appState.getUser(uid);
    console.log('this is the user ' + this.user.name);
    this.childRoute();
    this.setupValidation();
  }

  updateCanSubmit(validationResults) {
    let valid = true;
    for (let result of validationResults) {
      valid = valid && result.valid;
    }
    this.canSubmit = valid;
    console.log(this.user, this.canSubmit);
    if (this.user.userType !== '' && this.canSubmit){
      let nub = document.getElementById('newUserButton');
      nub.style.display = 'block';
    }
  }

  dropdownChanged() {
    let nub = document.getElementById('newUserButton');
    if (this.user.userType !== '' && this.canSubmit){
      nub.style.display = 'block';
    } else {
      nub.style.display = 'none';
    }
  }

  configHttpClient(){
    this.backend = '';
    /* istanbul ignore else */
    if (process.env.NODE_ENV !== 'production'){
      this.backend = process.env.BackendUrl;
    }
    this.httpClient.configure(config => {
      config
      .useStandardConfiguration()
      .withBaseUrl(this.backend);
    });
  }

  childRoute(){
    if (this.user.userType === 'Charity'){
      this.app.router.navigate('dashboard/charity');
    } else if (this.user.userType === 'Volunteer'){
      this.app.router.navigate('dashboard/volunteer');
    } else if (this.user.userType === 'Reader'){
      this.app.router.navigate('dashboard/reader');
    } else if (this.user.userType === 'Librarian'){
      this.app.router.navigate('dashboard/librarian');
    } else if (this.user.userType === 'Developer'){
      this.app.router.navigate('dashboard/developer');
    }
  }

  setupValidation() {
    ValidationRules
    .ensure('userPhone').required().minLength(10).withMessage('phone number must be at least 10 digits long.')
    .ensure('userType').required().minLength(5).withMessage('select a user type')
    .on(this.user);
  }

  validate() {
    this.validator.validateObject(this.user);
  }

  async updateUser(){
    let uid = this.auth.getTokenPayload().sub;
    await fetch;
    //this.user.userType = this.selectedValue;
    this.httpClient.fetch('/user/' + uid, {
      method: 'put',
      body: json(this.user)
    })
    .then(response=>response.json())
    .then(data=> {
      this.app.appState.setUser(this.user);
      this.app.appState.checkUserRole();
      this.childRoute();
    });
  }
}
