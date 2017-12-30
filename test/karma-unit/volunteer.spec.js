import {Volunteer} from '../../src/dashboard-child-routes/volunteer';
import {App} from '../../src/app';
import {AuthStub, HttpMock, AppStateStub, RouterStub} from './commons';

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
        'voloppId': 1,
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
    app.router = new RouterStub();
    app.activate();
    app.appState.user = {_id: '1', name: 'billy', email: 'billy@billy.com', volCauses: ['', '']};
    volunteer = new Volunteer(app);
    app2 = new App(auth, new HttpMockEvent());
    app2.appState = new AppStateStub();
    app2.router = new RouterStub();
    app2.appState.user = { name: 'Iddris Elba', userType: 'Volunteer', _id: '3333333', volTalents: ['childcare'], volCauses: ['Environmental'], volWorkPrefs: ['counseling'], volCauseOther: '', volTalentOther: '', volWorkOther: '', userDetails: 'newUser', isOhafUser: true};
    app2.activate();
    volunteer2 = new Volunteer(app2);
  });

  it('should active so it can display the volunteer settings', (done) => {
    volunteer.activate();
    volunteer.app.appState.user = { name: 'Iddris Elba', userType: 'Volunteer', _id: '3333333', volTalents: ['childcare'], volCauses: ['Environmental'], volWorkPrefs: ['counseling'], volCauseOther: '', volTalentOther: '', volWorkOther: '', userDetails: 'newUser', isOhafUser: true};
    volunteer.activate();
    //console.log(volunteer.user);
    done();
  });

  it('setup volunteer with other not selected', (done) => {
    volunteer.user = {name: 'Iddris Elba', userType: 'Volunteer', _id: '3333333', volTalents: ['childcare'], volCauses: ['Environmental'], volWorkPrefs: ['counseling'], volCauseOther: '', volTalentOther: '', volWorkOther: ''};
    document.body.innerHTML = '<div id="causesSelector"></div><div id="talentsSelector"></div><div id="worksSelector"></div>';
    volunteer.setupVolunteerUser();
    expect(volunteer.talentOther).toBe(false);
    expect(volunteer.workOther).toBe(false);
    expect(volunteer.causeOther).toBe(false);
    done();
  });

  it('should select picked type', (done) => {
    volunteer.user = {name: 'Iddris Elba', userType: 'Volunteer', _id: '3333333', volTalents: ['childcare'], volCauses: ['Environmental'], volWorkPrefs: ['counseling'], volCauseOther: '', volTalentOther: '', volWorkOther: ''};
    document.body.innerHTML = '<div id="selectTalents"></div><div id="selectCauses"></div><div id="selectWork"></div><button id="updateUserButton"></button>';
    volunteer.selectPickChange('causes');
    volunteer.selectPickChange('work');
    volunteer.selectPickChange('talents');
    done();
  });

  it('should update user', (done) => {
    volunteer.updateUser();
    done();
  });

  it('navigates to dashboard after update user', (done) => {
    volunteer.user = {name: 'Iddris Elba', userType: 'Charity', _id: '3333333', volTalents: ['childcare', 'other'], volCauses: ['Environmental', 'other'], volWorkPrefs: ['counseling', 'other'], volCauseOther: '', volTalentOther: '', volWorkOther: ''};
    volunteer.afterUpdateUser();
    done();
  });

  it('should active and get all events', (done) => {
    volunteer2.activate();
    done();
  });

  it('should have the same id as events id', (done) => {
    volunteer.events = [{_id: '2124', voloppId: '123', userId: '3', numPeople: 1, scheduled: false}];
    volunteer.checkSignups();
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
    volunteer2.app.buildPTag = function(){};
    volunteer2.displayEvents();
    //console.log(volunteer2.events);
    //expect(volunteer2.events[1].workHtml).toBe('<p style="font-size:10pt">not specified</p>');
    done();
  });

  it('displays the events including past events', (done) => {
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
    volunteer2.selectedFilter = [];
    volunteer2.displayEvents();
    //console.log(volunteer2.events);
    //expect(volunteer2.events[1].workHtml).toBe('<p style="font-size:10pt">not specified</p>');
    done();
  });

  it('should run attached to setup the volunteer user', (done) => {
    volunteer.activate();
    document.body.innerHTML = '<div id="causesSelector"></div><div id="talentsSelector"></div><div id="worksSelector"></div><input id="distanceInput"><button id="updateUserButton"></button>';
    volunteer.user = {volCauses: ['Hunger', 'other'], volTalents: ['Cooking', 'other'], volWorkPrefs: ['Chopping', 'other'], volCauseOther: 'Thirst', volTalentOther: 'Singing', volWorkOther: 'Cleaning' };
    volunteer.attached();
    // expect(document.getElementById('causes').innerHTML).not.toBe('<p style="font-size:10pt">not specified</p>');
    // expect(document.getElementById('talents').innerHTML).not.toBe('<p style="font-size:10pt">not specified</p>');
    // expect(document.getElementById('works').innerHTML).not.toBe('<p style="font-size:10pt">not specified</p>');
    done();
  });

  it('should not display the checkboxes', (done) => {
    volunteer.activate();
    document.body.innerHTML = '<div id="causesSelector"></div><div id="talentsSelector"></div><div id="worksSelector"></div><div id="selectTalents"></div><div id="selectCauses"></div><div id="selectWork"></div>';
    volunteer.user = {volCauses: [], volTalents: [], volWorkPrefs: [], volCauseOther: '', volTalentOther: '', volWorkOther: '' };
    volunteer.setupVolunteerUser();
    expect(document.getElementById('selectWork').style.display).not.toBe('block');
    expect(document.getElementById('selectTalents').style.display).not.toBe('block');
    expect(document.getElementById('selectCauses').style.display).not.toBe('block');
    done();
  });

  it('removes double quote empty string array elements', (done) => {
    volunteer.activate();
    document.body.innerHTML = '<div id="causesSelector"></div><div id="talentsSelector"></div><div id="worksSelector"></div><div id="selectTalents"></div><div id="selectCauses"></div><div id="selectWork"></div><button id="updateUserButton"></button>';
    volunteer.user = {volCauses: [], volTalents: [], volWorkPrefs: [], volCauseOther: '', volTalentOther: '', volWorkOther: '' };
    volunteer.selectedCauses = ['', 'hunger'];
    volunteer.selectedWorks = ['', 'scrubbing'];
    volunteer.selectedTalents = ['', 'beer drinking'];
    volunteer.selectPickChange('causes');
    volunteer.selectPickChange('work');
    volunteer.selectPickChange('talents');
    expect(volunteer.selectedCauses[0]).toBe('hunger');
    expect(volunteer.selectedWorks[0]).toBe('scrubbing');
    expect(volunteer.selectedTalents[0]).toBe('beer drinking');
    done();
  });

  it('hides the checkboxes when all are unchecked', (done) => {
    volunteer.activate();
    document.body.innerHTML = '<div id="causesSelector"></div><div id="talentsSelector"></div><div id="worksSelector"></div><div id="selectTalents" style="display:block"></div><div id="selectCauses" style="display:block"></div><div id="selectWork" style="display:block"></div><button id="updateUserButton"></button>';
    volunteer.user = {volCauses: [], volTalents: [], volWorkPrefs: [], volCauseOther: '', volTalentOther: '', volWorkOther: '' };
    volunteer.selectedCauses = [];
    volunteer.selectedWorks = [];
    volunteer.selectedTalents = [];
    volunteer.selectPickChange('causes');
    volunteer.selectPickChange('work');
    volunteer.selectPickChange('talents');
    expect(document.getElementById('selectTalents').style.display).toBe('none');
    expect(document.getElementById('selectCauses').style.display).toBe('none');
    expect(document.getElementById('selectWork').style.display).toBe('none');
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

  // it('should cancel signup', (done) => {
  //   volunteer.cancelSignup('120980592048243099824324');
  //   done();
  // });

  it('should not change the zipcode if defined', (done) => {
    volunteer.events = [{voZipCode: '24153'}];
    volunteer.fixZipcodesAndTypes();
    expect(volunteer.events[0].voZipCode).toBe('24153');
    done();
  });

  it('should not try to fix dates that do not exist', (done) => {
    volunteer.events = [{voZipCode: '24153'}];
    volunteer.fixDates();
    expect(volunteer.events[0].voStartDate).toBe(undefined);
    expect(volunteer.events[0].voEndDate).toBe(undefined);
    done();
  });

  it('should format the date of January 1, 2017', (done) => {
    let date = new Date();
    date.setMonth(0);
    date.setDate(1);
    date.setFullYear(2017);
    const newDate = volunteer.formatDate(date);
    expect(newDate).toBe('20170101');
    done();
  });

  it('should not signup when event is full', (done) => {
    //volunteer.canSignup = false;
    volunteer.uid = 1298471410910974;
    volunteer.signupEvent({_id: 1298471058100, full: true});
    //expect signup user id array to be length of zero
    done();
  });

  it('should signup event', (done) => {
    //volunteer.canSignup = true;
    volunteer.uid = 1298471410910974;
    volunteer.signupEvent({_id: 1298471058100});
    //expect signup user id array to contain this user id
    done();
  });
});
