import {UserAccount} from '../../src/dashboard-child-routes/user-account';
import {AuthStub, HttpMock, AppStateStub, RouterStub} from './commons';
import {App} from '../../src/app';
import {Validator} from 'aurelia-validation';

class VCMock {
  createForCurrentScope(validator) {
    return {validateTrigger: null};
  }
}

// class HttpStub extends HttpMock {
//   fetch(url) {
//     console.log(url);
//     return Promise.resolve({
//       json: () => Promise.resolve([{name: 'in the jungle'}])
//     });
//   }
// }

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
  //let http;

  beforeEach(() => {
    auth = new AuthStub();
    auth.setToken({sub: 'aowifjawifhiawofjo'});
    app = new App(auth, new HttpMock());
    app.router = new RouterStub();
    app.activate();
    ua = new UserAccount(app, new VCMock(), new ValidatorMock());
    ua.app.appState = new AppStateStub();
    //us.app.appState = new AppStateStub();
    ua.selectedCauses = ['other'];
    ua.selectedWorks = ['other'];
    ua.selectedTalents = ['other'];
    ua.activate();
    ua.user = {name: 'Iddris Elba', userType: 'Charity', _id: '3333333', volTalents: ['childcare', 'other'], volCauses: ['Environmental', 'other'], volWorkPrefs: ['counseling', 'other'], volCauseOther: '', volTalentOther: '', volWorkOther: ''};
  });

  // it('should activate user account', (done) => {
  //   ua.app.appState = new AppStateStub();
  //   ua.activate().then(() => {
  //     done();
  //   });
  // });

  // it('should activate user account with preselected attributes', (done) => {
  //   ua.app.appState = new AppStateStub();
  //   ua.app.auth.setToken({sub: '1'});
  //   ua.activate().then(() => {
  //     done();
  //   });
  // });

  it('should validate property', (done) => {
    ua.validator.validateProperty({}, 'school', 'schoolRules');
    done();
  });

  it('setup volunteer', (done) => {
    ua.app.appState = new AppStateStub();
    ua.setupVolunteer().then(() => {
      done();
    });
  });

  it('checkboxes app.expanded', (done) => {
    document.body.innerHTML = '  <div id="types" horizontal-align="right" vertical-align="top" style="margin-top:25px;"></div>';
    ua.app.expanded = true;
    ua.app.showCheckboxes('types');
    expect(ua.app.expanded).toBe(false);
    done();
  });

  it('checkboxes closed', (done) => {
    document.body.innerHTML = '  <div id="types" horizontal-align="right" vertical-align="top" style="margin-top:25px;"></div>';
    ua.app.expanded = false;
    ua.app.showCheckboxes('types');
    expect(ua.app.expanded).toBe(true);
    done();
  });

  it('should change other cause type', (done) => {
    //volops.activate();
    ua.selectedCauses = ['other'];
    ua.app.selectPickedChange(ua.user, ua, 'selectedCauses', 'volCauseOther', 'causeOther', true, 'volCauses');
    expect(ua.causeOther).toBe(true);
    expect(ua.user.volCauses).toBe(ua.selectedCauses);
    ua.selectedCauses = ['somethingelse'];
    ua.user.volCauseOther = 'Teststring';
    ua.app.selectPickedChange(ua.user, ua, 'selectedCauses', 'volCauseOther', 'causeOther', true, 'volCauses');
    expect(ua.causeOther).toBe(false);
    expect(ua.user.volCauseOther).toBe('');
    expect(ua.user.volCauses).toBe(ua.selectedCauses);

    done();
  });

  it('should change other work type', (done) => {
    //volops.activate();
    ua.selectedWorks = ['other'];
    ua.app.selectPickedChange(ua.user, ua, 'selectedWorks', 'volWorkOther', 'workOther', true, 'volWorkPrefs');
    expect(ua.workOther).toBe(true);
    expect(ua.user.volWorkPrefs).toBe(ua.selectedWorks);
    ua.selectedWorks = ['somethingelse'];
    ua.user.volWorkPrefs = 'Teststring';
    ua.app.selectPickedChange(ua.user, ua, 'selectedWorks', 'volWorkOther', 'workOther', true, 'volWorkPrefs');
    expect(ua.workOther).toBe(false);
    expect(ua.user.volWorkOther).toBe('');
    expect(ua.user.volWorkPrefs).toBe(ua.selectedWorks);

    done();
  });

  it('should change other talent type', (done) => {
    //volops.activate();
    ua.selectedTalents = ['other'];
    ua.app.selectPickedChange(ua.user, ua, 'selectedTalents', 'volTalentOther', 'talentOther', true, 'volTalents');
    expect(ua.talentOther).toBe(true);
    expect(ua.user.volTalents).toBe(ua.selectedTalents);
    ua.selectedTalents = ['somethingelse'];
    ua.user.volTalentOther = 'Teststring';
    ua.app.selectPickedChange(ua.user, ua, 'selectedTalents', 'volTalentOther', 'talentOther', true, 'volTalents');
    expect(ua.talentOther).toBe(false);
    expect(ua.user.volTalentOther).toBe('');
    expect(ua.user.volTalents).toBe(ua.selectedTalents);

    done();
  });

  it('should set charity', (done) => {
    ua.setCharity();
    done();
  });

  it('should update user', (done) => {
    ua.updateUser();
    done();
  });

  it('should select picked type', (done) => {
    ua.selectPickChange('causes');
    ua.selectPickChange('work');
    ua.selectPickChange('talents');
    done();
  });
  // it('causePicked without attributes', (done) => {
  //   ua.app.appState = new AppStateStub();
  //   ua.activate().then(() => {
  //     ua.causePicked();
  //     done();
  //   });
  // });

  // it('causePicked with attributes', (done) => {
  //   ua.app.appState = new AppStateStub();
  //   ua.app.auth.setToken({sub: '1'});
  //   ua.activate().then(() => {
  //     ua.causePicked();
  //     done();
  //   });
  // });


  // it('workPicked without attributes', (done) => {
  //   ua.app.appState = new AppStateStub();
  //   ua.activate().then(() => {
  //     ua.workPicked();
  //     done();
  //   });
  // });

  // it('workPicked with attributes', (done) => {
  //   ua.app.appState = new AppStateStub();
  //   ua.app.auth.setToken({sub: '1'});
  //   ua.activate().then(() => {
  //     ua.workPicked();
  //     done();
  //   });
  // });

  it('deletes the user', (done) => {
    ua.deleteUser();
    done();
  });
});
