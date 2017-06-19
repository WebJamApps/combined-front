import {inject} from 'aurelia-framework';
import {json} from 'aurelia-fetch-client';
//import {Router} from 'aurelia-router';
import {App} from '../app';
const csvjson = require('csvjson');
const filesaver = require('file-saver');
@inject(App, FileReader, filesaver)
export class Librarian {
  constructor(app, reader, saver){
    this.app = app;
    //this.router = router;
    this.reader = reader;
    this.filesaver = saver;
    this.newBook = {
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
    this.books = {};
  }

  types = ['hardback', 'paperback', 'pdf', 'webpage', 'video', 'audiobook', 'template'];
  accessArray = ['Private', 'Public'];
  newBook = null;
  CSVFilePath = {files: ['']};
  fileList = '';

  // async activate(){
  //   this.backend = '';
  //   /* istanbul ignore else */
  //   if (process.env.NODE_ENV !== 'production'){
  //     this.backend = process.env.BackendUrl;
  //   }
  //   await fetch;
  //   this.httpClient.configure((config) => {
  //     config
  //     .useStandardConfiguration()
  //     .withBaseUrl(this.backend);
  //   });
  // }

  createBook(){
    if (this.newBook.type !== 0){
      this.newBook.type = this.types[this.newBook.type - 1];
    } else {
      this.newBook.type = 'book';
    }
    if (this.newBook.access !== 0){
      this.newBook.access = this.accessArray[this.newBook.access - 1];
    } else {
      this.newBook.access = 'Public';
    }
    this.app.httpClient.fetch('/book/create', {
      method: 'post',
      body: json(this.newBook)
    })
    .then((data) => {
      this.app.router.navigate('/bookshelf');
    });
  }

  async deleteBooks(){
    await fetch;
    this.app.httpClient.fetch('/book/deleteall', {
      method: 'get'
      //body: json(this.newBook)
    });
    this.app.router.navigate('/bookshelf');
    //this.createBooksFromCSV();
    // .then((data) => {
    //   this.app.router.navigate('/bookshelf');
    // });
  }

  async deleteCreateBooks(){
    // let fakeobj = {};
    // fakeobj.query = {};
    //let createcsv = this.createBooksFromCSV;
    await fetch;
    this.app.httpClient.fetch('/book/deleteall', {
      method: 'get'
      //body: json(fakeobj)
    }).then((response) => {
      this.createBooksFromCSV();
    });
    // .then({
    //   createcsv();
  //  );
    //this.createBooksFromCSV();
    // setTimeout(function () {
    //
    // }, 4000);

    // .then((data) => {
    //   this.app.router.navigate('/bookshelf');
    // });
  }

  createBooksFromCSV(){
    let jsonObj;
    const httpClient = this.app.httpClient;
    const router = this.app.router;

    async function loaded (evt) {
      console.log('in csv create');
      const fileString = evt.target.result;
      const options = {
        delimiter: '\t'
      };
      jsonObj = csvjson.toObject(fileString, options);
      //if (Object.keys(jsonObj).length !== 0 && jsonObj.constructor === Object){
      makeLotaBooks(jsonObj);
    }


    function errorHandler(evt) {
      alert('The file could not be read');
    }

    async function makeLotaBooks (jsonObject) {
      httpClient.fetch('/book/create', {
        method: 'post',
        body: json(jsonObject)
      })
      .then((response) => response.json())
      .then((data) => {
        setTimeout(function () {

        }, 2000);
        router.navigate('/bookshelf');
      });
    }

    this.reader.onload = loaded;
    this.reader.onerror = errorHandler;
    this.reader.readAsText(CSVFilePath.files[0]);
  }

  makeCSVfile(){
    this.app.httpClient.fetch('/book/getall')
    .then((response) => response.json())
    .then((data) => {
      const options = {
        delimiter: '\t',
        headers: 'key'
      };
      this.books = JSON.stringify(data);
      this.books = csvjson.toCSV(data, options);
      const file = new File([this.books], 'books_export.txt', {type: 'text/plain;charset=utf-8'});
      this.filesaver.saveAs(file);
    });
  }

}
