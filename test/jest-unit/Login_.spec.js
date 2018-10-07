const Login_ = require('../../src/classes/Login_.js');

const reg = new Login_();
test('generates a login form', () => {
  document.body.innerHTML = '<div class="home"></div>';
  reg.startup('');
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

test('initiates a reset password request', () => {
  document.body.innerHTML = '<div class="home"></div>';
  reg.startup('');
  // document.getElementsByClassName('userid')[0].value = 'joe@smith.com';
  const mockfetch = function mockfetch(url, data) {
    this.headers = {};
    this.headers.url = url;
    this.headers.method = data.method;
    return Promise.resolve({
      Headers: this.headers,
      json: () => Promise.resolve({ email: 'joe@smith.com' })
    });
  };
  const evt = { target: { fetchClient: mockfetch, appName: '', runFetch: reg.runFetch } };
  reg.resetpass(evt).then((data) => {
    expect(data.message).toBe(null);
  });
});

test('initiates a reset password request for other app', () => {
  document.body.innerHTML = '<div class="home"></div>';
  reg.startup('otherapp');
  document.getElementsByClassName('loginemail')[0].value = 'joe@smith.com';
  const mockfetch = function mockfetch(url, data) {
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
  reg.startup('');
  // document.getElementsByClassName('userid')[0].value = 'joe@smith.com';
  const mockfetch = function mockfetch(url, data) {
    this.headers = {};
    this.headers.url = url;
    this.headers.method = data.method;
    return Promise.resolve({
      Headers: this.headers,
      json: () => Promise.resolve({ message: 'incorrect email address' })
    });
  };
  const evt = { target: { fetchClient: mockfetch, appName: '', runFetch: reg.runFetch } };
  reg.resetpass(evt).then((data) => {
    expect(data.message).toBe('incorrect email address');
  });
});

test('it catches error on reset password', () => {
  document.body.innerHTML = '<div class="home"></div>';
  reg.startup('');
  // document.getElementsByClassName('userid')[0].value = 'joe@smith.com';
  const mockfetch = function mockfetch(url, data) {
    this.headers = {};
    this.headers.url = url;
    this.headers.method = data.method;
    return Promise.resolve({
      Headers: this.headers,
      json: () => Promise.reject(new Error({ error: 'rejected' }))
    });
  };
  const evt = { target: { fetchClient: mockfetch, appName: '', runFetch: reg.runFetch } };
  return reg.resetpass(evt)
    .catch(e => expect(e).toBeTruthy());
});

test('validates a valid login form', () => {
  document.body.innerHTML = '<div class="home"></div>';
  reg.startup('OtherApp');
  document.getElementsByClassName('loginemail')[0].value = 'joe@smith.com';
  document.getElementsByClassName('loginemail')[0].checkValidity = function checkValidity() { return true; };
  document.getElementsByClassName('loginpass')[0].value = '123456789';
  document.getElementsByClassName('loginpass')[0].checkValidity = function checkValidity() { return true; };
  const loginbutton = document.getElementsByClassName('loginbutton')[0];
  const resetpass = document.getElementsByClassName('resetpass')[0];
  const evt = { target: { appName: 'OtherApp', buttonsErrors: reg.buttonsErrors } };
  reg.validateLogin(evt);
  expect(loginbutton.style.display).toBe('block');
  expect(resetpass.style.display).toBe('none');
});

test('validates a login form with invalid email (missing period)', () => {
  document.body.innerHTML = '<div class="home"></div>';
  reg.startup('OtherApp');
  document.getElementsByClassName('loginemail')[0].value = 'joe@smithcom';
  document.getElementsByClassName('loginemail')[0].checkValidity = function checkValidity() { return true; };
  document.getElementsByClassName('loginpass')[0].value = '123456789';
  document.getElementsByClassName('loginpass')[0].checkValidity = function checkValidity() { return true; };
  const logbutton = document.getElementsByClassName('loginbutton')[0];
  const resetpassButton = document.getElementsByClassName('resetpass')[0];
  const evt = { target: { appName: 'OtherApp', buttonsErrors: reg.buttonsErrors } };
  reg.validateLogin(evt);
  expect(logbutton.style.display).toBe('none');
  expect(resetpassButton.style.display).toBe('none');
});

test('validates a login form with invalid email (Google)', () => {
  document.body.innerHTML = '<div class="home"></div>';
  reg.startup('OtherApp');
  document.getElementsByClassName('loginemail')[0].value = 'joe@gmail.com';
  document.getElementsByClassName('loginemail')[0].checkValidity = function checkValidity() { return true; };
  document.getElementsByClassName('loginpass')[0].value = '123456789';
  document.getElementsByClassName('loginpass')[0].checkValidity = function checkValidity() { return true; };
  const logbutton = document.getElementsByClassName('loginbutton')[0];
  const resetpassButton = document.getElementsByClassName('resetpass')[0];
  const evt = { target: { appName: 'OtherApp', buttonsErrors: reg.buttonsErrors } };
  reg.validateLogin(evt);
  expect(logbutton.style.display).toBe('none');
  expect(resetpassButton.style.display).toBe('none');
});

test('validates a login form with invalid email (missing @)', () => {
  document.body.innerHTML = '<div class="home"></div>';
  reg.startup('OtherApp');
  document.getElementsByClassName('loginemail')[0].value = 'joegma.com';
  document.getElementsByClassName('loginemail')[0].checkValidity = function checkValidity() { return false; };
  document.getElementsByClassName('loginpass')[0].value = '123456789';
  document.getElementsByClassName('loginpass')[0].checkValidity = function checkValidity() { return true; };
  const logbutton = document.getElementsByClassName('loginbutton')[0];
  const resetpassButton = document.getElementsByClassName('resetpass')[0];
  const evt = { target: { appName: 'OtherApp', buttonsErrors: reg.buttonsErrors } };
  reg.validateLogin(evt);
  expect(logbutton.style.display).toBe('none');
  expect(resetpassButton.style.display).toBe('none');
});

// test('validates a login form without useremail and invalid password', () => {
//   document.body.innerHTML = '<div class="home"></div>';
//   reg.startup('');
//   document.getElementsByClassName('userid')[0].value = 'joesmith';
//   document.getElementsByClassName('loginpass')[0].value = '123456789';
//   document.getElementsByClassName('loginpass')[0].checkValidity = function checkValidity() { return false; };
//   document.getElementsByClassName('loginemail')[0].checkValidity = function checkValidity() { return false; };
//   const logbutton = document.getElementsByClassName('loginbutton')[0];
//   const resetpassButton = document.getElementsByClassName('resetpass')[0];
//   const evt = { target: { appName: '', buttonsErrors: reg.buttonsErrors } };
//   reg.validateLogin(evt);
//   expect(logbutton.style.display).toBe('none');
//   expect(resetpassButton.style.display).toBe('block');
// });

test('does not display the login button with invalid password and valid email', () => {
  document.body.innerHTML = '<div class="home"></div>';
  reg.startup('OtherApp');
  // document.getElementsByClassName('userid')[0].value = 'joesmith';
  document.getElementsByClassName('loginemail')[0].value = 'joe@smith.com';
  document.getElementsByClassName('loginpass')[0].value = '123456789';
  document.getElementsByClassName('loginpass')[0].checkValidity = function checkValidity() { return false; };
  document.getElementsByClassName('loginemail')[0].checkValidity = function checkValidity() { return true; };
  const logbutton = document.getElementsByClassName('loginbutton')[0];
  const resetpassButton = document.getElementsByClassName('resetpass')[0];
  const evt = { target: { appName: 'OtherApp', buttonsErrors: reg.buttonsErrors } };
  reg.validateLogin(evt);
  expect(logbutton.style.display).toBe('none');
  expect(resetpassButton.style.display).toBe('block');
});

// test('It displays reset password button', () => {
//   document.body.innerHTML = '<div class="home"></div>';
//   reg.startup('');
//   document.getElementsByClassName('userid')[0].value = 'joe@smith.com';
//   document.getElementsByClassName('loginpass')[0].value = '123456789';
//   document.getElementsByClassName('loginpass')[0].checkValidity = function checkValidity() { return true; };
//   document.getElementsByClassName('loginemail')[0].checkValidity = function checkValidity() { return false; };
//   const logbutton = document.getElementsByClassName('loginbutton')[0];
//   const resetpassButton = document.getElementsByClassName('resetpass')[0];
//   const evt = { target: { appName: '', buttonsErrors: reg.buttonsErrors } };
//   reg.validateLogin(evt);
//   expect(logbutton.style.display).toBe('block');
//   expect(resetpassButton.style.display).toBe('block');
// });

test('It does not display reset password button', () => {
  document.body.innerHTML = '<div class="home"></div>';
  reg.startup('');
  // document.getElementsByClassName('userid')[0].value = '';
  document.getElementsByClassName('loginpass')[0].value = '123456789';
  document.getElementsByClassName('loginpass')[0].checkValidity = function checkValidity() { return true; };
  document.getElementsByClassName('loginemail')[0].checkValidity = function checkValidity() { return false; };
  const logbutton = document.getElementsByClassName('loginbutton')[0];
  const resetpassButton = document.getElementsByClassName('resetpass')[0];
  const evt = { target: { appName: '', buttonsErrors: reg.buttonsErrors } };
  reg.validateLogin(evt);
  expect(logbutton.style.display).toBe('none');
  expect(resetpassButton.style.display).toBe('none');
});

test('login and reset buttons do not display when email is not valid format', () => {
  document.body.innerHTML = '<div class="home"></div>';
  reg.startup('OtherApp');
  document.getElementsByClassName('loginemail')[0].value = '33333';
  document.getElementsByClassName('loginemail')[0].checkValidity = function checkValidity() { return false; };
  document.getElementsByClassName('loginpass')[0].value = '123456789';
  document.getElementsByClassName('loginpass')[0].checkValidity = function checkValidity() { return true; };
  const logbutton = document.getElementsByClassName('loginbutton')[0];
  const resetpassButton = document.getElementsByClassName('resetpass')[0];
  const evt = { target: { appName: 'OtherApp', buttonsErrors: reg.buttonsErrors } };
  reg.validateLogin(evt);
  expect(logbutton.style.display).toBe('none');
  expect(resetpassButton.style.display).toBe('none');
  document.body.innerHTML = '';
});

test('login the user', () => {
  document.body.innerHTML = '<div class="home"></div>';
  reg.startup('');
  // document.getElementsByClassName('userid')[0].value = 'joe@smith';
  document.getElementsByClassName('loginpass')[0].value = '123456789';
  const mockfetch = function mockfetch(url, data) {
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
      fetchClient: mockfetch, appName: '', runFetch: reg.runFetch, checkIfLoggedIn() {}, generateSession() {}
    }
  };
  const mockStorage = {
    setItem() {
    // do nothing
    },
    getItem() {
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
  const mockfetch = function mockfetch(url, data) {
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
    setItem() {
    // do nothing
    },
    getItem() {
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
  reg.startup('');
  // document.getElementsByClassName('userid')[0].value = 'joe@smith';
  document.getElementsByClassName('loginpass')[0].value = '123456789';
  const mockfetch = function mockfetch(url, data) {
    this.headers = {};
    this.headers.url = url;
    this.headers.method = data.method;
    return Promise.resolve({
      Headers: this.headers,
      json: () => Promise.resolve({ message: 'incorrect email or password' })
    });
  };
  const evt = { target: { fetchClient: mockfetch, appName: '', runFetch: reg.runFetch } };
  const mockStorage = {
    setItem() {
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
  reg.startup('');
  // document.getElementsByClassName('userid')[0].value = 'joe@smith';
  document.getElementsByClassName('loginpass')[0].value = '123456789';
  const mockfetch = function mockfetch(url, data) {
    this.headers = {};
    this.headers.url = url;
    this.headers.method = data.method;
    return Promise.resolve({
      Headers: this.headers,
      json: () => Promise.reject(new Error({ error: 'incorrect email or password' }))
    });
  };
  const evt = { target: { fetchClient: mockfetch, appName: '', runFetch: reg.runFetch } };
  const mockStorage = {
    setItem() { // do nothing
    }
  };
  window.localStorage = mockStorage;
  return reg.logMeIn(evt)
    .catch(e => expect(e).toBeTruthy());
});
