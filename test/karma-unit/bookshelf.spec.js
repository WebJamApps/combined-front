//const Counter = require('assertions-counter');
import {HttpMock, AuthStub, AppStateStub} from './commons';
import {Bookshelf} from '../../src/bookshelf';
import {App} from '../../src/app';

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

let book2 = book;
book2.type = 'hardrock';
book2.siteLocation = 'https://bookstore.com/home';

class HttpStub extends HttpMock {
  fetch(url, obj) {
    return Promise.resolve({
      Headers: this.headers,
      json: () => Promise.resolve([book, book2, book])
    });
  }
}

class HttpStub2 {
  fetch(fn) {
    let response = this.itemStub;
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

describe('The Bookshelf Module', () => {
  let http;
  let http2;
  let shelf;
  let app;
  let bookshelf2;
  let auth;
  beforeEach(() => {
    let itemStubs = [1];
    http = new HttpStub();
    auth = new AuthStub();
    auth.setToken({sub: '112'});
    app = new App(auth, http);
    shelf = new Bookshelf(app);
    shelf.app.appState = new AppStateStub();
    http2 = new HttpStub2();
    http2.itemStub = itemStubs;
    bookshelf2 = new Bookshelf(app);
    bookshelf2.app.appState = new AppStateStub();
  });

  it('should activate', (done) => {
    shelf.activate();
    done();
  });

  it('gets all books', () => {
    bookshelf2.activate().then(() => {
      expect(bookshelf2.books).toBe(itemStubs);
      //expect(bookshelf1.books).not.toBe(itemFake);
      done();
    });
  });

  it('should check if the user is authenticated', (done) => {
    shelf.selectedFilter = [1, 2, 3, 4];
    shelf.filterPicked();
    done();
  });

  it('should select filtered picks', (done) => {
    shelf.selectedFilter = [1, 'media type', 'keyword', 'location'];
    shelf.filterPicked();
    done();
  });

  it('should clear all filters', (done) => {
    shelf.selectedFilter = [];
    shelf.filterPicked();
    //expect(shelf.filters[0].value.toBe(''));
    done();
  });

  it('call showCheckboxes', (done) => {
    document.body.innerHTML = '<iron-dropdown id="checkboxes-iron" horizontal-align="right" vertical-align="top" style="margin-top:25px;">';
    shelf.showCheckboxes();
    done();
  });

  it('call showCheckboxes', (done) => {
    document.body.innerHTML = '<iron-dropdown id="checkboxes-iron" horizontal-align="right" vertical-align="top" style="margin-top:25px;">';
    shelf.expanded = true;
    shelf.showCheckboxes();
    done();
  });

  it('should expect change in http status after getUser call', (done) => {
    shelf.setFilter(2);
    done();
  });
});
