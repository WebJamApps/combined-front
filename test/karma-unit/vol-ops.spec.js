import {VolunteerOpps} from '../../src/dashboard-child-routes/vol-ops';
import {App} from '../../src/app';
import {AuthStub, HttpMock, AppStateStub} from './commons';
import {Validator} from 'aurelia-validation';
import {formatDate, markPast} from '../../src/commons/utils.js';

function testAsync(runAsync) {
  return (done) => {
    runAsync().then(done, (e) => { fail(e); done(); });
  };
}

class VCMock {
  createForCurrentScope(validator) {
    return {validateTrigger: null};
  }
}

class ValidatorMock extends Validator {
  constructor(a, b) {
    super();
    this.a = a;
    this.b = b;
  }
  validateObject(obj, rules) {
    return Promise.resolve([{rule: Object, object: Object, propertyName: 'voStartTime', valid: true, message: ''}]);
  }
  validateProperty(prop, val, rules) {
    return Promise.resolve({});
  }
}

class ValidatorMockFalse extends Validator {
  constructor(a, b) {
    super();
    this.a = a;
    this.b = b;
  }
  validateObject(obj, rules) {
    console.log('obj');
    console.log(obj);
    return Promise.resolve([{rule: Object, object: Object, propertyName: 'voStartTime', valid: false, message: ''}]);
  }
  validateProperty(prop, val, rules) {
    return Promise.resolve({});
  }
}

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
      json: () => Promise.resolve([{'voName': '', 'voCharityId': this.charityID, 'voCharityName': this.charityName, 'voNumPeopleNeeded': 1, 'voDescription': '', 'voWorkTypes': [], 'voTalentTypes': [], 'voWorkTypeOther': '', 'voTalentTypeOther': '', 'voStartDate': null, 'voStartTime': '', 'voEndDate': null, 'voEndTime': '', 'voContactName': this.user.name, 'voContactEmail': this.user.email, 'voContactPhone': this.user.userPhone}])});
  }
  }

class HttpMockEvent2 extends HttpMock {
  fetch(url, obj) {
    this.headers.url = url;
    this.headers.method = obj ? obj.method : 'GET';
    if (obj && obj.method === 'put') {
      this.voOpp = obj.body;
    }
    this.status = 200;
    return Promise.resolve({
      Headers: this.headers,
      json: () => Promise.resolve([])
    });
  }
  }

class HttpMockChar extends HttpMock {
  fetch(url, obj) {
    this.headers.url = url;
    this.headers.method = obj ? obj.method : 'GET';
    if (obj && obj.method === 'put') {
      this.user = obj.body;
    }
    this.status = 200;
    return Promise.resolve({
      Headers: this.headers,
      json: () => Promise.resolve({_id: '123', charityTypeOther: 'tree huggers', charityTypes: ['Home', 'Elderly', 'other'], charityManagers: ['Josh', 'Maria', 'Bob']})
    });
  }
  }

