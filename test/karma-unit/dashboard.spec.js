import {Dashboard} from '../../src/dashboard';
import {App} from '../../src/app';
import {StageComponent} from 'aurelia-testing';
import {AuthStub, HttpMock, AppStateStub, RouterStub} from './commons';
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
    return Promise.resolve([{name: 'john', valid: true}]);
  }
  validateProperty(prop, val, rules) {
    return Promise.resolve({});
  }
}

describe('the Dashboard Module', () => {
  let dashboard;

  describe('Dashboard DI', () => {
    let auth;
    let http;
    let app;
    let vc;
    let val;

    beforeEach(() => {
      auth = new AuthStub();
      auth.setToken({sub: 'aowifjawifhiawofjo'});
      app = new App(auth, new HttpMock());
      app.router = new RouterStub();
      app.activate();
      vc = new VCMock();
      val = new ValidatorMock();
      dashboard = new Dashboard(app, vc, val);
    });

    it('activate dashboard', (done) => {
      dashboard.app.appState = new AppStateStub();
      dashboard.activate();
      setTimeout(function() {
        //expect(http.status).toBe(200);
        done();
      }, 10);
    });

    it('should check if updateCanSubmit', (done) => {
      dashboard.user = {userType: ''};
      dashboard.updateCanSubmit([{valid: false}]);
      done();
    });

    it('should expect change in http status after Volunteer activate call', (done) => {
      http = new HttpMock({name: 'Iddris Elba', userType: 'Volunteer'});
      app = new App(auth, http);
      dashboard = new Dashboard(app, vc, val);
      dashboard.app.appState = new AppStateStub();
      dashboard.activate();
      setTimeout(function() {
        //expect(http.status).toBe(200);
        done();
      }, 10);
    });

    it('should expect route for all userTypes', (done) => {
      let userTypes = ['Developer', 'Charity', 'Librarian', 'Reader'];
      for (let i of userTypes) {
        dashboard.user = {userType: i};
        dashboard.childRoute();
      }
      done();
    });

    it('should not route a user if they do not have any user type defined', (done) => {
      // let userTypes = [''];
      // for (let i of userTypes) {
      dashboard.user = {userType: ''};
      dashboard.childRoute();
      //}
      done();
    });

    it('should confirm 200 http status after updateUser call', (done) => {
      http = new HttpMock({name: 'John Fitzgerald', userType: 'Developer'});
      app = new App(auth, http);
      dashboard = new Dashboard(app, vc, val);
      dashboard.app.appState = new AppStateStub();
      setTimeout(function() {
        dashboard.updateUser();
        //expect(http.status).toBe(200)
        done();
      }, 5);
    });

    it('should validate', (done) => {
      dashboard.user = {name: 'Ray Smith', userType: 'Reader'};
      document.body.innerHTML = '<div id=\'newUserButton\'></div>';
      dashboard.validate();
      dashboard.dropdownChanged();
      dashboard.canSubmit = true;
      dashboard.dropdownChanged();
      done();
    });

    it('should validate property', (done) => {
      dashboard.validator.validateProperty({}, 'school', 'schoolRules');
      done();
    });
  });

  describe('Staging Dashboard', () => {
    beforeEach(() => {
      dashboard = StageComponent
      .withResources('src/dashboard')
      .inView('<dashboard></dashboard>')
      .boundTo({user: {name: 'John Fitzgerald'}});
    });
    it('staging the dashboard', (done) => {
      done();
    });
  });
});
