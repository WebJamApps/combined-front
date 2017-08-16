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
    //console.log(url);
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
    //console.log(url);
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

  // it('activates', (done) => {
  //   charity.activate();
  //   done();
  // });

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

  it('it does not display the charities table when there are no charities', (done) => {
    charity2.activate();
    expect(charity2.charities.length).toBe(0);
    done();
  });

  // it('prevents the enter key', (done) => {
  //   charity.activate();
  //   let e = {keyCode: 13, preventDefault: function(){}};
  //   charity.preventEnter(e);
  //   //expect(charity2.charities.length).toBe(0);
  //   done();
  // });

  // it('does not prevent other events', (done) => {
  //   charity.activate();
  //   let e = {keyCode: 12, preventDefault: function(){}};
  //   charity.preventEnter(e);
  //   //expect(charity2.charities.length).toBe(0);
  //   done();
  // });

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
    //let e = {keyCode: 12, preventDefault: function(){}};
    charity.update = true;
    document.body.innerHTML = '<h3 id="charityDash"></h3><div id="charTable"></div><div id="updateCharitySection"><button id="createNewCharityButton"></button></div><div id="scheduleCharitySection"></div>';
    charity.updateCharityFunction(charity1);
    expect(charity.charityName).toBe('test charity');
    charity.update = false;
    document.body.innerHTML = '<h3 id="charityDash"></h3><div id="charTable"></div><div id="updateCharitySection"><button id="createNewCharityButton"></button></div><div id=""></div>';
    charity.createNewCharity();
    done();
  });

  it('creates a new charity in the database', (done) => {
    charity.activate();
    let user = {name: 'Josh', _id: '1234'};
    charity.user = user;
    //charity.user.name = 'Josh';
    //charity.user._id = '1234';
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
    //let e = {keyCode: 12, preventDefault: function(){}};
    document.body.innerHTML = '<div id="charityDash"></div>';
    charity.createCharity();
    // expect(charity.charityName).toBe('test charity');
    // document.body.innerHTML = '<div id="updateCharitySection"></div><div id=""></div>';
    // charity.updateCharityFunction(charity1);
    done();
  });

  it('detects when the charity type is changed in the update form', (done) => {
    charity.activate();
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
    document.body.innerHTML = '<button class="updateButton"></button>';
    charity.updateTypePicked();
    charity.canSubmit2 = false;
    charity.updateCharity = {
      'charityName': 'test charity',
      'charityCity': '',
      'charityState': '',
      'charityZipCode': '',
      'charityTypes': ['Christian'],
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
    let validationResults = [{
      result: {valid: true}}];
    charity.updateCanSubmit2(validationResults);
    done();
  });

  it('does not display charity types when there are none', (done) => {
    charity2.activate();
    charity2.charities = [{charityTypes: [''], charityManagers: ['Home', 'Elderly']}, {charityTypes: ['Home', 'Elderly', 'other'], charityManagers: ['Home', 'Elderly', 'other']}, {charityTypes: [], charityManagers: []}];
    charity2.buildTypes();
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

  // it('fetches the event from the database by eventid', (done) => {
  //   charity.activate();
  //   charity.showEvent('1234');
  //   done();
  // });

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
    //this.updateCharity.charityEmail
    charity2.findUserByEmail();
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

  // it('showScheduleCharity', (done) => {
  //   document.body.innerHTML = '<div id="scheduleCharitySection"></div>';
  //   let node = document.createElement('div');
  //   node.id = 'updateCharitySection';
  //   document.body.appendChild(node);
  //   charity.activate();
  //   charity.showScheduleCharity({charityName: 'Developer', _id: 'abcd1234'});
  //   done();
  // });

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
