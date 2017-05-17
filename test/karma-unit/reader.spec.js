
import { Reader } from '../../src/dashboard-child-routes/reader.js';
import {AuthStub, RouterStub, HttpMock} from './commons';
const Counter = require('assertions-counter');

describe('the Reader Module', () => {
  let auth;
  let http;
  let token = 'mhioj23yr675843ho12yv9852vbbjeywouitryhrcyqo7t89vu';
  let reader;
  let app = {};
  let book = {
    'title': '',
    'type': 'hardback',
    'author': '',
    'numberPages': 0,
    'dateOfPub': 0,
    'url': '',
    'isbn': '',
    'siteLocation': '',
    'numberOfCopies': 1,
    'access': '',
    'comments': '',
    'checkedOutBy': '',
    'checkedOutByName': '',
    '_id': '12345'
  };
  beforeEach(() => {
    auth = new AuthStub();
    http = new HttpMock();
    reader = new Reader(auth, http, app, new RouterStub());
    auth.setToken(token);
  });

  it('activate reader', done =>{
    reader.activate();
    done();
  });

  it('check out a particular book', done => {
    reader.checkOutBook(book);
    done();
  });

  it('check in a specific book', done => {
    reader.checkInBook(book);
    done();
  });
  
  it('tests configHttpClient', (done) => {
    const { add: ok } = new Counter(2, done);
    reader.activate().then(() => {
      reader.httpClient.__configureCallback(new(class {
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

  // it('set process.env.AuthIsON to false', done => {
  //   process.env.AuthIsON = false;
  //   reader = new Reader(auth, http, app, new RouterStub());
  //   done();
  // });
});
