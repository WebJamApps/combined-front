import {
  inject
} from 'aurelia-framework';
import {
  App
} from './app';

const libraryUtils = require('./commons/libraryUtils');
const commonUtils = require('./commons/utils');
@inject(App)
export class Bookshelf {
  constructor(app) {
    this.libraryUtils = libraryUtils;
    this.app = app;
    this.showCheckboxes = commonUtils.showCheckboxes;
    this.filterType = '';
    this.reader = false;
    this.commonUtils = commonUtils;
  }

  mediaTypes = [];

  siteLocations = [];

  filterby = ['keyword', 'type', 'location'];

  selectedFilter = [];

  filters = [{
    filterby: 'keyword',
    value: '',
    keys: ['title', 'type', 'author', 'numberPages', 'dateOfPub', 'siteLocation', 'access', 'comments']
  },
  {
    filterby: 'type',
    value: '',
    keys: ['type']
  },
  {
    filterby: 'location',
    value: '',
    keys: ['siteLocation']
  }
  ];

  async activate() {
    const res = await this.app.httpClient.fetch('/book/getall');
    this.books = await res.json();
    this.commonUtils.makeFilterDropdown(this.mediaTypes, this.books, 'type');
    this.commonUtils.makeFilterDropdown(this.siteLocations, this.books, 'siteLocation');
    return this.libraryUtils.checkReader(this);
  }

  filterPicked() {
    this.commonUtils.filterSelected(this);
  }
}
