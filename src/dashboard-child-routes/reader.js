
import {inject} from 'aurelia-framework';
import {App} from '../app';
//import {AuthService} from 'aurelia-auth';
import {json} from 'aurelia-fetch-client';
@inject(App)
export class Reader {
  constructor(app){
    this.app = app;
    // this.auth = auth;
    // this.httpClient = httpClient;
    // this.book = {
    //   'title': '',
    //   'type': 'hardback',
    //   'author': '',
    //   'numberPages': 0,
    //   'dateOfPub': 0,
    //   'url': '',
    //   'isbn': '',
    //   'siteLocation': '',
    //   'numberOfCopies': 1,
    //   'access': '',
    //   'comments': '',
    //   'checkedOutBy': '',
    //   'checkedOutByName': ''
    // };
  }

  // tempBook = {
  //   'title': '',
  //   'type': 'hardback',
  //   'author': '',
  //   'numberPages': 0,
  //   'dateOfPub': 0,
  //   'url': '',
  //   'isbn': '',
  //   'siteLocation': '',
  //   'numberOfCopies': 1,
  //   'access': '',
  //   'comments': '',
  //   'checkedOutBy': '',
  //   'checkedOutByName': '',
  //   '_id': ''
  // };

  async activate(){
    //this.app.configHttpClient();
    await fetch;
    const res = await this.app.httpClient.fetch('/book/getall');
    this.books = await res.json();
    this.uid = this.app.auth.getTokenPayload().sub;
    this.user = await this.app.appState.getUser(this.uid);
    this.app.dashboardTitle = this.user.userType;
    this.app.role = this.user.userType;
  }

  // configHttpClient(){
  //   this.backend = '';
  //   /* istanbul ignore else */
  //   if (process.env.NODE_ENV !== 'production'){
  //     this.backend = process.env.BackendUrl;
  //   }
  //   this.httpClient.configure((config) => {
  //     config
  //     .useStandardConfiguration()
  //     .withBaseUrl(this.backend);
  //   });
  // }

  async checkOutBook(tempBook){
    //double check that someone else didn't already check out this book
    const res = await this.app.httpClient.fetch('/book/' + tempBook._id);
    this.book = await res.json();
    console.log('I only want to check it out if it is available?');
    console.log(this.book);
    if (this.book.checkedOutBy === '' || this.book.checkedOutBy === undefined){
      this.book.checkedOutBy = this.uid;
      console.log('user id of checkout by: ' + this.book.checkedOutBy);
      this.book.checkedOutByName = this.user.name;
      this.app.httpClient.fetch('/book/' + this.book._id, {
        method: 'put',
        body: json(this.book)
      })
      .then((response) => response.json())
      .then((data) => {
        //fetch a new list of all books
        this.activate();
      });
    } else {
      console.log('book is already checked out');
      this.activate();
    }
  }

  checkInBook(book){
    this.book = book;
    this.book.checkedOutBy = '';
    this.book.checkedOutByName = '';
    this.app.httpClient.fetch('/book/' + this.book._id, {
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
