import {TopNavApp} from '../../src/top-nav-app';

class RouterStub {
  configure(handler) {
    handler(this);
  }

  map(routes) {
    this.routes = routes;
  }
}

describe('the App module', () => {
  var sut;
  var mockedRouter;

  beforeEach(() => {
    mockedRouter = new RouterStub();
    sut = new TopNavApp();
    sut.configureRouter(mockedRouter, mockedRouter);
  });

  it('contains a router property', () => {
    expect(sut.router).toBeDefined();
  });

  it('configures the router title', () => {
    expect(sut.router.title).toEqual('Web Jam LLC');
  });

  it('should have a welcome route', () => {
    expect(sut.router.routes).toContain({ route: ['welcome', 'welcome'], name: 'welcome',  moduleId: './welcome', nav: true, title: 'Welcome' });
  });

  it('should have a users route', () => {
    expect(sut.router.routes).toContain({ route: 'users', name: 'users', moduleId: './users', nav: true, title: 'Github Users' });
  });

  it('should have a child router route', () => {
    expect(sut.router.routes).toContain({ route: 'child-router', name: 'child-router', moduleId: './child-router', nav: true, title: 'Child Router' });
  });
  it('should have a home route', () => {
    expect(sut.router.routes).toContain({ route: '',  name: 'home', moduleId: './home', nav: false, title: 'Web Jam LLC' });
  });
});
