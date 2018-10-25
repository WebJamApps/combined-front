import {
  inject
} from 'aurelia-framework';
import {
  App
} from './app';

const commonUtils = require('./commons/utils');
@inject(App)
export class Bookshelf {
  constructor(app) {
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
    if (this.app.auth.isAuthenticated()) {
      this.uid = this.app.auth.getTokenPayload().sub;
      this.user = await this.app.appState.getUser(this.uid);
      if (this.user.userType === 'Reader' || this.user.userType === 'Developer') this.reader = true;
    }
  }

  filterPicked() {
    this.commonUtils.filterSelected(this);
  }
}
