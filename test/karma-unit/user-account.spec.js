import {UserAccount} from '../../src/dashboard-child-routes/user-account';
import {AuthStub, HttpMock, AppStateStub, RouterStub} from './commons';
import {App} from '../../src/app';
import {Validator} from 'aurelia-validation';

function testAsync(runAsync) {
  return (done) => {
    runAsync().then(done, (e) => { fail(e); done(); });
  };
}

class VCMock {
  createForCurrentScope(validator) {
    return {validateTrigger: null};
  }
}

class HttpStub extends HttpMock {
  fetch(url) {
    if (url === '/auth/changeemail') {
      return Promise.resolve({
        json: () => ({message: 'in the jungle'})
      });
    }
    return Promise.resolve({
      json: () => [{name: 'in the jungle'}]
    });
  }
}

class ValidatorMock extends Validator {
  constructor(a, b) {
    super();
    this.a = a;
    this.b = b;
  }
  validateObject(obj, rules) {
    return Promise.resolve([{name: 'john', valid: true}]);
  }
  validateProperty(prop, val, rules) {
    return Promise.resolve({});
  }
}

describe('the UserAccount Module', () => {
  let ua;
  let app;
  let auth;

  beforeEach(() => {
    auth = new AuthStub();
    auth.setToken({sub: 'aowifjawifhiawofjo'});
    app = new App(auth, new HttpStub());
    app.router = new RouterStub();
    app.activate();
    ua = new UserAccount(app, new VCMock(), new ValidatorMock());
    ua.app.appState = new AppStateStub();
    ua.selectedCauses = [];
    ua.selectedWorks = [];
    ua.selectedTalents = [];
    ua.activate();
    ua.user = {name: 'Iddris Elba', userType: 'Charity', _id: '3333333', volTalents: ['childcare', 'other'], volCauses: ['Environmental', 'other'], volWorkPrefs: ['counseling', 'other'], volCauseOther: '', volTalentOther: '', volWorkOther: ''};
    spyOn(ua, 'deleteUser');
  });

  it('should validate property', (done) => {
    ua.validator.validateProperty({}, 'school', 'schoolRules');
    done();
  });

  it('should set charity', (done) => {
    ua.setCharity();
    done();
  });

  it('should set the user status', (done) => {
    ua.disableUser('disabled');
    expect(ua.user.userStatus).toBe('disabled');
    done();
  });

  it('should update user', (done) => {
    ua.updateUser();
    done();
  });

  it('should allow Librarian user to change their user type', (done) => {
    ua.user.userType = 'Librarian';
    ua.checkChangeUserType();
    expect(ua.canChangeUserType).toBe(true);
    done();
  });

  it('should allow Charity user to change their user type if they have no charities', (done) => {
    ua.user.userType = 'Charity';
    ua.app.httpClient.fetch = function(){
      return Promise.resolve({
        // Headers: this.headers,
        json: () => Promise.resolve([])
      });
    };
    ua.checkChangeUserType();
    expect(ua.canChangeUserType).toBe(true);
    done();
  });

  it('should not allow Charity user to change their user type if they have charities', testAsync(async function(){
    ua.user.userType = 'Charity';
    ua.app.httpClient.fetch = function(){
      return Promise.resolve({
        json: () => Promise.resolve([{_id: '1'}])
      });
    };
    await ua.checkChangeUserType();
    expect(ua.canChangeUserType).toBe(false);
    //done();
  }));

  it('does not allow change user type or delete if signed up for an event', testAsync(async function(){
    ua.uid = '123';
    ua.events2 = [{voPeopleScheduled: ['123']}];
    ua.changeReasons = '';
    await ua.checkScheduled();
    expect(ua.canChangeUserType).toBe(false);
  }));

  it('checks scheduled when nothing is scheduled', testAsync(async function(){
    ua.uid = '123';
    ua.events2 = [{_id: '123'}];
    ua.changeReasons = '';
    await ua.checkScheduled();
    expect(ua.canChangeUserType).toBe(true);
  }));

  it('allows change user type when scheduled event is in the past', testAsync(async function(){
    ua.uid = '123';
    ua.events2 = [{voPeopleScheduled: ['123'], past: true}];
    ua.changeReasons = '';
    await ua.checkScheduled();
    expect(ua.canChangeUserType).toBe(true);
  }));

  it('does not allow change user type and we already have the reason', testAsync(async function(){
    ua.uid = '123';
    ua.events2 = [{voPeopleScheduled: ['123'], past: false}];
    ua.changeReasons = '<li>You are scheduled to work an event.</li>';
    await ua.checkScheduled();
    expect(ua.canChangeUserType).toBe(false);
  }));

  it('it shows the update button after we change the user status', testAsync(async function(){
    document.body.innerHTML = '<button id="updateUserButton" style="display:none">Update</button>';
    ua.showUpdateButton();
    expect(document.getElementById('updateUserButton').style.display).toBe('block');
  }));

  it('allow change user type or delete if not signed up for an event', testAsync(async function(){
    ua.uid = '123';
    ua.events2 = [{voPeopleScheduled: ['1234', '1235']}];
    await ua.checkScheduled();
    expect(ua.canChangeUserType).toBe(true);
  }));

  it('should check whether update can submit', (done) => {
    document.body.innerHTML = '<button id="updateUserButton">Update</button>';
    ua.updateCanSubmit([{valid: false}]);
    expect(document.getElementById('updateUserButton').style.display).toBe('none');
    done();
  });

  it('should check whether update can submit when valid', (done) => {
    document.body.innerHTML = '<button id="updateUserButton">Update</button>';
    ua.updateCanSubmit([{valid: true}]);
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

  it('should change user email', (done) => {
    document.body.innerHTML = '<div class="formErrors"></div>';
    ua.changeUserEmail();
    expect(document.getElementsByClassName('formErrors')[0].innerText.trim()).toBe('');
    done();
  });

  it('deletes the user', (done) => {
    ua.deleteUser();
    expect(ua.deleteUser).toHaveBeenCalled();
    done();
  });
});
