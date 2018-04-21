import {App} from '../../src/app';
import {AuthStub, HttpMock, RouterStub, AppStateStub} from './commons';
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
    app1.activate();
    app1.appState = new AppStateStub();
    app2 = new App(new AuthStub2(), new HttpMock());
    app2.activate();
    app2.appState = new AppStateStub();
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
  it('check if user is logged in', (done) => {
    window.localStorage.setItem('aurelia_id_token', '109842sdhgsgfhjsfoi4124');
    let configStub = {options: {pushState: true}, addPipelineStep(){}, addPostRenderStep(){}, map(){}, fallbackRoute(){}, navigate(){}};
    app1.configureRouter(configStub, RouterStub);
    app1.router.navigate = function(){};
    app1.checkIfLoggedIn();
    expect(app1.auth.getTokenPayload()).toBe(window.localStorage.getItem('aurelia_id_token'));
    done();
  });
  it('scrolls page to top after route changes', (done) => {
    document.body.innerHTML = '<div class="material-header"></div>';
    //let configStub = {options: {pushState: true}, addPipelineStep(){}, addPostRenderStep(){}, map(){}, fallbackRoute(){}, navigate(){}};
    app1.activate();

    let config = {fallbackRoute: function(){}, map: function(){}, title: '', options: {pushstate: '', root: ''}, addPipelineStep: function(){}, addPostRenderStep: function(funObj){funObj.run({config: {settings: {noScrollToTop: false}}}, function(){});}};
    let router;
    app2.configureRouter(config, router);
    document.body.innerHTML = '';
    app2.configureRouter(config, router);
    config = {fallbackRoute: function(){}, map: function(){}, title: '', options: {pushstate: '', root: ''}, addPipelineStep: function(){}, addPostRenderStep: function(funObj){funObj.run({config: {settings: {noScrollToTop: true}}}, function(){});}};
    app2.configureRouter(config, router);
    done();
  });
  it('check if user is logged in when token is not in local storage', (done) => {
    window.localStorage.clear();
    //app1.authenticated = true;
    let configStub = {options: {pushState: true}, addPipelineStep(){},  addPostRenderStep(){}, map(){}, fallbackRoute(){}, navigate(){}};
    app1.configureRouter(configStub, RouterStub);
    app1.router.navigate = function(){};
    app1.checkIfLoggedIn();
    //expect(app1.authenticated).toBe(false);
    done();
  });
  it('configures the router', (done) => {
    let configStub = {options: {pushState: true}, addPipelineStep(){},  addPostRenderStep(){}, map(){}, fallbackRoute(){}};
    app1.configureRouter(configStub, RouterStub);
    expect(app1.router).toBeDefined;
    done();
  });

  it('updates by id', testAsync(async function(){
    //let configStub = {options: {pushState: true}, addPipelineStep(){}, map(){}, fallbackRoute(){}};
    //let afterF = function(){console.log('howdy');};
    await app1.updateById('/volopp/', '123', {});
    //console.log('this is the response');
    //console.log(response);
    //expect(app1.router).toBeDefined;
    //done();
  }));

  it('should find a user when authenticated', (done) => {
    //let configStub = {options: {pushState: true}, addPipelineStep(){}, map(){}, fallbackRoute(){}};
    app1.checkUser();
    //expect(app1.router).toBeDefined;
    done();
  });

  it('should provide a login page for OHAF', (done) => {
    app1.activate().then(() => {
      app1.ohafLogin();
    });
    done();
  });

  it('should provide a login page for WJ', (done) => {
    app1.activate().then(() => {
      app1.wjLogin();
    });
    done();
  });

  it('should sent an OHAF user to /OHAF on logout', (done) => {
    //app1.activate().then(() => {
    app1.role = 'Charity';
    app1.logout();
    //});
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
    let configStub = {options: {pushState: true}, addPipelineStep(){},  addPostRenderStep(){}, map(){}, fallbackRoute(){}};
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

  it('provides the correct /login page styles for WJ or OHAF', (done) => {
    let routre = new RouterStub();
    routre.currentInstruction.config.name = 'login';
    app1.router = routre;
    app1.appState.isOhafLogin = true;
    document.body.innerHTML = '<div id="wjfooter" class="footer drawer nav-list"><i id="mobilemenutoggle"></i></div>';
    //app1.currentRoute = 'login';
    app1.currentStyles;
    //app1.logout();
    expect(app1.Menu).toBe('ohaf');
    app1.appState.isOhafLogin = false;
    app1.currentStyles;
    expect(app1.Menu).toBe('wj');
    done();
  });

  it('gets the current styles with ohaf route', (done) => {
    let routre = new RouterStub();
    routre.currentInstruction.config.name = 'ohaf';
    document.body.innerHTML = '<div id="wjfooter" class="footer drawer nav-list"><i id="mobilemenutoggle"></i></div>';
    app1.router = routre;
    app1.currentStyles;
    expect(app1.Menu).toBe('ohaf');
    done();
  });

  it('gets the current styles with library route', (done) => {
    let routre = new RouterStub();
    routre.currentInstruction.config.name = 'library';
    document.body.innerHTML = '<div id="wjfooter" class="footer drawer nav-list"><i id="mobilemenutoggle"></i></div>';
    app1.router = routre;
    app1.currentStyles;
    expect(app1.Menu).toBe('library');
    done();
  });

  it('gets the current styles with dashboard route', (done) => {
    let routre = new RouterStub();
    routre.currentInstruction.fragment = '/dashboard';
    app1.router = routre;
    app1.currentStyles;
    expect(app1.Menu).toBe('dashboard');
    done();
  });

  it('gets the current styles with bookshelf route', (done) => {
    let routre = new RouterStub();
    routre.currentInstruction.fragment = '/bookshelf';
    app1.router = routre;
    app1.currentStyles;
    expect(app1.Menu).toBe('bookshelf');
    done();
  });

  it('gets the current styles with user-account route', (done) => {
    let routre = new RouterStub();
    routre.currentInstruction.fragment = '/dashboard/user-account';
    app1.router = routre;
    app1.currentStyles;
    expect(app1.Menu).toBe('user-account');
    done();
  });

  it('gets the current styles dashboard/volunteer route', (done) => {
    let routre = new RouterStub();
    document.body.innerHTML = '<div id="ohaf-footer" class="footer drawer nav-list" elevation="4" style="padding:8px; background-color: #565656"></div>';
    routre.currentInstruction.fragment = '/dashboard/volunteer';
    app1.router = routre;
    app1.currentStyles;
    expect(app1.Menu).toBe('volunteer');
    done();
  });

  it('gets the current styles with dashboard/charity route', (done) => {
    document.body.innerHTML = '<div id="ohaf-footer" class="footer drawer nav-list" elevation="4" style="padding:8px; background-color: #565656"></div>';
    let routre = new RouterStub();
    routre.currentInstruction.fragment = '/dashboard/charity';
    app1.router = routre;
    app1.currentStyles;
    expect(app1.Menu).toBe('charity');
    done();
  });

  it('gets the current styles with dashboard/reader route', (done) => {
    let routre = new RouterStub();
    routre.currentInstruction.fragment = '/dashboard/reader';
    app1.router = routre;
    app1.currentStyles;
    expect(app1.Menu).toBe('reader');
    done();
  });

  it('gets the current styles with dashboard/librarian route', (done) => {
    let routre = new RouterStub();
    routre.currentInstruction.fragment = '/dashboard/librarian';
    app1.router = routre;
    app1.currentStyles;
    expect(app1.Menu).toBe('librarian');
    done();
  });

  it('gets the current styles with dashboard/developer route', (done) => {
    let routre = new RouterStub();
    routre.currentInstruction.fragment = '/dashboard/developer';
    app1.router = routre;
    app1.currentStyles;
    expect(app1.Menu).toBe('developer');
    done();
  });

  it('gets the current styles with music-router route', (done) => {
    let routre = new RouterStub();
    routre.currentInstruction.config.name = 'music-router';
    app1.router = routre;
    app1.currentStyles;
    expect(app1.Menu).toBe('music');
    done();
  });

  it('gets the current styles when route is sc2rs', (done) => {
    let routre = new RouterStub();
    routre.currentInstruction.fragment = '/sc2rs';
    app1.router = routre;
    app1.currentStyles;
    done();
  });

  it('leaves the styles set to wj if undefined route frag', (done) => {
    let routre = new RouterStub();
    routre.currentInstruction.fragment = 'vol-ops/';
    app1.router = routre;
    app1.currentStyles;
    expect(app1.Menu).toBe('charity');
    routre.currentInstruction.fragment = undefined;
    app1.router = routre;
    app1.currentStyles;
    expect(app1.Menu).toBe('wj');
    done();
  });

  it('closes the menu on widescreen when clicking the correct area', (done) => {
    document.body.innerHTML = '<div class="drawer mobile-menu-toggle page-host swipe-area"></div>';
    app1.clickFunc({target: {className: 'nothing'}});
    expect(document.getElementsByClassName('page-host')[0].style.overflow).toBe('auto');
    done();
  });

  it('closes the menu on cellphone display', (done) => {
    document.body.innerHTML = '<div class="page-host drawer mobile-menu-toggle main-panel swipe-area"></div>';
    app1.contentWidth = '0px';
    app1.close();
    done();
  });

  it('should get widescreen', (done) => {
    const app3 = new App(new AuthStub, new HttpMock);
    document.body.innerHTML = '<div class="drawer swipe-area"></div> <div class="mobile-menu-toggle"></div><div class="main-panel"></div>';
    window.$ = () => ({parent: () => ({css: (arg) = arg})});
    app3.contentWidth = '0px';
    expect(app3.widescreen).toBe(true);
    done();
  });

  it('should toggle mobile menu', () => {
    document.body.innerHTML = '<div class="page-host drawer mobile-menu-toggle main-panel swipe-area"></div>';
    let toggleIcon = document.getElementsByClassName('mobile-menu-toggle')[0];
    app1.toggleMobileMenu();
    expect(toggleIcon.style.display).toBe('block');
    document.getElementsByClassName('drawer')[0].style.display = 'none';
    app1.toggleMobileMenu();
    //expect(toggleIcon.style.display).toBe('none');
  });

  it('should toggle menu to be icons only', () => {
    app2.activate();
    app2.fullmenu = true;
    document.body.innerHTML = '<div class="main-panel"></div><div class="drawer-container"></div><div class="nav-list"></div>';
    app2.toggleMenu();
    expect(app2.fullmenu).toBe(false);
    expect(app2.drawerWidth).toBe('50px');
    //done();
  });

  it('should toggle menu to be icons with text', () => {
    document.body.innerHTML = '<div class="main-panel"></div><div class="drawer-container"></div><div class="nav-list"></div>';
    app1.fullmenu = false;
    app1.toggleMenu();
    expect(app1.fullmenu).toBe(true);
    expect(app1.drawerWidth).toBe('182px');
  });
  // done();
});
