import csvjson from 'csvjson';
import { Validator } from 'aurelia-validation';
import { App } from '../../src/app';
import { AuthStub, HttpMock, AppStateStub } from './commons';
import { Developer } from '../../src/dashboard-child-routes/developer';

class VCMock {
  createForCurrentScope() {
    return { validateTrigger: null };
  }
}

class ValidatorMock extends Validator {
  constructor(a, b) {
    super();
    this.a = a;
    this.b = b;
  }

  validateObject() {
    return Promise.resolve([{ valid: true }]);
  }

  validateProperty() {
    return Promise.resolve({});
  }
}

describe('the develper module', () => {
  let developer, app1, http, reader, vc, val, auth;
  global.CSVFilePath = { files: ['title author url performer  category', 'sample.txt'] };

  beforeEach(() => {
    auth = new AuthStub();
    auth.setToken({ sub: '1' });
    http = new HttpMock();
    reader = new FileReader();
    app1 = new App(auth, http);
    vc = new VCMock();
    val = new ValidatorMock();
    app1.activate();
    developer = new Developer(app1, reader, {}, vc, val);
    developer.app.appState = new AppStateStub();
    developer.CSVFilePath = { files: ['title author url performer  category'] };
  });

  it('should activate', (done) => {
    developer.activate();
    done();
  });

  it('should validate', (done) => {
    document.body.innerHTML = '<div id="createMediaButton"></div>';
    developer.newSong = {};
    developer.newSong.category = 'original';
    developer.validate();
    developer.updateCanSubmit([{ valid: false }]);
    done();
  });

  it('validates the import txt file', (done) => {
    let valid = true;
    document.body.innerHTML = '<div id="createMediaButton"><input id="CSVFilePath" type="file"/><button id="deleteCreateButton">'
    + '</button><p class="errorMessage"></p></div>';
    valid = developer.textFileValidate();
    expect(valid).toBe(false);
    done();
  });

  it('should parse the csv.fixtures into object', (done) => {
    const object = csvjson.toObject(developer.CSVFilePath.files[0]);
    expect(object instanceof Array).toBeTruthy();
    done();
  });

  it('should confirm 200 https status after createSong is run', (done) => {
    developer.createBook();
    expect(http.status).toBe(200);
    done();
  });

  it('should raise a file reader error', (done) => {
    document.body.innerHTML = '<div id="createMediaButton"><p class="errorMessage"></p>'
    + '<input id="CSVFilePath" type="file"/><button id="deleteCreateButton"></div>';
    window.CSVFilePath = { files: [new Blob()] };
    const error = new Event('error');
    const load = new Event('load');
    developer.createBooksFromCSV();
    // if dashbook.createBooksFromCSV is called, it should called the makeLotaBooks that
    // places a http call and HttpMock will respond to it and also change the status.
    developer.reader.dispatchEvent(error);
    developer.reader.dispatchEvent(load);
    setTimeout(() => {
      // expect(http.status).toBe(200);
      done();
    }, 2001);
  });

  it('makes a .csv file', (done) => {
    developer.makeCSVfile();
    // expect(http2.status).toBe(200);
    done();
  });

  it('should delete and Create', (done) => {
    developer.deleteBooks();
    developer.deleteCreateBooks();
    done();
  });
  it('catches error on delete all', async () => {
    developer.app.httpClient.fetch = function fetch() { return Promise.reject(new Error('bad')); };
    try {
      await developer.deleteBooks();
    } catch (e) { expect(e.message).toBe('bad'); }
  });
  it('catches error on deleteCreate', async () => {
    developer.app.httpClient.fetch = function fetch() { return Promise.reject(new Error('bad')); };
    try {
      await developer.deleteCreateBooks();
    } catch (e) { expect(e.message).toBe('bad'); }
  });
});
