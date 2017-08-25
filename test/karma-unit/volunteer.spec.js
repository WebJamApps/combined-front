import {Volunteer} from '../../src/dashboard-child-routes/volunteer';
import {App} from '../../src/app';
import {AuthStub, HttpMock, AppStateStub} from './commons';

describe('the Volunteer Module', () => {
  let volunteer;
  let app;
  let auth;
  beforeEach(() => {
    auth = new AuthStub();
    auth.setToken({sub: '1'});
    app = new App(auth, new HttpMock());
    app.appstate = new AppStateStub();
    app.activate();
    //app.appstate.user = {_id: '23334', name: 'billy', email: 'billy@billy.com', volCauses: ['', '']};
    volunteer = new Volunteer(app);
  });
  it('should active so it can display the volunteer settings', (done) => {
    volunteer.activate();
    done();
  });
  it('should run attached to populate the table when no prefs are set', (done) => {
    volunteer.activate();
    document.body.innerHTML = '<p id="causes"></p><p id="talents"></p><p id="works"></p>';
    volunteer.user = {volCauses: [''], volTalents: [''], volWorkPrefs: [''] };
    volunteer.attached();
    done();
  });

  it('should run attached to populate the table when all prefs are set', (done) => {
    volunteer.activate();
    document.body.innerHTML = '<p id="causes"></p><p id="talents"></p><p id="works"></p>';
    volunteer.user = {volCauses: ['Hunger', 'other'], volTalents: ['Cooking', 'other'], volWorkPrefs: ['Chopping', 'other'], volCauseOther: 'Thirst', volTalentOther: 'Singing', volWorkOther: 'Cleaning' };
    volunteer.attached();
    done();
  });
});
