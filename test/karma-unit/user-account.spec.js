import { Validator } from 'aurelia-validation';
import { UserAccount } from '../../src/dashboard-child-routes/user-account';
import {
  AuthStub, HttpMock, AppStateStub, RouterStub
} from './commons';
import { App } from '../../src/app';

const sinon = require('sinon');

function testAsync(runAsync) {
  return (done) => {
    runAsync().then(done, (e) => { fail(e); done(); });
  };
}
class VCMock {
  createForCurrentScope() {
    return { validateTrigger: null };
  }
}
class HttpStub extends HttpMock {
  fetch(url) {
    if (url === '/user/auth/changeemail') {
      return Promise.resolve({
        json: () => ({ message: 'in the jungle' })
      });
    }
    return Promise.resolve({
      json: () => [{ name: 'in the jungle' }]
    });
  }
}
class HttpStub2 extends HttpMock {
  fetch(url) {
    if (url === '/user/auth/changeemail') {
      return Promise.resolve({
        json: () => ({ email: 'yo@yo.com' })
      });
    }
    return Promise.resolve({
      json: () => [{ name: 'in the jungle' }]
    });
  }
}
class ValidatorMock extends Validator {
  constructor(a, b) {
    super();
    this.a = a;
    this.b = b;
  }

  validateObject() {
    return Promise.resolve([{ name: 'john', valid: true }]);
  }

