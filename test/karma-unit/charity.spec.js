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
      json: () => Promise.resolve([{charityTypes: ['Home', 'Elderly'], charityManagers: ['Home', 'Elderly']}, {charityTypes: ['Home', 'Elderly', 'other'], charityManagers: ['Home', 'Elderly', 'other']}, {charityTypes: [], charityManagers: []}])
    });
  }
}

class HttpMockChar2 extends HttpMock {
  fetch(url, obj) {
    this.headers.url = url;
    this.headers.method = obj ? obj.method : 'GET';
    if (obj && obj.method === 'put') {
      this.user = obj.body;
    }
    this.status = 200;
    return Promise.resolve({
      Headers: this.headers,
      json: () => Promise.resolve([])
    });
  }
}

describe('the Charity Module', () => {
  let charity;
  let charity2;
  let app;
  let app2;
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
    app2 = new App(auth, new HttpMockChar2());
    app2.activate();
    charity = new Charity(app, vc, val);
    charity.app.appState = new AppStateStub();
    charity2 = new Charity(app2, vc, val);
    charity2.app.appState = new AppStateStub();
  });

  it('should call submit callback', (done) => {
    charity.validator2.cb([]);
    done();
  });

  it('displays the checkboxes inside a select box', (done) => {
    document.body.innerHTML = '  <div id="types" horizontal-align="right" vertical-align="top" style="margin-top:25px;"></div>';
    //charity.app.expanded = true;
    charity.app.showCheckboxes('types');
    expect(document.getElementById('types').style.display).toBe('block');
    done();
  });

  it('checkboxes closed', (done) => {
    document.body.innerHTML = '  <div id="types" horizontal-align="right" vertical-align="top" style="margin-top:25px;display:block"></div>';
    //charity.app.expanded = false;
    charity.app.showCheckboxes('types');
    expect(document.getElementById('types').style.display).toBe('none');
    done();
  });

  it('scrolls the charity dashboard into view after update', (done) => {
    document.body.innerHTML = '  <div id="charityDash" horizontal-align="right" vertical-align="top" style="margin-top:25px;"></div>';
    charity.setupValidation2 = function(){};
    charity.afterUpdate();
    //expect(charity.app.expanded).toBe(true);
    done();
  });

  it('it does not display the charities table when there are no charities', (done) => {
    charity2.activate();
    expect(charity2.charities.length).toBe(0);
    done();
  });

  it('it displays the new charity form on page load', (done) => {
    charity2.activate();
    charity2.setupValidation2 = function(){};
    document.body.innerHTML = '<div id="charityDash"></div><div id="updateCharitySection"></div>';
    charity2.attached();
    done();
  });

  it('displays the update charity table', (done) => {
    charity.activate();
    charity.setupValidation2 = function(){};
    let charity1 = {
      'charityName': 'test charity',
      'charityCity': '',
      'charityState': '',
      'charityZipCode': '',
      'charityTypes': ['other'],
      'charityManagers': [],
      'charityMngIds': [],
      'charityTypeOther': '',
      'charityTypesHtml': ''
    };
    charity.update = true;
    document.body.innerHTML = '<h3 id="charityDash"></h3><div id="charTable"></div><div id="updateCharitySection"><button id="createNewCharityButton"></button></div><div id="scheduleCharitySection"></div>';
    charity.updateCharityFunction(charity1);
    expect(charity.charityName).toBe('test charity');
    charity.update = false;
    document.body.innerHTML = '<h3 id="charityDash"></h3><div id="charTable"></div><div id="updateCharitySection"><button id="createNewCharityButton"></button></div><div id=""></div>';
    charity.createNewCharity();
    done();
  });

  it('has a list of states', (done) => {
    let states = [ 'Alabama', 'Alaska', 'American Samoa', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'District of Columbia',
      'Federated States of Micronesia', 'Florida', 'Georgia', 'Guam', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine',
      'Marshall Islands', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
      'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Northern Mariana Islands', 'Ohio', 'Oklahoma', 'Oregon', 'Palau', 'Pennsylvania', 'Puerto Rico',
      'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virgin Island', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
    states.sort();
    charity.activate();
    expect(charity.app.states).toContain(states[0]);
    expect(charity.app.states.length).toBe(states.length);
    done();
  });

  it('creates a new charity in the database with email as quote quote, null, and filled in', (done) => {
    charity.activate();
    let user = {name: 'Josh', _id: '1234'};
    charity.user = user;
    charity.setupValidation2 = function(){};
    charity.updateCharity = {
      'charityName': 'test charity',
      'charityCity': '',
      'charityState': '',
      'charityZipCode': '',
      'charityTypes': ['other'],
      'charityManagers': [],
      'charityMngIds': [],
      'charityTypeOther': '',
      'charityTypesHtml': ''
    };
    document.body.innerHTML = '<div id="charityDash"></div>';
    charity.createCharity();
    charity.updateCharity.charityEmail = '';
    charity.createCharity();
    charity.updateCharity.charityEmail = 'howdy@howdy.com';
    charity.createCharity();
    done();
  });

  it('detects when the charity type is changed in the update form', (done) => {
    charity.activate();
    charity.controller2 = {errors: [{_id: 123}]};
    charity.charityTypeValid = false;
    charity.updateCharity = {
      'charityName': 'test charity',
      'charityCity': '',
      'charityState': '',
      'charityZipCode': '',
      'charityTypes': [],
      'charityManagers': [],
      'charityMngIds': [],
      'charityTypeOther': '',
      'charityTypesHtml': ''
    };
    document.body.innerHTML = '<button class="updateButton"></button>';
    charity.updateTypePicked();
    charity.canSubmit2 = false;
    charity.updateCharity = {
      'charityName': 'test charity',
      'charityCity': '',
      'charityState': '',
      'charityZipCode': '',
      'charityTypes': ['Christian', 'other'],
      'charityManagers': [],
      'charityMngIds': [],
      'charityTypeOther': '',
      'charityTypesHtml': ''
    };
    charity.updateTypePicked();
    done();
  });

  it('it displays the submit or update button on the form if the form is valid', (done) => {
    charity.activate();
    charity.validType2 = true;
    let validationResults = [{valid: true}];
    charity.updateCanSubmit2(validationResults);
    done();
  });

  it('it does not try to display the submit or update button if it does not exist', (done) => {
    charity.activate();
    charity.validType2 = true;
    document.body.innerHTML = '<button class="updateButton"></button>';
    let validationResults = [{valid: false}, {valid: true}, {valid: false}];
    // let validationResults = [];
    charity.updateCanSubmit2(validationResults);
    done();
  });

  it('does not display charity types when there are none', (done) => {
    charity2.activate();
    charity2.charities = [{charityTypes: [''], charityManagers: ['Home', 'Elderly']}, {charityTypes: ['Home', 'Elderly', 'other'], charityManagers: ['Home', 'Elderly', 'other']}, {charityTypes: [], charityManagers: []}];
    charity2.app.buildPTag(charity2.charities, 'charityTypes', 'charityTypeOther', 'charityTypesHtml');
    expect(charity2.charities[0].charityTypesHtml).toBe('<p style="font-size:10pt">not specified</p>');
    done();
  });

  it('displays charity types when there are some', (done) => {
    charity2.activate();
    charity2.charities = [{charityTypes: [''], charityManagers: ['Home', 'Elderly']}, {charityTypes: ['Home', 'Elderly', 'other'], charityManagers: ['Home', 'Elderly', 'other']}, {charityTypes: [], charityManagers: []}];
    charity2.app.buildPTag(charity2.charities, 'charityTypes', 'charityTypeOther', 'charityTypesHtml');
    expect(charity2.charities[1].charityTypesHtml).not.toBe('<p style="font-size:10pt">not specified</p>');
    done();
  });

  it('does not display charity managers when there are none', (done) => {
    charity2.activate();
    charity2.charities = [{charityTypes: [''], charityManagers: ['']}, {charityTypes: ['Home', 'Elderly', 'other'], charityManagers: ['Home', 'Elderly', 'other']}, {charityTypes: [], charityManagers: []}];
    charity2.buildManagers();
    done();
  });

  it('does not remove the user as manager when he or she is not assigned to the charity', (done) => {
    charity2.activate();
    let fakeCharity = {
      charityManagers: ['Josh'], charityMngIds: '1234'
    };
    let fakeUser = {
      name: 'Betty'
    };
    charity2.uid = '4556';
    charity2.user = fakeUser;
    charity2.removeManager(fakeCharity);
    done();
  });

  it('displays the submit button when a type has been selected and the rest of the form is valid', (done) => {
    charity2.activate();
    charity2.controller2 = {errors: []};
    charity2.updateCharity = {
      'charityTypes': [ 'Christian', 'Homeless']
    };
    document.body.innerHTML = '<button id="newCharityButton" class="updateButton">';
    charity2.canSubmit2 = true;
    charity2.updateTypePicked();
    done();
  });

  it('does not add a new charity manager if the email is not a user of the app', (done) => {
    charity2.activate();
    charity2.updateCharity = {
      'charityName': 'test charity',
      'charityCity': '',
      'charityState': '',
      'charityZipCode': '',
      'charityTypes': ['Christian'],
      'charityManagers': [],
      'charityMngIds': [],
      'charityTypeOther': '',
      'charityTypesHtml': '',
      'charityEmail': 'yoyo@yoyo.com'
    };
    charity2.findUserByEmail();
    done();
  });

  it('it checks if a charity does not have any events', (done) => {
    charity2.activate();
    charity2.charities = [{_id: '1234', charityTypes: [''], charityManagers: ['']}, {_id: '2345', charityTypes: ['Home', 'Elderly', 'other'], charityManagers: ['Home', 'Elderly', 'other']}];
    charity2.checkEvents();
    done();
  });

  it('deletes charity', (done) => {
    charity.deleteCharity();
    done();
  });

  it('validate2', (done) => {
    charity.controller2 = {errors: []};
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

  it('removes manager', (done) => {
    charity.user = {name: 'Dev Patel'};
    charity.removeManager(updatedCharity);
    done();
  });

  it('should open checkbox', (done) => {
    document.body.innerHTML = '<div id="typesUpdate"></div>';
    let el = document.getElementById('typesUpdate');
    el.style.display = 'block';
    charity.updateCharity = {charityTypes: ['other']};
    charity.controller2 = {errors: []};
    charity.openCheckboxAndValidate('typesUpdate');
    done();
  });
});
