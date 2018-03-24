//import {computedFrom} from 'aurelia-framework';
//import {Router, Bindable} from 'aurelia-router';
//import {inject} from 'aurelia-framework';

//@inject(Router)
export class Home {

  constructor() {
    this.top;
  }

  get widescreenHomepage(){
    //document.getElementById('top').scrollIntoView();
    return document.documentElement.clientWidth > 1200;
    //document.getElementById('top').scrollIntoView();
  }

  // showSlides() {
  //   $('#slideshow > div:first')
  //     .hide()
  //     .next()
  //     .fadeIn(1500)
  //     .end()
  //     .appendTo('#slideshow');
  // }

  attached() {
    this.top = document.getElementsByClassName('material-header')[0];
    //let top = document.getElementById('top');
    if (this.top !== null && this.top !== undefined){
      this.top.scrollIntoView();
    }
  }
}
