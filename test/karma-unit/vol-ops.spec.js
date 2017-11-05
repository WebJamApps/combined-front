import {VolunteerOpps} from '../../src/dashboard-child-routes/vol-ops';
import {App} from '../../src/app';
import {AuthStub, HttpMock, AppStateStub} from './commons';
import {Validator} from 'aurelia-validation';

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
      json: () => Promise.resolve([{'voName': '',
        'voCharityId': this.charityID,
        'voCharityName': this.charityName,
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
        'voContactName': this.user.name,
        'voContactEmail': this.user.email,
        'voContactPhone': this.user.userPhone}])});
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
  //
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

  it('reformats the date to be yyyy-mm-dd', (done) => {
    let sampleDate = new Date();
    let sd = sampleDate.toString();
    //volops.activate();
    volops.events = [{
      'voStartDate': sd,
      'voEndDate': sd
    }];
    volops.fixDates();
    done();
  });

  it('does not reformat the dates', (done) => {
    //volops.activate();
    volops.events = [{
      'voStartDate': '2017-12-12',
      'voEndDate': '2017-12-12'
    }];
    volops.fixDates();
    done();
  });

  it('displays the chosen work preferences', (done) => {
    //volops.activate();
    volops.events = [{
      'voStartDate': '2017-12-12',
      'voEndDate': '2017-12-12',
      'voWorkTypes': ['shoveling', 'sweeping', 'other'],
      'voWorkTypeOther': 'scrubbing'
    }, {
      'voStartDate': '2017-12-12',
      'voEndDate': '2017-12-12',
      'voWorkTypes': [''],
      'voWorkTypeOther': ''
    }];
    volops.buildWorkPrefs();
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
    volops.buildTalents();
    done();
  });

  it('opens and closes the drop-down checkboxes', (done) => {
    //volops.activate();
    document.body.innerHTML = '<div id="talents" horizontal-align="right" vertical-align="top" style="margin-top:25px;"></div>';
    volops.app.showCheckboxes('talents');
    volops.app.expanded = true;
    volops.app.showCheckboxes('talents');
    done();
  });

  it('it display the talent other form field', (done) => {
    //volops.activate();
    volops.voOpp = {
      'voTalentTypes': ['other']
    };
    volops.talentPicked();
    volops.voOpp = {
      'voTalentTypes': ['swimming']
    };
    volops.talentPicked();
    done();
  });

  it('it display the work other form field', (done) => {
    //volops.activate();
    volops.voOpp = {
      'voWorkTypes': ['other']
    };
    volops.workPicked();
    volops.voOpp = {
      'voWorkTypes': ['swimming']
    };
    volops.workPicked();
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
      'voTalentTypeOther': 'scrubbing'
    };
    volops.cancelEvent(signupevent);
    done();
  });

  it('should display the users who signed up for the event', (done) => {
    let signupevent = {
      '_id': '123',
      'voWorkTypes': ['other'],
      'voWorkTypeOther': '',
      'voCharityName': '',
      'voStartDate': '2017-12-12',
      'voEndDate': '2017-12-12',
      'voTalentTypes': ['shoveling', 'sweeping', 'other'],
      'voTalentTypeOther': 'scrubbing',
      'voSignupUserIds': ['1', '2', '3']
    };
    document.body.innerHTML = '<div id="showvolunteers"></div>';
    volops.viewPeople(signupevent);
    done();
  });

  it('should display the users who signed up for the event', (done) => {
    let signupevent = {
      '_id': '123',
      'voWorkTypes': ['other'],
      'voWorkTypeOther': '',
      'voCharityName': '',
      'voStartDate': '2017-12-12',
      'voEndDate': '2017-12-12',
      'voTalentTypes': ['shoveling', 'sweeping', 'other'],
      'voTalentTypeOther': 'scrubbing',
      'voSignupUserIds': ['1', '2', '3']
    };
    //TODO this same httpmock needs to have a /user/uid that responds with a 404 error (user not found)
    volops.viewPeople(signupevent);
    done();
  });

  it('remove any signups where the user no longer exists', (done) => {
    volops4.fixUserSignups();
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
    document.body.innerHTML = '<div id="topSection"></div>';
    let thisEvent = {
      'voWorkTypes': ['other'],
      'voCharityName': '',
      'voStartDate': '2017-12-12',
      'voEndDate': '2017-12-12',
      'voTalentTypes': ['shoveling', 'sweeping', 'other'],
      'voTalentTypeOther': 'scrubbing'
    };
    volops.setupValidation2 = function(){};
    volops.showUpdateEvent(thisEvent, 'update');
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
    volops.showNewEvent();
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

  it('should not remove user signups if the user does exist', (done) => {
    //volops.activate();
    volops.fixUserSignups();
    done();
  });

  it('should detect if a user does not exist that is set as a signup', (done) => {
    //TODO /signup/getall needs to be configured in the httpmock to return an array of signup objects
    //TODO this same httpmock needs to have a /user/uid that responds with a 404 error (user not found)
    volops.fixUserSignups();
    done();
  });

  it('should delete any signups where the user does not exist', (done) => {
    volops.removeSignup('badid');
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

  it('run attached', (done) => {
    //volops2.activate();
    volops2.user = {
      'name': 'me',
      'email': 'me@me.org',
      'userPhone': '3333333333'
    };
    document.body.innerHTML = '<div id="topSection"></div><input id="s-time" type="text"><input id="e-time" type="text"><button class="updateButton"></button>';
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
    volops2.setupValidation2 = function(){};
    volops2.attached();
    done();
  });
});
