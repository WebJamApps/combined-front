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
  let dashboard;
  describe('Dashboard DI', () => {
    let auth, app, http;
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

    it('should activate dashboard', async () => {
      const thisuser = {
        _id: '3456',
        userType: 'Developer'
      };
      dashboard.app.appState.setUser(thisuser);
      let res;
      try {
        res = await dashboard.activate();
        expect(res).toBe(true);
      } catch (e) {
        throw e;
      }
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

    it('should default to Volunteer only when a new ohaf user', (done) => {
      dashboard.user = {
        userType: '',
        isOhafUser: true
      };
      dashboard.childRoute();
      dashboard.user = {
        userType: '',
        isOhafUser: false
      };
      dashboard.childRoute();
      dashboard.user = {
        userType: 'Charity',
        isOhafUser: true
      };
      dashboard.childRoute();
      done();
    });

    it('should expect change in http status after Volunteer activate call', (done) => {
      http = new HttpMock({
        name: 'Iddris Elba',
        userType: 'Volunteer'
      });
      app = new App(auth, http);
      dashboard = new Dashboard(app);
      dashboard.app.appState = new AppStateStub();
      dashboard.activate();
      setTimeout(() => {
        // expect(http.status).toBe(200);
      }, 10);
      done();
    });

    it('should expect route for all userTypes', (done) => {
      const userTypes = ['Developer', 'Charity', 'Librarian', 'Reader', 'Volunteer'];
      for (const i of userTypes) {
        dashboard.user = {
          userType: i
        };
        dashboard.childRoute();
      }
      done();
    });

    it('should route to user-account when user is disabled', (done) => {
      dashboard.user = {
        _id: '1',
        name: 'Iddris Elba',
        userType: 'Volunteer',
        userStatus: 'disabled'
      };
      dashboard.childRoute();
      done();
    });

    it('should not route a user if they do not have any user type defined', (done) => {
      // let userTypes = [''];
      // for (let i of userTypes) {
      dashboard.user = {
        userType: ''
      };
      dashboard.childRoute();
      // }
      done();
    });

    // it('should confirm 200 http status after updateUser call', (done) => {
    //   http = new HttpMock({name: 'John Fitzgerald', userType: 'Developer'});
    //   app = new App(auth, http);
    //   dashboard = new Dashboard(app);
    //   dashboard.app.appState = new AppStateStub();
    //   setTimeout(function() {
    //     dashboard.updateUser();
    //     //expect(http.status).toBe(200)
    //     done();
    //   }, 5);
    // });

    // it('should validate', (done) => {
    //   dashboard.user = {name: 'Ray Smith', userType: 'Reader'};
    //   dashboard.canSubmit = true;
    //   document.body.innerHTML = '<div id=\'newUserButton\'></div>';
    //   dashboard.validate();
    //   let validationResults = [{
    //     result: {valid: true}}];
    //   dashboard.updateCanSubmit(validationResults);
    //   //dashboard.dropdownChanged();
    //   //dashboard.canSubmit = true;
    //   //dashboard.dropdownChanged();
    //   done();
    // });

    // it('should setup the validation', (done) => {
    //   dashboard.user = {name: 'Ray Smith', userType: 'Reader'};
    //   dashboard.canSubmit = true;
    //   document.body.innerHTML = '<div id=\'newUserButton\'></div>';
    //   dashboard.validate();
    //   let validationResults = [{
    //     result: {valid: true}}];
    //   dashboard.updateCanSubmit(validationResults);
    //   //dashboard.dropdownChanged();
    //   //dashboard.canSubmit = true;
    //   //dashboard.dropdownChanged();
    //   done();
    // });

    //   it('should validate property', (done) => {
    //     dashboard.validator.validateProperty({}, 'school', 'schoolRules');
    //     done();
    //   });
  });

  describe('Staging Dashboard', () => {
    beforeEach(() => {
      dashboard = StageComponent
        .withResources('src/dashboard')
        .inView('<dashboard></dashboard>')
        .boundTo({
          user: {
            name: 'John Fitzgerald'
          }
        });
    });
    it('staging the dashboard', (done) => {
      done();
    });
  });
});
