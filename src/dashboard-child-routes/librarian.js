import {
  ValidationControllerFactory, ValidationRules, Validator, validateTrigger
} from 'aurelia-validation';
import { inject } from 'aurelia-framework';
import { json } from 'aurelia-fetch-client';
import { App } from '../app';
import { FormValidator } from '../classes/FormValidator';

const csvjson = require('csvjson');
const filesaver = require('file-saver');
const utils = require('../commons/utils');
@inject(App, FileReader, filesaver, ValidationControllerFactory, Validator)
export class Librarian {
  constructor(app, reader, saver, controllerFactory, validator) {
    this.app = app;
    this.reader = reader;
    this.filesaver = saver;
    this.utils = utils;
    this.newBook = {
      title: '',
      type: '',
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
      checkedOutByName: ''
    };
    this.books = {};
    this.validator = new FormValidator(validator, results => this.updateCanSubmit(results)); // if the form is valid then set to true.
    this.controller = controllerFactory.createForCurrentScope(this.validator);
    this.controller.validateTrigger = validateTrigger.changeOrBlur;
    this.canSubmit = false; // the button on the form
    this.validType = false;
  }

  types = ['hardback', 'paperback', 'pdf', 'webpage', 'video', 'audio', 'graphic'];

  accessArray = ['Private', 'Public'];

  async activate() {
    const uid = this.app.auth.getTokenPayload().sub;
    this.user = await this.app.appState.getUser(uid);
    this.app.dashboardTitle = this.user.userType;
    this.app.role = this.user.userType;
    this.types.sort();
    this.types.push('other');
    this.setupValidation();
  }

  // textFileValidate() {
  //   const nub = document.getElementById('deleteCreateButton');
  //   document.getElementsByClassName('errorMessage')[0].innerHTML = '';
  //   nub.style.display = 'none';
  //   let valid = false;
  //   for (let i = 0; i < CSVFilePath.files.length; i += 1) {
  //     const oInput = CSVFilePath.files[i];
  //     // the type is determined automatically during the creation of the Blob.
  //     // this value cannot be controlled by developer, hence cannot test it.
  //     /* istanbul ignore if */
  //     if (oInput.type === 'text/plain') {
  //       nub.style.display = 'block';
  //       valid = true;
  //     } else {
  //       document.getElementsByClassName('errorMessage')[0].innerHTML = `Sorry, ${oInput.type} is an invalid file type.`;
  //       valid = false;
  //     }
  //   }
  //   return valid;
  // }

  setupValidation() {
    ValidationRules
      .ensure('title').required().maxLength(40).withMessage('Title is required')
      .ensure('type')
      .required()
      .withMessage('Media Type is required')
      .on(this.newBook);
  }

  validate() {
    return this.validator.validateObject(this.newBook);
  }

  updateCanSubmit(validationResults) {
    let valid = true;
    const nub = document.getElementById('createMediaButton');
    nub.style.display = 'none';
    for (const result of validationResults) {
      if (result.valid === false) {
        valid = false;
        nub.style.display = 'none';
        break;
      }
    }
    this.canSubmit = valid;
    if (this.canSubmit && this.newBook.type !== 0) {
      nub.style.display = 'block';
    }
    return this.canSubmit;
  }

  createBook() {
    this.app.httpClient.fetch('/book/create', {
      method: 'post',
      body: json(this.newBook)
    })
      .then(() => {
        this.app.router.navigate('/bookshelf');
      });
  }

  async deleteBooks() {
    await fetch;
    this.app.httpClient.fetch('/book/deleteall', {
      method: 'delete'
    });
    this.app.router.navigate('/bookshelf');
  }

  async deleteCreateBooks() {
    await fetch;
    this.app.httpClient.fetch('/book/deleteall', {
      method: 'delete'
    }).then(() => {
      this.createBooksFromCSV();
    });
  }

  createBooksFromCSV() {
    let jsonObj;
    const httpClient = this.app.httpClient;
    const router = this.app.router;
    async function makeLotaBooks(jsonObject) {
      httpClient.fetch('/book/create', {
        method: 'post',
        body: json(jsonObject)
      })
        .then(response => response.json())
        .then(() => {
          setTimeout(() => {
          }, 2000);
          router.navigate('/bookshelf');
        });
    }
    async function loaded(evt) {
      const fileString = evt.target.result;
      const options = {
        delimiter: '\t'
      };
      jsonObj = csvjson.toObject(fileString, options);
      makeLotaBooks(jsonObj);
    }
    function errorHandler() {
      document.getElementsByClassName('errorMessage')[0].innerHTML = 'The file could not be read';
    }

    this.reader.onload = loaded;
    this.reader.onerror = errorHandler;
    this.reader.readAsText(CSVFilePath.files[0]);
  }

  makeCSVfile() {
    this.app.httpClient.fetch('/book/getall')
      .then(response => response.json())
      .then((data) => {
        const options = {
          delimiter: '\t',
          headers: 'key'
        };
        this.books = JSON.stringify(data);
        this.books = csvjson.toCSV(data, options);
        const file = new File([this.books], 'books_export.txt', { type: 'text/plain;charset=utf-8' });
        this.filesaver.saveAs(file);
      });
  }
}
