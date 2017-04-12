
const Counter = require('assertions-counter');
import {App} from '../../src/app';
import {AppState} from '../../src/classes/AppState.js';
import {AuthStub, RouterStub, HttpMock} from './commons';

class AuthStub2 extends AuthStub {
  isAuthenticated() {
    this.authenticated = false;
    return this.authenticated;
  }
}

describe('the App module', () => {
  let app1;
  let app2;
  beforeEach(() => {
    app1 = new App(null, null, new AuthStub, new RouterStub, new HttpMock, new AppState);
    app1.auth.setToken('No token');
    app2 = new App(null, null, new AuthStub2, new RouterStub, new HttpMock, new AppState);
  });

  it('tests configHttpClient', (done) => {
    const { add: ok } = new Counter(2, done);
    app1.auth.tokenInterceptor = 'tokenInterceptor';
    app1.configHttpClient();
    app1.httpClient.__configureCallback(new(class {
      withDefaults(opts) {
        expect(opts.mode).toBe('cors');
        ok();
        return this;
      }
      withInterceptor(token) {
        expect(token).toBe(app1.auth.tokenInterceptor);
        ok();
        return this;
      }
    })());
  });

  it('tests logout', () => {
    //console.log(app1);
    app1.activate();
    app1.logout();
    expect(app1.authenticated).toBe(false);
  });

  it('should get widescreen', () => {
    //console.log(app1);
    const app3 = new App(null, null, new AuthStub, new RouterStub, new HttpMock, new AppState);
    expect(app3.widescreen).toBe(true);
  });

  it('should toggle menu to be icons only', () => {
    app2.activate();
    app2.fullmenu = true;
    //console.log(app1);
    app2.togglemenu();
    expect(app2.fullmenu).toBe(false);
    expect(app2.drawerWidth).toBe('50px');
  });

  it('should toggle menu to be icons with text', () => {
    app1.fullmenu = false;
    //console.log(app1);
    app1.togglemenu();
    expect(app1.fullmenu).toBe(true);
    expect(app1.drawerWidth).toBe('175px');
  });
});
