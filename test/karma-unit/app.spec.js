//import {AuthorizeStep} from 'aurelia-auth';
import {App} from '../../src/app';
import {AuthStub, HttpMock} from './commons';
//import {RouterStub} from './commons';
//const Counter = require('assertions-counter');

class AuthStub2 extends AuthStub {
  isAuthenticated() {
    this.authenticated = false;
    return this.authenticated;
  }
}

// class HttpStub {
//   fetch(fn) {
//     var response = this.itemStub;
//     this.__fetchCallback = fn;
//     return new Promise((resolve) => {
//       resolve({ json: () => response });
//     });
//   }
//   configure(fn) {
//     this.__configureCallback = fn;
//     return this.__configureReturns;
//   }
// }

describe('the App module', () => {
  let app1;
  let app2;
  
  //var sut;
  //   var mockedRouter;
  
  beforeEach(() => {
    app1 = new App(new AuthStub, new HttpMock);
    app1.auth.setToken('No token');
    app2 = new App(new AuthStub2, new HttpMock);
  });
  
  // it('tests configHttpClient', (done) => {
  //   const { add: ok } = new Counter(2, done);
  //   app1.auth.tokenInterceptor = 'tokenInterceptor';
  //   app1.configHttpClient();
  //   app1.httpClient.__configureCallback(new(class {
  //     withDefaults(opts) {
  //       expect(opts.mode).toBe('cors');
  //       ok();
  //       return this;
  //     }
  //     withInterceptor(token) {
  //       expect(token).toBe(app1.auth.tokenInterceptor);
  //       ok();
  //       return this;
  //     }
  //   })());
  // });
  
  it('configures the router', done => {
    let configStub = {options: {pushState: true}, addPipelineStep(){}, map(){}, fallbackRoute(){}};
    let routerStub = {};
    app1.configureRouter(configStub, routerStub);
    done();
  });
  
  it('tests logout', done => {
    //console.log(app1);
    app1.activate().then(() => {
      app1.logout();
      expect(app1.authenticated).toBe(false);
    });
    done();
  });
  
  it('should get widescreen', done => {
    //console.log(app1);
    const app3 = new App(new AuthStub, new HttpMock);
    expect(app3.widescreen).toBe(true);
    done();
  });
  
  it('should toggle menu to be icons only', () => {
    app2.activate();
    app2.fullmenu = true;
    //console.log(app1);
    app2.toggleMenu();
    expect(app2.fullmenu).toBe(false);
    expect(app2.drawerWidth).toBe('50px');
    //done();
  });
  
  it('should toggle menu to be icons with text', () => {
    app1.fullmenu = false;
    //console.log(app1);
    app1.toggleMenu();
    expect(app1.fullmenu).toBe(true);
    expect(app1.drawerWidth).toBe('175px');
  });
  // done();
});
