import {News} from '../../src/news';
import {AppRouterConfig} from '../../src/app.router.config';
import {RouterStub, ConfigStub} from './commons';

describe('the News module', () => {
  //let news1;
  let mockedRouter;
  let sut;
  let config1;
  let news1;

  beforeEach(() => {
    mockedRouter = new RouterStub();
    sut = new AppRouterConfig(mockedRouter);
    config1 = new ConfigStub;
    config1.map([
      { route: '', name: 'dashboard', moduleId: './dashboard-routes/dashboard', nav: false, title: 'Dashboard', auth: true},
      { route: 'volunteer', name: 'volunteer', moduleId: './dashboard-routes/volunteer-dashboard', nav: false, title: 'Volunteer', auth: true},
      { route: 'charity', name: 'charity', moduleId: './dashboard-routes/charity-dashboard', nav: false, title: 'Charity', auth: true},
      { route: 'library', name: 'library', moduleId: './dashboard-routes/store-manager-dashboard-router', nav: false, title: 'Store', auth: true}

    ]);
    sut.configure(config1, mockedRouter);
    news1 = new News(mockedRouter);
  });

  it('will attach', (done) => {
    //mockedRouter.getRoute();
    news1.attached();
    //TODO expect something useful
    //console.log(news1.title);
    expect(news1.title).toBe('Howdy is cool');
    done();
  });
});
