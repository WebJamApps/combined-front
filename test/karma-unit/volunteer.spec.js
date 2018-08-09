import { Volunteer } from '../../src/dashboard-child-routes/volunteer';
import { App } from '../../src/app';
import {
  AuthStub, HttpMock, AppStateStub, RouterStub
} from './commons';
import { formatDate, markPast } from '../../src/commons/utils';

function testAsync(runAsync) {
  return (done) => {
    runAsync().then(done, (e) => { fail(e); done(); });
  };
}

class HttpMockEvent extends HttpMock {
  fetch(url, obj) {
    this.headers.url = url;
    this.headers.method = obj ? obj.method : 'GET';
    if (obj && obj.method === 'put') {
      this.voOpp = obj.body;
    }
    this.status = 200;
    return Promise.resolve({
      Headers: this.headers,
      json: () => Promise.resolve([{
        _id: '234',
        voName: 'run the swamp',
        voCharityId: '123',
        voCharityName: 'howdy',
        voloppId: 1,
        voNumPeopleNeeded: 1,
        voDescription: '',
        voWorkTypes: [],
        voTalentTypes: [],
        voWorkTypeOther: '',
        voTalentTypeOther: '',
        voStartDate: null,
        voStartTime: '2017-01-01',
        voEndDate: null,
        voEndTime: '',
        voContactName: '',
        voContactEmail: '',
        voContactPhone: ''
      }])
    });
  }
}
describe('the Volunteer Module', () => {
  let volunteer, volunteer2, app, app2, auth;
  beforeEach(() => {
    auth = new AuthStub();
    auth.setToken({ sub: '1' });
    app = new App(auth, new HttpMock());
    app.appState = new AppStateStub();
    app.router = new RouterStub();
    app.activate();
    app.appState.user = {
      _id: '1', name: 'billy', email: 'billy@billy.com', volCauses: ['', '']
    };
    volunteer = new Volunteer(app);
    app2 = new App(auth, new HttpMockEvent());
    app2.appState = new AppStateStub();
    app2.router = new RouterStub();
    app2.appState.user = {
      name: 'Iddris Elba',
      userType: 'Volunteer',
      _id: '3333333',
      volTalents: ['childcare'],
      volCauses: ['Environmental'],
      volWorkPrefs: ['counseling'],
      volCauseOther: '',
      volTalentOther: '',
      volWorkOther: '',
      userDetails: 'newUser',
      isOhafUser: true
    };
    app2.activate();
    volunteer2 = new Volunteer(app2);
    spyOn(volunteer, 'reload').and.callFake(() => 'nope is nothn');
  });

  afterEach(() => {
    // viewport.reset();
  });

  it('should active so it can display the volunteer settings', (done) => {
    volunteer.activate();
    volunteer.app.appState.user = {
      name: 'Iddris Elba',
      userType: 'Volunteer',
      _id: '3333333',
      volTalents: ['childcare'],
      volCauses: ['Environmental'],
      volWorkPrefs: ['counseling'],
      volCauseOther: '',
      volTalentOther: '',
      volWorkOther: '',
      userDetails: 'newUser',
      isOhafUser: true
    };
    volunteer.activate();
    // console.log(volunteer.user);
    done();
  });

  it('sets the filter dropdown position for cell phone display', (done) => {
    // viewport.set(800);
    // document.body.innerHTML = '<div class="checkboxes-div" style="top:33px"></div><div id="distanceInput"><div>';
    // volunteer.setupVolunteerUser = function () {};
    // volunteer.attached();
    // expect(document.getElementsByClassName('checkboxes-div')[0].style.top).toBe('124px');
    // viewport.set(500);
    // volunteer.attached();
    // expect(document.getElementsByClassName('checkboxes-div')[0].style.top).toBe('124px');
    done();
  });

  it('setup volunteer with other not selected', (done) => {
    volunteer.user = {
      name: 'Iddris Elba',
      userType: 'Volunteer',
      _id: '3333333',
      volTalents: ['childcare'],
      volCauses: ['Environmental'],
      volWorkPrefs: ['counseling'],
      volCauseOther: '',
      volTalentOther: '',
      volWorkOther: ''
    };
    document.body.innerHTML = '<div id="causesSelector"></div><div id="talentsSelector"></div><div id="worksSelector"></div>';
    volunteer.setupVolunteerUser();
    expect(volunteer.talentOther).toBe(false);
    expect(volunteer.workOther).toBe(false);
    expect(volunteer.causeOther).toBe(false);
    done();
  });

  it('should select picked type', (done) => {
    volunteer.user = {
      name: 'Iddris Elba',
      userType: 'Volunteer',
      _id: '3333333',
      volTalents: ['childcare'],
      volCauses: ['Environmental'],
      volWorkPrefs: ['counseling'],
      volCauseOther: '',
      volTalentOther: '',
      volWorkOther: ''
    };
    document.body.innerHTML = '<div id="selectTalents"></div><div id="selectCauses"></div><div id="selectWork"></div>'
    + '<button id="updateUserButton"></button>';
    volunteer.selectPickChange('causes');
    volunteer.selectPickChange('work');
    volunteer.selectPickChange('talents');
    done();
  });

  it('should update user', (done) => {
    volunteer.updateUser();
    done();
  });
  it('should active and get all events', (done) => {
    volunteer2.activate();
    done();
  });
  it('displays the events', (done) => {
    volunteer2.events = [{
      voStartDate: '2017-12-12T',
      voEndDate: '2017-12-12',
      voWorkTypes: ['shoveling', 'sweeping', 'other'],
      voWorkTypeOther: 'scrubbing',
      _id: 1,
      scheduled: false,
      voNumPeopleScheduled: 10,
      voNumPeopleNeeded: 5,
      voStatus: 'cancel',
      voCharityTypes: ['ages', 'in', 'the', 'wake']
    }, {
      voStartDate: '2017-12-12',
      voEndDate: '2017-12-12T',
      voWorkTypes: [''],
      voWorkTypeOther: '',
      _id: 2,
      scheduled: false,
      voNumPeopleScheduled: 10,
      voNumPeopleNeeded: 5,
      voStatus: 'cancel',
      voCharityTypes: ['ages', 'in', 'the', 'wake']
    }];
    volunteer2.selectedFilter = ['future only', 'hello'];
    volunteer2.app.buildPTag = function () {};
    volunteer2.displayEvents();
    done();
  });

  it('displays the events including past events', (done) => {
    // volunteer2.activate();
    volunteer2.events = [{
      voStartDate: '2017-12-12T',
      voEndDate: '2017-12-12',
      voWorkTypes: ['shoveling', 'sweeping', 'other'],
      voWorkTypeOther: 'scrubbing',
      _id: 1,
      scheduled: false,
      voNumPeopleScheduled: 10,
      voNumPeopleNeeded: 5,
      voStatus: 'cancel',
      voCharityTypes: ['ages', 'in', 'the', 'wake']
    }, {
      voStartDate: '2017-12-12',
      voEndDate: '2017-12-12T',
      voWorkTypes: [''],
      voWorkTypeOther: '',
      _id: 2,
      scheduled: false,
      voNumPeopleScheduled: 10,
      voNumPeopleNeeded: 5,
      voStatus: 'cancel',
      voCharityTypes: ['ages', 'in', 'the', 'wake']
    }];
    volunteer2.selectedFilter = [];
    volunteer2.displayEvents();
    // console.log(volunteer2.events);
    // expect(volunteer2.events[1].workHtml).toBe('<p style="font-size:10pt">not specified</p>');
    done();
  });

  it('should run attached to setup the volunteer user', (done) => {
    volunteer.activate();
    document.body.innerHTML = '<div id="causesSelector"></div><div id="talentsSelector"></div><div id="worksSelector">'
    + '</div><input id="distanceInput"><button id="updateUserButton"></button>';
    volunteer.user = {
      volCauses: ['Hunger', 'other'],
      volTalents: ['Cooking', 'other'],
      volWorkPrefs: ['Chopping', 'other'],
      volCauseOther:
      'Thirst',
      volTalentOther: 'Singing',
      volWorkOther: 'Cleaning'
    };
    volunteer.attached();
    done();
  });

  it('should not display the checkboxes', (done) => {
    volunteer.activate();
    document.body.innerHTML = '<div id="causesSelector"></div><div id="talentsSelector"></div><div id="worksSelector"></div>'
    + '<div id="selectTalents"></div><div id="selectCauses"></div><div id="selectWork"></div>';
    volunteer.user = {
      volCauses: [], volTalents: [], volWorkPrefs: [], volCauseOther: '', volTalentOther: '', volWorkOther: ''
    };
    volunteer.setupVolunteerUser();
    expect(document.getElementById('selectWork').style.display).not.toBe('block');
    expect(document.getElementById('selectTalents').style.display).not.toBe('block');
    expect(document.getElementById('selectCauses').style.display).not.toBe('block');
    done();
  });

  it('removes double quote empty string array elements', (done) => {
    volunteer.activate();
    document.body.innerHTML = '<div id="causesSelector"></div><div id="talentsSelector"></div><div id="worksSelector"></div>'
    + '<div id="selectTalents"></div><div id="selectCauses"></div><div id="selectWork"></div><button id="updateUserButton"></button>';
    volunteer.user = {
      volCauses: [], volTalents: [], volWorkPrefs: [], volCauseOther: '', volTalentOther: '', volWorkOther: ''
    };
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
    document.body.innerHTML = '<div id="causesSelector"></div><div id="talentsSelector"></div><div id="worksSelector">'
    + '</div><div id="selectTalents" style="display:block"></div><div id="selectCauses" style="display:block"></div>'
    + '<div id="selectWork" style="display:block"></div><button id="updateUserButton"></button>';
    volunteer.user = {
      volCauses: [], volTalents: [], volWorkPrefs: [], volCauseOther: '', volTalentOther: '', volWorkOther: ''
    };
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

  it('should check scheduled and set to zero', (done) => {
    volunteer.events = [{
      voStartDate: '2017-12-12',
      voEndDate: '2017-12-12',
      voWorkTypes: ['shoveling', 'sweeping', 'other'],
      voWorkTypeOther: 'scrubbing',
      _id: 1,
      scheduled: false,
      voNumPeopleScheduled: 10,
      voNumPeopleNeeded: 5,
      voStatus: 'cancel'
    }, {
      voStartDate: '2017-12-12',
      voEndDate: '2017-12-12',
      voWorkTypes: [''],
      voWorkTypeOther: '',
      _id: 2,
      scheduled: false,
      voNumPeopleScheduled: 10,
      voNumPeopleNeeded: 5,
      voStatus: 'cancel'
    }];
    volunteer.checkScheduled();
    // volunteer.doubleCheckSignups = false;
    // volunteer.checkScheduled();
    expect(volunteer.events[0].voNumPeopleScheduled).toBe(0);
    done();
  });

  it('should check scheduled and set to correct number, full, and scheduled', (done) => {
    volunteer.events = [{
      voStartDate: '2017-12-12',
      voEndDate: '2017-12-12',
      voWorkTypes: ['shoveling', 'sweeping', 'other'],
      voWorkTypeOther: 'scrubbing',
      _id: 1,
      scheduled: false,
      voNumPeopleScheduled: 10,
      voNumPeopleNeeded: 5,
      voStatus: 'cancel',
      voPeopleScheduled: ['12', '13', '14', '15', '16']
    }, {
      voStartDate: '2017-12-12',
      voEndDate: '2017-12-12',
      voWorkTypes: [''],
      voWorkTypeOther: '',
      _id: 2,
      scheduled: false,
      voNumPeopleScheduled: 10,
      voNumPeopleNeeded: 5,
      voStatus: 'cancel'
    }];
    volunteer.uid = '15';
    volunteer.checkScheduled();
    // volunteer.doubleCheckSignups = false;
    // volunteer.checkScheduled();
    expect(volunteer.events[0].voNumPeopleScheduled).toBe(5);
    expect(volunteer.events[0].full).toBe(true);
    expect(volunteer.events[0].scheduled).toBe(true);
    volunteer.uid = '155';
    volunteer.checkScheduled(() => {
      expect(volunteer.events[0].scheduled).toBe(false);
    });
    done();
  });

  it('should filter picks', (done) => {
    volunteer.events = [{
      voStartDate: '',
      voEndDate: '2017-12-12',
      voWorkTypes: ['shoveling', 'sweeping', 'other'],
      voWorkTypeOther: 'scrubbing'
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
    volunteer.uid = '15';
    const myEvent = {
      voStartDate: '2017-12-12',
      voEndDate: '2017-12-12',
      voWorkTypes: ['shoveling', 'sweeping', 'other'],
      voWorkTypeOther: 'scrubbing',
      _id: 1,
      scheduled: false,
      voNumPeopleScheduled: 10,
      voNumPeopleNeeded: 5,
      voStatus: 'cancel',
      voPeopleScheduled: ['12', '13', '14', '15', '16']
    };
    volunteer.cancelSignup(myEvent);
    expect(myEvent.voPeopleScheduled.indexOf('15')).toBe(-1);
    done();
    // console.log(myEvent);
  });

  // it('allows a volunteer to signup for an event', testAsync(async () => {
  //   volunteer.uid = '155';
  //   const myEvent = {
  //     voStartDate: '2017-12-12',
  //     voEndDate: '2017-12-12',
  //     voWorkTypes: ['shoveling', 'sweeping', 'other'],
  //     voWorkTypeOther: 'scrubbing',
  //     _id: 1,
  //     scheduled: false,
  //     voNumPeopleScheduled: 10,
  //     voNumPeopleNeeded: 5,
  //     voStatus: 'cancel',
  //     voPeopleScheduled: ['12', '13', '14', '15']
  //   };
  //   await volunteer.signupEvent(myEvent);
  //   expect(myEvent.voPeopleScheduled.indexOf('155')).not.toBe(-1);
  // }));

  it('should not signup if date has past', testAsync(async () => {
    volunteer.activate();
    volunteer.uid = '155';
    const myEvent = {
      voStartDate: '2017-12-12',
      voEndDate: '2017-12-12',
      voWorkTypes: ['shoveling', 'sweeping', 'other'],
      voWorkTypeOther: 'scrubbing',
      _id: '234',
      scheduled: false,
      voNumPeopleScheduled: 10,
      voNumPeopleNeeded: 5,
      voStatus: 'cancel',
      voPeopleScheduled: ['12', '13', '14', '15']
    };
    await volunteer.signupEvent(myEvent);
    expect(myEvent.voPeopleScheduled.indexOf('155')).toBe(-1);
  }));

  it('should not signup if already at max volunteers needed', testAsync(async () => {
    volunteer.activate();
    volunteer.uid = '155';
    const myEvent = {
      voStartDate: '2017-12-12',
      voEndDate: '2017-12-12',
      voWorkTypes: ['shoveling', 'sweeping', 'other'],
      voWorkTypeOther: 'scrubbing',
      _id: '2345',
      scheduled: false,
      voNumPeopleScheduled: 10,
      voNumPeopleNeeded: 5,
      voStatus: 'cancel',
      voPeopleScheduled: ['12', '13', '14', '15']
    };
    await volunteer.signupEvent(myEvent);
    expect(myEvent.voPeopleScheduled.indexOf('155')).toBe(-1);
  }));

  // it('should signup', testAsync(async () => {
  //   volunteer.activate();
  //   volunteer.uid = '155';
  //   const myEvent = {
  //     voStartDate: '2017-12-12',
  //     voEndDate: '2017-12-12',
  //     voWorkTypes: ['shoveling', 'sweeping', 'other'],
  //     voWorkTypeOther: 'scrubbing',
  //     _id: '23456',
  //     scheduled: false,
  //     voNumPeopleNeeded: 5,
  //     voStatus: 'cancel',
  //     voPeopleScheduled: ['12']
  //   };
  //   const thisevent = await volunteer.signupEvent(myEvent);
  //   expect(thisevent.voPeopleScheduled.indexOf('155')).not.toBe(-1);
  // }));

  it('should catch error on doubleCheckSignups', testAsync(async () => {
    volunteer.doubleCheckSignups({ _id: '234567' }).then(() => {
      // console.log('is this an error?');
      // console.log(isError);
      // expect(isError).toBe(Error{});
    });
  }));

  it('should mark past dates', testAsync(async () => {
    volunteer.activate();
    volunteer.uid = '155';
    volunteer.events = [{
      voStartDate: '2017-12-12',
      voEndDate: '2017-12-12',
      voWorkTypes: ['shoveling', 'sweeping', 'other'],
      voWorkTypeOther: 'scrubbing',
      _id: '23456',
      scheduled: false,
      voNumPeopleNeeded: 5,
      voStatus: 'cancel',
      voPeopleScheduled: ['12']
    }];
    markPast(volunteer.events, formatDate);
    expect(volunteer.events[0].past).toBe(true);
  }));

  it('should mark not past', testAsync(async () => {
    volunteer.activate();
    volunteer.uid = '155';
    volunteer.events = [{
      voStartDate: '2517-12-12',
      voEndDate: '2517-12-12',
      voWorkTypes: ['shoveling', 'sweeping', 'other'],
      voWorkTypeOther: 'scrubbing',
      _id: '23456',
      scheduled: false,
      voNumPeopleNeeded: 5,
      voStatus: 'cancel',
      voPeopleScheduled: ['12']
    }];
    markPast(volunteer.events, formatDate);
    expect(volunteer.events[0].past).toBe(false);
  }));

  it('should not change the zipcode if defined', (done) => {
    volunteer.events = [{ voZipCode: '24153' }];
    volunteer.fixZipcodesAndTypes();
    expect(volunteer.events[0].voZipCode).toBe('24153');
    done();
  });

  it('should format the date of January 1, 2017', (done) => {
    const date = new Date();
    date.setMonth(0);
    date.setDate(1);
    date.setFullYear(2017);
    const newDate = formatDate(date);
    expect(newDate).toBe('20170101');
    done();
  });
  //
  // it('should format the date of December 12, 2017', (done) => {
  //   let date = new Date();
  //   date.setMonth(11);
  //   date.setDate(12);
  //   date.setFullYear(2017);
  //   const newDate = volunteer.formatDate(date);
  //   expect(newDate).toBe('20171212');
  //   done();
  // });

  it('should not signup when event is full', (done) => {
    // volunteer.canSignup = false;
    volunteer.uid = 1298471410910974;
    volunteer.signupEvent({ _id: 1298471058100, full: true });
    // expect signup user id array to be length of zero
    done();
  });

  it('should signup event', (done) => {
    // volunteer.canSignup = true;
    volunteer.uid = 1298471410910974;
    volunteer.signupEvent({ _id: 1298471058100 });
    // expect signup user id array to contain this user id
    done();
  });
});
