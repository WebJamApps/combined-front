const Register_ = require('../../src/classes/Register_.js');

let reg = new Register_();

test('generates a registration form for PATRIC', () => {
  document.body.innerHTML = '<div class="home"></div>';
  reg.startup('PATRIC');
  let regform = document.getElementsByClassName('RegistrationForm');
  expect(regform[0]).toBeDefined();
  expect(document.getElementsByClassName('userIdRow')[0].style.display).toBe('block');
});

test('generates a registration form for another app', () => {
  document.body.innerHTML = '<div class="home"></div>';
  reg.startup();
  let regform = document.getElementsByClassName('RegistrationForm');
  expect(regform[0]).toBeDefined();
  expect(document.getElementsByClassName('userIdRow')[0].style.display).toBe('none');
});

test('hides a registration form with click Cancel button', () => {
  document.body.innerHTML = '<div class="home"></div>';
  reg.startup();
  document.getElementsByClassName('nevermind')[0].click();
  let regform = document.getElementsByClassName('RegistrationForm');
  expect(regform[0].style.display).toBe('none');
});

test('updates the registration form after selection of primary app is PATRIC', () => {
  document.body.innerHTML = '<div class="home"></div>';
  reg.startup('');
  document.getElementsByClassName('pas')[0].value = 'PATRIC';
  reg.updateRegForm();
  let uidRowStuff = document.getElementsByClassName('userIdRow')[0];
  expect(uidRowStuff.style.display).toBe('block');
});

test('updates the registration form after selection of primary app is not PATRIC', () => {
  document.body.innerHTML = '<div class="home"></div>';
  reg.startup('');
  document.getElementsByClassName('pas')[0].value = '';
  reg.updateRegForm();
  let uidRowStuff = document.getElementsByClassName('userIdRow')[0];
  expect(uidRowStuff.style.display).toBe('none');
});

test('generates a registration form without userid', () => {
  document.body.innerHTML = '<div class="home"></div>';
  reg.startup('DifferentApp');
  let userIdRow = document.getElementsByClassName('userIdRow')[0];
  expect(userIdRow.style.display).toBe('none');
});

test('hides the submit button when registration form is not valid email', () => {
  document.body.innerHTML = '<div class="home"></div>';
  reg.startup('');
  document.getElementsByClassName('pas')[0].value = 'other';
  document.getElementsByClassName('pas')[0].style.display = 'block';
  document.getElementsByClassName('email')[0].value = 'google.@gmail.com';
  document.getElementsByClassName('email')[0].checkValidity = function() {return false;};
  document.getElementsByClassName('password')[0].checkValidity = function() {return true;};
  let evt = {target: {displayError: reg.displayRegError, validateGoogle: reg.validateGoogle}};
  reg.validateReg(evt);
  let registbutton = document.getElementsByClassName('registerbutton')[0];
  expect(registbutton.style.display).toBe('none');
});

test('hides the submit button when registration form is not valid name', () => {
  document.body.innerHTML = '<div class="home"></div>';
  reg.startup('PATRIC');
  document.getElementsByClassName('password')[0].checkValidity = function() {return true;};
  document.getElementsByClassName('email')[0].checkValidity = function() {return true;};
  document.getElementsByClassName('firstname')[0].value = '';
  let evt = {target: {displayError: reg.displayRegError, validateGoogle: reg.validateGoogle}};
  reg.validateReg(evt);
  let registbutton = document.getElementsByClassName('registerbutton')[0];
  expect(registbutton.style.display).toBe('none');
});

test('hides the submit button when registration form is not valid password', () => {
  document.body.innerHTML = '<div class="home"></div>';
  reg.startup('PATRIC');
  document.getElementsByClassName('email')[0].value = 'google.@gb.com';
  document.getElementsByClassName('firstname')[0].value = 'Bob';
  document.getElementsByClassName('lastname')[0].value = 'Smith';
  document.getElementsByClassName('email')[0].checkValidity = function() {return true;};
  document.getElementsByClassName('password')[0].checkValidity = function() {return false;};
  let evt = {target: {displayError: reg.displayRegError, validateGoogle: reg.validateGoogle}};
  reg.validateReg(evt);
  let registbutton = document.getElementsByClassName('registerbutton')[0];
  expect(registbutton.style.display).toBe('none');
});

test('shows the submit button when registration form is valid', () => {
  document.body.innerHTML = '<div class="home"></div>';
  reg.startup('PATRIC');
  document.getElementsByClassName('firstname')[0].value = 'Joe';
  document.getElementsByClassName('lastname')[0].value = 'Smith';
  document.getElementsByClassName('email')[0].value = 'joe@smith.com';
  document.getElementsByClassName('password')[0].value = '123456789';
  const mockvalidity = function() {
    return true;
  };
  document.getElementsByClassName('password')[0].checkValidity = mockvalidity;
  document.getElementsByClassName('email')[0].checkValidity = mockvalidity;
  let evt = {target: {displayError: reg.displayRegError, validateGoogle: reg.validateGoogle}};
  reg.validateReg(evt);
  let registbutton = document.getElementsByClassName('registerbutton')[0];
  expect(registbutton.style.display).toBe('block');
  document.body.innerHTML = '';
});

