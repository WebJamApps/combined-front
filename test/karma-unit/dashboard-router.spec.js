import {DashboardRouter} from '../../src/dashboard-router';
import {RouterStub, ConfigStub} from './commons';

describe('the dashboard-router module', () => {
  var sut;
  var mockedRouter;


  mockedRouter = new RouterStub();
  const config1 = new ConfigStub;
  config1.map([
    { route: '', name: 'dashboard', moduleId: './dashboard-routes/dashboard', nav: false, title: 'Dashboard', auth: true},
    { route: 'volunteer', name: 'volunteer', moduleId: './dashboard-routes/volunteer-dashboard', nav: false, title: 'Volunteer', auth: true},
    { route: 'charity', name: 'charity', moduleId: './dashboard-routes/charity-dashboard', nav: false, title: 'Charity', auth: true},
    { route: 'library', name: 'library', moduleId: './dashboard-routes/store-manager-dashboard-router', nav: false, title: 'Store', auth: true}

  ]);
  sut = new DashboardRouter(mockedRouter);

  it('configures the dashboard child routes', (done) => {
    sut.configureRouter(config1, mockedRouter);
    expect(sut.router).toBeDefined;
    done();
  });
});
