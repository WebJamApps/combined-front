import {Login} from '../../src/login';
import {RouterStub, AuthStub, HttpMock} from './commons';
import {App} from '../../src/app';

class AuthStub1 extends AuthStub {
  authenticate(name, f = false, o = null) {
    return Promise.resolve({
      name: name,
      token: 'heyvgyuv38t327rvuiqt78b934ujwehgyq89ery8t'
    });
  }
}

class AppStub extends App{
  authenticated = false;
}

describe('the Login module', () => {
  let login;
  let app1;
  let auth;

  beforeEach(() => {
    auth = new AuthStub1();
    //auth.setToken({sub: 'aowifjawifhiawofjo'});
    app1 = new AppStub(auth, new HttpMock());
    app1.router = new RouterStub();
    app1.activate();
    login = new Login(app1);
    //sut.app.appState = new AppStateStub();
    //sut.app.authenticated = false;
  });

  it('should expect authentication to function as rewritten.', (done) => {
    login.authenticate('google').then((data) => {
      //console.log(data); // disable this if you want to.
      done();
    }, null);
  });

  // it('runs the authenticate function', (done) => {
  //   sut.authenticate('google');
  //   //expect isAuthenticated to be called after the sut.authenticate is done calling to register change in authentication.
  //   setTimeout(function() {
  //     expect(sut.app.authenticated).toBe(true);
  //     done();
  //   }, 5);
  // });
  //
  it('should be attached to router', (done) => {
    login.attached();
    //console.log(sut.title);
    expect(login.title).toBe('Howdy is cool');
    done();
  });
});
