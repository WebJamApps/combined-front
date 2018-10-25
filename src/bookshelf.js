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

  // keyword = false;
  //
  // mediaType = false;
  //
  // siteLocation = false;

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

  // finishFilterPicker(arrayLength) {
  //   for (let i = 0; i < arrayLength; i += 1) {
  //     if (this.selectedFilter.includes('keyword')) this.keyword = true;
  //     else {
  //       this.filters[0].value = '';
  //       this.keyword = false;
  //     }
  //     if (this.selectedFilter.includes('media type')) this.mediaType = true;
  //     else {
  //       this.filters[1].value = '';
  //       this.mediaType = false;
  //     }
  //     if (this.selectedFilter.includes('location')) this.siteLocation = true;
  //     else {
  //       this.filters[2].value = '';
  //       this.siteLocation = false;
  //     }
  //   }
  // }
  //
  // filterPicked() {
  //   const arrayLength = this.selectedFilter.length;
  //   this.keyword = false;
  //   this.mediaType = false;
  //   this.siteLocation = false;
  //   if (arrayLength === 0) {
  //     this.filters[0].value = '';
  //     this.filters[1].value = '';
  //     this.filters[2].value = '';
  //     return;
  //   }
  //   this.finishFilterPicker(arrayLength);
  // }
  filterPicked() {
    this.commonUtils.filterSelected(this);
  }
}
