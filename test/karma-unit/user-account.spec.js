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
    console.log(url);
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
  });

  it('should validate property', (done) => {
    ua.validator.validateProperty({}, 'school', 'schoolRules');
    done();
  });

  // it('should change other cause type', (done) => {
  //   ua.selectedCauses = ['other'];
  //   ua.app.selectPickedChange(ua.user, ua, 'selectedCauses', 'volCauseOther', 'causeOther', true, 'volCauses');
  //   expect(ua.causeOther).toBe(true);
  //   expect(ua.user.volCauses).toBe(ua.selectedCauses);
  //   ua.selectedCauses = ['somethingelse'];
  //   ua.user.volCauseOther = 'Teststring';
  //   ua.app.selectPickedChange(ua.user, ua, 'selectedCauses', 'volCauseOther', 'causeOther', true, 'volCauses');
  //   expect(ua.causeOther).toBe(false);
  //   expect(ua.user.volCauseOther).toBe('');
  //   expect(ua.user.volCauses).toBe(ua.selectedCauses);
  //
  //   done();
  // });

  // it('should change other work type', (done) => {
  //   ua.selectedWorks = ['other'];
  //   ua.app.selectPickedChange(ua.user, ua, 'selectedWorks', 'volWorkOther', 'workOther', true, 'volWorkPrefs');
  //   expect(ua.workOther).toBe(true);
  //   expect(ua.user.volWorkPrefs).toBe(ua.selectedWorks);
  //   ua.selectedWorks = ['somethingelse'];
  //   ua.user.volWorkPrefs = 'Teststring';
  //   ua.app.selectPickedChange(ua.user, ua, 'selectedWorks', 'volWorkOther', 'workOther', true, 'volWorkPrefs');
  //   expect(ua.workOther).toBe(false);
  //   expect(ua.user.volWorkOther).toBe('');
  //   expect(ua.user.volWorkPrefs).toBe(ua.selectedWorks);
  //   done();
  // });

  // it('should change other talent type', (done) => {
  //   ua.selectedTalents = ['other'];
  //   ua.app.selectPickedChange(ua.user, ua, 'selectedTalents', 'volTalentOther', 'talentOther', true, 'volTalents');
  //   expect(ua.talentOther).toBe(true);
  //   expect(ua.user.volTalents).toBe(ua.selectedTalents);
  //   ua.selectedTalents = ['somethingelse'];
  //   ua.user.volTalentOther = 'Teststring';
  //   ua.app.selectPickedChange(ua.user, ua, 'selectedTalents', 'volTalentOther', 'talentOther', true, 'volTalents');
  //   expect(ua.talentOther).toBe(false);
  //   expect(ua.user.volTalentOther).toBe('');
  //   expect(ua.user.volTalents).toBe(ua.selectedTalents);
  //   done();
  // });

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

  it('does not allow change user type or delete if signed up for an event', testAsync(async function(){
    ua.uid = '123';
    ua.events2 = [{voPeopleScheduled: ['123']}];
    await ua.checkScheduled();
    expect(ua.canChangeUserType).toBe(false);
  }));

  it('allow change user type or delete if not signed up for an event', testAsync(async function(){
    ua.uid = '123';
    ua.events2 = [{voPeopleScheduled: ['1234', '1235']}];
    await ua.checkScheduled();
    expect(ua.canChangeUserType).toBe(true);
  }));

  // it('should allow Volunteer user to change their user type when not signedup', (done) => {
  //   ua.user.userType = 'Volunteer';
  //   ua.checkSignups = function(){
  //     return new Promise((resolve) => {
  //       resolve({});
  //     });
  //   };
  //   ua.userSignups = [];
  //   ua.checkChangeUserType();
  //   expect(ua.canChangeUserType).toBe(true);
  //   done();
  // });

  // it('should select picked type', (done) => {
  //   ua.selectPickChange('causes');
  //   ua.selectPickChange('work');
  //   ua.selectPickChange('talents');
  //   done();
  // });

  it('should check whether update can submit', (done) => {
    ua.updateCanSubmit([{valid: false}]);
    done();
  });

  it('deletes the user', (done) => {
    ua.deleteUser();
    done();
  });
});
