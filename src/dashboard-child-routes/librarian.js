import { inject } from 'aurelia-framework';
import { json } from 'aurelia-fetch-client';
import { App } from '../app';
import { ValidationControllerFactory, ValidationRules, Validator, validateTrigger } from 'aurelia-validation';
import { FormValidator } from '../classes/FormValidator';

const csvjson = require('csvjson');
const filesaver = require('file-saver');
@inject(App, FileReader, filesaver, ValidationControllerFactory, Validator)
export class Librarian {
  // controller = null;
  // validator = null;
  constructor(app, reader, saver, controllerFactory, validator) {
    this.app = app;
    this.reader = reader;
    this.filesaver = saver;
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
    // this.preventDefault = this.preventEnter.bind(this);
  }

  types = ['hardback', 'paperback', 'pdf', 'webpage', 'video', 'audio', 'graphic'];
  accessArray = ['Private', 'Public'];
  // newBook = null;

  async activate() {
    const uid = this.app.auth.getTokenPayload().sub;
    this.user = await this.app.appState.getUser(uid);
    this.app.dashboardTitle = this.user.userType;
    this.app.role = this.user.userType;
    this.types.sort();
    this.types.push('other');
    // this.states.sort();
    this.setupValidation();
    // window.addEventListener('keypress', this.preventDefault, false);
  }

  // preventEnter(e) {
  //   if (e.keyCode === 13) {
  //     e.preventDefault();
  //   }
  // }

  textFileValidate() {
    const nub = document.getElementById('deleteCreateButton');
    nub.style.display = 'none';
    console.log('i am validating');
    console.log(CSVFilePath.files);
    if (CSVFilePath.files.length === 0) {
      alert('no file was selected');
      return false;
    }
    for (let i = 0; i < CSVFilePath.files.length; i++) {
      const oInput = CSVFilePath.files[i];
      console.log(oInput.type);
      // the type is determined automatically during the creation of the Blob.
      // this value cannot be controlled by developer, hence cannot test it.
      /* istanbul ignore if */
      if (oInput.type === 'text/plain') {
        console.log('type is a plain text file');
        nub.style.display = 'block';
        return true;
      }
      alert(`Sorry, ${oInput.type} is an invalid file type.`);
      return false;
    }
  }

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
    console.log('checking if I can submit');
    console.log(this.newBook.type);
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
    // if (this.newBook.type !== 0){
    //   this.newBook.type = this.types[this.newBook.type - 1];
    // } else {
    //   this.newBook.type = 'paperback';
    // }
    // if (this.newBook.access !== 0){
    //   this.newBook.access = this.accessArray[this.newBook.access - 1];
    // } else {
    //   this.newBook.access = 'Public';
    // }
    this.app.httpClient.fetch('/book/create', {
      method: 'post',
      body: json(this.newBook)
    })
      .then((data) => {
        this.app.router.navigate('/bookshelf');
      });
  }

  async deleteBooks() {
    await fetch;
    this.app.httpClient.fetch('/book/deleteall', {
      method: 'get'
    });
    this.app.router.navigate('/bookshelf');
  }

  async deleteCreateBooks() {
    await fetch;
    this.app.httpClient.fetch('/book/deleteall', {
      method: 'get'
    }).then((response) => {
      this.createBooksFromCSV();
    });
  }

  createBooksFromCSV() {
    let jsonObj;
    const httpClient = this.app.httpClient;
    const router = this.app.router;
    async function loaded(evt) {
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

    async function makeLotaBooks(jsonObject) {
      httpClient.fetch('/book/create', {
        method: 'post',
        body: json(jsonObject)
      })
        .then(response => response.json())
        .then((data) => {
          setTimeout(() => {
          }, 2000);
          router.navigate('/bookshelf');
        });
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
