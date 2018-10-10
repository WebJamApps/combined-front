import { App } from '../../src/app';
import { AuthStub, HttpMock } from './commons';
import { Reader } from '../../src/dashboard-child-routes/reader';

const sinon = require('sinon');

describe('the Reader Module', () => {
  let auth, reader, app;
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
    reader = new Reader(app);
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

  it('prevents check out a book already taken', (done) => {
    const bMock = sinon.mock(reader.app.httpClient);
    bMock.expects('fetch').resolves({ json() { return Promise.resolve({ checkedOutBy: '123' }); } });
    reader.checkOutBook({ _id: '456' });
    bMock.restore();
    done();
  });
});
