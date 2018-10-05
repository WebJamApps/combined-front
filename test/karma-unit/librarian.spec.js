import csvjson from 'csvjson';
import { Validator } from 'aurelia-validation';
import { App } from '../../src/app';
import { AuthStub, HttpMock, AppStateStub } from './commons';
import { Librarian } from '../../src/dashboard-child-routes/librarian';
import { csvFixture } from './librarian.spec.fixtures';

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
    return Promise.resolve([{ name: 'john', valid: true }]);
  }

  validateProperty() {
    return Promise.resolve({});
  }
}

describe('the librarian module', () => {
  let librarian, app1, http, reader, vc, val, auth;
  global.CSVFilePath = { files: [csvFixture.string, 'sample.txt'] };

  beforeEach(() => {
    auth = new AuthStub();
    auth.setToken({ sub: '1' });
    http = new HttpMock();
    reader = new FileReader();
    app1 = new App(auth, http);
    vc = new VCMock();
    val = new ValidatorMock();
    app1.activate();
    librarian = new Librarian(app1, reader, {}, vc, val);
    librarian.app.appState = new AppStateStub();
    librarian.CSVFilePath = { files: [csvFixture.string] };
  });

  it('should activate', (done) => {
    librarian.activate();
    done();
  });

  it('should validate', (done) => {
    document.body.innerHTML = '<div id="createMediaButton"></div>';
    librarian.validate();
    librarian.updateCanSubmit([{ valid: false }]);
    done();
  });

  it('should parse the csv.fixtures into object', (done) => {
    const object = csvjson.toObject(librarian.CSVFilePath.files[0]);
    expect(object instanceof Array).toBeTruthy();
    done();
  });

  it('should confirm 200 https status after createBook is run', (done) => {
    librarian.createBook();
    expect(http.status).toBe(200);
    done();
  });

  it('should log a new book type when book is undefined', (done) => {
    librarian.newBook.type = 0;
    librarian.createBook();
    expect(http.status).toBe(200);
    done();
  });

  it('should default to Public access when book access is undefined', (done) => {
    librarian.newBook.access = 0;
    librarian.createBook();
    expect(http.status).toBe(200);
    done();
  });

  it('should raise a file reader error', (done) => {
    window.CSVFilePath = { files: [new Blob()] };
    const error = new Event('error');
    const load = new Event('load');
    librarian.createBooksFromCSV();
    // if dashbook.createBooksFromCSV is called, it should called the makeLotaBooks that
    // places a http call and HttpMock will respond to it and also change the status.
    librarian.reader.dispatchEvent(error);
    librarian.reader.dispatchEvent(load);
    setTimeout(() => {
      // expect(http.status).toBe(200);
      done();
    }, 2001);
  });

  it('should validate textFile', (done) => {
    // document.body.innerHTML = '<div id="deleteCreateButton"></div>';
    // librarian.newBook.type = 'text/plain';
    // librarian.textFileValidate();
    done();
  });

  it('should createBooksFromCSV', (done) => {
    // librarian.createBooksFromCSV();
    done();
  });

  it('should make a .csv file', (done) => {
    librarian.makeCSVfile();
    // expect(http2.status).toBe(200);
    done();
  });

  it('should delete and deleteCreate', (done) => {
    librarian.deleteBooks();
    librarian.deleteCreateBooks();
    done();
  });

  // it('should validate textFile', (done) => {
  //   // global.CSVFilePath = { files: [] };
  //   // librarian.textFileValidate();
  //   done();
  // });
});
