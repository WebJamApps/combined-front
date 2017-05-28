import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';


//import { bindable } from 'aurelia-framework';

// const fetch = !self.fetch ? System.import('isomorphic-fetch') : Promise.resolve(self.fetch);
//const booksUrl = process.env.BackendUrl + '/book/getall';
@inject(HttpClient)
export class Bookshelf {
  constructor(httpClient){
    this.httpClient = httpClient;
    this.filterType = '';
  }
  // @bindable
  mediaTypes = ['hardback', 'paperback', 'pdf', 'webpage', 'video', 'audiobook', 'template'];
  siteLocations = [];
  filterby = ['keyword', 'media type', 'location'];
  selectedFilter = [];
  expanded = false;
  keyword = false;
  mediaType = false;
  siteLocation = false;

  async activate(){
    this.backend = '';
    /* istanbul ignore else */
    if (process.env.NODE_ENV !== 'production'){
      this.backend = process.env.BackendUrl;
    }
    await fetch;
    //if (process.env.NODE_ENV !== 'production'){
    this.httpClient.configure((config) => {
      config
      .useStandardConfiguration()
      .withBaseUrl(this.backend);
    });
    const res = await this.httpClient.fetch('/book/getall');
    this.books =  await res.json();
    this.populateTypes();
    this.populateSites();
  }

  filterPicked(){
    let arrayLength = this.selectedFilter.length;
    this.keyword = false;
    this.mediaType = false;
    this.siteLocation = false;
    for (let i = 0; i < arrayLength; i++) {
      /* look in array, if filter type is contained then set the selected filtertype to be true  this.keyword = true; this.mediaType=true; this.siteLocation=true*/
      if (this.selectedFilter.includes('keyword')) {
        this.keyword = true;
      } else {
        this.filters[0].value = '';
        this.keyword = false;
      }
      if (this.selectedFilter.includes('media type')) {
        this.mediaType = true;
      } else {
        this.filters[1].value = '';
        this.mediaType = false;
      }
      if (this.selectedFilter.includes('location')) {
        this.siteLocation = true;
      } else {
        this.filters[2].value = '';
        this.siteLocation = false;
      }
    }
  }

  filters = [
    {value: '', keys: ['title', 'type', 'author', 'numberPages', 'dateOfPub', 'siteLocation', 'access']},
    {value: '', keys: ['type']},
    {value: '', keys: ['siteLocation']}
  ];

  populateTypes(){
    this.mediaTypes.push('');
    for (let next of this.books){
      let nextType = next.type;
      /* istanbul ignore else */
      if (this.mediaTypes.indexOf(nextType) === -1){
        this.mediaTypes.push(nextType);
      }
    }
  }

  populateSites(){
    this.siteLocations.push('');
    for (let next of this.books){
      let nextSite = next.siteLocation;
      /* istanbul ignore else */
      if (this.siteLocations.indexOf(nextSite) === -1){
        this.siteLocations.push(nextSite);
      }
    }
  }

  setFilter(filterType){
    this.filterType = this.filterby[this.filterType - 1];
  }

  showCheckboxes(){
    const checkboxes = document.getElementById('checkboxes-iron');
    if (!this.expanded) {
      checkboxes.opened = true;
      this.expanded = true;
    } else {
      checkboxes.opened = false;
      this.expanded = false;
    }
  }

}
