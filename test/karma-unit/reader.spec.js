import { App } from '../../src/app';
import { AuthStub, HttpMock } from './commons';
import { Reader } from '../../src/dashboard-child-routes/reader.js';

describe('the Reader Module', () => {
  let auth;
  // let http;
  // let token = 'mhioj23yr675843ho12yv9852vbbjeywouitryhrcyqo7t89vu';
  let reader;
  // let reader2;
  let app;
  const book = {
    title: '',
    type: 'hardback',
    author: '',
    numberPages: 0,
    dateOfPub: 0,
    url: '',
    isbn: '',
    siteLocation: '',
    numberOfCopies: 1,
    access: '',
    comments: '',
    checkedOutBy: '',
    checkedOutByName: '',
    _id: '12345'
  };
  beforeEach(() => {
    auth = new AuthStub();
    auth.setToken({ sub: 'aowifjawifhiawofjo' });
    app = new App(auth, new HttpMock());
    app.activate();
    // auth = new AuthStub();
    // http = new HttpMock();
    reader = new Reader(app);
    // reader2 = new Reader(App);
    // auth.setToken(token);
  });

  it('activate reader', (done) => {
    reader.activate();
    done();
  });


  it('check out a particular book', (done) => {
    reader.checkOutBook(book);
    done();
  });

  it('check in a specific book', (done) => {
    reader.checkInBook(book);
    done();
  });

  it('check out a specific book', (done) => {
    reader.user = { name: 'Froyo' };
    reader.checkOutBook(book);
    done();
  });

  it('check out a book already taken', (done) => {
    reader.activate().then(() => {
      reader.checkOutBook(book);
      reader.checkOutBook(book);
      done();
    });
  });
});
