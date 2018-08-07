import { inject } from 'aurelia-framework';
import { json } from 'aurelia-fetch-client';
import {
  ValidationControllerFactory, ValidationRules, Validator, validateTrigger
} from 'aurelia-validation';
import { App } from '../app';
import { FormValidator } from '../classes/FormValidator';
import { showCheckboxes } from '../commons/utils';

@inject(App, ValidationControllerFactory, Validator)
export class Charity {
  controller = null;
  validator = null;
  constructor(app, controllerFactory, validator) {
    this.showCheckboxes = showCheckboxes;
    this.app = app;
    this.charities = [];
    this.validator2 = new FormValidator(validator, results => this.updateCanSubmit2(results));
    this.controller2 = controllerFactory.createForCurrentScope(this.validator2);
    this.controller2.validateTrigger = validateTrigger.changeOrBlur;
    this.canSubmit2 = false;
    this.validType2 = false;
    this.charityTypeValid = false;
  }
  async activate() {
    this.counter = 1;
    this.update = false;
    this.types = ['Christian', 'Environmental', 'Hunger', 'Animal Rights', 'Homeless', 'Veterans', 'Elderly'];
    this.types.sort();
    this.types.push('other');
    this.uid = this.app.auth.getTokenPayload().sub;
    this.user = await this.app.appState.getUser(this.uid);
    this.app.dashboardTitle = this.user.userType;
    this.app.role = this.user.userType;
    const res = await this.app.httpClient.fetch(`/charity/${this.uid}`);
    this.charities = await res.json();
    if (this.charities.length !== 0) {
      this.app.buildPTag(this.charities, 'charityTypes', 'charityTypeOther', 'charityTypesHtml');
      this.buildManagers();
      await this.checkEvents();
    }
  }
  async checkEvents() {
    for (let i = 0; i < this.charities.length; i += 1) {
      let foundEvents = [];
      this.charities[i].hasEvents = false;
      const res = await this.app.httpClient.fetch(`/volopp/${this.charities[i]._id}`); // eslint-disable-line no-await-in-loop
      foundEvents = await res.json(); // eslint-disable-line no-await-in-loop
      this.charities[i].hasEvents = foundEvents.length > 0;
    }
    // console.log(this.charities);
  }
  createNewCharity() {
    const charity = {
      charityEmail: '',
      charityName: '',
      charityStreet: '',
      charityCity: '',
      charityState: '',
      charityZipCode: '',
      charityTypes: [],
      charityManagers: [],
      charityMngIds: [],
      charityTypeOther: '',
      charityTypesHtml: ''
    };
    this.update = false;
    document.getElementById('charTable').style.display = 'block';
    this.updateScheduledEvent = false;
    // the element is available in the template.
    setTimeout(() => { document.getElementById('createNewCharityButton').style.display = 'none'; });
    this.showUpdateCharity(charity);
  }

  updateCharityFunction(charity) {
    charity.charityEmail = '';
    this.counter = 1;
    this.update = true;
    this.canSubmit2 = true;
    this.validType2 = true;
    this.showUpdateCharity(charity);
    // this.openCheckboxAndValidate('typesUpdate', true);
    this.showCheckboxes('typesUpdate', true);
    const ctypeerror = document.getElementsByClassName('ctypeerror')[0];
    ctypeerror.style.display = 'none';
  }

  async showUpdateCharity(charity) {
    this.charityName = charity.charityName;
    this.updateCharity = charity;
    this.typeOther = this.updateCharity.charityTypes.includes('other');
    this.updateCharity.charityTypeOther = !this.typeOther ? '' : this.updateCharity.charityTypeOther;
    await this.setupValidation2();
    await this.controller2.validate();
    // console.log(this.controller2.errors);
    if (this.update === true) document.getElementById('updateCharitySection').scrollIntoView();
    else document.getElementById('charityDash').scrollIntoView();
    // console.log(this.controller2.errors);
    this.buildErrors();
  }
  buildErrors() {
    // console.log(99);
    const errorList = document.getElementById('valErrors');
    // console.log(errorList);
    let innerH = '';
    // console.log(this.controller2.errors);
    for (let i = 0; i < this.controller2.errors.length; i += 1) {
      // console.log(102);
      innerH += `<li style="margin-left:-24px; color:red; width:2.5in">${this.controller2.errors[i].message}</li>`;
      // console.log(innerH);
    }
    if (errorList !== null) {
      errorList.style.display = 'block';
      errorList.innerHTML = innerH;
    }
  }

