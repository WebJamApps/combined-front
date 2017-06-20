import {inject} from 'aurelia-framework';
import {json} from 'aurelia-fetch-client';
import {App} from '../app';
//import { ValidationControllerFactory, Validator} from 'aurelia-validation';
// import { ValidationControllerFactory, ValidationRules, Validator, validateTrigger } from 'aurelia-validation';
//import {FormValidator} from '../classes/FormValidator';
const csvjson = require('csvjson');
const filesaver = require('file-saver');
// @inject(App, FileReader, filesaver, ValidationControllerFactory, Validator)
@inject(App, FileReader, filesaver)
export class Librarian {
  controller = null;
  validator = null;
  //constructor(app, reader, saver, controllerFactory, validator){
  constructor(app, reader, saver){
    this.app = app;
    this.reader = reader;
    this.filesaver = saver;
    //this.selectedFiles = [];
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
    // this.validator = new FormValidator(validator, (results) => this.updateCanSubmit(results)); //if the form is valid then set to true.
    // this.controller = controllerFactory.createForCurrentScope(this.validator);
    // this.controller.validateTrigger = validateTrigger.changeOrBlur;
    this.canSubmit = false;  //the button on the form
    this.validType = false;
  }

  types = ['hardback', 'paperback', 'pdf', 'webpage', 'video', 'audiobook', 'template'];
  accessArray = ['Private', 'Public'];
  newBook = null;
  //CSVFilePath = {files: ['']};
  _validFileExtensions = ['.txt'];

  textFileValidate() {
    //let arrInputs = document.getElementById('CSVFilePath');
    let nub = document.getElementById('deleteCreateButton');
    nub.style.display = 'none';
    console.log('i am validating');
    console.log(CSVFilePath.files);
    if (CSVFilePath.files.length === 0) {
      alert('no file was selected');
      return false;
    }
    for (let i = 0; i < CSVFilePath.files.length; i++) {
      let oInput = CSVFilePath.files[i];
      console.log(oInput.type);
      if (oInput.type === 'text/plain') {
        console.log('type is a plain text file');
        nub.style.display = 'block';
        return true;
      }
      alert('Sorry, ' + oInput.type + ' is an invalid file type.');
      return false;
      //sFileName = oInput.value;
      // if (sFileName.length > 0) {
      //   blnValid = false;
      // for (let j = 0; j < _validFileExtensions.length; j++) {
      //   sCurExtension = _validFileExtensions[j];
      //   if (sFileName.substr(sFileName.length - sCurExtension.length, sCurExtension.length).toLowerCase() === sCurExtension.toLowerCase()) {
      //     blnValid = true;
      //     nub.style.display = 'block';
      //     break;
      //   }
      // }
      //       if (!blnValid) {
      //         alert('Sorry, ' + sFileName + ' is invalid, allowed extensions are: ' + _validFileExtensions.join(', '));
      //         return false;
      //       }
      //     }
      //   }
      // }
      // return true;
    }
  }
  // setupValidation() {
  //   ValidationRules
  //   //.ensure(this.selectedFiles[0]).matches(/^\s*$/);
  // }
  //
  // validate() {
  //   return this.validator.validateObject(this.selectedFiles);
  // }
  //
  // updateCanSubmit(validationResults) {
  //   let valid = true;
  //   let nub = document.getElementById('deleteCreateButton');
  //   nub.style.display = 'none';
  //   for (let result of validationResults) {
  //     if (result.valid === false){
  //       valid = false;
  //       break;
  //     }
  //   }
  //   this.canSubmit = valid;
  //   if (this.canSubmit){
  //     nub.style.display = 'block';
  //   }
  //   return this.canSubmit;
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
    });
    this.app.router.navigate('/bookshelf');
  }

  async deleteCreateBooks(){
    await fetch;
    this.app.httpClient.fetch('/book/deleteall', {
      method: 'get'
    }).then((response) => {
      this.createBooksFromCSV();
    });
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
