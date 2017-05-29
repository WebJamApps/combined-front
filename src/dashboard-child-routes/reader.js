
import {inject} from 'aurelia-framework';
import {App} from '../app';
import {AuthService} from 'aurelia-auth';
import {HttpClient, json} from 'aurelia-fetch-client';
@inject(AuthService, HttpClient, App)
export class Reader {
  constructor(auth, httpClient, app){
    this.app = app;
    this.auth = auth;
    this.httpClient = httpClient;
    this.book = {
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
      'checkedOutByName': ''
    };
  }

  async activate(){
    this.configHttpClient();
    await fetch;
    const res = await this.httpClient.fetch('/book/getall');
    this.books = await res.json();
    this.uid = this.auth.getTokenPayload().sub;
    this.user = await this.app.appState.getUser(this.uid);
  }

  configHttpClient(){
    this.backend = '';
    /* istanbul ignore else */
    if (process.env.NODE_ENV !== 'production'){
      this.backend = process.env.BackendUrl;
    }
    this.httpClient.configure((config) => {
      config
      .useStandardConfiguration()
      .withBaseUrl(this.backend);
    });
  }

  checkOutBook(book){
    this.book = book;
    this.book.checkedOutBy = this.uid;
    this.book.checkedOutByName = this.user.name;
    this.httpClient.fetch('/book/update/' + this.book._id, {
      method: 'put',
      body: json(this.book)
    })
    .then((response) => response.json())
    .then((data) => {
      //fetch a new list of all books
      this.activate();
    });
  }

  checkInBook(book){
    this.book = book;
    this.book.checkedOutBy = '';
    this.book.checkedOutByName = '';
    this.httpClient.fetch('/book/update/' + this.book._id, {
      method: 'put',
      body: json(this.book)
    })
    .then((response) => response.json())
    .then((data) => {
      //fetch a fresh new list of all books
      this.activate();
    });
  }
}