  validateProperty() {
    return Promise.resolve({});
  }
}
describe('the UserAccount Module', () => {
  let ua, app, auth;
  beforeEach(() => {
    auth = new AuthStub();
    auth.setToken({ sub: 'aowifjawifhiawofjo' });
    app = new App(auth, new HttpStub());
    app.router = new RouterStub();
    app.activate();
    ua = new UserAccount(app, new VCMock(), new ValidatorMock());
    ua.app.appState = new AppStateStub();
    ua.selectedCauses = [];
    ua.selectedWorks = [];
    ua.selectedTalents = [];
    ua.activate();
    ua.user = {
      name: 'Iddris Elba',
      email: 'yo@yo.com',
      userType: 'Charity',
      _id: '3333333',
      volTalents:
      ['childcare', 'other'],
      volCauses: ['Environmental', 'other'],
      volWorkPrefs: ['counseling', 'other'],
      volCauseOther: '',
      volTalentOther: '',
      volWorkOther: ''
    };
  });
  it('should validate property', (done) => {
    ua.validator.validateProperty({}, 'school', 'schoolRules');
    done();
  });
  it('should activate and get the user type from appState', testAsync(async () => {
    ua.app.appState.getUser = function getUser() {
      return new Promise((resolve) => {
        resolve({ userType: 'monster', email: 'yo@yo.com' });
      });
    };
    ua.setupValidation = function setupValidation() {};
    await ua.activate();
    expect(ua.newUserType).toBe('monster');
  }));
  it('should set charity', (done) => {
    ua.setCharity();
    done();
  });
  it('should set the user status', (done) => {
    ua.disableUser('disabled');
    expect(ua.user.userStatus).toBe('disabled');
    done();
  });
  it('should check the user email when it is a google account', (done) => {
    ua.isGoogleEmail = false;
    ua.user = {
      name: 'Iddris Elba',
      email: 'j@gmail.com',
      userType: 'Charity',
      _id: '3333333',
      volTalents:
      ['childcare', 'other'],
      volCauses: ['Environmental', 'other'],
      volWorkPrefs: ['counseling', 'other'],
      volCauseOther: '',
      volTalentOther: '',
      volWorkOther: ''
    };
    ua.checkUserEmail();
    expect(ua.isGoogleEmail).toBe(true);
    done();
  });
  it('updates a user when email has changed', (done) => {
    ua.originalEmail = 'yo@yo.com';
    ua.user.email = 'bye@bye.com';
    ua.updateUser();
    expect(ua.user.changeemail).toBe('bye@bye.com');
    done();
  });
  it('updates a user when email has not changed', (done) => {
    ua.user.changeemail = '';
    ua.originalEmail = 'bye@bye.com';
    ua.user.email = 'bye@bye.com';
    ua.updateUser();
    expect(ua.user.changeemail).toBe('');
    done();
  });
  it('should allow Librarian user to change their user type', (done) => {
    ua.user.userType = 'Librarian';
    ua.checkChangeUserType();
    expect(ua.canChangeUserType).toBe(true);
    done();
  });
  it('fixes events that are not configured with people scheduled', (done) => {
    ua.events2 = [{ voPeopleScheduled: ['123', '234'] }];
    const checker = ua.events2;
    ua.fixPeopleScheduled(ua.events2);
    expect(ua.events2).toBe(checker);
    ua.events2 = [{ id: '123' }];
    ua.fixPeopleScheduled(ua.events2);
    expect(ua.events2[0].voPeopleScheduled).toHaveLength(0);
    done();
  });
  it('checks for scheduled events by a volunteer user', (done) => {
    ua.user.userType = 'Volunteer';
    ua.fetchAllEvents = function fetchAllEvents() { return Promise.resolve(); };
    ua.checkChangeUserType();
    done();
  });
  it('should allow Charity user to change their user type if they have no charities', (done) => {
    ua.user.userType = 'Charity';
    ua.app.httpClient.fetch = function fetch() {
      return Promise.resolve({
        json: () => Promise.resolve([])
      });
    };
    ua.checkChangeUserType();
    expect(ua.canChangeUserType).toBe(true);
    done();
  });
  it('should not allow Charity user to change their user type if they have charities', testAsync(async () => {
    ua.user.userType = 'Charity';
    ua.app.httpClient.fetch = function fetch() {
      return Promise.resolve({
        json: () => Promise.resolve([{ _id: '1' }])
      });
    };
    await ua.checkChangeUserType();
    expect(ua.canChangeUserType).toBe(false);
  }));
  it('does not allow change user type or delete if signed up for an event', testAsync(async () => {
    ua.uid = '123';
    ua.events2 = [{ voPeopleScheduled: ['123'] }];
    ua.changeReasons = '';
    await ua.checkScheduled();
    expect(ua.canChangeUserType).toBe(false);
  }));
  it('allows change user type when scheduled event is in the past', testAsync(async () => {
    ua.uid = '123';
    ua.events2 = [{ voPeopleScheduled: ['123'], past: true }];
    ua.changeReasons = '';
    await ua.checkScheduled();
    expect(ua.canChangeUserType).toBe(true);
  }));
  it('allows change user type when no books have been checked out', (done) => {
    ua.uid = '123';
    ua.changeUserType = true;
    ua.events2 = [{ voPeopleScheduled: ['123'], past: true }];
    ua.changeReasons = '';
    ua.user = {};
    ua.user.userType = 'Reader';
    const bMock = sinon.mock(ua.app.httpClient);
    const books = { json() { return Promise.resolve([]); } };
    bMock.expects('fetch').resolves(books);
    ua.checkReader();
    expect(ua.canChangeUserType).toBe(true);
    bMock.restore();
    done();
  });
  it('does not allow change user type and we already have the reason', testAsync(async () => {
    ua.uid = '123';
    ua.events2 = [{ voPeopleScheduled: ['123'], past: false }];
    ua.changeReasons = '<li>You are scheduled to work an event.</li>';
    await ua.checkScheduled();
    expect(ua.canChangeUserType).toBe(false);
  }));
  it('it shows the update button after we change the user status', testAsync(async () => {
    document.body.innerHTML = '<button id="updateUserButton" style="display:none">Update</button>';
    ua.showUpdateButton();
    expect(document.getElementById('updateUserButton').style.display).toBe('block');
  }));
  it('allow change user type or delete if not signed up for an event', testAsync(async () => {
    ua.uid = '123';
    ua.events2 = [{ voPeopleScheduled: ['1234', '1235'] }];
    await ua.checkScheduled();
    expect(ua.canChangeUserType).toBe(true);
  }));
  it('should check whether update can submit', (done) => {
    document.body.innerHTML = '<button id="updateUserButton">Update</button>';
    ua.updateCanSubmit([{ valid: false }]);
    expect(document.getElementById('updateUserButton').style.display).toBe('none');
    done();
  });
  it('should check whether update can submit when valid', (done) => {
    document.body.innerHTML = '<button id="updateUserButton">Update</button>';
    ua.updateCanSubmit([{ valid: true }]);
    expect(document.getElementById('updateUserButton').style.display).toBe('block');
    done();
  });
  it('not set user status to enabled if not already defined', (done) => {
    ua.user.userStatus = 'disabled';
    ua.checkUserStatus();
    expect(ua.user.userStatus).toBe('disabled');
    done();
  });
  it('should call after update user when changeemail is null', (done) => {
    ua.user.changeemail = '';
    ua.afterUpdateUser();
    expect(ua.app.appState.user).toBe(ua.user);
    done();
  });
  it('should change user email and catch an error', testAsync(async () => {
    document.body.innerHTML = '<div class="formErrors"></div>';
    ua.user = {
      name: 'Iddris Elba', email: 'j@gmail.com', userType: 'Charity', _id: '3333333', changeemail: 'yo@yo.com'
    };
    ua.app.httpClient.fetch = function fetch() {
      return Promise.resolve({
        json: () => Promise.reject(new Error({ error: 'you fail' }))
      });
    };
    await ua.changeUserEmail();
  }));
  it('should change user email with and without error message', testAsync(async () => {
    document.body.innerHTML = '<div class="formErrors"></div>';
    app = new App(auth, new HttpStub2());
    app.router = new RouterStub();
    app.activate();
    ua = new UserAccount(app, new VCMock(), new ValidatorMock());
    ua.user = {
      name: 'Iddris Elba', email: 'j@gmail.com', userType: 'Charity', _id: '3333333', changeemail: 'yo@yo.com'
    };
    ua.app.httpClient.fetch = function fetch() {
      return Promise.resolve({
        json: () => Promise.resolve({ message: 'good job' })
      });
    };
    await ua.changeUserEmail();
    expect(document.getElementsByClassName('formErrors')[0].innerHTML).not.toBe('');
    ua.app.httpClient.fetch = function fetch() {
      return Promise.resolve({
        json: () => Promise.resolve({})
      });
    };
    document.getElementsByClassName('formErrors')[0].innerHTML = '';
    await ua.changeUserEmail();
    expect(document.getElementsByClassName('formErrors')[0].innerHTML).toBe('');
  }));
  it('deletes the user', testAsync(async () => {
    ua.check = true;
    ua.app.logout = function logout() { ua.check = false; return true; };
    await ua.deleteUser();
    expect(ua.check).toBe(false);
  }));
  it('validates the update user form after page loads', (done) => {
    document.body.innerHTML = '<div class="formErrors"></div>';
    app = new App(auth, new HttpStub2());
    app.router = new RouterStub();
    app.activate();
    ua = new UserAccount(app, new VCMock(), new ValidatorMock());
    ua.user = {
      name: 'Iddris Elba', email: 'j@gmail.com', userType: 'Charity', _id: '3333333', changeemail: 'yo@yo.com'
    };
    ua.controller.validate = function validate() {};
    ua.attached();
    done();
  });
});
