import {
  Login
} from '../../src/login';
import {
  RouterStub,
  AuthStub,
  HttpMock,
  AppStateStub
} from './commons';
import {
  App
} from '../../src/app';

class AuthStub1 extends AuthStub {
  authenticate(name) {
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
    auth.setToken({
      sub: 'aowifjawifhiawofjo'
    });
    app1 = new AppStub(auth, new HttpMock());
    app1.router = new RouterStub();
    app1.activate();
    login = new Login(app1);
    login.app.appState = new AppStateStub();
  });
  it('authenticates when not from OHAF', async () => {
    let cb;
    try {
      cb = await login.app.authenticate('google');
    } catch (e) { throw e; }
    expect(cb.length).toBeGreaterThan(20);
  });
  it('should authentication when from OHAF', async () => {
    login.app.appState.isOhafLogin = true;
    let cb;
    try {
      cb = await login.app.authenticate('google');
    } catch (e) { throw e; }
    expect(cb.length).toBeGreaterThan(20);
  });
  it('should check if user is logged in', (done) => {
    window.localStorage.setItem('aurelia_id_token', '109842sdhgsgfhjsfoi4124');
    login.app.appUtils.checkIfLoggedIn(login.app);
    expect(login.app.auth.getTokenPayload()).toBe(window.localStorage.getItem('aurelia_id_token'));
    done();
  });
  it('displays login form with appName', (done) => {
    document.body.innerHTML = '<div class="home"></div>';
    login.app.showForm('webjam llc', login.login_Class);
    expect(document.getElementsByClassName('home')[0].innerHTML).not.toBe('');
    done();
  });
  it('attaches to the dom', (done) => {
    document.body.innerHTML = '<div class="home"><div class="topSection"></div><input class="loginemail"/></div>';
    window.history.pushState({}, 'Login', '/login');
    login.attached();
    const loginEmailValue = document.getElementsByClassName('loginemail')[0].value;
    expect(loginEmailValue).toBe('');
    done();
  });
  it('attaches to the dom with an email in the url', (done) => {
    document.body.innerHTML = '<div class="home"><div class="topSection"></div><input class="loginemail"/></div>';
    window.history.pushState({}, 'Login', '/login?email=j@b.com');
    login.attached();
    const loginEmailValue = document.getElementsByClassName('loginemail')[0].value;
    expect(loginEmailValue).toBe('j@b.com');
    done();
  });
});
