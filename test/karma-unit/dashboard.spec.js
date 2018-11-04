import {
  StageComponent
} from 'aurelia-testing';
import {
  Dashboard
} from '../../src/dashboard';
import {
  App
} from '../../src/app';
import {
  AuthStub,
  HttpMock,
  AppStateStub,
  RouterStub
} from './commons';

describe('the Dashboard Module', () => {
  let auth, app, http, dashboard;
  beforeEach(() => {
    auth = new AuthStub();
    auth.setToken({
      sub: '3456'
    });
    app = new App(auth, new HttpMock());
    app.router = new RouterStub();
    app.activate();
    dashboard = new Dashboard(app);
    dashboard.app.appState = new AppStateStub();
  });
  it('sets the token to be the aurelia token', (done) => {
    localStorage.setItem('aurelia_id_token', '123');
    dashboard.activate();
    done();
  });
  it('does not set the token if it already exists', (done) => {
    localStorage.setItem('aurelia_id_token', '123');
    dashboard.activate();
    expect(localStorage.getItem('aurelia_id_token')).toBe('123');
    done();
  });
});
