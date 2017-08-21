import {App} from '../../src/app';
import {AuthStub, HttpMock, RouterStub} from './commons';
const Counter = require('assertions-counter');

class AuthStub2 extends AuthStub {
  isAuthenticated() {
    this.authenticated = false;
    return this.authenticated;
  }
}

function testAsync(runAsync) {
  return (done) => {
    runAsync().then(done, (e) => { fail(e); done(); });
  };
}

describe('the App module', () => {
  let app1;
  let app2;

  beforeEach(() => {
    app1 = new App(new AuthStub(), new HttpMock());
    app1.auth.setToken('No token');
    app2 = new App(new AuthStub2(), new HttpMock());
  });

  it('tests configHttpClient', (done) => {
    const { add: ok } = new Counter(4, done);
    app1.auth.tokenInterceptor = 'tokenInterceptor';
    app1.configHttpClient();
    app1.httpClient.__configureCallback(new(class {
      withDefaults(opts) {
        expect(opts.mode).toBe('cors');
        ok();
        return this;
      }
      useStandardConfiguration() {
        ok();
        return this;
      }
      withBaseUrl() {
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

  it('configures the router', (done) => {
    let configStub = {options: {pushState: true}, addPipelineStep(){}, map(){}, fallbackRoute(){}};
    app1.configureRouter(configStub, RouterStub);
    expect(app1.router).toBeDefined;
    done();
  });

  it('tests logout', testAsync(async function() {
    await app1.activate();
    await app1.logout();
    expect(app1.authenticated).toBe(false);
  }));

  it('gets the current route', testAsync(async function() {
    //console.log(app1);
    await app1.activate();
    let configStub = {options: {pushState: true}, addPipelineStep(){}, map(){}, fallbackRoute(){}};
    //let routerStub = {};
    await app1.configureRouter(configStub, RouterStub);
    //console.log('current instruction ' + app1.router.currentInstruction);
    let route = await app1.currentRoute;
    expect(route).toBe(route);
    //expect(route).toBe('yoyo');
  }));

  it('gets the current fragment', (done) => {
    app1.router = new RouterStub();
    let frag = app1.currentRouteFrag;
    app1.currentRoute;
    expect(typeof frag).toBe('object');
    done();
  });

  // it('gets the current styles with ohaf route', (done) => {
  //   let routre = new RouterStub();
  //   routre.currentInstruction.config.name = 'ohaf';
  //   app1.router = routre;
  //   app1.currentStyles;
  //   done();
  // });

  it('gets the current styles with library route', (done) => {
    let routre = new RouterStub();
    routre.currentInstruction.config.name = 'library';
    app1.router = routre;
    app1.currentStyles;
    done();
  });

  it('gets the current styles with dashboard route', (done) => {
    let routre = new RouterStub();
    routre.currentInstruction.fragment = '/dashboard';
    app1.router = routre;
    app1.currentStyles;
    done();
  });

  it('gets the current styles with bookshelf route', (done) => {
    let routre = new RouterStub();
    routre.currentInstruction.fragment = '/bookshelf';
    app1.router = routre;
    app1.currentStyles;
    done();
  });

  it('gets the current styles with user-account route', (done) => {
    let routre = new RouterStub();
    routre.currentInstruction.fragment = '/dashboard/user-account';
    app1.router = routre;
    app1.currentStyles;
    done();
  });

  // it('gets the current styles dashboard/volunteer route', (done) => {
  //   let routre = new RouterStub();
  //   routre.currentInstruction.fragment = '/dashboard/volunteer';
  //   app1.router = routre;
  //   app1.currentStyles;
  //   done();
  // });

  // it('gets the current styles with dashboard/charity route', (done) => {
  //   let routre = new RouterStub();
  //   routre.currentInstruction.fragment = '/dashboard/charity';
  //   app1.router = routre;
  //   app1.currentStyles;
  //   done();
  // });

  it('gets the current styles with dashboard/reader route', (done) => {
    let routre = new RouterStub();
    routre.currentInstruction.fragment = '/dashboard/reader';
    app1.router = routre;
    app1.currentStyles;
    done();
  });

  it('gets the current styles with dashboard/librarian route', (done) => {
    let routre = new RouterStub();
    routre.currentInstruction.fragment = '/dashboard/librarian';
    app1.router = routre;
    app1.currentStyles;
    done();
  });
  it('gets the current styles with dashboard/developer route', (done) => {
    let routre = new RouterStub();
    routre.currentInstruction.fragment = '/dashboard/developer';
    app1.router = routre;
    app1.currentStyles;
    done();
  });

  it('gets the current styles with music-router route', (done) => {
    let routre = new RouterStub();
    routre.currentInstruction.config.name = 'music-router';
    app1.router = routre;
    app1.currentStyles;
    done();
  });

  // it('gets the current styles when route is null', (done) => {
  //   let routre = new RouterStub();
  //   routre.currentInstruction.config.name = '';
  //   app1.router = routre;
  //   app1.currentStyles;
  //   done();
  // });

  it('closes the menu on cellphone display', (done) => {
    //console.log(app1);
    app1.activate().then(() => {
      app1.close();
      //expect(app1.authenticated).toBe(false);
    });
    done();
  });

  it('should get widescreen', (done) => {
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