test('shows the submit button when registration form uses a Google email with PATRIC', () => {
  document.body.innerHTML = '<div class="home"></div>';
  reg.startup('PATRIC');
  document.getElementsByClassName('firstname')[0].value = 'Joe';
  document.getElementsByClassName('lastname')[0].value = 'Smith';
  document.getElementsByClassName('email')[0].value = 'joe@gmail.com';
  document.getElementsByClassName('password')[0].value = '123456789';
  const mockvalidity = function() {
    return true;
  };
  document.getElementsByClassName('password')[0].checkValidity = mockvalidity;
  document.getElementsByClassName('email')[0].checkValidity = mockvalidity;
  let evt = {target: {displayError: reg.displayRegError, validateGoogle: reg.validateGoogle, appName: 'PATRIC'}};
  document.getElementsByClassName('pas')[0].style.display = 'none';
  reg.validateReg(evt);
  let registbutton = document.getElementsByClassName('registerbutton')[0];
  expect(registbutton.style.display).toBe('block');
  document.body.innerHTML = '';
});

test('hides register button when email format is not valid', () => {
  document.body.innerHTML = '<div class="home"></div>';
  reg.startup('PATRIC');
  document.getElementsByClassName('firstname')[0].value = 'Joe';
  document.getElementsByClassName('lastname')[0].value = 'Smith';
  document.getElementsByClassName('email')[0].value = 'joe@smith.com';
  document.getElementsByClassName('password')[0].value = '123456789';
  const mockvalidity = function() {
    return false;
  };
  document.getElementsByClassName('password')[0].checkValidity = function() {return true;};
  document.getElementsByClassName('email')[0].checkValidity = mockvalidity;
  let evt = {target: {displayError: reg.displayRegError, validateGoogle: reg.validateGoogle}};
  reg.validateReg(evt);
  let registbutton = document.getElementsByClassName('registerbutton')[0];
  expect(registbutton.style.display).toBe('none');
  document.body.innerHTML = '';
});

test('create a new user for another app', () => {
  document.body.innerHTML = '<div class="home"></div>';
  reg.appName = '';
  reg.startup();
  document.getElementsByClassName('firstname')[0].value = 'Joe';
  document.getElementsByClassName('lastname')[0].value = 'Smith';
  document.getElementsByClassName('email')[0].value = 'joe@smith.com';
  document.getElementsByClassName('password')[0].value = '123456789';
  document.getElementsByClassName('pas')[0].value = 'CoolApp';
  const mockfetch = function(url, data) {
    this.headers = {};
    this.headers.url = url;
    this.headers.method = data.method;
    return Promise.resolve({
      Headers: this.headers,
      json: () => Promise.resolve({success: true })
    });
  };
  let evt = {target: {fetchClient: mockfetch, runFetch: reg.runFetch}};
  //reg.fetch = mockfetch;
  reg.createUser(evt).then(() => {
    let messagediv1 = document.getElementsByClassName('registererror')[0];
    expect(messagediv1.innerHTML).toBe('');
  });
});

test('it does not create a new user when there is an response error message from post', () => {
  document.body.innerHTML = '<div class="home"></div>';
  reg.startup('PATRIC');
  document.getElementsByClassName('firstname')[0].value = 'Joe';
  document.getElementsByClassName('lastname')[0].value = 'Smith';
  document.getElementsByClassName('email')[0].value = 'joe@smith.com';
  document.getElementsByClassName('password')[0].value = '123456789';
  const mockfetch = function(url, data) {
    this.headers = {};
    this.headers.url = url;
    this.headers.method = data.method;
    return Promise.resolve({
      Headers: this.headers,
      json: () => Promise.resolve({message: 'error' })
    });
  };
  let evt = {target: {fetchClient: mockfetch, runFetch: reg.runFetch}};
  //reg.fetch = mockfetch;
  reg.createUser(evt).then(() => {
    let messagediv1 = document.getElementsByClassName('registererror')[0];
    expect(messagediv1.innerHTML).toMatch(/error/);
  });
});

test('it catches error on create a new user', () => {
  document.body.innerHTML = '<div class="home"></div>';
  reg.startup('PATRIC');
  document.getElementsByClassName('firstname')[0].value = 'Joe';
  document.getElementsByClassName('lastname')[0].value = 'Smith';
  document.getElementsByClassName('email')[0].value = 'joe@smith.com';
  document.getElementsByClassName('password')[0].value = '123456789';
  const mockfetch = function(url, data) {
    this.headers = {};
    this.headers.url = url;
    this.headers.method = data.method;
    return Promise.resolve({
      Headers: this.headers,
      json: () => Promise.reject({error: 'rejected' })
    });
  };
  let evt = {target: {fetchClient: mockfetch, runFetch: reg.runFetch}};
  return reg.createUser(evt)
  .catch((e) => expect(e).toBeTruthy());
});

