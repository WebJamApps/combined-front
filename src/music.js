// import {inject} from 'aurelia-framework';
// import {App} from './app';
// import {Router} from 'aurelia-router';
//
// @inject(App, Router)

export class Music {
  // constructor(app, router){
  //   this.app = app;
  //   this.router = router;
  // }
  activate(){
    this.slideIndex = 0;
    this.counter = 0;
  }

  jump(h){
    //console.log(document.getElementById(h));
    document.getElementById(h).scrollIntoView();
  }

  showSlides() {
    $('#slideshow > div:first')
      .hide()
      .next()
      .fadeIn(1500)
      .end()
      .appendTo('#slideshow');
  }

  attached() {
    $("#slideshow > div:gt(0)").hide();
    setInterval(this.showSlides, 5000);
  }
}
