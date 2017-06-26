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
    this.headers.url = url;
    this.headers.method = obj ? obj.method : 'GET';
    if (obj && obj.method === 'put') {
      this.user = obj.body;
    }
    this.status = 200;
    return Promise.resolve({
      Headers: this.headers,
      json: () => Promise.resolve([{charityTypes: ['Home', 'Elderly']}, {charityTypes: ['Home', 'Elderly', 'other']}, {charityTypes: []}])
    });
  }
}

describe('the Charity Module', () => {
  let charity;
  let app;
  let auth;
  let vc;
  let val;
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

  it('runs type picked when nothing is selected', (done) => {
    document.body.innerHTML = '<button id="newCharityButton">';
    charity.types = ['Christian', 'Hunger'];
    charity.typePicked();
    //expect(charity.newCharity.charityType.length).toBe(0);
    done();
  });

  it('runs type picked with valid types and other selected and can submit', (done) => {
    document.body.innerHTML = '<button id="newCharityButton">';
    charity.types = ['Christian', 'Hunger'];
    charity.newCharity.charityTypes = ['Christian', 'other'];
    charity.canSubmit = true;
    charity.typePicked();
    //expect(charity.newCharity.charityType.length).toBe(0);
    done();
  });

  it('runs type picked with valid types and other selected and cannot submit', (done) => {
    document.body.innerHTML = '<button id="newCharityButton">';
    charity.types = ['Christian', 'Hunger'];
    charity.newCharity.charityTypes = ['Christian', 'other'];
    charity.canSubmit = false;
    charity.typePicked();
    //expect(charity.newCharity.charityType.length).toBe(0);
    done();
  });

  it('validates the charity form to allow submit', (done) => {
    document.body.innerHTML = '<button id="newCharityButton">';
    charity.newCharity.charityTypes = ['Christian', 'other'];
    charity.canSubmit = false;
    charity.validType = true;
    charity.validate();
    //expect(charity.newCharity.charityType.length).toBe(0);
    done();
  });

  it('does not allow submit when type is not selected', (done) => {
    document.body.innerHTML = '<button id="newCharityButton">';
    charity.newCharity.charityTypes = ['Christian', 'other'];
    charity.canSubmit = false;
    charity.validType = false;
    charity.validate();
    //expect(charity.newCharity.charityType.length).toBe(0);
    done();
  });

  it('does not allow submit when validationResults are false', (done) => {
    document.body.innerHTML = '<button id="newCharityButton">';
    charity.newCharity.charityTypes = ['Christian', 'other'];
    charity.canSubmit = false;
    charity.validate();
    //expect(charity.newCharity.charityType.length).toBe(0);
    done();
  });

  it('allows submit when validationResults are true', (done) => {
    document.body.innerHTML = '<button id="newCharityButton">';
    charity.newCharity.charityTypes = ['True'];
    charity.validType = true;
    charity.validate();
    //expect(charity.newCharity.charityType.length).toBe(0);
    done();
  });

  it('new charity created', (done) => {
    //charity.app.appState = new AppStateStub();
    charity.activate();
    charity.user = {'name': 'Test Name', '_id': '32'};
    charity.newCharity.charityState = 'Alabama';
    charity.createCharity();
    expect(charity.newCharity.charityManagers[0]).toBe('Test Name');
    expect(charity.newCharity.charityState).toBe('Alabama');
    done();
  });

  it('deletes charity', (done) => {
    charity.deleteCharity();
    done();
  });
});