test('it initiates an email varification', () => {
  document.body.innerHTML = '<div class="home"></div>';
  reg.startup('PATRIC');
  document.getElementsByClassName('firstname')[0].value = 'Joe';
  document.getElementsByClassName('lastname')[0].value = 'Smith';
  document.getElementsByClassName('email')[0].value = 'joe@smith.com';
  document.getElementsByClassName('password')[0].value = '123456789';
  const mockfetch = function(url, data) {
    this.headers = {};
    this.headers.url = url;
    this.headers.method = data.method;
    return Promise.resolve({
      Headers: this.headers,
      json: () => Promise.resolve({email: 'joe@smith.com' })
    });
  };
  let evt = {target: {fetchClient: mockfetch, runFetch: reg.runFetch}};
  reg.createUser(evt).then((data) => {
    expect(data.email).toBe('joe@smith.com');
  });
});

test('it does not initiates an email varification', () => {
  document.body.innerHTML = '<div class="home"></div>';
  reg.startup('PATRIC');
  document.getElementsByClassName('firstname')[0].value = 'Joe';
  document.getElementsByClassName('lastname')[0].value = 'Smith';
  document.getElementsByClassName('email')[0].value = 'joe@smith.com';
  document.getElementsByClassName('password')[0].value = '123456789';
  const mockfetch = function(url, data) {
    this.headers = {};
    this.headers.url = url;
    this.headers.method = data.method;
    return Promise.resolve({
      Headers: this.headers,
      json: () => Promise.resolve({})
    });
  };
  let evt = {target: {fetchClient: mockfetch, runFetch: reg.runFetch}};
  reg.createUser(evt).then((data) => {
    expect(data.email).toBe(null);
  });
});

test('initiates a reset password request', () => {
  document.getElementsByClassName('userid')[0].value = 'joe@smith.com';
  const mockfetch = function(url, data) {
    this.headers = {};
    this.headers.url = url;
    this.headers.method = data.method;
    return Promise.resolve({
      Headers: this.headers,
      json: () => Promise.resolve({email: 'joe@smith.com'})
    });
  };
  let evt = {target: {fetchClient: mockfetch, appName: 'PATRIC', runFetch: reg.runFetch}};
  reg.resetpass(evt).then((data) => {
    expect(data.message).toBe(null);
  });
});

// test('logs out the user', () => {
//   const mockStorage = {setItem: function(item, value) {
//     //do nothing
//   }, removeItem: function(item) {
//     //do nothing
//   }};
//   window.localStorage = mockStorage;
//   document.body.innerHTML += '<div class="loginerror"></div><div class="ShowWAuth"></div><div class="HideWAuth"></div>';
//   reg.logout();
//   let showA = document.getElementsByClassName('ShowWAuth')[0];
//   expect(showA.style.display).toBe('none');
// });

// test('it displays account and logout buttons when the user is logged in', () => {
//   const mockStorage = {getItem: function(item, value) {
//     return '12345';
//   }, removeItem: function(item) {
//     //do nothing
//   }};
//   window.localStorage = mockStorage;
//   document.body.innerHTML = '<div class="HideWAuth"></div><div class="ShowWAuth"></div>';
//   reg.checkIfLoggedIn();
//   expect(document.getElementsByClassName('ShowWAuth')[0].style.display).toBe('block');
//   expect(document.getElementsByClassName('HideWAuth')[0].style.display).toBe('none');
// });

// test('it does nothing when account and logout buttons do not exist', () => {
//   const mockStorage = {getItem: function(item, value) {
//     return '12345';
//   }, removeItem: function(item) {
//     //do nothing
//   }};
//   window.localStorage = mockStorage;
//   document.body.innerHTML = '';
//   reg.checkIfLoggedIn();
//   expect(document.getElementsByClassName('ShowWAuth').length).toBe(0);
//   expect(document.getElementsByClassName('HideWAuth').length).toBe(0);
// });

// test('it does not displays account and logout buttons when the user is not logged in', () => {
//   const mockStorage = {getItem: function(item, value) {
//     return null;
//   }, removeItem: function(item) {
//     //do nothing
//   }};
//   window.localStorage = mockStorage;
//   document.body.innerHTML = '<div class="HideWAuth" style="display:block"></div><div class="ShowWAuth" style="display:none"></div>';
//   reg.checkIfLoggedIn();
//   expect(document.getElementsByClassName('ShowWAuth')[0].style.display).toBe('none');
//   expect(document.getElementsByClassName('HideWAuth')[0].style.display).toBe('block');
// });

// test('it navigates to the user preferences page', () => {
//   reg.userAccount();
// });

test('it hides the registration form', () => {
  document.body.innerHTML = '<div><div class="RegistrationForm" style="display:block"></div></div>';
  //reg.startup('otherapp');
  reg.patric.nevermind('RegistrationForm');
  expect(document.getElementsByClassName('RegistrationForm')[0].style.display).toBe('none');
});
