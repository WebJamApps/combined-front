import { Validator } from 'aurelia-validation';
import { Charity } from '../../src/dashboard-child-routes/charity';
import { App } from '../../src/app';
import { AuthStub, HttpMock, AppStateStub } from './commons';

class VCMock {
  createForCurrentScope() {
    return { validateTrigger: null };
  }
}
class ValidatorMock extends Validator {
  constructor(a, b) {
    super();
    this.a = a;
    this.b = b;
  }

  validateObject(obj) {
    if (obj.charityTypes.indexOf('True') > -1) {
      return Promise.resolve([{
        rule: Object, object: Object, propertyName: 'charityPhoneNumber', valid: true, message: 'Charity Phone Number is correct'
      }]);
    }
    return Promise.resolve([{
      rule: Object, object: Object, propertyName: 'charityPhoneNumber', valid: false, message: 'Charity Phone Number is not correct'
    }]);
  }

  validateProperty() {
    // console.log(rules);
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
      json: () => Promise.resolve([{ charityTypes: ['Home', 'Elderly'], charityManagers: ['Home', 'Elderly'] },
        { charityTypes: ['Home', 'Elderly', 'other'], charityManagers: ['Home', 'Elderly', 'other'] }, { charityTypes: [], charityManagers: [] }])
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
  let charity, charity2, app, app2, auth, vc, val;
  const updatedCharity = {
    charityName: '',
    charityCity: '',
    charityState: '',
    charityZipCode: '',
    charityTypes: [],
    charityManagers: [],
    charityMngIds: [],
    charityTypeOther: '',
    charityTypesHtml: '',
    charityPhoneNumber: '0237654897'
  };
  beforeEach(() => {
    vc = new VCMock();
    val = new ValidatorMock();
    auth = new AuthStub();
    auth.setToken({ sub: 'aowifjawifhiawofjo' });
    app = new App(auth, new HttpMockChar());
    app.activate();
    app2 = new App(auth, new HttpMockChar2());
    app2.activate();
    charity = new Charity(app, vc, val);
    charity.app.appState = new AppStateStub();
    charity2 = new Charity(app2, vc, val);
    charity2.app.appState = new AppStateStub();
  });
  // it('should call submit callback', (done) => {
  //   charity.validator2.cb([]);
  //   done();
  // });
  it('displays the checkboxes inside a select box', (done) => {
    document.body.innerHTML = '  <div id="types" horizontal-align="right" vertical-align="top" style="margin-top:25px;"></div>';
    charity.showCheckboxes('types');
    expect(document.getElementById('types').style.display).toBe('block');
    done();
  });
  it('checkboxes closed', (done) => {
    document.body.innerHTML = '  <div id="types" horizontal-align="right" vertical-align="top" style="margin-top:25px;display:block"></div>';
    charity.showCheckboxes('types');
    expect(document.getElementById('types').style.display).toBe('none');
    done();
  });
  it('it does not display the charities table when there are no charities', (done) => {
    charity2.activate();
    expect(charity2.charities).toHaveLength(0);
    done();
  });
  it('it displays the new charity form on page load', (done) => {
    charity2.activate();
    charity2.setupValidation2 = function setupValidation2() {};
    charity2.controller2 = { validate() {} };
    document.body.innerHTML = '<div id="charityDash"></div><div id="updateCharitySection"><div id="charTable">'
    + '</div><button id="createNewCharityButton"></button></div>';
    charity2.attached();
    done();
  });
  it('displays the update charity table', (done) => {
    charity.activate();
    charity.setupValidation2 = function setupValidation2() {};
    const charity1 = {
      charityName: 'test charity',
      charityCity: '',
      charityState: '',
      charityZipCode: '',
      charityTypes: ['other'],
      charityManagers: [],
      charityMngIds: [],
      charityTypeOther: '',
      charityTypesHtml: '',
      charityEmail: ''
    };
    charity.update = true;
    charity.controller2 = { validate() {} };
    document.body.innerHTML = '<h3 id="charityDash"></h3><div class="ctypeerror" id="charTable">'
    + '</div><div id="typesUpdate"></div><div id="updateCharitySection"><button id="createNewCharityButton">'
    + '</button><button id="updateCharityButton"></button></div><div id="scheduleCharitySection"></div>';
    charity.updateCharityFunction(charity1);
    expect(charity.charityName).toBe('test charity');
    charity.update = false;
    document.body.innerHTML = '<h3 id="charityDash"></h3><div id="charTable"></div><div id="updateCharitySection">'
    + '<button id="createNewCharityButton"></button></div><div id=""></div>';
    charity.createNewCharity();
    done();
  });

  it('has a list of states', (done) => {
    const states = ['Alabama', 'Alaska', 'American Samoa', 'Arizona', 'Arkansas', 'California', 'Colorado',
      'Connecticut', 'Delaware', 'District of Columbia',
      'Federated States of Micronesia', 'Florida', 'Georgia', 'Guam', 'Hawaii', 'Idaho', 'Illinois', 'Indiana',
      'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine',
      'Marshall Islands', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana',
      'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
      'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Northern Mariana Islands', 'Ohio', 'Oklahoma', 'Oregon',
      'Palau', 'Pennsylvania', 'Puerto Rico',
      'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virgin Island',
      'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
    states.sort();
    expect(charity.app.states).toContain(states[0]);
    expect(charity.app.states).toHaveLength(states.length);
    done();
  });

  // it('creates a new charity in the database with email as quote quote, null, and filled in', (done) => {
  //   charity.activate();
  //   const user = { name: 'Josh', _id: '1234' };
  //   charity.user = user;
  //   charity.setupValidation2 = function setupValidation2() {};
  //   charity.updateCharity = {
  //     charityName: 'test charity',
  //     charityCity: '',
  //     charityState: '',
  //     charityZipCode: '',
  //     charityTypes: ['other'],
  //     charityManagers: [],
  //     charityMngIds: [],
  //     charityTypeOther: '',
  //     charityTypesHtml: '',
  //     charityEmail: ''
  //   };
  //   document.body.innerHTML = '<div id="charityDash"></div>';
  //   charity.updateCharity.charityEmail = '';
  //   charity.createCharity();
  //   charity.updateCharity.charityEmail = 'howdy@howdy.com';
  //   charity.createCharity();
  //   done();
  // });
  it('detects when the charity type is changed in the update form', (done) => {
    charity.activate();
    charity.controller2 = { errors: [{ _id: 123 }], validate: () => {} };
    charity.charityTypeValid = false;
    charity.updateCharity = {
      charityName: 'test charity',
      charityCity: '',
      charityState: '',
      charityZipCode: '',
      charityTypes: [],
      charityManagers: [],
      charityMngIds: [],
      charityTypeOther: '',
      charityTypesHtml: '',
      charityEmail: ''
    };
    document.body.innerHTML = '<button class="updateButton ctypeerror"></button>';
    charity.updateTypePicked();
    expect(document.getElementsByClassName('ctypeerror')[0].style.display).toBe('block');
    charity.canSubmit2 = false;
    charity.updateCharity = {
      charityName: 'test charity',
      charityCity: '',
      charityState: '',
      charityZipCode: '',
      charityTypes: ['Christian', 'other'],
      charityManagers: [],
      charityMngIds: [],
      charityTypeOther: '',
      charityTypesHtml: '',
      charityEmail: ''
    };
    charity.updateTypePicked();
    expect(document.getElementsByClassName('ctypeerror')[0].style.display).toBe('none');
    done();
  });
  it('it displays the submit or update button on the form if the form is valid', (done) => {
    charity.activate();
    charity.validType2 = true;
    const validationResults = [{ valid: true }];
    charity.update = true;
    charity.counter = 9;
    document.body.innerHTML = '<ul id="valErrors"></ul><button class="updateButton"></button>';
    charity.updateCanSubmit2(validationResults);
    expect(charity.canSubmit2).toBe(true);
    done();
  });
  it('displays the create new charity webform with hidden submit button and the charities table', (done) => {
    jasmine.clock().install();
    charity.activate();
    document.body.innerHTML = '<div id="charTable" style="display:none"></div><div><button id="createNewCharityButton" '
    + 'style="display:block">Create</button>';
    charity.showUpdateCharity = function showUpdateCharity() {};
    charity.createNewCharity();
    jasmine.clock().tick(1);
    expect(document.getElementById('createNewCharityButton').style.display).toBe('none');
    expect(document.getElementById('charTable').style.display).toBe('block');
    done();
    jasmine.clock().uninstall();
  });
  it('hides the update charity button if it was displayed', (done) => {
    charity.activate();
    document.body.innerHTML = '<div id="charTable" style="display:none"></div><div id="updateCharitySection">'
    + '</div><div><button id="updateCharityButton" style="display:block">Create</button>';
    charity.setupValidation2 = function setupValidation2() {};
    charity.update = true;
    const myCharity = {
      charityName: 'test charity',
      charityCity: '',
      charityState: '',
      charityZipCode: '',
      charityTypes: ['Christian', 'other'],
      charityManagers: [],
      charityMngIds: [],
      charityTypeOther: '',
      charityTypesHtml: '',
      charityEmail: ''
    };
    charity.controller2 = { validate() {} };
    charity.showUpdateCharity(myCharity);
    expect(document.getElementById('updateCharityButton').style.display).toBe('block');
    done();
  });
  it('it does not try to display the submit or update button if it does not exist', (done) => {
    charity.activate();
    charity.validType2 = true;
    charity.controller2 = { errors: [{ _id: 123 }], validate: () => {} };
    document.body.innerHTML = '<ul id="valErrors"></ul><button class="updateButton"></button>';
    const validationResults = [{ valid: false }, { valid: true }, { valid: false }];
    charity.updateCanSubmit2(validationResults);
    expect(charity.canSubmit2).toBe(false);
    done();
  });
  it('does not disable the submit button for create new charity', (done) => {
    charity.activate();
    charity.validType2 = true;
    charity.update = false;
    document.body.innerHTML = '<ul id="valErrors"></ul><button class="updateButton" style="display:none"></button>';
    const validationResults = [{ valid: true }, { valid: true }, { valid: true }];
    charity.updateCanSubmit2(validationResults);
    expect(document.getElementsByClassName('updateButton')[0].style.display).toBe('block');
    done();
  });
  it('disables the update button when the update form initially displays', (done) => {
    charity.activate();
    charity.validType2 = true;
    charity.update = true;
    charity.counter = 1;
    document.body.innerHTML = '<ul id="valErrors"></ul><button class="updateButton" style="display:none"></button>';
    const validationResults = [{ valid: true }, { valid: true }, { valid: true }];
    charity.updateCanSubmit2(validationResults);
    expect(document.getElementsByClassName('updateButton')[0].disabled).toBe(true);
    done();
  });

  it('does not display charity types when there are none', (done) => {
    charity2.activate();
    charity2.charities = [{ charityTypes: [''], charityManagers: ['Home', 'Elderly'] }, {
      charityTypes:
       ['Home', 'Elderly', 'other'],
      charityManagers: ['Home', 'Elderly', 'other']
    }, { charityTypes: [], charityManagers: [] }];
    charity2.app.buildPTag(charity2.charities, 'charityTypes', 'charityTypeOther', 'charityTypesHtml');
    expect(charity2.charities[0].charityTypesHtml).toBe('<p style="font-size:10pt">not specified</p>');
    done();
  });

  it('displays charity types when there are some', (done) => {
    charity2.activate();
    charity2.charities = [{ charityTypes: [''], charityManagers: ['Home', 'Elderly'] }, {
      charityTypes:
      ['Home', 'Elderly', 'other'],
      charityManagers: ['Home', 'Elderly', 'other']
    }, { charityTypes: [], charityManagers: [] }];
    charity2.app.buildPTag(charity2.charities, 'charityTypes', 'charityTypeOther', 'charityTypesHtml');
    expect(charity2.charities[1].charityTypesHtml).not.toBe('<p style="font-size:10pt">not specified</p>');
    done();
  });

  it('does not display charity managers when there are none', (done) => {
    charity2.activate();
    charity2.charities = [{ charityTypes: [''], charityManagers: [''] }, {
      charityTypes:
      ['Home', 'Elderly', 'other'],
      charityManagers: ['Home', 'Elderly', 'other']
    }, { charityTypes: [], charityManagers: [] }];
    charity2.buildManagers();
    done();
  });
  it('does not remove the user as manager when he or she is not assigned to the charity', (done) => {
    charity2.activate();
    const fakeCharity = {
      charityManagers: ['Josh'], charityMngIds: '1234'
    };
    const fakeUser = {
      name: 'Betty'
    };
    charity2.uid = '4556';
    charity2.user = fakeUser;
    charity2.removeManager(fakeCharity);
    done();
  });
  it('displays the submit button when a type has been selected and the rest of the form is valid', (done) => {
    charity2.activate();
    charity2.controller2 = { errors: [{ _id: 123 }], validate: () => {} };
    charity2.updateCharity = { charityTypes: ['Christian', 'Homeless'] };
    document.body.innerHTML = '<ul id="valErrors"></ul><button id="newCharityButton" class="updateButton ctypeerror">';
    charity2.canSubmit2 = true;
    charity2.updateTypePicked();
    expect(document.getElementsByClassName('ctypeerror')[0].style.display).toBe('none');
    done();
  });
  it('does not add a new charity manager if the email is not a user of the app', (done) => {
    charity2.activate();
    charity2.updateCharity = {
      charityName: 'test charity',
      charityCity: '',
      charityState: '',
      charityZipCode: '',
      charityTypes: ['Christian'],
      charityManagers: [],
      charityMngIds: [],
      charityTypeOther: '',
      charityTypesHtml: '',
      charityEmail: 'yoyo@yoyo.com'
    };
    charity2.findUserByEmail();
    done();
  });
  it('it checks if a charity does not have any events', (done) => {
    charity2.activate();
    charity2.charities = [{ _id: '1234', charityTypes: [''], charityManagers: [''] },
      { _id: '2345', charityTypes: ['Home', 'Elderly', 'other'], charityManagers: ['Home', 'Elderly', 'other'] }];
    charity2.checkEvents();
    done();
  });

  it('deletes charity', (done) => {
    charity.deleteCharity();
    done();
  });

  it('updateCharityFunct', (done) => {
    charity.updateCharity = updatedCharity;
    const node = document.createElement('div');
    node.id = 'charityDash';
    document.getElementsByTagName('body')[0].appendChild(node);
    charity.updateCharity.charityEmail = 'dannyyean@me.com';
    charity.updateCharityFunct();
    charity.updateCharity.charityEmail = 'dannyyean@me.com';
    charity.updateCharityFunct();
    done();
  });

  it('updateCharityFunct put charity', (done) => {
    charity.updateCharity = updatedCharity;
    const node = document.createElement('div');
    node.id = 'charityDash';
    document.getElementsByTagName('body')[0].appendChild(node);
    charity.updateCharity.charityEmail = '';
    charity.updateCharityFunct();
    done();
  });

  it('removes manager', (done) => {
    charity.user = { name: 'Dev Patel' };
    charity.removeManager(updatedCharity);
    done();
  });
});
