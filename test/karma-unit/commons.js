class RouterStub {

  currentInstruction = { config: { title: 'Howdy is cool' } }

  configure(handler) {
    if (handler) {
      handler(this);
    }
  }

  getRoute() {
    return this.router.currentInstruction.config.title; //name of the route
  }

  addPipelineStep(param1, AuthorizeStep) {
    //do nothing
  }

  options() {
    //do nothing
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
    const response = 'user logged out';
    return new Promise((resolve)=>{
      resolve({json: ()=>response});
    });
  }
  getMe() {
    const response = 'This is user data';
    return new Promise((resolve)=>{
      resolve({json: ()=>response});
    });
  }
  getTokenPayload() {
    const response = this.token;
    return new Promise((resolve)=>{
      resolve({json: ()=>response});
    });
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

  getUser() {
    // this.user = {name: 'Iddris Elba', userType: 'Volunteer'};
    return this.user;
  }
  setUser(input) {
    this.user = input;
  }

  getAuth() {
    return (this.is_auth);
  }

  setAuth(input) {
    this.is_auth = input;
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
    this.user = data || {name: 'John Fitzgerald', userType: 'Charity'};
  }
  status = 500;
  headers = {accept: 'application/json', method: '', url: ''}
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
    return Promise.resolve({
      Headers: this.headers,
      json: () => Promise.resolve(this.user)
    });
  }
}

export {RouterStub, ConfigStub, AuthStub, AppStateStub, HttpMock};
