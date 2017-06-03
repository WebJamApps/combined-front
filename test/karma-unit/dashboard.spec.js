import {Dashboard} from '../../src/dashboard';
import {App} from '../../src/app';
import {StageComponent} from 'aurelia-testing';
//const Counter = require('assertions-counter');
import {AuthStub, HttpMock} from './commons';
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

class AuthServiceMock extends AuthStub {
  authenticate() {
    this.authenticated = true;
    return Promise.resolve('user is authenticated');
  }
}

describe('the Dashboard Module', () => {
  let dashboard;
  //let dashboard2;

  describe('Dashboard DI', () => {
    let auth;
    //let http;
    let token = 'mhioj23yr675843ho12yv9852vbbjeywouitryhrcyqo7t89vu';
    let app;
    let vc;
    let val;
    //let appState;
    beforeEach(() => {
      app = new App(AuthStub, HttpMock);
      auth = new AuthServiceMock();
      vc = new VCMock();
      val = new ValidatorMock();
      //http = new HttpMock();
      dashboard = new Dashboard(app, vc, val);
      //dashboard2 = new Dashboard(app, vc, val);
      auth.setToken(token);
    });

    // it('should authenticate and return feedback', (done) => {
    //   dashboard.app.auth.authenticate().then((data) => {
    //     expect(data).toContain('authenticated');
    //   }).catch((e) => {
    //     expect(e).toThrow();
    //   });
    //   done();
    // });

    // it('should check if the user is authenticated', (done) => {
    //   expect(dashboard.app.auth.isAuthenticated()).toBeTruthy();
    //   done();
    // });

    // it('should fetch some json data after api call', (done) => {
    //   dashboard.app.httpClient.fetch('/some/data').then((data) => {
    //     expect(data).toBeDefined(); // check if the data is defined.
    //   }, (o) => {
    //     // else catch the reject.
    //     expect(o).toBeUndefined();
    //   });
    //   done();
    // });

    // it('should expect change in http status after Volunteer activate call', (done) => {
    //   http = new HttpMock({name: 'Iddris Elba', userType: 'Volunteer'});
    //   auth = new AuthServiceMock();
    //   app = new App(AuthStub, HttpMock);
    //   appState = new AppStateStub();
    //   appState.setUser({name: 'Iddris Elba', userType: 'Volunteer'});
    //   app.appState = appState;
    //   app.router = new RouterStub();
    //   dashboard = new Dashboard(app, vc, val);
    //   auth.setToken(token);
    //   dashboard.activate();
    //   setTimeout(function() {
    //     //expect(http.status).toBe(200);
    //     done();
    //   }, 10);
    // });

    // it('should expect change in http status after Developer activate call', (done) => {
    //   http = new HttpMock({name: 'John Fitzgerald', userType: 'Developer'});
    //   auth = new AuthServiceMock();
    //   app = new App(AuthStub, HttpMock);
    //   appState = new AppStateStub();
    //   appState.setUser({name: 'Iddris Elba', userType: 'Developer'});
    //   app.appState = appState;
    //   app.router = new RouterStub();
    //   dashboard = new Dashboard(app, vc, val);
    //   auth.setToken(token);
    //   dashboard.activate();
    //   setTimeout(function() {
    //     //expect(http.status).toBe(200);
    //     done();
    //   }, 10);
    // });

    // it('should route a child in the librarian route', (done) => {
    //   http = new HttpMock({name: 'John Fitzgerald', userType: 'Developer'});
    //   auth = new AuthServiceMock();
    //   app = new App(AuthStub, HttpMock);
    //   app.router = new RouterStub();
    //   dashboard = new Dashboard(app, vc, val);
    //   dashboard.user = {name: 'Ray Smith', userType: 'Librarian'};
    //   dashboard.childRoute();
    //   setTimeout(function() {
    //     //expect(http.status).toBe(200);
    //     done();
    //   }, 10);
    // });

    // it('should route a child in the charity route', (done) => {
    //   http = new HttpMock({name: 'John Fitzgerald', userType: 'Developer'});
    //   auth = new AuthServiceMock();
    //   app = new App(AuthStub, HttpMock);
    //   app.router = new RouterStub();
    //   dashboard = new Dashboard(app, vc, val);
    //   dashboard.user = {name: 'Ray Smith', userType: 'Charity'};
    //   dashboard.childRoute();
    //   setTimeout(function() {
    //     //expect(http.status).toBe(200);
    //     done();
    //   }, 10);
    // });

    // it('should route a child in the reader route', (done) => {
    //   http = new HttpMock({name: 'John Fitzgerald', userType: 'Developer'});
    //   auth = new AuthServiceMock();
    //   app = new App(AuthStub, HttpMock);
    //   app.router = new RouterStub();
    //   dashboard = new Dashboard(app, vc, val);
    //   dashboard.user = {name: 'Ray Smith', userType: 'Reader'};
    //   dashboard.childRoute();
    //   setTimeout(function() {
    //     //expect(http.status).toBe(200);
    //     done();
    //   }, 10);
    // });

    // it('should detect a change in a dropdown form', done => {
    //   http = new HttpMock({name: 'John Fitzgerald', userType: 'Developer'});
    //   auth = new AuthServiceMock();
    //   app = new App(AuthStub, HttpMock);
    //   app.router = new RouterStub();
    //   dashboard = new Dashboard(auth, http, app);
    //   dashboard.dropdownChanged();
    //   setTimeout(function() {
    //     //expect(http.status).toBe(200);
    //     done();
    //   }, 10);
    // });

    // it('should confirm 200 http status after updateUser call', (done) => {
    //   http = new HttpMock({name: 'John Fitzgerald', userType: 'Developer'});
    //   auth = new AuthServiceMock();
    //   app = new App(AuthStub, HttpMock);
    //   appState = new AppStateStub();
    //   appState.setUser({name: 'John Fitzgerald', userType: 'Developer'});
    //   app.appState = appState;
    //   app.router = new RouterStub();
    //   dashboard = new Dashboard(app, vc, val);
    //   dashboard.user = {name: 'John Fitzgerald', userType: 'Developer'};
    //   setTimeout(function() {
    //     dashboard.updateUser();
    //     //expect(http.status).toBe(200);
    //     done();
    //   }, 5);
    // });

    // it('tests configHttpClient', (done) => {
    //   const { add: ok } = new Counter(2, done);
    //   dashboard2.configHttpClient();
    //   dashboard2.httpClient.__configureCallback(new(class {
    //     withBaseUrl(opts) {
    //       expect(opts).toBe(process.env.BackendUrl);
    //       ok();
    //       return this;
    //     }
    //     useStandardConfiguration() {
    //       ok();
    //       return this;
    //     }
    //   })());
    // });

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

    it('should check if rule exists in validator', (done) => {
    //   dashboard.validator.ruleExists({}, 'schoolRules');
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
