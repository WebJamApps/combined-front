import {Dashboard} from '../../src/dashboard';
import {StageComponent} from 'aurelia-testing';
const Counter = require('assertions-counter');
import {AuthStub, AppStateStub, RouterStub, HttpMock} from './commons';

class AuthServiceMock extends AuthStub {
  authenticate() {
    this.authenticated = true;
    return Promise.resolve('user is authenticated');
  }
}

describe('the Dashboard Module', () => {
  let dashboard;
  let dashboard2;

  describe('Dashboard DI', () => {
    let auth;
    let http;
    let token = 'mhioj23yr675843ho12yv9852vbbjeywouitryhrcyqo7t89vu';
    beforeEach(() => {
      auth = new AuthServiceMock();
      http = new HttpMock();
      dashboard = new Dashboard(auth, http, null, new RouterStub, new AppStateStub);
      dashboard2 = new Dashboard(auth, new HttpMock, null, new RouterStub, new AppStateStub);
      // process.env.NODE_ENV = 'development';
      auth.setToken(token);
    });

    it('should authenticate and return feedback', done =>{
      dashboard.auth.authenticate().then(data => {
        expect(data).toContain('authenticated');
      }).catch((e) => {
        expect(e).toThrow();
      });
      done();
    });

    it('should check if the user is authenticated', done => {
      expect(dashboard.auth.isAuthenticated()).toBeTruthy();
      done();
    });

    it('should fetch some json data after api call', done => {
      dashboard.httpClient.fetch('/some/data').then(data => {
        expect(data).toBeDefined(); // check if the data is defined.
      }, o => {
        // else catch the reject.
        expect(o).toBeUndefined();
      });
      done();
    });

    it('should expect change in http status after getUser call', done => {
      dashboard.getUser();
      expect(http.status).toBe(200);
      done();
    });

    //TODO: Get this to work!! process.env.NODE_ENV is not recognized
    // it('should set backend to a blank string if NODE_ENV is production', done => {
    //   http = new HttpMock({name: 'Iddris Elba', userType: 'Volunteer'});
    //   auth = new AuthServiceMock();
    //   process.env.NODE_ENV = 'production';
    //   dashboard = new Dashboard(auth, http, null, new RouterMock, new AppStateMock);
    //   expect(dashboard.backend).toBe('');
    // });

    it('should expect change in http status after Volunteer activate call', done => {
      http = new HttpMock({name: 'Iddris Elba', userType: 'Volunteer'});
      auth = new AuthServiceMock();
      dashboard = new Dashboard(auth, http, null, new RouterStub, new AppStateStub);
      auth.setToken(token);
      dashboard.activate();
      setTimeout(function() {
        expect(http.status).toBe(200);
        done();
      }, 10);
    });

    it('should expect change in http status after Developer activate call', done => {
      http = new HttpMock({name: 'John Fitzgerald', userType: 'Developer'});
      auth = new AuthServiceMock();
      dashboard = new Dashboard(auth, http, null, new RouterStub, new AppStateStub);
      auth.setToken(token);
      dashboard.activate();
      setTimeout(function() {
        expect(http.status).toBe(200);
        done();
      }, 10);
    });

    it('should confirm 200 http status after updateUser call', done => {
      http = new HttpMock({name: 'John Fitzgerald', userType: 'Developer'});
      auth = new AuthServiceMock();
      let appstate;
      appstate = new AppStateStub();
      appstate.user = {name: 'John Fitzgerald', userType: 'Developer'};
      dashboard = new Dashboard(auth, http, null, new RouterStub, appstate);
      dashboard.user = {name: 'John Fitzgerald', userType: 'Developer'};
      dashboard.getUser();
      setTimeout(function() {
        dashboard.updateUser();
        expect(http.status).toBe(200);
        done();
      }, 5);
    });

    it('tests configHttpClient', (done) => {
      const { add: ok } = new Counter(2, done);
      dashboard2.activate().then(() => {
        dashboard2.httpClient.__configureCallback(new(class {
          withBaseUrl(opts) {
            expect(opts).toBe(process.env.BackendUrl);
            ok();
            return this;
          }
          useStandardConfiguration() {
            ok();
            return this;
          }
        })());
      });
    });

    it('should confirm route by returning the currently navigated route', done => {
      expect(dashboard.router.navigate(dashboard.types[0])).toBe('Charity');
      expect(dashboard.router.navigate(dashboard.types[1])).toBe('Volunteer');
      done();
    });

    // afterEach(() => {
    //   delete process.env.NODE_ENV;
    // });
  });

  //TODO: Mock environment for being production, test it, and run activate function

  describe('Staging Dashboard', () => {
    beforeEach(() => {
      dashboard = StageComponent
      .withResources('src/dashboard')
      .inView('<dashboard></dashboard>')
      .boundTo({user: {name: 'John Fitzgerald'}});
    });
    it('staging the dashboard', done => {
      done();
    });
  });
});
