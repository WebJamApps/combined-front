import {UserAccount} from '../../src/dashboard-child-routes/user-account';
import {AuthStub, HttpMock, AppStateStub, RouterStub} from './commons';
import {App} from '../../src/app';
import {Validator} from 'aurelia-validation';

class VCMock {
  createForCurrentScope(validator) {
    return {validateTrigger: null};
  }
}

class HttpStub extends HttpMock {
  fetch(url) {
    console.log(url);
    return Promise.resolve({
      json: () => Promise.resolve([{name: 'in the jungle'}])
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
  //let http;

  beforeEach(() => {
    auth = new AuthStub();
    auth.setToken({sub: 'aowifjawifhiawofjo'});
    app = new App(auth, new HttpStub());
    app.router = new RouterStub();
    app.activate();
    ua = new UserAccount(app, new VCMock(), new ValidatorMock());
    ua.app.appState = new AppStateStub();
    //us.app.appState = new AppStateStub();
    ua.activate();
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

  // it('talentPicked without attributes', (done) => {
  //   ua.app.appState = new AppStateStub();
  //   ua.activate().then(() => {
  //     ua.talentPicked();
  //     done();
  //   });
  // });

  // it('talentPicked with attributes', (done) => {
  //   ua.app.appState = new AppStateStub();
  //   ua.app.auth.setToken({sub: '1'});
  //   ua.activate().then(() => {
  //     ua.talentPicked();
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
