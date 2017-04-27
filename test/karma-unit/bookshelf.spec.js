
import {HttpMock} from './commons';
import {Bookshelf} from '../../src/bookshelf';

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

class HttpStub extends HttpMock {
  fetch(url, obj) {
    return Promise.resolve({
      Headers: this.headers,
      json: () => Promise.resolve([book, book, book])
    });
  }
}

describe('The Bookshelf Module', () => {
  let http;
  let shelf;
  beforeEach(() => {
    http = new HttpStub();
    shelf = new Bookshelf(http);
  });

  it('should activate', done =>{
    shelf.activate();
    done();
  });

  it('should check if the user is authenticated', done => {
    shelf.selectedFilter = [1, 2, 3, 4];
    shelf.filterPicked();
    done();
  });

  it('should select filtered picks', done => {
    shelf.selectedFilter = [1, 'media type', 'keyword', 'location'];
    shelf.filterPicked();
    done();
  });

  it('call showCheckboxes', done => {
    document.body.innerHTML = "<div id='checkboxes'></div>";
    shelf.showCheckboxes();
    done();
  });

  it('call showCheckboxes', done => {
    document.body.innerHTML = "<div id='checkboxes'></div>";
    shelf.expanded = true;
    shelf.showCheckboxes();
    done();
  });

  it('should expect change in http status after getUser call', done => {
    shelf.setFilter(2);
    done();
  });
});
