import {inject} from 'aurelia-framework';
import {App} from './app';
import {makeFilterDropdown} from './commons/utils.js';
@inject(App)
export class Bookshelf {
  constructor(app){
    this.app = app;
    this.filterType = '';
    this.reader = false;
  }

  //mediaTypes = ['hardback', 'paperback', 'pdf', 'webpage', 'video', 'audiobook', 'template'];
  mediaTypes = [];
  siteLocations = [];
  filterby = ['keyword', 'media type', 'location'];
  selectedFilter = [];
  keyword = false;
  mediaType = false;
  siteLocation = false;

  async activate(){
    const res = await this.app.httpClient.fetch('/book/getall');
    this.books = await res.json();
    console.log(this.books);
    makeFilterDropdown(this.mediaTypes, this.books, 'type');
    //this.populateTypes();
    //this.populateSites();
    makeFilterDropdown(this.siteLocations, this.books, 'siteLocation');
    /* istanbul ignore else */
    if (this.app.auth.isAuthenticated()) {
      console.log('i am authenticated');
      this.uid = this.app.auth.getTokenPayload().sub;
      this.user = await this.app.appState.getUser(this.uid);
      console.log(this.user);
      /* istanbul ignore else */
      if (this.user.userType === 'Reader' || this.user.userType === 'Developer'){
        this.reader = true;
      }
    }
  }

  filterPicked(){
    let arrayLength = this.selectedFilter.length;
    this.keyword = false;
    this.mediaType = false;
    this.siteLocation = false;
    if (arrayLength === 0){
      this.filters[0].value = '';
      this.filters[1].value = '';
      this.filters[2].value = '';
      return;
    }
    for (let i = 0; i < arrayLength; i++) {
      /* look in array, if filter type is contained then set the selected filtertype to be true  this.keyword = true; this.mediaType=true; this.siteLocation=true*/
      if (this.selectedFilter.includes('keyword')) {
        this.keyword = true;
      } else {
        console.log('you unchecked the keyword filter');
        this.filters[0].value = '';
        this.keyword = false;
        //this.activate();
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
    {value: '', keys: ['title', 'type', 'author', 'numberPages', 'dateOfPub', 'siteLocation', 'access', 'comments']},
    {value: '', keys: ['type']},
    {value: '', keys: ['siteLocation']}
  ];

  // populateTypes(){
  //   this.mediaTypes.push('');
  //   for (let next of this.books){
  //     let nextType = next.type;
  //     if (this.mediaTypes.indexOf(nextType) === -1){
  //       this.mediaTypes.push(nextType);
  //     }
  //   }
  // }

  // populateSites(){
  //   this.siteLocations.push('');
  //   for (let next of this.books){
  //     let nextSite = next.siteLocation;
  //     if (this.siteLocations.indexOf(nextSite) === -1){
  //       this.siteLocations.push(nextSite);
  //     }
  //   }
  // }

  // setFilter(filterType){
  //   this.filterType = this.filterby[this.filterType - 1];
  // }

}
