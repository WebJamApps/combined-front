const Login_ = require('../../src/classes/Login_.js');
// import 'isomorphic-fetch';

const reg = new Login_();

test('generates a login form', () => {
  document.body.innerHTML = '<div class="home"></div>';
  reg.startup('PATRIC');
  const regform = document.getElementsByClassName('LoginForm');
  expect(regform[0]).toBeDefined();
});

test('hides a login form with click Cancel button', () => {
  document.body.innerHTML = '<div class="home"></div>';
  reg.startup();
  document.getElementsByClassName('nevermind')[0].click();
  const regform = document.getElementsByClassName('LoginForm');
  expect(regform[0].style.display).toBe('none');
});

test('generates a login form without userid', () => {
  document.body.innerHTML = '<div class="home"></div>';
  reg.startup('AdifferentApp');
  const useridInput = document.getElementsByClassName('uidinput')[0];
  expect(useridInput.style.display).toBe('none');
});

test('initiates a reset password request', () => {
  document.body.innerHTML = '<div class="home"></div>';
  reg.startup('');
  document.getElementsByClassName('userid')[0].value = 'joe@smith.com';
  const mockfetch = function (url, data) {
    this.headers = {};
    this.headers.url = url;
    this.headers.method = data.method;
    return Promise.resolve({
      Headers: this.headers,
      json: () => Promise.resolve({ email: 'joe@smith.com' })
    });
  };
  const evt = { target: { fetchClient: mockfetch, appName: 'PATRIC', runFetch: reg.runFetch } };
  reg.resetpass(evt).then((data) => {
    expect(data.message).toBe(null);
  });
});

test('initiates a reset password request for other app', () => {
  document.body.innerHTML = '<div class="home"></div>';
  reg.startup('otherapp');
  document.getElementsByClassName('loginemail')[0].value = 'joe@smith.com';
  const mockfetch = function (url, data) {
    this.headers = {};
    this.headers.url = url;
    this.headers.method = data.method;
    return Promise.resolve({
      Headers: this.headers,
      json: () => Promise.resolve({})
    });
  };
  const evt = { target: { fetchClient: mockfetch, appName: 'otherapp', runFetch: reg.runFetch } };
  reg.resetpass(evt).then((data) => {
    expect(data.message).toBe(null);
  });
});

test('Does not initiates a reset password request with invalid email', () => {
  document.body.innerHTML = '<div class="home"></div>';
  reg.startup('PATRIC');
  document.getElementsByClassName('userid')[0].value = 'joe@smith.com';
  const mockfetch = function (url, data) {
    this.headers = {};
    this.headers.url = url;
    this.headers.method = data.method;
    return Promise.resolve({
      Headers: this.headers,
      json: () => Promise.resolve({ message: 'incorrect email address' })
    });
  };
  const evt = { target: { fetchClient: mockfetch, appName: 'PATRIC', runFetch: reg.runFetch } };
  reg.resetpass(evt).then((data) => {
    expect(data.message).toBe('incorrect email address');
  });
});

test('it catches error on reset password', () => {
  document.body.innerHTML = '<div class="home"></div>';
  reg.startup('PATRIC');
  document.getElementsByClassName('userid')[0].value = 'joe@smith.com';
  const mockfetch = function (url, data) {
    this.headers = {};
    this.headers.url = url;
    this.headers.method = data.method;
    return Promise.resolve({
      Headers: this.headers,
      json: () => Promise.reject({ error: 'rejected' })
    });
  };
  const evt = { target: { fetchClient: mockfetch, appName: 'PATRIC', runFetch: reg.runFetch } };
  return reg.resetpass(evt)
    .catch(e => expect(e).toBeTruthy());
});

test('validates a login form with userid and no email', () => {
  document.body.innerHTML = '<div class="home"></div>';
  reg.startup('PATRIC');
  document.getElementsByClassName('userid')[0].value = 'user123';
  document.getElementsByClassName('loginpass')[0].value = '123456789';
  document.getElementsByClassName('loginpass')[0].checkValidity = function () { return true; };
  document.getElementsByClassName('loginemail')[0].checkValidity = function () { return false; };
  const logbutton = document.getElementsByClassName('loginbutton')[0];
  const evt = { target: { appName: 'PATRIC', buttonsErrors: reg.buttonsErrors } };
  reg.validateLogin(evt);
  expect(logbutton.style.display).toBe('block');
});

