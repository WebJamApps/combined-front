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
    app.appState = new AppStateStub();
    app.activate();
    app.appState.user = {_id: '1', name: 'billy', email: 'billy@billy.com', volCauses: ['', '']};
    volunteer = new Volunteer(app);
    app2 = new App(auth, new HttpMockEvent());
    app2.appState = new AppStateStub();
    app2.appState.user = {_id: '1', name: 'billy', email: 'billy@billy.com', volCauses: ['', '']};
    app2.activate();
    volunteer2 = new Volunteer(app2);
  });

  it('should active so it can display the volunteer settings', (done) => {
    volunteer.activate();
    console.log(volunteer.user);
    done();
  });

  it('should active and get all events', (done) => {
    volunteer2.activate();
    done();
  });

  it('displays the events', (done) => {
    // volunteer2.activate();
    volunteer2.events = [{
      'voStartDate': '2017-12-12T',
      'voEndDate': '2017-12-12',
      'voWorkTypes': ['shoveling', 'sweeping', 'other'],
      'voWorkTypeOther': 'scrubbing',
      '_id': 1,
      'scheduled': false,
      'voNumPeopleScheduled': 10,
      'voNumPeopleNeeded': 5,
      'voStatus': 'cancel',
      'voCharityTypes': ['ages', 'in', 'the', 'wake']
    }, {
      'voStartDate': '2017-12-12',
      'voEndDate': '2017-12-12T',
      'voWorkTypes': [''],
      'voWorkTypeOther': '',
      '_id': 2,
      'scheduled': false,
      'voNumPeopleScheduled': 10,
      'voNumPeopleNeeded': 5,
      'voStatus': 'cancel',
      'voCharityTypes': ['ages', 'in', 'the', 'wake']
    }];
    volunteer2.signups = [{'voloppId': 1, 'numPeople': 25, 'userId': 123445}, {'voloppId': 3, 'numPeople': 25, 'userId': 123445}];
    volunteer2.doubleCheckSignups = true;
    volunteer2.selectedFilter = ['future only', 'hello'];
    volunteer2.displayEvents();
    //console.log(volunteer2.events);
    //expect(volunteer2.events[1].workHtml).toBe('<p style="font-size:10pt">not specified</p>');
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

  it('should check scheduled', (done) => {
    volunteer.events = [{
      'voStartDate': '2017-12-12',
      'voEndDate': '2017-12-12',
      'voWorkTypes': ['shoveling', 'sweeping', 'other'],
      'voWorkTypeOther': 'scrubbing',
      '_id': 1,
      'scheduled': false,
      'voNumPeopleScheduled': 10,
      'voNumPeopleNeeded': 5,
      'voStatus': 'cancel'
    }, {
      'voStartDate': '2017-12-12',
      'voEndDate': '2017-12-12',
      'voWorkTypes': [''],
      'voWorkTypeOther': '',
      '_id': 2,
      'scheduled': false,
      'voNumPeopleScheduled': 10,
      'voNumPeopleNeeded': 5,
      'voStatus': 'cancel'
    }];
    volunteer.signups = [{'voloppId': 1, 'numPeople': 25, 'userId': 123445}, {'voloppId': 3, 'numPeople': 25, 'userId': 123445}];
    volunteer.doubleCheckSignups = true;
    volunteer.checkScheduled();
    volunteer.doubleCheckSignups = false;
    volunteer.checkScheduled();
    done();
  });

  it('should filter picks', (done) => {
    volunteer.events = [{
      'voStartDate': '',
      'voEndDate': '2017-12-12',
      'voWorkTypes': ['shoveling', 'sweeping', 'other'],
      'voWorkTypeOther': 'scrubbing'
    }];
    volunteer.selectedFilter = ['keywords', 'zipcode', 'cause', 'future only'];
    volunteer.filterPicked();
    volunteer.selectedFilter = ['keyword', 'zpcode', 'case', 'futures onlies'];
    volunteer.filterPicked();
    volunteer.selectedFilter = [];
    volunteer.filterPicked();
    done();
  });

  it('should cancel signup', (done) => {
    volunteer.cancelSignup('120980592048243099824324');
    done();
  });

  it('should check signup event', (done) => {
    volunteer.canSignup = true;
    volunteer.uid = 1298471410910974;
    volunteer.signupEvent({_id: 1298471058100});
    done();
  });
});
