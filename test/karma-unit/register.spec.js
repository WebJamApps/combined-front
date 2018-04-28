import { Register } from '../../src/register';
import { RouterStub, AuthStub, HttpMock, AppStateStub } from './commons';
import { App } from '../../src/app';

class AuthStub1 extends AuthStub {
  authenticate(name, f = false, o = null) {
    console.log(o);
    console.log(f);
    return Promise.resolve({
      name,
      token: 'heyvgyuv38t327rvuiqt78b934ujwehgyq89ery8t'
    });
  }
}
class AppStub extends App {
  authenticated = false;
}
describe('the Register module', () => {
  let register, app1, auth;
  beforeEach(() => {
    auth = new AuthStub1();
    auth.setToken({ sub: 'aowifjawifhiawofjo' });
    app1 = new AppStub(auth, new HttpMock());
    app1.router = new RouterStub();
    app1.activate();
    register = new Register(app1);
    register.app.appState = new AppStateStub();
  });
  it('should run attached function', (done) => {
    register.attached();
    done();
  });
  it('displays registration form with appName', (done) => {
    document.body.innerHTML = '<div class="home"></div>';
    register.app.showForm('webjam llc', register.registerClass);
    // register.showRegister('web jam llc');
    expect(document.getElementsByClassName('home')[0].innerHTML).not.toBe('');
    done();
  });
});