  async updateTypePicked() {
    this.validType2 = false;
    const ctypeerror = document.getElementsByClassName('ctypeerror')[0];
    ctypeerror.style.display = 'block';
    for (const i of this.types) {
      if (this.updateCharity.charityTypes.indexOf(i) > -1) {
        this.validType2 = true;
        ctypeerror.style.display = 'none';
      }
    }
    await this.controller2.validate();
    this.buildErrors();
    this.typeOther = this.updateCharity.charityTypes.includes('other');
    this.updateCharity.charityTypeOther = !this.typeOther ? '' : this.updateCharity.charityTypeOther;
  }
  setupValidation2() {
    ValidationRules
      .ensure('charityTypes').required().minLength(1).withMessage('charity type is required')
      .ensure('charityPhoneNumber')
      .matches(/\b[2-9]\d{9}\b/)
      .withMessage('10 digits only')
      .ensure('charityName')
      .required()
      .maxLength(40)
      .withMessage('Charity name is required')
      .ensure('charityEmail')
      .email()
      .ensure('charityZipCode')
      .required()
      .matches(/\b\d{5}\b/)
      .withMessage('5-digit zipcode')
      .ensure('charityCity')
      .required()
      .matches(/[^0-9]+/)
      .maxLength(30)
      .withMessage('City is required')
      .ensure('charityStreet')
      .required()
      .maxLength(40)
      .withMessage('Street address is required')
      .ensure('charityState')
      .required()
      .withMessage('State is required')
      .on(this.updateCharity);
  }
  updateCanSubmit2(validationResults) {
    let valid = true;
    const nub = document.getElementsByClassName('updateButton')[0];
    if (nub !== undefined) {
      nub.style.display = 'none';
    }
    for (const result of validationResults) {
      if (result.valid === false) {
        valid = false;
      }
    }
    if (!valid || !this.validType2) {
      this.canSubmit2 = false;
      this.buildErrors();
      return false;
    }
    this.canSubmit2 = true;
    nub.style.display = 'block';
    document.getElementById('valErrors').style.display = 'none';
    nub.removeAttribute('disabled');
    if (this.update) {
      nub.setAttribute('disabled', '');
      nub.style.cursor = 'none';
      nub.style.backgroundColor = 'buttonface';
      this.counter += 1;
      if (this.counter > 8) {
        nub.removeAttribute('disabled');
        nub.style.cursor = 'pointer';
        nub.style.backgroundColor = '#dfc';
      }
    }
    return null;
  }

  createCharity() {
    this.updateCharity.charityManagers[0] = this.user.name;
    this.updateCharity.charityMngIds[0] = this.user._id;
    this.updateCharity.charityEmail = this.updateCharity.charityEmail.toLowerCase();
    // console.log('this is the update charity email: ' + this.updateCharity);
    if (this.updateCharity.charityEmail !== '' && this.updateCharity.charityEmail !== null) {
      this.findUserByEmail('post');
    } else {
      this.postCharity();
    }
  }

  postCharity() {
    this.app.httpClient.fetch('/charity/create', {
      method: 'post',
      body: json(this.updateCharity)
    })
      .then(() => {
      // console.log(data);
        document.getElementById('charityDash').scrollIntoView();
        this.activate();
        this.createNewCharity();
      });
  }

  buildManagers() {
    for (let l = 0; l < this.charities.length; l += 1) {
      let manHtml = '';
      for (let i = 0; i < this.charities[l].charityManagers.length; i += 1) {
        if (this.charities[l].charityManagers[i] !== '') {
          manHtml = `${manHtml}<p style="font-size:10pt; padding-top:4px; margin-bottom:4px">${this.charities[l].charityManagers[i]}</p>`;
        }
      }
      if (manHtml === '') {
        manHtml = '<p style="font-size:10pt">not specified</p>';
      }
      this.charities[l].charityManagersHtml = manHtml;
    }
  }

  async deleteCharity(charityId) {
    await fetch;
    this.app.httpClient.fetch(`/charity/${charityId}`, {
      method: 'delete'
    })
      .then(() => {
      // console.log('your charity has been deleted');
        this.activate();
        this.createNewCharity();
      });
  }

  updateCharityFunct() {
    this.updateCharity.charityEmail = this.updateCharity.charityEmail.toLowerCase();
    // console.log('this is the update charity email: ' + this.updateCharity.charityEmail);
    if (this.updateCharity.charityEmail !== '' && this.updateCharity.charityEmail !== null) {
      this.findUserByEmail('put');
    } else {
      this.putCharity();
    }
  }

  removeManager(charity) {
    this.updateCharity = charity;
    const index = this.updateCharity.charityMngIds.indexOf(this.uid);
    if (index > -1) {
      this.updateCharity.charityMngIds.splice(index, 1);
    }
    const index2 = this.updateCharity.charityManagers.indexOf(this.user.name);
    if (index > -1) {
      this.updateCharity.charityManagers.splice(index2, 1);
    }
    this.putCharity();
  }

  async putCharity() {
    await this.app.updateById('/charity/', this.updateCharity._id, this.updateCharity);
    this.updateCharity = {};
    document.getElementById('charityDash').scrollIntoView();
    this.activate();
    this.createNewCharity();
  }

  async findUserByEmail(thenDo) {
    await fetch;
    this.app.httpClient.fetch('/user/', {
      method: 'post',
      body: json({ email: this.updateCharity.charityEmail })
    })
      .then(response => response.json())
      .then((data) => {
        if (data.length !== 0) {
        // console.log('the additional manager is: ' + JSON.stringify(data));
          const tempManager = data;
          // console.log('this is the additional manager: ');
          // console.log(tempManager[0].name);
          // console.log(tempManager[0]._id);
          // only do this if the array does not already contain the user id, else alert that the user is already a manager of this charity
          for (let l = 0; l < this.updateCharity.charityMngIds.length; l += 1) {
            // console.log('checking for already a manager');
            if (this.updateCharity.charityMngIds.indexOf(tempManager[0]._id) > -1) {
              return alert('this user is already a manager of this charity');
            }
          }
          this.updateCharity.charityMngIds.push(tempManager[0]._id);
          this.updateCharity.charityManagers.push(tempManager[0].name);
          if (thenDo === 'put') {
            this.putCharity();
          } else {
            this.postCharity();
          }
        } else {
          alert('There is no OHAF user with that email');
        }
        return null;
      });
  }

  attached() {
    this.createNewCharity();
  }
}
