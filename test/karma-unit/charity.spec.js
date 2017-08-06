import {Charity} from '../../src/dashboard-child-routes/charity';
import {App} from '../../src/app';
import {AuthStub, HttpMock, AppStateStub} from './commons';
import {Validator} from 'aurelia-validation';

class VCMock {
  createForCurrentScope(validator) {
    return {validateTrigger: null};
  }
}

class ValidatorMock extends Validator {
  constructor(a, b) {
    super();
    this.a = a;
    this.b = b;
  }
  validateObject(obj, rules) {
    console.log('obj');
    console.log(obj);
    if (obj.charityTypes.indexOf('True') > -1){
      return Promise.resolve([{rule: Object, object: Object, propertyName: 'charityPhoneNumber', valid: true, message: 'Charity Phone Number is correct'}]);
    }
    return Promise.resolve([{rule: Object, object: Object, propertyName: 'charityPhoneNumber', valid: false, message: 'Charity Phone Number is not correct'}]);
  }
  validateProperty(prop, val, rules) {
    return Promise.resolve({});
  }
}

class HttpMockChar extends HttpMock {
  fetch(url, obj) {
    console.log(url);
    this.headers.url = url;
    this.headers.method = obj ? obj.method : 'GET';
    if (obj && obj.method === 'put') {
      this.user = obj.body;
    }
    this.status = 200;
    return Promise.resolve({
      Headers: this.headers,
      json: () => Promise.resolve([{charityTypes: ['Home', 'Elderly'], charityManagers: ['Home', 'Elderly']}, {charityTypes: ['Home', 'Elderly', 'other'], charityManagers: ['Home', 'Elderly', 'other']}, {charityTypes: [], charityManagers: []}])
    });
  }
}

