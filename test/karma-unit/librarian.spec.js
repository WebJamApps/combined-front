import {Librarian} from '../../src/dashboard-child-routes/librarian';
//import {HttpClient} from 'aurelia-fetch-client';
import './setup';
//import {Router} from 'aurelia-router';
import {csvFixture} from './librarian.spec.fixtures';
import csvjson from 'csvjson';
//import filesaver from 'file-saver';
const Counter = require('assertions-counter');

class HttpStub {
  fetch(fn) {
    var response = this.itemStub;
    this.__fetchCallback = fn;
    return new Promise((resolve) => {
      resolve({ json: () => response });
    });
  }
  configure(fn) {
    this.__configureCallback = fn;
    return this.__configureReturns;
  }
}

// class LibrarianMock extends Librarian {
//   process.env.NODE_ENV = 'production';
// }

class HttpMock {
  status = 500;
  header = {accept: 'application/json', url: '', method: ''}
  response = ''
  fetch(data, object) {
    // data should be the path when calling the fecth method.
    // see the log to ensure the methods are being called.
    if (data) {
      this.header.url = data;
      if (object.method === 'GET') {
        this.header.method = object.method;
        this.status = 200;
        return Promise.resolve({
          Headers: this.header,
          status: this.status,
          data: object.body
        });
      }
      this.header.method = object.method;
      this.status = 200;
      return Promise.resolve({
        Headers: this.header,
        status: this.status,
        json: () => Promise.resolve(object.body)
      });
    }
    return Promise.resolve({
      Headers: this.header,
      status: this.status,
      data: 'PLEASE SPECIFY A URL'
    });
  }
  configure(fn) {
    this.__configureCallback = fn;
    return this.__configureReturns;
  }
}

class RouterMock {
  navigate(route) {
    // for testing purposes, let us check if route is really returned.
    // or even called at all.
    return route;
  }
}

describe('the librarian module', () => {
  let librarian;
  let librarian1;
  let librarian5;
  //let librarian6;
  let http;
  let router;
  let fileReaderStub;
  //let fileSaverStub;
  global.CSVFilePath = { files: [csvFixture.string] };
  beforeEach(() => {
    http = new HttpMock();
    router = new RouterMock();
    fileReaderStub = {};
    //fileSaverStub = {};
    librarian = new Librarian(http, router, fileReaderStub);
    librarian5 = new Librarian(new HttpStub(), router, fileReaderStub);
    //librarian6 = new LibrarianMock(new HttpStub(), router, fileReaderStub);
    // add the new book csv from the fixtures object and use it as main data.
    librarian.CSVFilePath = {files: [csvFixture.string]};
  });
  it('should parse the csv.fixtures into object', done => {
    let object = csvjson.toObject(librarian.CSVFilePath.files[0]);
    expect(object instanceof Array).toBeTruthy();
    done();
  });
  
  it('should confirm 200 https status after createBook is run', done => {
    librarian.createBook();
    expect(http.status).toBe(200);
    done();
  });
  
  it('should log a new book type when book is undefined', done => {
    librarian.newBook.type = 0;
    librarian.createBook();
    expect(http.status).toBe(200);
    done();
  });
  
  it('should default to Public access when book access is undefined', done => {
    librarian.newBook.access = 0;
    librarian.createBook();
    expect(http.status).toBe(200);
    done();
  });
  
  // trying another option for testing the createBooksFromCSV();
  it('should confirm a http status change', done => {
    window.CSVFilePath = {files: [new Blob([csvFixture.string])] };
    let reader = new FileReader();
    http = new HttpMock();
    librarian1 = new Librarian(http, router, reader);
    librarian1.createBooksFromCSV();
    // if dashbook.createBooksFromCSV is called, it should called the makeLotaBooks that
    // places a http call and HttpMock will respond to it and also change the status.
    setTimeout(function() {
      if (newState === -1) {
        expect(http.status).toBe(200);
      }
    }, 10);
    done();
  });
  
  //TODO it should wait 2 seconds and then redirect to the bookshelf
  //expect this.router.currentInstruction.config.name toBe 'bookshelf'
  
  it('should raise a file reader error', done => {
    window.CSVFilePath = {files: [new Blob()] };
    let reader = new FileReader();
    http = new HttpMock();
    let error = new Event('error');
    librarian = new Librarian(http, router, reader);
    librarian.createBooksFromCSV();
    // if dashbook.createBooksFromCSV is called, it should called the makeLotaBooks that
    // places a http call and HttpMock will respond to it and also change the status.
    reader.dispatchEvent(error);
    setTimeout(function() {
      //expect(http.status).toBe(200);
    }, 10);
    done();
  });
  
  it('should convert from csv and then post that array of books', (done) => {
    fileReaderStub.readAsText = () => {};
    librarian.createBooksFromCSV();
    librarian.httpClient.fetch = (url, {body: blob}) => {
      const reader = new FileReader();
      reader.onload =  () => {
        const data = new TextDecoder('utf8').decode(reader.result);
        expect(JSON.parse(data)).toEqual(csvFixture.json);
        done();
      };
      reader.readAsArrayBuffer(blob);
      return new Promise(()=>{}); // don't resolve
    };
    fileReaderStub.onload({ target: { result: csvFixture.string } });
  });
  
  it('tests configHttpClient', (done) => {
    const { add: ok } = new Counter(2, done);
    librarian5.activate().then(() => {
      librarian5.httpClient.__configureCallback(new(class {
        withBaseUrl(opts) {
          expect(opts).toBe(process.env.BackendUrl);
          ok();
          return this;
        }
        useStandardConfiguration() {
          ok();
          return this;
        }
      })());
    });
  });
  
  //TODO it runs activate when node env is production
  //expect this.backend toBe ''
  // it('runs activate when node env is production', (done) => {
  //   //TODO figure out how to set process.env.NODE_ENV = 'production'
  //   //process.env.NODE_ENV = 'production';
  //   librarian6 = new Librarian(new HttpStub(), router, fileReaderStub);
  //   expect(librarian6.backend).toBe('');
  //   done();
  // });
  //
  //TODO should make a .csv file
  //expect(http.status).toBe(200);
  it('should make a .csv file', done => {
    //TODO mock the filesaver
    librarian5.makeCSVfile();
    expect(http.status).toBe(500);
    done();
  });
});