test('validates a login form without userid', () => {
  document.body.innerHTML = '<div class="home"></div>';
  reg.startup('OtherApp');
  document.getElementsByClassName('loginemail')[0].value = 'joe@smith.com';
  document.getElementsByClassName('loginemail')[0].checkValidity = function () { return true; };
  document.getElementsByClassName('loginpass')[0].value = '123456789';
  document.getElementsByClassName('loginpass')[0].checkValidity = function () { return true; };
  const logbutton = document.getElementsByClassName('loginbutton')[0];
  const resetpassButton = document.getElementsByClassName('resetpass')[0];
  const evt = { target: { appName: 'OtherApp', buttonsErrors: reg.buttonsErrors } };
  reg.validateLogin(evt);
  expect(logbutton.style.display).toBe('block');
  expect(resetpassButton.style.display).toBe('block');
});

test('validates a login form without userid and invalid email (missing period)', () => {
  document.body.innerHTML = '<div class="home"></div>';
  reg.startup('OtherApp');
  document.getElementsByClassName('loginemail')[0].value = 'joe@smithcom';
  document.getElementsByClassName('loginemail')[0].checkValidity = function () { return true; };
  document.getElementsByClassName('loginpass')[0].value = '123456789';
  document.getElementsByClassName('loginpass')[0].checkValidity = function () { return true; };
  const logbutton = document.getElementsByClassName('loginbutton')[0];
  const resetpassButton = document.getElementsByClassName('resetpass')[0];
  const evt = { target: { appName: 'OtherApp', buttonsErrors: reg.buttonsErrors } };
  reg.validateLogin(evt);
  expect(logbutton.style.display).toBe('none');
  expect(resetpassButton.style.display).toBe('none');
});

test('validates a login form without userid and invalid email (Google)', () => {
  document.body.innerHTML = '<div class="home"></div>';
  reg.startup('OtherApp');
  document.getElementsByClassName('loginemail')[0].value = 'joe@gmail.com';
  document.getElementsByClassName('loginemail')[0].checkValidity = function () { return true; };
  document.getElementsByClassName('loginpass')[0].value = '123456789';
  document.getElementsByClassName('loginpass')[0].checkValidity = function () { return true; };
  const logbutton = document.getElementsByClassName('loginbutton')[0];
  const resetpassButton = document.getElementsByClassName('resetpass')[0];
  const evt = { target: { appName: 'OtherApp', buttonsErrors: reg.buttonsErrors } };
  reg.validateLogin(evt);
  expect(logbutton.style.display).toBe('none');
  expect(resetpassButton.style.display).toBe('none');
});

test('validates a login form without userid and invalid email (missing @)', () => {
  document.body.innerHTML = '<div class="home"></div>';
  reg.startup('OtherApp');
  document.getElementsByClassName('loginemail')[0].value = 'joegma.com';
  document.getElementsByClassName('loginemail')[0].checkValidity = function () { return false; };
  document.getElementsByClassName('loginpass')[0].value = '123456789';
  document.getElementsByClassName('loginpass')[0].checkValidity = function () { return true; };
  const logbutton = document.getElementsByClassName('loginbutton')[0];
  const resetpassButton = document.getElementsByClassName('resetpass')[0];
  const evt = { target: { appName: 'OtherApp', buttonsErrors: reg.buttonsErrors } };
  reg.validateLogin(evt);
  expect(logbutton.style.display).toBe('none');
  expect(resetpassButton.style.display).toBe('none');
});

test('validates a login form without useremail and invalid password', () => {
  document.body.innerHTML = '<div class="home"></div>';
  reg.startup('PATRIC');
  document.getElementsByClassName('userid')[0].value = 'joesmith';
  document.getElementsByClassName('loginpass')[0].value = '123456789';
  document.getElementsByClassName('loginpass')[0].checkValidity = function () { return false; };
  document.getElementsByClassName('loginemail')[0].checkValidity = function () { return false; };
  const logbutton = document.getElementsByClassName('loginbutton')[0];
  const resetpassButton = document.getElementsByClassName('resetpass')[0];
  const evt = { target: { appName: 'PATRIC', buttonsErrors: reg.buttonsErrors } };
  reg.validateLogin(evt);
  expect(logbutton.style.display).toBe('none');
  expect(resetpassButton.style.display).toBe('block');
});

