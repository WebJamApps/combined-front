import { Login } from '../../src/login';
import { RouterStub, AuthStub, HttpMock, AppStateStub } from './commons';
import { App } from '../../src/app';

class AuthStub1 extends AuthStub {
  authenticate(name, f = false, o = null) {
    console.log(f);
    console.log(o);
    return Promise.resolve({
      name,
      token: 'heyvgyuv38t327rvuiqt78b934ujwehgyq89ery8t'
    });
  }
}
class AppStub extends App {
  authenticated = false;
}
describe('the Login module', () => {
  let login, app1, auth;
  beforeEach(() => {
    auth = new AuthStub1();
    auth.setToken({ sub: 'aowifjawifhiawofjo' });
    app1 = new AppStub(auth, new HttpMock());
    app1.router = new RouterStub();
    app1.activate();
    login = new Login(app1);
    login.app.appState = new AppStateStub();
  });
  it('should authentication when not from OHAF', (done) => {
    login.app.authenticate('google').then((data) => {
      console.log(data);
      done();
    }, null);
  });
  it('should authentication when from OHAF', (done) => {
    login.app.appState.isOhafLogin = true;
    login.app.authenticate('google').then((data) => {
      console.log(data);
      done();
    }, null);
  });
  it('should be attached to router', (done) => {
    login.attached();
    done();
  });
  it('should check if user is logged in', (done) => {
    window.localStorage.setItem('aurelia_id_token', '109842sdhgsgfhjsfoi4124');
    login.app.checkIfLoggedIn();
    expect(login.app.auth.getTokenPayload()).toBe(window.localStorage.getItem('aurelia_id_token'));
    done();
  });
  it('displays login form with appName', (done) => {
    document.body.innerHTML = '<div class="home"></div>';
    login.app.showForm('webjam llc', login.login_Class);
    expect(document.getElementsByClassName('home')[0].innerHTML).not.toBe('');
    done();
  });
});
