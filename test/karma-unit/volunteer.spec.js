import {Volunteer} from '../../src/dashboard-child-routes/volunteer';
import {App} from '../../src/app';
import {AuthStub, HttpMock, AppStateStub} from './commons';

describe('the Volunteer Module', () => {
  let volunteer;
  let app;
  beforeEach(() => {
    app = new App(new AuthStub(), new HttpMock());
    app.appstate = new AppStateStub();
    app.appstate.user = {_id: '23334', name: 'billy', email: 'billy@billy.com'};
    volunteer = new Volunteer(app);
  });
  it('should active so it can display the volunteer settings', (done) => {
    volunteer.activate();
    done();
  });
});
