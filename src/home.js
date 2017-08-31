//import {computedFrom} from 'aurelia-framework';
//import {Router, Bindable} from 'aurelia-router';
//import {inject} from 'aurelia-framework';

//@inject(Router)
export class Home {

  //constructor(router) {
    //this.router = router;
  //}


  get widescreen(){
    return document.documentElement.clientWidth > 1340;
  }

  // showSlides() {
  //   $('#slideshow > div:first')
  //     .hide()
  //     .next()
  //     .fadeIn(1500)
  //     .end()
  //     .appendTo('#slideshow');
  // }

  // attached() {
  //   $('#slideshow > div:gt(0)').hide();
  //   setInterval(this.showSlides, 5000);
  // }
}
