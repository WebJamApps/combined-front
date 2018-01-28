const Fetch = require('isomorphic-fetch');
const patric = require('../commons/patric.js');
class Register_ {
  constructor() {
    this.fetch = Fetch;
    this.appName = '';
    this.patric = patric;
  }

  createRegistrationForm(appName) {
    this.patric.nevermind('LoginForm');
    this.patric.nevermind('RegistrationForm');
    this.appName = appName;
    const regform = document.createElement('div');
    regform.className = 'RegistrationForm';
    regform.innerHTML = '<h2 style="margin-top:20px;padding:4px;font-size:1.2em;text-align:center;background:#eee;"><span class="appName"></span>User Registration</h2>' + '<form class=""><div style="padding:2px; margin:10px;"><table><tbody>' +
    '<tr class="primApSel"><td><label style="display:inline">Primary App </label><select class="pas"><option value=""> </option><option value="PATRIC">PATRIC</option></select></td></tr>' +
    '<tr><th>First Name <span style="color:red">*</span></th><th>Last Name <span style="color:red">*</span></th></tr><tr><td width="50%">' +
    '<input class="firstname" type="text" name="first_name" style="width:100%;" required>' +
    '</td><td><input class="lastname" type="text" name="last_name" style="width:100%;" required>' +
    '</td></tr><tr><th colspan="1">Email Address <span style="color:red">*</span></th><th colspan="1">Password <span style="color:red">*</span></th></tr><tr><td colspan="1">' +
    '<input class="email" type="email" name="email" style="width:100%;" required></td>' + '<td><input style="width:100%" class="password" pattern=".{8,}" title="8 characters minimum" type="password" name="password" style="width:100%;" required>' +
    '</td></tr><tr class="userIdRow">' + '<th colspan="2">Userid (optional)</th></tr><tr class="useridinput"><td colspan="2"><div style="width:100%"><input class="userid" type="text" name="userid" value=""></div></td>' + '</tr>' +
    '<tr><th colspan="2">Organization</th></tr><tr><td colspan="2"><input style="width:100%" class="organization" type="text" name="affiliation" value=""></td></tr>' +
    '<tr><th colspan="2">Organisms</th></tr><tr><td colspan="2"><div><input style="width:100%;" class="organisms" type="text" name="organisms" value=""></div></td></tr>' +
    '<tr><th colspan="2">Interests</th></tr><tr><td colspan="2"><div><textarea style="width:100%;" class="interests" rows="5" cols="50" name="interests" style="height:75px;" value=""></textarea></div></td></tr>' +
    '</tbody></table><p><span style="color:red">*</span> <i>Indicates required field</i></p></div><div style="text-align:center;padding:2px;margin:10px;">' +
    '<div class="registererror" style="color:red"></div>' +
    '<div><button type="button" class="registerbutton" style="display:none; margin-bottom:-22px">Register New User</button>' +
    '<button class="nevermind" type="button" style="margin-top:2px">Cancel</button></div></div></form>';
    const home = document.getElementsByClassName('home');
    home[0].insertBefore(regform, home[0].childNodes[0]);
    document.getElementsByClassName('appName')[0].innerHTML = appName + ' ';
    let elementsObj = {'PATRIC': ['userIdRow', 'useridinput'], 'nArr': ['primApSel']};
    patric.showHideElements2(this.appName, elementsObj);
  }

