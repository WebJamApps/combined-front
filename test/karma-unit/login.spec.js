import {Login} from '../../src/login';
import {RouterStub, AuthStub, AppStateStub} from './commons';

class AuthStub1 extends AuthStub {
  authenticate(name, f = false, o = null) {
    return Promise.resolve({
      name: name,
      token: 'heyvgyuv38t327rvuiqt78b934ujwehgyq89ery8t'
    });
  }
}

class AppStub {
  authenticated = false;
}

describe('the Login module', () => {
  var sut;
  var app1;
  var auth;
  var router;
  var appState;

  beforeEach(() => {
    app1 = new AppStub();
    auth = new AuthStub1();
    router = new RouterStub();
    appState = new AppStateStub();
    sut = new Login(auth, app1, router, appState);
  });

  it('should expect authentication to function as rewritten.', done => {
    sut.authenticate('google').then((data) => {
      //console.log(data); // disable this if you want to.
      done();
    }, null);
  });

  it('runs the authenticate function', (done) => {
    sut.authenticate('google');
    //expect isAuthenticated to be called after the sut.authenticate is done calling to register change in authentication.
    setTimeout(function() {
      expect(sut.app.authenticated).toBe(true);
      done();
    }, 5);
  });

  it('should be attached to router', done => {
      sut.attached();
      console.log(sut.title);
      expect(sut.title).toBe('Howdy is cool');
      done()
  });

});
