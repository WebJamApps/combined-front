class RouterStub {
  currentInstruction = {
    config: { title: 'Howdy is cool', name: 'yoyo' },
    fragment: {}
  }
  configure(handler) {
    if (handler) {
      handler(this);
    }
  }
  getRoute() {
    return this.router.currentInstruction.config.title; // name of the route
  }
  addPipelineStep(param1, AuthorizeStep) {
    console.log(AuthorizeStep);
    // do nothing
  }
  addPostRenderStep(param1, next) {
    console.log(next);
    // do nothing
  }
  options() {
    // do nothing
  }
  map(routes) {
    this.routes = routes;
    return this.routes instanceof Array ? this.routes : [this.routes];
  }
  navigate(route) {
    return route;
  }
  fallbackRoute(opt) {
    this.opt = opt;
  }
}
class ConfigStub {
  map(array1) {
    return array1;
  }
  fallbackRoute(route) {
    this.route = route;
  }
}
class AuthStub {
  setToken(token) {
    this.token = token;
  }
  logout(data) {
    console.log(data);
    const response = 'user logged out';
    return new Promise((resolve) => {
      resolve({ json: () => response });
    });
  }
  getMe() {
    const response = 'This is user data';
    return new Promise((resolve) => {
      resolve({ json: () => response });
    });
  }
  getTokenPayload() {
    const response = this.token;
    return response;
  }
  isAuthenticated() {
    this.authenticated = true;
    return this.authenticated;
  }
}
class AppStateStub {
  constructor() {
    this.user = {};
    this.is_auth = false;
    this.roles = [];
  }
  getUser(uid) {
    if (uid === '1') {
      this.user = {
        name: 'Iddris Elba',
        email: 'yo@yo.com',
        userType: 'Charity',
        _id: '1',
        volTalents: ['childcare', 'other'],
        volCauses: ['Environmental', 'other'],
        volWorkPrefs: ['counseling', 'other'],
        volCauseOther: '',
        volTalentOther: '',
        volWorkOther: '',
        userDetails: 'newUser',
        isOhafUser: true
      };
    } else if (uid === '2') {
      this.user = {
        name: 'Iddris Elba',
        email: 'yo@yo.com',
        userType: 'Volunteer',
        _id: '2',
        volTalents: ['childcare', 'other'],
        volCauses: ['Environmental', 'other'],
        volWorkPrefs: ['counseling', 'other'],
        volCauseOther: '',
        volTalentOther: '',
        volWorkOther: '',
        userDetails: 'newUser',
        isOhafUser: true
      };
    } else if (uid === '3') {
      this.user = {
        userStatus: 'enabled',
        name: 'Iddris Elba',
        email: 'yo@yo.com',
        userType: 'Volunteer',
        _id: '3',
        volTalents:
        ['childcare', 'other'],
        volCauses: ['Environmental', 'other'],
        volWorkPrefs: ['counseling', 'other'],
        volCauseOther: '',
        volTalentOther: '',
        volWorkOther: '',
        userDetails: 'newUser',
        isOhafUser: true
      };
    } else {
      this.user = {
        name: 'Iddris Elba',
        email: 'yo@yo.com',
        userType: 'Developer',
        _id: '3333333',
        volTalents: ['childcare', 'other'],
        volCauses: ['Environmental', 'other'],
        volWorkPrefs: ['counseling', 'other'],
        volCauseOther: '',
        volTalentOther:
        '',
        volWorkOther: '',
        userDetails: 'newUser',
        isOhafUser: true
      };
    }
    return new Promise((resolve) => {
      resolve(this.user);
    });
  }
  setUser(input) {
    this.user = input;
  }
  checkUserRole() {
    return this.roles;
  }
  getRoles() {
    return (this.roles);
  }
  setRoles(input) {
    this.roles = input;
  }
}

