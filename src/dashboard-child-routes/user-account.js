import {
  ValidationControllerFactory, ValidationRules, Validator, validateTrigger
} from 'aurelia-validation';
import { inject } from 'aurelia-framework';
import { App } from '../app';
import { FormValidator } from '../classes/FormValidator';
import { formatDate, markPast } from '../commons/utils';
@inject(App, ValidationControllerFactory, Validator)
export class UserAccount {
  controller = null;
  validator = null;
  constructor(app, controllerFactory, validator) {
    this.app = app;
    this.canChangeUserType = true;
    this.validator = new FormValidator(validator, results => this.updateCanSubmit(results));
    this.controller = controllerFactory.createForCurrentScope(this.validator);
    this.controller.validateTrigger = validateTrigger.changeOrBlur;
    this.canSubmit = false;
    this.canDelete = true;
    this.status = ['enabled', 'disabled'];
    this.originalEmail = '';
    this.isGoogleEmail = false;
    this.newUserType = '';
  }
  async activate() {
    this.userTypes = JSON.parse(process.env.userRoles).roles;
    this.uid = this.app.auth.getTokenPayload().sub;
    this.user = await this.app.appState.getUser(this.uid);
    this.originalEmail = this.user.email;
    this.checkUserStatus();
    this.checkUserEmail();
    this.app.role = this.user.userType;
    this.checkChangeUserType();
    this.userTypes.sort();
    this.setupValidation();
    this.newUserType = this.user.userType;
  }
  checkUserEmail() {
    if (this.user.email.split('@gmail').length > 1 || this.user.email.split('@vt.edu').length > 1 || this.user.email.split('@bi.vt.edu').length > 1) {
      this.isGoogleEmail = true;
    }
  }
  checkUserStatus() {
    if (this.user.userStatus === undefined || this.user.userStatus === null || this.user.userStatus === '') this.user.userStatus = 'enabled';
  }
  setupValidation() {
    ValidationRules
      .ensure('userPhone').matches(/\b[2-9]\d{9}\b/).withMessage('10 digits only')
      .ensure('userZip')
      .required()
      .matches(/\b\d{5}\b/)
      .withMessage('5-digit zipcode')
      .ensure('userCity')
      .required()
      .matches(/[^0-9]+/)
      .maxLength(30)
      .withMessage('City name please')
      .ensure('userState')
      .required()
      .ensure('name')
      .required()
      .ensure('email')
      .required()
      .email()
      .on(this.user);
  }
  updateCanSubmit(validationResults) {
    const nub = document.getElementById('updateUserButton');
    let valid = true;
    for (const result of validationResults) {
      if (result.valid === false) {
        valid = false;
        nub.style.display = 'none';
        break;
      }
    }
    this.canSubmit = valid;
    if (this.canSubmit) {
      nub.style.display = 'block';
    }
    return this.canSubmit;
  }
  async checkChangeUserType() {
    this.changeReasons = '';
    if (this.user.userType === 'Volunteer' || this.user.userType === 'Developer') {
      await this.fetchAllEvents();
      this.checkScheduled();
    }
    if (this.user.userType === 'Charity' || this.user.userType === 'Developer') {
      // Do not allow user to change their primary userType away from Charity if they have created a charity
      const res = await this.app.httpClient.fetch(`/charity/${this.uid}`);
      this.charities = await res.json();
      if (this.charities.length > 0) {
        this.canChangeUserType = false;
        this.canDelete = false;
        this.changeReasons = `${this.changeReasons}<li>You are the manager of a charity.</li>`;
      }
    }
    if (this.user.userType === 'Reader' || this.user.userType === 'Developer') {
      const res = await this.app.httpClient.fetch(`/book/findcheckedout/${this.uid}`);
      this.books = await res.json();
      if (this.books.length > 0) {
        this.canChangeUserType = false;
        this.canDelete = false;
        this.changeReasons = `${this.changeReasons}<li>You have a book checked out.</li>`;
      }
    }
  }
  async fetchAllEvents() {
    const res = await this.app.httpClient.fetch('/volopp/getall');
    this.events2 = await res.json();
    // fixDates(this.events2); //TODO determine if this is still needed or fix (this should be a backend function)
    markPast(this.events2, formatDate);
    this.fixPeopleScheduled(this.events2);
  }
  fixPeopleScheduled(events) {
    for (let i = 0; i < events.length; i += 1) {
      if (events[i].voPeopleScheduled === null || events[i].voPeopleScheduled === undefined) {
        events[i].voPeopleScheduled = [];
      }
    }
  }
  checkScheduled() {
    for (let i = 0; i < this.events2.length; i += 1) {
      if (this.events2[i].voPeopleScheduled.includes(this.uid)) {
        this.canDelete = false;
        if (!this.events2[i].past) {
          this.canChangeUserType = false;
        }
      }
    }
    if (!this.canChangeUserType && this.changeReasons.indexOf('<li>You are scheduled to work an event.</li>') === -1) {
      this.changeReasons = `${this.changeReasons}<li>You are scheduled to work an event.</li>`;
    }
  }
  async setCharity() {
    this.user.userDetails = '';
    this.user.userType = 'Charity';
    await this.app.updateById('/user/', this.uid, this.user);
  }
  afterUpdateUser() {
    if (this.user.changeemail !== '') {
      // console.log('email address was changed!');
      this.changeUserEmail();
    } else {
      this.app.appState.setUser(this.user);
      this.app.appState.checkUserRole();
      this.app.router.navigate('dashboard');
    }
  }
  changeUserEmail() {
    const bodyData = { changeemail: this.user.changeemail.toLowerCase(), email: this.user.email.toLowerCase() };
    const fetchData = {
      method: 'PUT',
      body: JSON.stringify(bodyData),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    };
    return this.app.httpClient.fetch('/auth/changeemail', fetchData)
      .then(response => response.json())
      .then((data) => {
        if (data.message) {
          const messagediv = document.getElementsByClassName('formErrors')[0];
          messagediv.innerHTML = `<p style="text-align:left; padding-left:12px">${data.message}</p>`;
          /* istanbul ignore if */
        } else if (process.env.NODE_ENV !== 'test') {
          window.location.assign(`/userutil/?changeemail=${this.user.changeemail.toLowerCase()}`);
        }
      })
      .catch(() => {
        // console.log(error);
      });
  }
  async updateUser() {
    this.user.changeemail = '';
    if (this.originalEmail !== this.user.email) {
      this.user.changeemail = this.user.email.toLowerCase();
      this.user.email = this.originalEmail.toLowerCase();
    }
    this.user.userType = this.newUserType;
    await this.app.updateById('/user/', this.uid, this.user);
    this.afterUpdateUser();
  }
  disableUser(status) {
    this.user.userStatus = status;
    this.updateUser();
  }
  async deleteUser() {
    await fetch;
    this.app.httpClient.fetch(`/user/${this.uid}`, {
      method: 'delete'
    })
      .then(() => {
        this.app.logout();
      });
  }
  showUpdateButton() {
    const nub = document.getElementById('updateUserButton');
    nub.style.display = 'block';
  }
  attached() {
    this.controller.validate();
  }
}