test('does not display the login button with invalid password and valid email', () => {
  document.body.innerHTML = '<div class="home"></div>';
  reg.startup('OtherApp');
  document.getElementsByClassName('userid')[0].value = 'joesmith';
  document.getElementsByClassName('loginemail')[0].value = 'joe@smith.com';
  document.getElementsByClassName('loginpass')[0].value = '123456789';
  document.getElementsByClassName('loginpass')[0].checkValidity = function () { return false; };
  document.getElementsByClassName('loginemail')[0].checkValidity = function () { return true; };
  const logbutton = document.getElementsByClassName('loginbutton')[0];
  const resetpassButton = document.getElementsByClassName('resetpass')[0];
  const evt = { target: { appName: 'OtherApp', buttonsErrors: reg.buttonsErrors } };
  reg.validateLogin(evt);
  expect(logbutton.style.display).toBe('none');
  expect(resetpassButton.style.display).toBe('block');
});

test('It displays reset password button', () => {
  document.body.innerHTML = '<div class="home"></div>';
  reg.startup('PATRIC');
  document.getElementsByClassName('userid')[0].value = 'joe@smith.com';
  document.getElementsByClassName('loginpass')[0].value = '123456789';
  document.getElementsByClassName('loginpass')[0].checkValidity = function () { return true; };
  document.getElementsByClassName('loginemail')[0].checkValidity = function () { return false; };
  const logbutton = document.getElementsByClassName('loginbutton')[0];
  const resetpassButton = document.getElementsByClassName('resetpass')[0];
  const evt = { target: { appName: 'PATRIC', buttonsErrors: reg.buttonsErrors } };
  reg.validateLogin(evt);
  expect(logbutton.style.display).toBe('block');
  expect(resetpassButton.style.display).toBe('block');
});

test('It does not displays reset password button', () => {
  document.body.innerHTML = '<div class="home"></div>';
  reg.startup('PATRIC');
  document.getElementsByClassName('userid')[0].value = '';
  document.getElementsByClassName('loginpass')[0].value = '123456789';
  document.getElementsByClassName('loginpass')[0].checkValidity = function () { return true; };
  document.getElementsByClassName('loginemail')[0].checkValidity = function () { return false; };
  const logbutton = document.getElementsByClassName('loginbutton')[0];
  const resetpassButton = document.getElementsByClassName('resetpass')[0];
  const evt = { target: { appName: 'PATRIC', buttonsErrors: reg.buttonsErrors } };
  reg.validateLogin(evt);
  expect(logbutton.style.display).toBe('none');
  expect(resetpassButton.style.display).toBe('none');
});

test('login and reset buttons do not display when email is not valid format', () => {
  document.body.innerHTML = '<div class="home"></div>';
  reg.startup('OtherApp');
  document.getElementsByClassName('loginemail')[0].value = '33333';
  document.getElementsByClassName('loginemail')[0].checkValidity = function () { return false; };
  document.getElementsByClassName('loginpass')[0].value = '123456789';
  document.getElementsByClassName('loginpass')[0].checkValidity = function () { return true; };
  const logbutton = document.getElementsByClassName('loginbutton')[0];
  const resetpassButton = document.getElementsByClassName('resetpass')[0];
  const evt = { target: { appName: 'OtherApp', buttonsErrors: reg.buttonsErrors } };
  reg.validateLogin(evt);
  expect(logbutton.style.display).toBe('none');
  expect(resetpassButton.style.display).toBe('none');
  document.body.innerHTML = '';
});