class HttpMock {
  // this one catches the ajax and then resolves a custom json data.
  // real api calls will have more methods.
  constructor(data) {
    this.user = data || {
      name: 'Iddris Elba',
      userType: 'Volunteer',
      _id: '3333333',
      volTalents: [],
      volCauses: [],
      volWorkPrefs: [],
      volCauseOther: '',
      volTalentOther: '',
      volWorkOther: ''
    };
  }
  status = 500;
  headers = { accept: 'application/json', method: '', url: '' }
  configure(fn) {
    this.__configureCallback = fn;
    return this.__configureReturns;
  }
  fetch(url, obj) {
    this.headers.url = url;
    this.headers.method = obj ? obj.method : 'GET';
    if (obj && obj.method === 'put') {
      this.user = obj.body;
    }
    this.status = 200;
    let returnValue = this.user;
    if (url === '/user/1' || url === '/user/2' || url === '/user/3') {
      returnValue = this.getSpecificUser(url.substring(-1));
    } else if (url === '/volopp/') {
      returnValue = { message: 'success' };
    } else if (url === '/volopp/get/234') {
      returnValue = {
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
        voStartDate: '2017-01-01',
        voStartTime: null,
        voEndDate: null,
        voEndTime: '',
        voContactName: '',
        voContactEmail: '',
        voContactPhone: ''
      };
    } else if (url === '/volopp/get/2345') {
      returnValue = {
        _id: '2345',
        voName: 'run the swamp',
        voCharityId: '123',
        voCharityName: 'howdy',
        voloppId: 1,
        voNumPeopleNeeded: 1,
        voPeopleScheduled: ['123'],
        voDescription: '',
        voWorkTypes: [],
        voTalentTypes: [],
        voWorkTypeOther: '',
        voTalentTypeOther: '',
        voStartDate: null,
        voStartTime: null,
        voEndDate: null,
        voEndTime: '',
        voContactName: '',
        voContactEmail: '',
        voContactPhone: ''
      };
    } else if (url === '/volopp/get/23456') {
      console.log('i am in the correct route!');
      returnValue = {
        _id: '23456',
        voName: 'run the swamp',
        voCharityId: '123',
        voCharityName: 'howdy',
        voloppId: 1,
        voNumPeopleNeeded: 3,
        voPeopleScheduled: ['1234'],
        voDescription: '',
        voWorkTypes: [],
        voTalentTypes: [],
        voWorkTypeOther: '',
        voTalentTypeOther: '',
        voStartDate: '2055-12-12',
        voStartTime: null,
        voEndDate: null,
        voEndTime: '',
        voContactName: '',
        voContactEmail: '',
        voContactPhone: ''
      };
    } else if (url === '/volopp/get/234567') {
      returnValue = null;
    }
    if (returnValue !== null) {
      return Promise.resolve({
        Headers: this.headers,
        json: () => Promise.resolve(returnValue)
      });
    }
    return Promise.resolve({
      Headers: this.headers,
      json: () => Promise.reject(new Error('fail'))
    });
  }

  getSpecificUser(id) {
    if (id === '1') {
      return [
        {
          name: 'Iddris Elba',
          userType: 'Volunteer',
          _id: '1',
          volTalents: [],
          volCauses: [],
          volWorkPrefs:
          [],
          volCauseOther: '',
          volTalentOther: '',
          volWorkOther: ''
        }
      ];
    } else if (id === '2') {
      return null;
    } else if (id === '3') {
      return [
        {
          name: 'Test Elba',
          userType: 'Volunteer',
          _id: '3',
          volTalents: [],
          volCauses: [],
          volWorkPrefs:
          [],
          volCauseOther: '',
          volTalentOther: '',
          volWorkOther: ''
        }
      ];
    }
    return null;
  }

  getSignUpAll() {
    return [
      {
        _id: '2124', voloppId: '123', userId: '1', numPeople: 1
      },
      {
        _id: '2124', voloppId: '123', userId: '2', numPeople: 1
      },
      {
        _id: '2124', voloppId: '123', userId: '3', numPeople: 1
      }
    ];
  }

  getMockCharity() {
    return Promise.resolve({
      Headers: this.headers,
      json: () => Promise.resolve({
        _id: '123', charityTypeOther: 'tree huggers', charityTypes: ['Home', 'Elderly', 'other'], charityManagers: ['Josh', 'Maria', 'Bob']
      })
    });
  }
}

export { RouterStub, ConfigStub, AuthStub, AppStateStub, HttpMock };
