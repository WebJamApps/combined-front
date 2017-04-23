
import { Reader } from '../../src/reader.js';
import {AuthStub, RouterStub, HttpMock} from './commons';

describe('the Dashboard Module', () => {
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

  it('set process.env.AuthIsON to false', done => {
    process.env.AuthIsON = false;
    reader = new Reader(auth, http, app, new RouterStub());
    done();
  });
});