describe('the Volunteer Opps Module', () => {
  let app;
  let auth;
  let volops;
  let app2;
  let volops2;
  let app3;
  let volops3;
  let volops4;
  let app4;
  beforeEach(() => {
    auth = new AuthStub();
    auth.setToken({sub: 'aowifjawifhiawofjo'});
    app = new App(auth, new HttpMockEvent());
    volops = new VolunteerOpps(app, new VCMock(), new ValidatorMock());
    volops.activate();
    volops.app.appState = new AppStateStub();
    app2 = new App(auth, new HttpMockEvent2());
    volops2 = new VolunteerOpps(app2, new VCMock(), new ValidatorMockFalse());
    volops2.activate();
    volops2.app.appState = new AppStateStub();
    app3 = new App(auth, new HttpMockChar());
    volops3 = new VolunteerOpps(app3, new VCMock(), new ValidatorMockFalse());
    volops3.activate();
    volops3.app.appState = new AppStateStub();
    app4 = new App(auth, new HttpMock());
    volops4 = new VolunteerOpps(app4, new VCMock(), new ValidatorMock());
    volops4.activate();
    volops4.app.appState = new AppStateStub();
  });

  it('activates and there are events and runs the show time', (done) => {
    volops.activate();
      //volops.showTime();
    done();
  });

  it('it counts signups if the user exists', testAsync(async function(){
    volops4.events = [{_id: '123', voPeopleScheduled: ['1', '2'] }];
    await volops4.checkScheduled();
    expect(volops4.events[0].voNumPeopleScheduled).toBe(2);
  }));

  // it('does not show the submit button on initial display of update form', testAsync(async function(){
  //   volops.activate();
  //   let thisEvent = {
  //     '_id': '123',
  //     'voWorkTypes': ['other'],
  //     'voWorkTypeOther': '',
  //     'voCharityName': '',
  //     'voStartDate': '2017-12-12',
  //     'voEndDate': '2017-12-12',
  //     'voTalentTypes': ['shoveling', 'sweeping', 'other'],
  //     'voTalentTypeOther': 'scrubbing',
  //     'voDescription': 'howdy'
  //   };
  //   document.body.innerHTML = '<div id="topSection"></div><button id="updateScheduleEvent"></button>';
  //   volops.setupValidation2 = function(){};
  //   await volops.showUpdateEvent(thisEvent, 'update');
  //   expect(document.getElementById('updateScheduleEvent').style.display).toBe('none');
  // }));

  it('it sets signups to zero', testAsync(async function(){
    volops4.events = [{_id: '123', voStartDate: null, voEndDate: null}];
    await volops4.checkScheduled();
    expect(volops4.events[0].voNumPeopleScheduled).toBe(0);
  }));

  it('it removes signups if the user does not exist', testAsync(async function(){
    volops4.events = [{_id: '123', voPeopleScheduled: ['14444', '244444'], voStartDate: null, voEndDate: null, voWorkTypes: [], voTalentTypes: [] }];
    volops4.app.httpClient.fetch = function(){
      return Promise.reject(new Error('fail'));
    };
    await volops4.checkScheduled().then((isError) => {
    });
    expect(volops4.events[0].voNumPeopleScheduled).toBe(0);
  }));

  it('it displays the list of volunteers', testAsync(async function(){
    volops4.events = [{_id: '123', voPeopleScheduled: ['14444', '244444'], voStartDate: null, voEndDate: null, voWorkTypes: [], voTalentTypes: [] }];
    let fakeVolunteer = {name: 'Iddris Elba', userType: 'Volunteer', _id: '3333333', volTalents: ['childcare', 'other'], volCauses: ['Environmental', 'other'], volWorkPrefs: ['counseling', 'other'], volCauseOther: '', volTalentOther: '', volWorkOther: '', userDetails: 'newUser', isOhafUser: true};
    volops4.app.httpClient.fetch = function(){
      return Promise.resolve({
          // Headers: this.headers,
        json: () => Promise.resolve(fakeVolunteer)
      });
    };
    document.body.innerHTML = '<div id="showvolunteers"></div>';
    await volops4.viewPeople(volops4.events[0]);
    expect(volops4.allPeople[0].name).toBe('Iddris Elba');
  }));

  it('should mark past dates', testAsync(async function(){
    volops4.activate();
    volops4.uid = '155';
    volops4.events = [{
      'voStartDate': '2017-12-12',
      'voEndDate': '2017-12-12',
      'voWorkTypes': ['shoveling', 'sweeping', 'other'],
      'voWorkTypeOther': 'scrubbing',
      '_id': '23456',
      'scheduled': false,
      'voNumPeopleNeeded': 5,
      'voStatus': 'cancel',
      'voPeopleScheduled': ['12']
    }];
    markPast(volops4.events, formatDate);
    expect(volops4.events[0].past).toBe(true);
  }));

  it('should mark not past', testAsync(async function(){
    volops4.activate();
    volops4.uid = '155';
    volops4.events = [{
      'voStartDate': '2517-12-12',
      'voEndDate': '2517-12-12',
      'voWorkTypes': ['shoveling', 'sweeping', 'other'],
      'voWorkTypeOther': 'scrubbing',
      '_id': '23456',
      'scheduled': false,
      'voNumPeopleNeeded': 5,
      'voStatus': 'cancel',
      'voPeopleScheduled': ['12']
    }];
    markPast(volops4.events, formatDate);
    expect(volops4.events[0].past).toBe(false);
  }));

  it('should format the date of December 12, 2017', (done) => {
    let date = new Date();
    date.setMonth(11);
    date.setDate(12);
    date.setFullYear(2017);
    const newDate = formatDate(date);
    expect(newDate).toBe('20171212');
    done();
  });

  it('activates and there are no events', (done) => {
    volops2.activate();
    done();
  });

  it('set the min and max for start and end dates', (done) => {
      //volops.activate();
    volops.voOpp = {
      'voStartDate': '2017-12-12',
      'voEndDate': '2017-12-12'
    };
    volops.selectDate('start-date');
    volops.selectDate('end-date');
    done();
  });

  it('displays the chosen work preferences', (done) => {
      //volops.activate();
    volops.events = [{
      'voStartDate': '2017-12-12',
      'voEndDate': '2017-12-12',
      'voWorkTypes': ['shoveling', 'sweeping', 'other'],
      'voWorkTypeOther': 'scrubbing',
      'voTalentTypes': ['shoveling', 'sweeping', 'other'],
      'voTalentTypeOther': 'scrubbing'
    }, {
      'voStartDate': '2017-12-12',
      'voEndDate': '2017-12-12',
      'voWorkTypes': [''],
      'voWorkTypeOther': '',
      'voTalentTypes': ['shoveling', 'sweeping', 'other'],
      'voTalentTypeOther': 'scrubbing'
    }];
    volops.app.buildPTag(volops.events, 'voWorkTypes', 'voWorkTypeOther', 'workHtml');
      //console.log(volops.events[1]);
    expect(volops.events[1].workHtml).toBe('<p style="font-size:10pt">not specified</p>');
      //volops.buildWorkPrefs();
    done();
  });

  it('displays the chosen talent preferences', (done) => {
      //volops.activate();
    volops.events = [{
      'voStartDate': '2017-12-12',
      'voEndDate': '2017-12-12',
      'voTalentTypes': ['shoveling', 'sweeping', 'other'],
      'voTalentTypeOther': 'scrubbing'
    }, {
      'voStartDate': '2017-12-12',
      'voEndDate': '2017-12-12',
      'voTalentTypes': [''],
      'voTalentTypeOther': ''
    }];
    volops.app.buildPTag(volops.events, 'voTalentTypes', 'voTalentTypeOther', 'talentHtml');
    expect(volops.events[1].talentHtml).toBe('<p style="font-size:10pt">not specified</p>');
    done();
  });

  it('opens and closes the drop-down checkboxes', (done) => {
      //volops.activate();
    document.body.innerHTML = '<div id="talents" horizontal-align="right" vertical-align="top" style="margin-top:25px;"></div>';
    volops.showCheckboxes('talents');
    volops.app.expanded = true;
    volops.showCheckboxes('talents');
    done();
  });

  it('it displays the talent other form field', (done) => {
    volops.activate();
    volops.user = {
      'name': 'me',
      'email': 'me@me.org',
      'userPhone': '3333333333',
      'volTalents': []
    };
    volops.voOpp = {
      'voTalentTypes': ['other']
    };
    volops.app.selectPickedChange(volops.voOpp, volops, 'voTalentTypes', 'voTalentTypeOther', 'talentOther');
    expect(volops.talentOther).toBe(true);
    volops.voOpp = {
      'voTalentTypes': ['swimming']
    };
    volops.voOpp.voTalentTypeOther = 'teststring';
    volops.selectPickChange('talents');
    expect(volops.talentOther).toBe(false);
    document.body.innerHTML =   document.body.innerHTML = '<div id="topSection"></div><input id="s-time" type="text"><input id="e-time" type="text">';
    volops.setupValidation2 = function(){};
    volops.controller2 = {validate: () => {}};
    volops.attached();
    done();
  });

  it('it display the work other form field', (done) => {
    volops.activate();
    volops.user = {
      'name': 'me',
      'email': 'me@me.org',
      'userPhone': '3333333333',
      'volTalents': [],
      'volWorkPrefs': []
    };
    volops.voOpp = {
      'voWorkTypes': ['other'],
      'voTalentTypes': ['swimming', 'other']
    };
      //volops.app.selectPickedChange(volops.voOpp, volops, 'voWorkTypes', 'voWorkTypeOther', 'workOther');
    volops.selectPickChange('work');
      //expect(volops.workOther).toBe(true);
    volops.voOpp = {
      'voWorkTypes': ['swimming']
    };
    volops.voOpp.voWorkTypeOther = 'teststring';
    volops.app.selectPickedChange(volops.voOpp, volops, 'voWorkTypes', 'voWorkTypeOther', 'workOther');
      //expect(volops.workOther).toBe(false);
    expect(volops.voOpp.voWorkTypeOther).toBe('');
    done();
  });

  it('it creates a new event', (done) => {
      //volops.activate();
    document.body.innerHTML = '<div id="eventHeader"></div>';
    volops.charityName = 'OHAF';
    volops.voOpp = {
      'voWorkTypes': ['other'],
      'voWorkTypeOther': '',
      'voCharityName': '',
      'voStartDate': '2017-12-12',
      'voEndDate': '2017-12-12',
      'voTalentTypes': ['shoveling', 'sweeping', 'other'],
      'voTalentTypeOther': 'scrubbing'
    };
    volops.scheduleEvent();
    done();
  });

  it('it cancels an event', (done) => {
    let signupevent = {
      '_id': '123',
      'voWorkTypes': ['other'],
      'voWorkTypeOther': '',
      'voCharityName': '',
      'voStartDate': '2017-12-12',
      'voEndDate': '2017-12-12',
      'voTalentTypes': ['shoveling', 'sweeping', 'other'],
      'voTalentTypeOther': 'scrubbing',
      'voDescription': 'howdy'
    };
    volops.cancelEvent(signupevent);
    expect(volops.voOpp.voDescription).toBe('<p style="background-color:red"><strong>The Charity Has Cancelled This Event</strong></p>howdy');
    done();
  });

  it('it cancels an event without any description', (done) => {
    let signupevent = {
      '_id': '123',
      'voWorkTypes': ['other'],
      'voWorkTypeOther': '',
      'voCharityName': '',
      'voStartDate': '2017-12-12',
      'voEndDate': '2017-12-12',
      'voTalentTypes': ['shoveling', 'sweeping', 'other'],
      'voTalentTypeOther': 'scrubbing'
    };
    volops.cancelEvent(signupevent);
    expect(volops.voOpp.voDescription).toBe(undefined);
    done();
  });

  it('it reactivates an event without any description', (done) => {
    let signupevent = {
      '_id': '123',
      'voWorkTypes': ['other'],
      'voWorkTypeOther': '',
      'voCharityName': '',
      'voStartDate': '2017-12-12',
      'voEndDate': '2017-12-12',
      'voTalentTypes': ['shoveling', 'sweeping', 'other'],
      'voTalentTypeOther': 'scrubbing'
    };
    volops.reactivateEvent(signupevent);
    expect(volops.voOpp.voDescription).toBe(undefined);
    done();
  });

  it('it reactivates an event with description', (done) => {
    let signupevent = {
      '_id': '123',
      'voWorkTypes': ['other'],
      'voWorkTypeOther': '',
      'voCharityName': '',
      'voStartDate': '2017-12-12',
      'voEndDate': '2017-12-12',
      'voTalentTypes': ['shoveling', 'sweeping', 'other'],
      'voTalentTypeOther': 'scrubbing',
      'voDescription': 'howdy'
    };
    volops.reactivateEvent(signupevent);
    expect(volops.voOpp.voDescription).toBe('howdy');
    done();
  });

  it('it updates an event', (done) => {
    volops.voOpp = {
      '_id': '123',
      'voWorkTypes': ['other'],
      'voWorkTypeOther': '',
      'voCharityName': '',
      'voStartDate': '2017-12-12',
      'voEndDate': '2017-12-12',
      'voTalentTypes': ['shoveling', 'sweeping', 'other'],
      'voTalentTypeOther': 'scrubbing',
      'voDescription': 'howdy'
    };
    volops.updateEvent('update');
    expect(volops.voOpp.voDescription).toBe('<p style="background-color:yellow"><strong>The Charity Has Updated Details About This Event</strong></p>howdy');
    done();
  });

  it('it reactivates a cancelled event', (done) => {
    let signupevent = {
      '_id': '123',
      'voWorkTypes': ['other'],
      'voWorkTypeOther': '',
      'voCharityName': '',
      'voStartDate': '2017-12-12',
      'voEndDate': '2017-12-12',
      'voTalentTypes': ['shoveling', 'sweeping', 'other'],
      'voTalentTypeOther': 'scrubbing'
    };
    volops.reactivateEvent(signupevent);
    done();
  });

  it('displays the update event form', (done) => {
      //volops.activate();
    document.body.innerHTML = '<div id="topSection"><div id="updateScheduleEvent"></div></div>';
    let thisEvent = {
      'voWorkTypes': ['other'],
      'voCharityName': '',
      'voStartDate': '2017-12-12',
      'voEndDate': '2017-12-12',
      'voTalentTypes': ['shoveling', 'sweeping', 'other'],
      'voTalentTypeOther': 'scrubbing',
      'voContactPhone': '5555555',
      'voContactEmail': 'j@b.com',
      'voName': 'howdy',
      'voNumPeopleNeeded': 4,
      'voStartTime': '08:00 am',
      'voEndTime': '05:00 pm',
      'voZipCode': '24153',
      'voCity': 'Rochester',
      'voStreet': '120 street drive',
      'voState': 'Virginia'
    };
    volops.setupValidation2 = function(){};
    volops.controller2 = {validate: () => {}};
    volops.showUpdateEvent(thisEvent, 'update');
    expect(volops.newEvent).toBe(false);
    done();
  });

  it('displays the new event form', (done) => {
      //volops.activate();
    volops.user = {
      'name': 'me',
      'email': 'me@me.org',
      'userPhone': '3333333333'
    };
    document.body.innerHTML = '<div id="topSection"></div><input id="s-time" type="text"><input id="e-time" type="text">';
    volops.setupValidation2 = function(){};
    volops.controller2 = {validate: () => {}};
    volops.showNewEvent();
    expect(document.getElementById('topSection').style.display).toBe('block');
    done();
  });

  it('displays the charity types including other types', (done) => {
    volops3.charityID = '123';
    volops3.voOpp = {
      'voWorkTypes': ['other'],
      'voWorkTypeOther': '',
      'voCharityName': '',
      'voStartDate': '2017-12-12',
      'voEndDate': '2017-12-12',
      'voTalentTypes': ['shoveling', 'sweeping', 'other'],
      'voTalentTypeOther': 'scrubbing',
      'voCharityTypes': ['Christian', 'other']
    };
    volops3.findCharity();
    done();
  });

  it('updates an event', (done) => {
      //volops.activate();
    volops.voOpp = {
      'voWorkTypes': ['other'],
      'voCharityName': '',
      'voStartDate': '2017-12-12',
      'voEndDate': '2017-12-12',
      'voTalentTypes': ['shoveling', 'sweeping', 'other'],
      'voTalentTypeOther': 'scrubbing',
      '_id': '2222'
    };
    volops.updateEvent();
    done();
  });

  it('deletes an event', (done) => {
      //volops.activate();
    volops.deleteEvent('333');
    done();
  });

  it('displays the submit button if the form is valid', (done) => {
      //volops.activate();
    document.body.innerHTML = '<button class="updateButton"></button>';
    volops.charityName = 'OHAF';
    volops.voOpp = {
      'voWorkTypes': ['other'],
      'voCharityName': '',
      'voStartDate': '2017-12-12',
      'voEndDate': '2017-12-12',
      'voTalentTypes': ['shoveling', 'sweeping', 'other'],
      'voTalentTypeOther': 'scrubbing',
      '_id': '2222'
    };
    volops.validType2 = true;
    let validationResults = [{result: {valid: true}}];
    volops.updateCanSubmit2(validationResults);
    done();
  });

  it('displays the submit button if the update form is valid after two validate calls', (done) => {
      //volops.activate();
    document.body.innerHTML = '<button class="updateButton"></button>';
    volops.charityName = 'OHAF';
    volops.voOpp = {
      'voWorkTypes': ['other'],
      'voCharityName': '',
      'voStartDate': '2017-12-12',
      'voEndDate': '2017-12-12',
      'voTalentTypes': ['shoveling', 'sweeping', 'other'],
      'voTalentTypeOther': 'scrubbing',
      '_id': '2222'
    };
    volops.validType2 = true;
    volops.updateEvent = true;
    volops.counter = 2;
    let validationResults = [{result: {valid: true}}];
    volops.updateCanSubmit2(validationResults);
    expect(document.getElementsByClassName('updateButton')[0].style.display).toBe('block');
    done();
  });

  it('the submit button is not displayed when the form is not valid', (done) => {
      //volops2.activate();
    document.body.innerHTML = '<button class="updateButton"></button>';
    volops2.charityName = 'OHAF';
    volops2.voOpp = {
      'voWorkTypes': ['other'],
      'voCharityName': '',
      'voStartDate': '2017-12-12',
      'voEndDate': '2017-12-12',
      'voTalentTypes': ['shoveling', 'sweeping', 'other'],
      'voTalentTypeOther': 'scrubbing',
      '_id': '2222'
    };
    volops2.validate2();
    done();
  });

  it('events must have at least one volunteer', (done) => {
      //volops2.activate();
    document.body.innerHTML = '<button class="updateButton"></button>';
    volops2.charityName = 'OHAF';
    volops2.voOpp = {
      'voWorkTypes': ['other'],
      'voCharityName': '',
      'voStartDate': '2017-12-12',
      'voEndDate': '2017-12-12',
      'voTalentTypes': ['shoveling', 'sweeping', 'other'],
      'voTalentTypeOther': 'scrubbing',
      '_id': '2222',
      'voNumPeopleNeeded': 0
    };
    volops2.onlyPositive();
    volops2.voOpp.voNumPeopleNeeded = 45;
    volops2.onlyPositive();
    done();
  });
});