  register(appName) {
    this.appName = appName;
    this.createRegistrationForm(this.appName);
    let firstNameInput = document.getElementsByClassName('firstname')[0];
    this.setEvents(firstNameInput, appName);
    let lastNameInput = document.getElementsByClassName('lastname')[0];
    this.setEvents(lastNameInput, appName);
    let emailInput = document.getElementsByClassName('email')[0];
    this.setEvents(emailInput, appName);
    let passInput = document.getElementsByClassName('password')[0];
    this.setEvents(passInput, appName);
    let registerEventButton = document.getElementsByClassName('registerbutton')[0];
    registerEventButton.fetchClient = this.fetch;
    registerEventButton.runFetch = this.runFetch;
    registerEventButton.addEventListener('click', this.createUser);
    let cancelButton = document.getElementsByClassName('nevermind')[0];
    cancelButton.addEventListener('click', function() {
      document.getElementsByClassName('RegistrationForm')[0].style.display = 'none';
    });
    let pas2 = document.getElementsByClassName('pas')[0];
    pas2.addEventListener('change', this.updateRegForm);
    pas2.addEventListener('change', this.validateReg);
    pas2.displayError = this.displayRegError;
    pas2.validateGoogle = this.validateGoogle;
    pas2.appName = appName;
    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'test') {
      document.getElementsByClassName('RegistrationForm')[0].scrollIntoView();
    }
  }

  setEvents(element, appName) {
    element.addEventListener('change', this.validateReg);
    element.addEventListener('focus', this.validateReg);
    element.addEventListener('keydown', this.validateReg);
    element.addEventListener('keyup', this.validateReg);
    element.displayError = this.displayRegError;
    element.validateGoogle = this.validateGoogle;
    element.appName = appName;
  }

  updateRegForm() {
    console.log('inside this function');
    let primApp = document.getElementsByClassName('pas')[0].value;
    let uidRow = document.getElementsByClassName('userIdRow')[0];
    let useridinput = document.getElementsByClassName('useridinput')[0];
    if (primApp === 'PATRIC') {
      uidRow.style.display = 'block';
      useridinput.style.display = 'block';
      document.getElementsByClassName('registererror')[0].innerHTML = '';
      this.appName = 'PATRIC';
    } else {
      uidRow.style.display = 'none';
      useridinput.style.display = 'none';
      this.appName = primApp;
    }
  }

  validateReg(evt) {
    let displayError = evt.target.displayError;
    let validateGoogle = evt.target.validateGoogle;
    let appName = evt.target.appName;
    let fname = document.getElementsByClassName('firstname')[0].value;
    let fspace = fname.split(' ');
    let lname = document.getElementsByClassName('lastname')[0].value;
    let lspace = lname.split(' ');
    let email = document.getElementsByClassName('email')[0].value;
    let edot = email.split('.');
    let validemail = document.getElementsByClassName('email')[0];
    let password = document.getElementsByClassName('password')[0].value;
    let pspace = password.split(' ');
    let googleAccount = validateGoogle(email, appName);
    let validpass = document.getElementsByClassName('password')[0];
    let nameError = false;
    let pwError = false;
    let emError = false;
    if (fname === '' || lname === '' || fspace.length > 1 || lspace.length > 1) {
      nameError = true;
    }
    if (pspace.length > 1 || !validpass.checkValidity() || password === '') {
      pwError = true;
    }
    if (!validemail.checkValidity() || edot.length === 1 || email === '') {
      emError = true;
    }
    displayError(nameError, emError, pwError, googleAccount);
  }

  validateGoogle(email, appName) {
    // console.log(email);
    // let primaryApp = '';
    // if (document.getElementsByClassName('pas')[0].style.display !== 'none'){
    //   primaryApp = document.getElementsByClassName('pas')[0].value;
    // } else {
    //   primaryApp = 'PATRIC';
    // }
    //console.log(primaryApp);
    let googleAccount = false;
    if (email.split('@gmail').length > 1 || email.split('@vt.edu').length > 1 || email.split('@bi.vt.edu').length > 1) {
      if (appName !== 'PATRIC') {
        googleAccount = true;
      }
    }
    return googleAccount;
  }


  displayRegError(nameError, emError, pwError, googleAccount) {
    let registbutton = document.getElementsByClassName('registerbutton')[0];
    let regError = document.getElementsByClassName('registererror')[0];
    if (!nameError && !emError && !pwError && !googleAccount) {
      registbutton.style.display = 'block';
    } else {
      registbutton.style.display = 'none';
    }
    if (googleAccount) {
      regError.innerHTML = '<p>Please scroll up and click the Login with Google button</p>';
    } else if (nameError) {
      regError.innerHTML = '<p>Name format is not valid</p>';
    } else if (emError) {
      regError.innerHTML = '<p>Email format is not valid</p>';
    } else if (pwError) {
      regError.innerHTML = '<p>Password format is not valid</p>';
    } else {regError.innerHTML = '';}
  }

  createUser(evt) {
    let fetchClient = evt.target.fetchClient;
    let firstname = document.getElementsByClassName('firstname')[0].value;
    let runFetch = evt.target.runFetch;
    //let primaryAppValue = '';
    let primaryAppValue = document.getElementsByClassName('pas')[0].value;
    let lastname = document.getElementsByClassName('lastname')[0].value;
    //let orgString = '';
    let orgString = document.getElementsByClassName('organization')[0].value;
    //let organismString = '';
    let organismString = document.getElementsByClassName('organisms')[0].value;
    //let userdetString = '';
    let userdetString = document.getElementsByClassName('interests')[0].value;
    //let useridValue = '';
    let useridValue = document.getElementsByClassName('userid')[0].value;
    let bodyData = {'name': firstname + ' ' + lastname, 'email': document.getElementsByClassName('email')[0].value, 'password': document.getElementsByClassName('password')[0].value,
      'first_name': firstname, 'last_name': lastname, 'affiliation': orgString, 'organisms': organismString, 'interests': userdetString, 'id': useridValue, 'primaryApp': primaryAppValue};
    let fetchData = {
      method: 'POST',
      body: JSON.stringify(bodyData),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    };
    return runFetch(fetchClient, process.env.BackendUrl + '/auth/signup', fetchData);
  }

  runFetch(fetchClient, url, route, fetchData) {
    let messagediv = document.getElementsByClassName('registererror')[0];
    return fetchClient(url, route, fetchData)
    .then((response) => response.json())
    .then((data) => {
      if (data.message) {
        messagediv.innerHTML = '<p style="text-align:left;padding-left:12px">' + data.message + '</p>';
      } else {
        document.getElementsByClassName('RegistrationForm')[0].style.display = 'none';
        if (data.email) {
          window.location.href = process.env.FrontendUrl + '/userutil/?email=' + data.email;
        }
      }
    })
    .catch((error) => {
      console.log(error);
    });
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('useremail');
    let feurl = 'http://localhost:7000';
      /* istanbul ignore if */
    if (process.env.FrontendUrl !== undefined) {
      feurl = process.env.FrontendUrl;
    }
    let hideWithAuth = document.getElementsByClassName('HideWAuth')[0];
    hideWithAuth.style.display = 'block';
    let showWithAuth = document.getElementsByClassName('ShowWAuth')[0];
    showWithAuth.style.display = 'none';
    window.location.href = feurl + '/';
  }

  userAccount() {
    let feurl = 'http://localhost:7000';
      /* istanbul ignore if */
    if (process.env.FrontendUrl !== undefined) {
      feurl = process.env.FrontendUrl;
    }
    window.location.href = feurl + '/userutil/?form=prefs';
  }

}

module.exports = Register_;