test('login the PATRIC user', () => {
  document.body.innerHTML = '<div class="home"></div>';
  reg.startup('PATRIC');
  document.getElementsByClassName('userid')[0].value = 'joe@smith';
  document.getElementsByClassName('loginpass')[0].value = '123456789';
  const mockfetch = function (url, data) {
    this.headers = {};
    this.headers.url = url;
    this.headers.method = data.method;
    return Promise.resolve({
      Headers: this.headers,
      json: () => Promise.resolve({ token: 'lsdfldjflsdjlfdjfsjdlf', email: 'joe@smith.com' })
    });
  };
  const evt = {
    target: {
      fetchClient: mockfetch, appName: 'PATRIC', runFetch: reg.runFetch, checkIfLoggedIn() {}, generateSession(email) {}
    }
  };
  const mockStorage = {
    setItem(item, value) {
    // do nothing
    },
    getItem(item, value) {
    // do nothing
    }
  };
  window.localStorage = mockStorage;
  document.body.innerHTML += '<div class="ShowWAuth"></div><div class="HideWAuth"></div>';
  reg.logMeIn(evt).then((data) => {
    expect(data.token).toBe('lsdfldjflsdjlfdjfsjdlf');
    const showA = document.getElementsByClassName('ShowWAuth')[0];
    expect(showA.style.display).toBe('block');
  });
});

test('login the other app user', () => {
  document.body.innerHTML = '<div class="home"></div>';
  reg.startup('OtherApp');
  document.getElementsByClassName('loginemail')[0].value = 'joe@smith';
  document.getElementsByClassName('loginpass')[0].value = '123456789';
  const mockfetch = function (url, data) {
    this.headers = {};
    this.headers.url = url;
    this.headers.method = data.method;
    return Promise.resolve({
      Headers: this.headers,
      json: () => Promise.resolve({ token: 'lsdfldjflsdjlfdjfsjdlf' })
    });
  };
  const evt = { target: { fetchClient: mockfetch, appName: 'CoolApp', runFetch: reg.runFetch } };
  const mockStorage = {
    setItem(item, value) {
    // do nothing
    },
    getItem(item, value) {
    // do nothing
    }
  };
  window.localStorage = mockStorage;
  document.body.innerHTML += '<div class="ShowWAuth"></div><div class="HideWAuth"></div>';
  reg.logMeIn(evt).then((data) => {
    expect(data.token).toBe('lsdfldjflsdjlfdjfsjdlf');
    const showA = document.getElementsByClassName('ShowWAuth')[0];
    expect(showA.style.display).toBe('block');
  });
});

test('displays error message if login fails', () => {
  document.body.innerHTML = '<div class="home"></div>';
  reg.startup('PATRIC');
  document.getElementsByClassName('userid')[0].value = 'joe@smith';
  document.getElementsByClassName('loginpass')[0].value = '123456789';
  const mockfetch = function (url, data) {
    this.headers = {};
    this.headers.url = url;
    this.headers.method = data.method;
    return Promise.resolve({
      Headers: this.headers,
      json: () => Promise.resolve({ message: 'incorrect email or password' })
    });
  };
  const evt = { target: { fetchClient: mockfetch, appName: 'PATRIC', runFetch: reg.runFetch } };
  const mockStorage = {
    setItem(item, value) {
    // do nothing
    }
  };
  window.localStorage = mockStorage;
  reg.logMeIn(evt).then((data) => {
    expect(data.message).toBe('incorrect email or password');
  });
});

test('catches any login errors', () => {
  document.body.innerHTML = '<div class="home"></div>';
  reg.startup('PATRIC');
  document.getElementsByClassName('userid')[0].value = 'joe@smith';
  document.getElementsByClassName('loginpass')[0].value = '123456789';
  const mockfetch = function (url, data) {
    this.headers = {};
    this.headers.url = url;
    this.headers.method = data.method;
    return Promise.resolve({
      Headers: this.headers,
      json: () => Promise.reject({ error: 'incorrect email or password' })
    });
  };
  const evt = { target: { fetchClient: mockfetch, appName: 'PATRIC', runFetch: reg.runFetch } };
  const mockStorage = {
    setItem(item, value) {
    // do nothing
    }
  };
  window.localStorage = mockStorage;
  return reg.logMeIn(evt)
    .catch(e => expect(e).toBeTruthy());
});

// test('Generates a session for PATRIC', () => {
//   const mockfetch = function(url, data) {
//     this.headers = {};
//     this.headers.url = url;
//     this.headers.method = data.method;
//     return Promise.resolve({
//       Headers: this.headers,
//       json: () => Promise.resolve({ message: 'success' })
//     });
//   };
//   reg.fetch = mockfetch;
//   const mockStorage = {getItem: function(item, value) {
//     //do nothing
//   }};
//   window.localStorage = mockStorage;
//   reg.generateSession('joe@smith.com').then((data) => {
//     expect(data.message).toBe('success');
//   });
// });
