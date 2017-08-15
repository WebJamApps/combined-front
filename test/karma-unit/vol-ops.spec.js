import {VolunteerOpps} from '../../src/dashboard-child-routes/vol-ops';
import {App} from '../../src/app';
import {AuthStub, HttpMock, AppStateStub} from './commons';
describe('the Volunteer Opps Module', () => {
  let app;
  let auth;
  let volops;
  beforeEach(() => {
    auth = new AuthStub();
    auth.setToken({sub: 'aowifjawifhiawofjo'});
    app = new App(auth, new HttpMock());
    volops = new VolunteerOpps(app);
    volops.app.appState = new AppStateStub();
  });

  it('activates', (done) => {
    volops.activate();
    done();
  });
});
