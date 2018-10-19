import {
  ValidationControllerFactory, ValidationRules, Validator, validateTrigger
} from 'aurelia-validation';
import { inject } from 'aurelia-framework';
import { json } from 'aurelia-fetch-client';
import { App } from '../app';
import { FormValidator } from '../classes/FormValidator';

const csvjson = require('csvjson');
// const filesaver = require('file-saver');
const utils = require('../commons/utils');
@inject(App, FileReader, ValidationControllerFactory, Validator)
export class Developer {
  constructor(app, reader, controllerFactory, validator) {
    this.app = app;
    this.reader = reader;
    // this.filesaver = saver;
    this.utils = utils;
    this.newSong = {
      title: '',
      url: '',
      category: '',
      author: '',
      performer: '',
    };
    this.songs = [];
    this.validator = new FormValidator(validator, results => this.updateCanSubmit(results)); // if the form is valid then set to true.
    this.controller = controllerFactory.createForCurrentScope(this.validator);
    this.controller.validateTrigger = validateTrigger.changeOrBlur;
    this.canSubmit = false; // the button on the form
    this.validType = false;
  }

  catArray = ['original', 'pub', 'mission'];

  async activate() {
    const uid = this.app.auth.getTokenPayload().sub;
    this.user = await this.app.appState.getUser(uid);
    this.app.dashboardTitle = this.user.userType;
    this.app.role = this.user.userType;
    this.setupValidation();
  }

  setupValidation() {
    ValidationRules
      .ensure('title').required().maxLength(40)
      .ensure('url')
      .required()
      .ensure('category')
      .required()
      .ensure('author')
      .required()
      .ensure('performer')
      .required()
      .on(this.newSong);
  }

  validate() {
    return this.validator.validateObject(this.newSong);
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
    if (this.canSubmit && this.newSong.category !== '') {
      nub.style.display = 'block';
    }
    return this.canSubmit;
  }

  createBook() {
    this.app.httpClient.fetch('/song', {
      method: 'post',
      body: json(this.newSong)
    })
      .then(() => {
        this.app.router.navigate('/music/songs');
      });
  }

  async deleteBooks() {
    try {
      await this.app.httpClient.fetch('/song', {
        method: 'delete'
      });
    } catch (e) { throw e; }
    return this.app.router.navigate('/dashboard');
  }

  async deleteCreateBooks() {
    try {
      await this.app.httpClient.fetch('/song', {
        method: 'delete'
      });
    } catch (e) { throw e; }
    this.createBooksFromCSV();
  }

  createBooksFromCSV() {
    let jsonObj;
    const httpClient = this.app.httpClient;
    const router = this.app.router;
    function makeLotaBooks(jsonObject) {
      return httpClient.fetch('/song', {
        method: 'post',
        body: json(jsonObject)
      })
        .then(response => response.json())
        .then(() => {
          setTimeout(() => {
          }, 2000);
          router.navigate('/music/songs');
        });
    }
    async function loaded(evt) {
      const fileString = evt.target.result;
      const options = { delimiter: '\t' };
      jsonObj = csvjson.toObject(fileString, options);
      return makeLotaBooks(jsonObj);
    }
    function errorHandler() {
      document.getElementsByClassName('errorMessage')[0].innerHTML = 'The file could not be read';
    }
    this.reader.onload = loaded;
    this.reader.onerror = errorHandler;
    this.reader.readAsText(CSVFilePath.files[0]);
  }

  // makeCSVfile() {
  //   this.app.httpClient.fetch('/song')
  //     .then(response => response.json())
  //     .then((data) => {
  //       const options = {
  //         delimiter: '\t',
  //         headers: 'key'
  //       };
  //       this.songs = JSON.stringify(data);
  //       this.songs = csvjson.toCSV(data, options);
  //       const file = new File([this.songs], 'songs_export.txt', { type: 'text/plain;charset=utf-8' });
  //       this.filesaver.saveAs(file);
  //     });
  // }
}