describe('the Charity Module', () => {
  let charity;
  let app;
  let auth;
  let vc;
  let val;
  let updatedCharity = {
    'charityName': '',
    'charityCity': '',
    'charityState': '',
    'charityZipCode': '',
    'charityTypes': [],
    'charityManagers': [],
    'charityMngIds': [],
    'charityTypeOther': '',
    'charityTypesHtml': '',
    'charityPhoneNumber': '0237654897'
  };

  beforeEach(() => {
    vc = new VCMock();
    val = new ValidatorMock();
    auth = new AuthStub();
    auth.setToken({sub: 'aowifjawifhiawofjo'});
    app = new App(auth, new HttpMockChar());
    app.activate();
    charity = new Charity(app, vc, val);
    charity.app.appState = new AppStateStub();
  });

  it('activates', (done) => {
    charity.activate();
    done();
  });

  it('checkboxes expanded', (done) => {
    document.body.innerHTML = '  <iron-dropdown id="types" horizontal-align="right" vertical-align="top" style="margin-top:25px;"></iron-dropdown>';
    charity.expanded = true;
    charity.showCheckboxes('types');
    expect(charity.expanded).toBe(false);
    done();
  });

  it('checkboxes closed', (done) => {
    document.body.innerHTML = '  <iron-dropdown id="types" horizontal-align="right" vertical-align="top" style="margin-top:25px;"></iron-dropdown>';
    charity.expanded = false;
    charity.showCheckboxes('types');
    expect(charity.expanded).toBe(true);
    done();
  });

  // it('runs type picked when nothing is selected', (done) => {
  //   charity.activate();
  //   document.body.innerHTML = '<button id="newCharityButton">';
  //   charity.types = ['Christian', 'Hunger'];
  //   charity.typePicked();
  //   done();
  // });

  // it('runs type picked with valid types and other selected and can submit', (done) => {
  //   charity.activate();
  //   document.body.innerHTML = '<button id="newCharityButton">';
  //   charity.types = ['Christian', 'Hunger'];
  //   charity.newCharity.charityTypes = ['Christian', 'other'];
  //   charity.canSubmit = true;
  //   charity.typePicked();
  //   done();
  // });

  // it('runs type picked with valid types and other selected and cannot submit', (done) => {
  //   charity.activate();
  //   document.body.innerHTML = '<button id="newCharityButton">';
  //   charity.types = ['Christian', 'Hunger'];
  //   charity.newCharity.charityTypes = ['Christian', 'other'];
  //   charity.canSubmit = false;
  //   charity.typePicked();
  //   done();
  // });

  // it('validates the charity form to allow submit', (done) => {
  //   charity.activate();
  //   document.body.innerHTML = '<button id="newCharityButton">';
  //   charity.newCharity.charityTypes = ['Christian', 'other'];
  //   charity.canSubmit = false;
  //   charity.validType = true;
  //   charity.validate();
  //   done();
  // });

  // it('does not allow submit when type is not selected', (done) => {
  //   charity.activate();
  //   document.body.innerHTML = '<button id="newCharityButton">';
  //   charity.newCharity.charityTypes = ['Christian', 'other'];
  //   charity.canSubmit = false;
  //   charity.validType = false;
  //   charity.validate();
  //   done();
  // });

  // it('does not allow submit when validationResults are false', (done) => {
  //   charity.activate();
  //   document.body.innerHTML = '<button id="newCharityButton">';
  //   charity.newCharity.charityTypes = ['Christian', 'other'];
  //   charity.canSubmit = false;
  //   charity.validate();
  //   done();
  // });

  // it('allows submit when validationResults are true', (done) => {
  //   charity.activate();
  //   document.body.innerHTML = '<button id="newCharityButton">';
  //   charity.newCharity.charityTypes = ['True'];
  //   charity.validType = true;
  //   charity.validate();
  //   done();
  // });

  // it('new charity created', (done) => {
  //   charity.activate();
  //   charity.user = {'name': 'Test Name', '_id': '32'};
  //   charity.newCharity.charityState = 'Alabama';
  //   document.body.innerHTML = '<div id="charityDash"></div>';
  //   charity.createCharity();
  //   expect(charity.newCharity.charityManagers[0]).toBe('Test Name');
  //   expect(charity.newCharity.charityState).toBe('Alabama');
  //   done();
  // });

  it('deletes charity', (done) => {
    charity.deleteCharity();
    done();
  });

  it('showScheduleCharity', (done) => {
    document.body.innerHTML = '<div id="scheduleCharitySection"></div>';
    let node = document.createElement('div');
    node.id = 'updateCharitySection';
    document.body.appendChild(node);
    charity.activate();
    charity.showScheduleCharity({charityName: 'Developer', _id: 'abcd1234'});
    done();
  });

  // it('updateTypePicked', (done) => {
  //   let node = document.createElement('button');
  //   node.id = 'updateCharityButton';
  //   document.getElementsByTagName('body')[0].appendChild(node);
  //   charity.types = ['Christian', 'Environmental', 'Hunger', 'Animal Rights', 'Homeless', 'Veterans', 'Elderly'];
  //   charity.canSubmit2 = true;
  //   charity.updateCharity = {charityTypes: ['Hunger']};
  //   charity.updateTypePicked();
  //   charity.updateCharity = {charityTypes: ['Hunger', 'other']};
  //   charity.updateTypePicked();
  //   done();
  // });

  it('validate2', (done) => {
    charity.updateCharity = {charityTypes: ['Hunger', 'other'], charityName: 'okay'};
    charity.validate2();
    done();
  });

  it('updateCharityFunct', (done) => {
    charity.updateCharity = updatedCharity;
    let node = document.createElement('div');
    node.id = 'charityDash';
    document.getElementsByTagName('body')[0].appendChild(node);
    charity.updateCharityFunct();
    charity.updateCharity.charityEmail = 'dannyyean@me.com';
    charity.updateCharityFunct();
    done();
  });

  it('updateCharityFunct put charity', (done) => {
    charity.updateCharity = updatedCharity;
    let node = document.createElement('div');
    node.id = 'charityDash';
    document.getElementsByTagName('body')[0].appendChild(node);
    charity.updateCharity.charityEmail = null;
    charity.updateCharityFunct();
    done();
  });

  // it('showUpdateCharity', (done) => {
  //   let node = document.createElement('div');
  //   let section = document.createElement('section');
  //   node.id = 'updateCharitySection';
  //   section.id = 'scheduleCharitySection';
  //   document.getElementsByTagName('body')[0].appendChild(node);
  //   document.getElementsByTagName('body')[0].appendChild(section);
  //   updatedCharity.charityEmail = 'dannyyean@my.com';
  //   charity.showUpdateCharity(updatedCharity);
  //   done();
  // });

  it('removes manager', (done) => {
    charity.user = {name: 'Dev Patel'};
    charity.removeManager(updatedCharity);
    done();
  });
});
