import {App} from '../../src/app';
import {AuthStub, HttpMock} from './commons';
import {Librarian} from '../../src/dashboard-child-routes/librarian';
import './setup';
import {csvFixture} from './librarian.spec.fixtures';
import csvjson from 'csvjson';
// import filesaver from 'file-saver';
//const Counter = require('assertions-counter');

describe('the librarian module', () => {
  let librarian;
  let app1;
  let http;
  let reader;
  global.CSVFilePath = { files: [csvFixture.string] };
  beforeEach(() => {
    http = new HttpMock();
    reader = new FileReader();
    app1 = new App(new AuthStub(), http);
    app1.activate();
    librarian = new Librarian(app1, reader, {});
    librarian.CSVFilePath = {files: [csvFixture.string]};
  });
  it('should parse the csv.fixtures into object', (done) => {
    let object = csvjson.toObject(librarian.CSVFilePath.files[0]);
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

  // it('should confirm a http status change', (done) => {
  //   window.CSVFilePath = {files: [new Blob([csvFixture.string])] };
  //   librarian.createBooksFromCSV();
  //   // if dashbook.createBooksFromCSV is called, it should called the makeLotaBooks that
  //   // places a http call and HttpMock will respond to it and also change the status.
  //   setTimeout(function() {
  //     if (newState === -1) {
  //       expect(http.status).toBe(200);
  //     }
  //   }, 10);
  //   done();
  // });

  //it should wait 2 seconds and then redirect to the bookshelf
  //expect this.router.currentInstruction.config.name toBe 'bookshelf'

  it('should raise a file reader error', (done) => {
    window.CSVFilePath = {files: [new Blob()] };
    let error = new Event('error');
    librarian.createBooksFromCSV();
    // if dashbook.createBooksFromCSV is called, it should called the makeLotaBooks that
    // places a http call and HttpMock will respond to it and also change the status.
    librarian.reader.dispatchEvent(error);
    setTimeout(function() {
      //expect(http.status).toBe(200);
    }, 10);
    done();
  });

  // it('should convert from csv and then post that array of books', (done) => {
  //   librarian.reader.readAsText = () => {};
  //   librarian.createBooksFromCSV();
  //   librarian.app.httpClient.fetch = (url, {body: blob}) => {
  //     //const reader = new FileReader();
  //     librarian.reader.onload =  () => {
  //       const data = new TextDecoder('utf8').decode(librarian.reader.result);
  //       expect(JSON.parse(data)).toBeDefined;
  //       done();
  //     };
  //     librarian.reader.readAsArrayBuffer(blob);
  //     return new Promise(() => {}); // don't resolve
  //   };
  //   librarian.reader.onload({ target: { result: csvFixture.string } });
  // });

  // it('should make a .csv file', (done) => {
  //
  //   librarian.makeCSVfile();
  //   //expect(http2.status).toBe(200);
  //   done();
  // });
});
