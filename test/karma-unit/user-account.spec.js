import {UserAccount} from '../../src/dashboard-child-routes/user-account';
import {AuthStub, HttpMock, AppStateStub} from './commons';
import {App} from '../../src/app';

class HttpStub extends HttpMock {
  fetch(url) {
    console.log(url);
    return Promise.resolve({
      json: () => Promise.resolve([{name: 'in the jungle'}])
    });
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
    app.activate();
    ua = new UserAccount(app);
  });

  it('should activate user account', (done) => {
    ua.app.appState = new AppStateStub();
    ua.activate().then(() => {
      done();
    });
  });

  it('should activate user account with preselected attributes', (done) => {
    ua.app.appState = new AppStateStub();
    ua.app.auth.setToken({sub: '1'});
    ua.activate().then(() => {
      done();
    });
  });

  it('setup volunteer', (done) => {
    ua.app.appState = new AppStateStub();
    ua.setupVolunteer().then(() => {
      done();
    });
  });

  it('checkboxes expanded', (done) => {
    document.body.innerHTML = '  <div id="types" horizontal-align="right" vertical-align="top" style="margin-top:25px;"></div>';
    ua.expanded = true;
    ua.showCheckboxes('types');
    expect(ua.expanded).toBe(false);
    done();
  });

  it('checkboxes closed', (done) => {
    document.body.innerHTML = '  <div id="types" horizontal-align="right" vertical-align="top" style="margin-top:25px;"></div>';
    ua.expanded = false;
    ua.showCheckboxes('types');
    expect(ua.expanded).toBe(true);
    done();
  });

  it('causePicked without attributes', (done) => {
    ua.app.appState = new AppStateStub();
    ua.activate().then(() => {
      ua.causePicked();
      done();
    });
  });

  it('causePicked with attributes', (done) => {
    ua.app.appState = new AppStateStub();
    ua.app.auth.setToken({sub: '1'});
    ua.activate().then(() => {
      ua.causePicked();
      done();
    });
  });

  it('talentPicked without attributes', (done) => {
    ua.app.appState = new AppStateStub();
    ua.activate().then(() => {
      ua.talentPicked();
      done();
    });
  });

  it('talentPicked with attributes', (done) => {
    ua.app.appState = new AppStateStub();
    ua.app.auth.setToken({sub: '1'});
    ua.activate().then(() => {
      ua.talentPicked();
      done();
    });
  });

  it('workPicked without attributes', (done) => {
    ua.app.appState = new AppStateStub();
    ua.activate().then(() => {
      ua.workPicked();
      done();
    });
  });

  it('workPicked with attributes', (done) => {
    ua.app.appState = new AppStateStub();
    ua.app.auth.setToken({sub: '1'});
    ua.activate().then(() => {
      ua.workPicked();
      done();
    });
  });

  it('deletes the user', (done) => {
    ua.deleteUser();
    done();
  });
});
