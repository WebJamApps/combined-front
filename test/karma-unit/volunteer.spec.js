import {Volunteer} from '../../src/dashboard-child-routes/volunteer';
import {App} from '../../src/app';
import {AuthStub, HttpMock, AppStateStub} from './commons';

class HttpMockEvent extends HttpMock {
  fetch(url, obj) {
    //console.log(url);
    this.headers.url = url;
    this.headers.method = obj ? obj.method : 'GET';
    if (obj && obj.method === 'put') {
      this.voOpp = obj.body;
    }
    this.status = 200;
    return Promise.resolve({
      Headers: this.headers,
      json: () => Promise.resolve([{'_id': '234', 'voName': 'run the swamp',
        'voCharityId': '123',
        'voCharityName': 'howdy',
        'voNumPeopleNeeded': 1,
        'voDescription': '',
        'voWorkTypes': [],
        'voTalentTypes': [],
        'voWorkTypeOther': '',
        'voTalentTypeOther': '',
        'voStartDate': null,
        'voStartTime': '',
        'voEndDate': null,
        'voEndTime': '',
        'voContactName': '',
        'voContactEmail': '',
        'voContactPhone': ''}])
    });
  }
}

describe('the Volunteer Module', () => {
  let volunteer;
  let volunteer2;
  let app;
  let app2;
  let auth;
  beforeEach(() => {
    auth = new AuthStub();
    auth.setToken({sub: '1'});
    app = new App(auth, new HttpMock());
    app.appstate = new AppStateStub();
    app.activate();
    //app.appstate.user = {_id: '23334', name: 'billy', email: 'billy@billy.com', volCauses: ['', '']};
    volunteer = new Volunteer(app);
    app2 = new App(auth, new HttpMockEvent());
    app2.appstate = new AppStateStub();
    app2.activate();
    volunteer2 = new Volunteer(app2);
  });

  it('should active so it can display the volunteer settings', (done) => {
    volunteer.activate();
    done();
  });

  it('should active and get all events', (done) => {
    volunteer2.activate();
    done();
  });

  it('should run attached to populate the table when no prefs are set', (done) => {
    volunteer.activate();
    document.body.innerHTML = '<p id="causes"></p><p id="talents"></p><p id="works"></p>';
    volunteer.user = {volCauses: [''], volTalents: [''], volWorkPrefs: [''] };
    volunteer.attached();
    expect(document.getElementById('causes').innerHTML).toBe('<p style="font-size:10pt">not specified</p>');
    expect(document.getElementById('talents').innerHTML).toBe('<p style="font-size:10pt">not specified</p>');
    expect(document.getElementById('works').innerHTML).toBe('<p style="font-size:10pt">not specified</p>');
    done();
  });

  it('should run attached to populate the table when all prefs are set', (done) => {
    volunteer.activate();
    document.body.innerHTML = '<p id="causes"></p><p id="talents"></p><p id="works"></p>';
    volunteer.user = {volCauses: ['Hunger', 'other'], volTalents: ['Cooking', 'other'], volWorkPrefs: ['Chopping', 'other'], volCauseOther: 'Thirst', volTalentOther: 'Singing', volWorkOther: 'Cleaning' };
    volunteer.attached();
    expect(document.getElementById('causes').innerHTML).not.toBe('<p style="font-size:10pt">not specified</p>');
    expect(document.getElementById('talents').innerHTML).not.toBe('<p style="font-size:10pt">not specified</p>');
    expect(document.getElementById('works').innerHTML).not.toBe('<p style="font-size:10pt">not specified</p>');
    done();
  });
});
