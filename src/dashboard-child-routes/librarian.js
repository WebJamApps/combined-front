import {inject} from 'aurelia-framework';
import {HttpClient, json} from 'aurelia-fetch-client';
import {Router} from 'aurelia-router';
const csvjson = require('csvjson');
const filesaver = require('file-saver');
@inject(HttpClient, Router, FileReader)
export class Librarian {
  constructor(httpClient, router, reader){
    this.httpClient = httpClient;
    this.router = router;
    this.reader = reader;
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

  async activate(){
    this.backend = '';
    /* istanbul ignore else */
    if (process.env.NODE_ENV !== 'production'){
      this.backend = process.env.BackendUrl;
    }
    await fetch;
    this.httpClient.configure(config => {
      config
      .useStandardConfiguration()
      .withBaseUrl(this.backend);
    });
  }

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
    this.httpClient.fetch('/book/create', {
      method: 'post',
      body: json(this.newBook)
    })
    .then(data=>{
      this.router.navigate('/bookshelf');
    });
  }

  createBooksFromCSV(){
    let jsonObj;
    const httpClient = this.httpClient;
    const router = this.router;

    function loaded (evt) {
      const fileString = evt.target.result;
      jsonObj = csvjson.toObject(fileString);
      makeLotaBooks(jsonObj);
    }

    function errorHandler(evt) {
      //TODO no file attached
      //TODO wrong file type attached
      alert('The file could not be read');
    }

    function makeLotaBooks (jsonObject) {
      httpClient.fetch('/book/create', {
        method: 'post',
        body: json(jsonObject)
      })
      .then(response=>response.json())
      .then(data=>{
        setTimeout(function () {
          if (newState === -1) {
          }
        }, 2000);
        router.navigate('/bookshelf');
      });
    }

    // if (CSVFilePath.files[0] !== null){
    // TODO: Parse all csv files
    // TODO: add check for browser support of FileReader
    //TODO: do not run file reader if no csv file in the form
    this.reader.onload = loaded;
    this.reader.onerror = errorHandler;
    this.reader.readAsText(CSVFilePath.files[0]);
  }

  makeCSVfile(){
    this.httpClient.fetch('/book/getall')
    .then(response=>response.json())
    .then(data=>{
      const options = {
        headers: 'key'
      };
      this.books = JSON.stringify(data);
      this.books = csvjson.toCSV(data, options);
      const file = new File([this.books], 'books_export.csv', {type: 'text/plain;charset=utf-8'});
      filesaver.saveAs(file);
    });
  }
}
