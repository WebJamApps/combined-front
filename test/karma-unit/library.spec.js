import {Library} from '../../src/library';
//import {AppRouterConfig} from '../../src/app.router.config';
//import {RouterStub} from './commons';

describe('the Library module', () => {
  //let news1;
  //let mockedRouter;
  //let sut;
  //let config1;
  let lib1;

  beforeEach(() => {
    //mockedRouter = new RouterStub();
    //sut = new AppRouterConfig(mockedRouter);
    // config1 = new ConfigStub;
    // config1.map([
    //   { route: '', name: 'dashboard', moduleId: './dashboard-routes/dashboard', nav: false, title: 'Dashboard', auth: true},
    //   { route: 'volunteer', name: 'volunteer', moduleId: './dashboard-routes/volunteer-dashboard', nav: false, title: 'Volunteer', auth: true},
    //   { route: 'charity', name: 'charity', moduleId: './dashboard-routes/charity-dashboard', nav: false, title: 'Charity', auth: true},
    //   { route: 'library', name: 'library', moduleId: './dashboard-routes/store-manager-dashboard-router', nav: false, title: 'Store', auth: true}
    //
    // ]);
    //sut.configure(config1, mockedRouter);
    lib1 = new Library();
  });

  it('checks that widescreen is boolean', (done) => {
    expect(typeof lib1.widescreen).toBe('boolean');
    done();
  });
});
