import { json } from 'aurelia-fetch-client';
import { inject } from 'aurelia-framework';
import { App } from '../app';
@inject(App)
export class Reader {
  constructor(app) {
    this.app = app;
  }

  async activate() {
    await fetch;
    const res = await this.app.httpClient.fetch('/book/getall');
    this.books = await res.json();
    this.uid = this.app.auth.getTokenPayload().sub;
    this.user = await this.app.appState.getUser(this.uid);
    this.app.dashboardTitle = this.user.userType;
    this.app.role = this.user.userType;
  }

  async checkOutBook(tempBook) {
    // double check that someone else didn't already check out this book
    const res = await this.app.httpClient.fetch(`/book/${tempBook._id}`);
    this.book = await res.json();
    if (this.book.checkedOutBy === '' || this.book.checkedOutBy === undefined) {
      this.book.checkedOutBy = this.uid;
      this.book.checkedOutByName = this.user.name;
      this.updateBook(this.book);
    } else {
      this.activate();
    }
  }

  updateBook(book) {
    this.app.httpClient.fetch(`/book/${this.book._id}`, {
      method: 'put',
      body: json(book)
    })
      .then(response => response.json())
      .then(() => {
      // fetch a new list of all books
        this.activate();
      });
  }

  checkInBook(book) {
    this.book = book;
    this.book.checkedOutBy = '';
    this.book.checkedOutByName = '';
    this.updateBook(this.book);
  }
}
